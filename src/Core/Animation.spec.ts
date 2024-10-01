
import { IMAGE_NAMES, ANIMATION_FRAME_SPEED_MS } from "../Constants";
import { Animation } from "./Animation";


describe('animation', () => {
    describe('looping', () => {
        it('runs animation', () => {
            const images = [IMAGE_NAMES.RHINO_CELEBRATE1, IMAGE_NAMES.RHINO_CELEBRATE2]
            const animation = new Animation(images, true, ANIMATION_FRAME_SPEED_MS);
            const gameStartTime = Date.now();
            expect(animation.getCurrentAnimationFrame()).toBe(0)


            // not enough time passes to move to next frame
            animation.nextFrame(gameStartTime + (ANIMATION_FRAME_SPEED_MS / 2))
            expect(animation.getCurrentAnimationFrame()).toBe(0);


            // enough time passed
            animation.nextFrame(gameStartTime + ANIMATION_FRAME_SPEED_MS + 1)
            expect(animation.getCurrentAnimationFrame()).toBe(1);
            expect(animation.getImages()[animation.getCurrentAnimationFrame()]).toBe(IMAGE_NAMES.RHINO_CELEBRATE2)

            //more times passes so should loop back to first image
            animation.nextFrame(gameStartTime + (ANIMATION_FRAME_SPEED_MS * 2) + 1)
            expect(animation.getCurrentAnimationFrame()).toBe(0);
            expect(animation.getImages()[animation.getCurrentAnimationFrame()]).toBe(IMAGE_NAMES.RHINO_CELEBRATE1)

        });
    });

    describe('non looping', () => {
        it('sets up animation', () => {
            const images = [IMAGE_NAMES.RHINO_CELEBRATE1, IMAGE_NAMES.RHINO_CELEBRATE2]
            const animation = new Animation(images, false, ANIMATION_FRAME_SPEED_MS);
            expect(animation.getImages()[0]).toBe(IMAGE_NAMES.RHINO_CELEBRATE1);
            expect(animation.getImages()[1]).toBe(IMAGE_NAMES.RHINO_CELEBRATE2)
        });

        it('runs animation', () => {
            const mockCallback = jest.fn();
            const images = [IMAGE_NAMES.RHINO_CELEBRATE1, IMAGE_NAMES.RHINO_CELEBRATE2]
            const animation = new Animation(images, false, ANIMATION_FRAME_SPEED_MS, mockCallback);
            const gameStartTime = Date.now();
            expect(animation.getCurrentAnimationFrame()).toBe(0);


            // not enough time passes to move to next frame
            animation.nextFrame(gameStartTime + (ANIMATION_FRAME_SPEED_MS / 2))
            expect(animation.getCurrentAnimationFrame()).toBe(0);

            // enough time passed
            animation.nextFrame(gameStartTime + ANIMATION_FRAME_SPEED_MS + 1)

            expect(animation.getCurrentAnimationFrame()).toBe(1);
            expect(animation.getImages()[animation.getCurrentAnimationFrame()]).toBe(IMAGE_NAMES.RHINO_CELEBRATE2)

            // animation finished
            animation.nextFrame(gameStartTime + (ANIMATION_FRAME_SPEED_MS * 2) + 2)
            expect(mockCallback).toBeCalled();
        });
    });

});