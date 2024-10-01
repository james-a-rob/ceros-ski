import "jest-canvas-mock";
import { ImageManager } from "../Core/ImageManager";
import { IMAGE_NAMES, IMAGES, KEYS, ANIMATION_FRAME_SPEED_MS, AIR_TIME } from "../Constants";
import { Obstacle } from "./Obstacles/Obstacle";
import { ObstacleManager } from "./Obstacles/ObstacleManager";
import { Canvas } from "../Core/Canvas";
import { Skier } from "./Skier";

/**
 * These test validate the intigration of a number of components. There is not much mocking. Consider adding lower level unit tests to improve coverage
 */

beforeEach(() => {
    global.Image = class {
        onload: (() => void) | null = null;
        onerror: ((error: Event) => void) | null = null;
        width: number = 55;
        height: number = 47;

        set src(url: string) {
            setTimeout(() => {
                if (this.onload) {
                    this.onload();
                }
            }, 0);
        }
    } as unknown as typeof Image;
});

describe("Skier", () => {
    describe("jumping", () => {
        it("enters jumping state when hitting a jump", async () => {
            document.body.innerHTML = `<div><canvas id="game-canvas"></canvas></div>`;

            const imageManager = new ImageManager();
            await imageManager.loadImages(IMAGES);

            const canvas = new Canvas("game-canvas", 300, 300);
            const obstacleManager = new ObstacleManager(imageManager, canvas);
            const skier = new Skier(0, 0, imageManager, obstacleManager, canvas);

            // set jump directly infront of skier.
            const jump = new Obstacle(0, 0, imageManager, canvas);
            jump.imageName = IMAGE_NAMES.JUMP_RAMP;
            obstacleManager.obstacles.push(jump);

            // is in air
            skier.update(123);
            expect(skier.isJumping()).toBe(true);

            // continues to move forward while airborne
            skier.update(123);
            expect(skier.position.y).toBe(20);

            // step forwards time in air
            let times = AIR_TIME / 10;
            for (let i = 0; i < times; i++) {
                skier.update(123);
            }

            expect(skier.isJumping()).toBe(false);
        });

        it("enters jumping state when player hits space bar", async () => {
            document.body.innerHTML = `<div><canvas id="game-canvas"></canvas></div>`;

            const imageManager = new ImageManager();
            await imageManager.loadImages(IMAGES);

            const canvas = new Canvas("game-canvas", 300, 300);
            const obstacleManager = new ObstacleManager(imageManager, canvas);
            const skier = new Skier(0, 0, imageManager, obstacleManager, canvas);

            skier.handleInput(KEYS.SPACE);

            // is in air
            skier.update(123);
            expect(skier.isJumping()).toBe(true);

            // continues to move forward while airborne
            skier.update(123);
            expect(skier.position.y).toBe(20);
        });

        it("does not crash into rocks when in the air", async () => {
            document.body.innerHTML = `<div><canvas id="game-canvas"></canvas></div>`;

            const imageManager = new ImageManager();
            await imageManager.loadImages(IMAGES);

            const canvas = new Canvas("game-canvas", 300, 300);
            const obstacleManager = new ObstacleManager(imageManager, canvas);
            const skier = new Skier(0, 0, imageManager, obstacleManager, canvas);

            // set rock infront of skier.
            const rock = new Obstacle(0, 10, imageManager, canvas);
            rock.imageName = IMAGE_NAMES.ROCK1;
            obstacleManager.obstacles.push(rock);

            skier.handleInput(KEYS.SPACE);

            // is in air
            skier.update(123);
            expect(skier.isJumping()).toBe(true);

            // continues to move forward while airborne
            skier.update(123);
            expect(skier.position.y).toBe(20);

            // is not in crashed state
            expect(skier.isCrashed()).toBe(false);
        });

        it("flips while jumping", async () => {
            const gameStartTime = Date.now();

            document.body.innerHTML = `<div><canvas id="game-canvas"></canvas></div>`;

            const imageManager = new ImageManager();
            await imageManager.loadImages(IMAGES);

            const canvas = new Canvas("game-canvas", 300, 300);
            const obstacleManager = new ObstacleManager(imageManager, canvas);
            const skier = new Skier(0, 0, imageManager, obstacleManager, canvas);

            skier.handleInput(KEYS.SPACE);

            // is in air
            skier.update(gameStartTime);
            expect(skier.isJumping()).toBe(true);
            expect(skier.imageName).toBe(IMAGE_NAMES.SKIER_JUMP_1);

            // animates to new image after enough air time
            skier.position.y = 200;
            skier.update(gameStartTime + ANIMATION_FRAME_SPEED_MS + 10);
            expect(skier.imageName).toBe(IMAGE_NAMES.SKIER_JUMP_2);

            // return to ski down state
            skier.position.y = 500;
            skier.update(gameStartTime + ANIMATION_FRAME_SPEED_MS * 2 + 100);
            expect(skier.imageName).toBe(IMAGE_NAMES.SKIER_DOWN);
        });
    });
});
