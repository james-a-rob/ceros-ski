import 'jest-canvas-mock';
import { ImageManager } from "../Core/ImageManager";
import { IMAGE_NAMES } from '../Constants';
import { Obstacle } from './Obstacles/Obstacle';
import { ObstacleManager } from "./Obstacles/ObstacleManager";
import { Canvas } from "../Core/Canvas";
import { Skier } from "./Skier";

/**
 * These are clientside integration tests. There is not much mocking. Consider adding lower level unit tests to improve coverage
 */
describe('Skier', () => {
    describe('jumping', () => {
        it('gets air when hitting a jump', () => {

            document.body.innerHTML = `<div><canvas id="game-canvas"></canvas></div>`;

            const imageManager = new ImageManager();
            const canvas = new Canvas("game-canvas", 300, 300);
            const obstacleManager = new ObstacleManager(imageManager, canvas);
            const skier = new Skier(0, 0, imageManager, obstacleManager, canvas);

            // set jump directly infront of skier. 
            const jump = new Obstacle(0, 0, imageManager, canvas);
            jump.imageName = IMAGE_NAMES.JUMP_RAMP;
            obstacleManager.obstacles.push(jump)

            console.log(obstacleManager.obstacles)
            expect(skier.isJumping).toBe(true);
        });

        // it('gets air when player hits space bar', () => {
        //     expect(1).toBe(2);
        // });

        // it('does not crash into tree when in the air', () => {
        //     expect(1).toBe(2);
        // });

    })
});