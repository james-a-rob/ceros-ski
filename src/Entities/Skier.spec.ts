import 'jest-canvas-mock';
import { ImageManager } from "../Core/ImageManager";
import { IMAGE_NAMES, IMAGES } from '../Constants';
import { Obstacle } from './Obstacles/Obstacle';
import { ObstacleManager } from "./Obstacles/ObstacleManager";
import { Canvas } from "../Core/Canvas";
import { Skier } from "./Skier";

/**
 * These are clientside integration tests. There is not much mocking. Consider adding lower level unit tests to improve coverage
 */

beforeEach(() => {
    // Define a mock Image class
    global.Image = class {
        onload: (() => void) | null = null; // Type for onload
        onerror: ((error: Event) => void) | null = null; // Type for onerror

        // Setter for src to simulate image loading
        set src(url: string) {
            // Simulating successful loading
            setTimeout(() => {
                if (this.onload) {
                    this.onload(); // Call onload if it exists
                }
            }, 0);
        }
    } as unknown as typeof Image; // Cast to the type of the global Image
});

describe('Skier', () => {
    describe('jumping', () => {
        it('gets air when hitting a jump', async () => {

            document.body.innerHTML = `<div><canvas id="game-canvas"></canvas></div>`;

            const imageManager = new ImageManager();
            await imageManager.loadImages(IMAGES);

            const canvas = new Canvas("game-canvas", 300, 300);
            const obstacleManager = new ObstacleManager(imageManager, canvas);
            const skier = new Skier(0, 0, imageManager, obstacleManager, canvas);

            // set jump directly infront of skier. 
            const jump = new Obstacle(0, 0, imageManager, canvas);
            jump.imageName = IMAGE_NAMES.JUMP_RAMP;
            obstacleManager.obstacles.push(jump)

            skier.update();
            expect(skier.isJumping()).toBe(true);
        });

        // it('gets air when player hits space bar', () => {
        //     expect(1).toBe(2);
        // });

        // it('does not crash into tree when in the air', () => {
        //     expect(1).toBe(2);
        // });

        // it('flips while in the air', () => {

        // });

    })
});