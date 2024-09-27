/**
 * The skier is the entity controlled by the player in the game. The skier skis down the hill, can move at different
 * angles, and crashes into obstacles they run into. If caught by the rhino, the skier will get eaten and die.
 */

import { IMAGE_NAMES, DIAGONAL_SPEED_REDUCER, KEYS, AIR_TIME, ANIMATION_FRAME_SPEED_MS } from "../Constants";
import { Entity } from "./Entity";
import { Canvas } from "../Core/Canvas";
import { ImageManager } from "../Core/ImageManager";
import { Animation } from "../Core/Animation";
import { intersectTwoRects, Rect } from "../Core/Utils";
import { ObstacleManager } from "./Obstacles/ObstacleManager";
import { Obstacle } from "./Obstacles/Obstacle";

/**
 * The skier starts running at this speed. Saved in case speed needs to be reset at any point.
 */
const STARTING_SPEED: number = 10;

/**
 * The different states the skier can be in.
 */

enum STATES {
    STATE_SKIING = "skiing",
    STATE_CRASHED = "crashed",
    STATE_JUMPING = "jumping",
    STATE_DEAD = "dead",
}

/**
 * The different directions the skier can be facing.
 */
const DIRECTION_LEFT: number = 0;
const DIRECTION_LEFT_DOWN: number = 1;
const DIRECTION_DOWN: number = 2;
const DIRECTION_RIGHT_DOWN: number = 3;
const DIRECTION_RIGHT: number = 4;

/**
 * Mapping of the image to display for the skier based upon which direction they're facing.
 */
const DIRECTION_IMAGES: { [key: number]: IMAGE_NAMES } = {
    [DIRECTION_LEFT]: IMAGE_NAMES.SKIER_LEFT,
    [DIRECTION_LEFT_DOWN]: IMAGE_NAMES.SKIER_LEFTDOWN,
    [DIRECTION_DOWN]: IMAGE_NAMES.SKIER_DOWN,
    [DIRECTION_RIGHT_DOWN]: IMAGE_NAMES.SKIER_RIGHTDOWN,
    [DIRECTION_RIGHT]: IMAGE_NAMES.SKIER_RIGHT,
};

export class Skier extends Entity {
    jumpAnimation: Animation;
    jumpTakeOffPosition?: number;
    airTime: number = AIR_TIME;
    /**
     * The name of the current image being displayed for the skier.
     */
    imageName: IMAGE_NAMES = IMAGE_NAMES.SKIER_DOWN;

    /**
     * What state the skier is currently in.
     */
    state: STATES = STATES.STATE_SKIING;

    /**
     * What direction the skier is currently facing.
     */
    direction: number = DIRECTION_DOWN;

    /**
     * How fast the skier is currently moving in the game world.
     */
    speed: number = STARTING_SPEED;

    /**
     * Stored reference to the ObstacleManager
     */
    obstacleManager: ObstacleManager;

    /**
     * Init the skier.
     */
    constructor(x: number, y: number, imageManager: ImageManager, obstacleManager: ObstacleManager, canvas: Canvas) {
        super(x, y, imageManager, canvas);

        this.obstacleManager = obstacleManager;
        this.jumpAnimation = new Animation([IMAGE_NAMES.SKIER_JUMP_1, IMAGE_NAMES.SKIER_JUMP_2], false, ANIMATION_FRAME_SPEED_MS, this.finishJumpAnimation.bind(this))
    }

    /**
     * Is the skier currently in the jumping state
     */
    isJumping(): boolean {
        return this.state === STATES.STATE_JUMPING;
    }

    /**
     * Is the skier currently in the crashed state
     */
    isCrashed(): boolean {
        return this.state === STATES.STATE_CRASHED;
    }

    /**
     * Is the skier currently in the skiing state
     */
    isSkiing(): boolean {
        return this.state === STATES.STATE_SKIING;
    }

    /**
     * Is the skier currently in the dead state
     */
    isDead(): boolean {
        return this.state === STATES.STATE_DEAD;
    }

    /**
     * Set the current direction the skier is facing and update the image accordingly
     */
    setDirection(direction: number) {
        this.direction = direction;
        this.setDirectionalImage();
    }

    /**
     * Set the skier's image based upon the direction they're facing.
     */
    setDirectionalImage() {
        this.imageName = DIRECTION_IMAGES[this.direction];
    }

    /**
     * Move the skier and check to see if they've hit an obstacle. The skier only moves in the skiing state.
     */
    update(gameTime: number) {
        // this.imageName = IMAGE_NAMES.SKIER_JUMP_2;

        if (this.isJumping()) {
            this.jumpAnimation.nextFrame(gameTime)
            const nextAnimationImage = this.jumpAnimation.getImages()[this.jumpAnimation.getCurrentAnimationFrame()];
            if (nextAnimationImage) {
                this.imageName = nextAnimationImage;

            }
            this.move();
            this.checkIfHitObstacle();
            this.land();
        }

        if (this.isSkiing()) {
            this.move();
            this.checkIfHitObstacle();
            //check if hit jump method?
        }
    }

    /**
     * Draw the skier if they aren't dead
     */
    draw() {
        if (this.isDead()) {
            return;
        }

        super.draw();
    }

    /**
     * Move the skier based upon the direction they're currently facing. This handles frame update movement.
     */
    move() {
        switch (this.direction) {
            case DIRECTION_LEFT_DOWN:
                this.moveSkierLeftDown();
                break;
            case DIRECTION_DOWN:
                this.moveSkierDown();
                break;
            case DIRECTION_RIGHT_DOWN:
                this.moveSkierRightDown();
                break;
            case DIRECTION_LEFT:
            case DIRECTION_RIGHT:
                // Specifically calling out that we don't move the skier each frame if they're facing completely horizontal.
                break;
        }
    }

    /**
     * Move the skier left. Since completely horizontal movement isn't frame based, just move incrementally based upon
     * the starting speed.
     */
    moveSkierLeft() {
        this.position.x -= STARTING_SPEED;
    }

    /**
     * Move the skier diagonally left in equal amounts down and to the left. Use the current speed, reduced by the scale
     * of a right triangle hypotenuse to ensure consistent traveling speed at an angle.
     */
    moveSkierLeftDown() {
        this.position.x -= this.speed / DIAGONAL_SPEED_REDUCER;
        this.position.y += this.speed / DIAGONAL_SPEED_REDUCER;
    }

    /**
     * Move the skier down at the speed they're traveling.
     */
    moveSkierDown() {
        this.position.y += this.speed;
    }

    /**
     * Move the skier diagonally right in equal amounts down and to the right. Use the current speed, reduced by the scale
     * of a right triangle hypotenuse to ensure consistent traveling speed at an angle.
     */
    moveSkierRightDown() {
        this.position.x += this.speed / DIAGONAL_SPEED_REDUCER;
        this.position.y += this.speed / DIAGONAL_SPEED_REDUCER;
    }

    /**
     * Move the skier right. Since completely horizontal movement isn't frame based, just move incrementally based upon
     * the starting speed.
     */
    moveSkierRight() {
        this.position.x += STARTING_SPEED;
    }

    /**
     * Move the skier up. Since moving up isn't frame based, just move incrementally based upon
     * the starting speed.
     */
    moveSkierUp() {
        this.position.y -= STARTING_SPEED;
    }

    /**
     * Handle keyboard input. If the skier is dead, don't handle any input.
     */
    handleInput(inputCode: string) {
        if (this.isDead()) {
            return false;
        }

        let handled: boolean = true;

        switch (inputCode) {
            case KEYS.LEFT:
                this.turnLeft();
                break;
            case KEYS.RIGHT:
                this.turnRight();
                break;
            case KEYS.UP:
                this.turnUp();
                break;
            case KEYS.DOWN:
                this.turnDown();
                break;
            case KEYS.SPACE:
                this.jump();
                break;
            default:
                handled = false;
        }

        return handled;
    }

    /**
     * Turn the skier left. If they're already completely facing left, move them left. Otherwise, change their direction
     * one step left. If they're in the crashed state, then first recover them from the crash.
     */
    turnLeft() {
        if (this.isCrashed()) {
            this.recoverFromCrash(DIRECTION_LEFT);
        }

        if (this.direction === DIRECTION_LEFT) {
            this.moveSkierLeft();
        } else {
            this.setDirection(this.direction - 1);
        }
    }

    /**
     * Turn the skier right. If they're already completely facing right, move them right. Otherwise, change their direction
     * one step right. If they're in the crashed state, then first recover them from the crash.
     */
    turnRight() {
        if (this.isCrashed()) {
            this.recoverFromCrash(DIRECTION_RIGHT);
        }

        if (this.direction === DIRECTION_RIGHT) {
            this.moveSkierRight();
        } else {
            this.setDirection(this.direction + 1);
        }
    }

    /**
     * Turn the skier up which basically means if they're facing left or right, then move them up a bit in the game world.
     * If they're in the crashed state, do nothing as you can't move up if you're crashed.
     */
    turnUp() {
        if (this.isCrashed()) {
            return;
        }

        if (this.direction === DIRECTION_LEFT || this.direction === DIRECTION_RIGHT) {
            this.moveSkierUp();
        }
    }

    /**
     * Turn the skier to face straight down. If they're crashed don't do anything to require them to move left or right
     * to escape an obstacle before skiing down again.
     */
    turnDown() {
        if (this.isCrashed()) {
            return;
        }

        this.setDirection(DIRECTION_DOWN);
    }

    /**
     * The skier has a bit different bounds calculating than a normal entity to make the collision with obstacles more
     * natural. We want the skier to end up in the obstacle rather than right above it when crashed, so move the bottom
     * boundary up.
     */
    getBounds(): Rect | null {
        const image = this.imageManager.getImage(this.imageName);
        if (!image) {
            return null;
        }

        return new Rect(
            this.position.x - image.width / 2,
            this.position.y - image.height / 2,
            this.position.x + image.width / 2,
            this.position.y - image.height / 4
        );
    }

    /**
     * Go through all the obstacles in the game and see if the skier collides with any of them. If so, crash the skier.
     */
    checkIfHitObstacle() {

        const skierBounds = this.getBounds();
        if (!skierBounds) {
            return;
        }

        const collision = this.obstacleManager.getObstacles().find((obstacle: Obstacle): boolean => {
            const obstacleBounds = obstacle.getBounds();

            if (!obstacleBounds) {
                return false;
            }

            return intersectTwoRects(skierBounds, obstacleBounds);
        });

        // jumping over a single tree
        if (collision && collision.imageName === IMAGE_NAMES.TREE && this.isJumping()) {
            return;
        }

        // hiting a jump
        if (collision && collision.imageName === IMAGE_NAMES.JUMP_RAMP) {
            this.jump();
            return;
        }

        // hitting any other obstacles
        if (collision) {
            this.crash();
            return;
        }
    }

    /**
     * Updates the state of the component.
     *
     * This function performs the following actions:
     * - Loops through the array of jump images.
     * - Resets the state to the takeoff state.
     */
    jump() {
        if (this.state !== STATES.STATE_JUMPING) {
            this.jumpTakeOffPosition = this.position.y;

            this.state = STATES.STATE_JUMPING;
        }


        // this.state = STATES.STATE_SKIING;


        // update state
        // loop through jump images array
        // reset to takeoff state
    }

    finishJumpAnimation() {
        this.imageName = IMAGE_NAMES.SKIER_DOWN;

        // this.state = STATES.STATE_SKIING;

    }

    /**
     * Checks if the skier has traveled far enough forward to initiate landing.
     *
     * This function determines whether the current distance traveled meets
     * the criteria for landing.
     */
    land() {
        // if traveled far enough forwards then land
        if (this.jumpTakeOffPosition && this.jumpTakeOffPosition + this.airTime === this.position.y) {
            this.state = STATES.STATE_SKIING;
            this.imageName = IMAGE_NAMES.SKIER_DOWN;
            this.jumpTakeOffPosition = undefined;

        }


    }

    /**
     * Crash the skier. Set the state to crashed, set the speed to zero cause you can't move when crashed and update the
     * image.
     */
    crash() {
        this.state = STATES.STATE_CRASHED;
        this.speed = 0;
        this.imageName = IMAGE_NAMES.SKIER_CRASH;
    }

    /**
     * Change the skier back to the skiing state, get them moving again at the starting speed and set them facing
     * whichever direction they're recovering to.
     */
    recoverFromCrash(newDirection: number) {
        this.state = STATES.STATE_SKIING;
        this.speed = STARTING_SPEED;
        this.setDirection(newDirection);
    }

    /**
     * Kill the skier by putting them into the "dead" state and stopping their movement.
     */
    die() {
        this.state = STATES.STATE_DEAD;
        this.speed = 0;
    }
}
