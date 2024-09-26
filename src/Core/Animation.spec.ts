
import { IMAGE_NAMES, ANIMATION_FRAME_SPEED_MS } from "../Constants";
import { Animation } from "./Animation";


describe('animation', () => {
    describe('looping', () => {
        it('runs animation', () => {
            const images = [IMAGE_NAMES.RHINO_CELEBRATE1, IMAGE_NAMES.RHINO_CELEBRATE2]
            const animation = new Animation(images, true, ANIMATION_FRAME_SPEED_MS);
            const gameStartTime = Date.now();
            expect(animation.getCurrentAnimationFrame()).toBe(0);

            // start animation
            console.log('start animation')
            animation.animate(gameStartTime)
            expect(animation.getCurrentAnimationFrame()).toBe(0);


            // not enough time passes to move to next frame
            console.log('cant move forwards')

            animation.animate(gameStartTime + (ANIMATION_FRAME_SPEED_MS / 2))
            expect(animation.getCurrentAnimationFrame()).toBe(0);


            // enough time passed
            console.log('move foramward 1')
            animation.animate(gameStartTime + ANIMATION_FRAME_SPEED_MS + 1)

            expect(animation.getCurrentAnimationFrame()).toBe(1);
            expect(animation.getImages()[animation.getCurrentAnimationFrame()]).toBe(IMAGE_NAMES.RHINO_CELEBRATE2)

            //more times passes so should loop back to first image
            console.log('move foramward 2')

            animation.animate(gameStartTime + (ANIMATION_FRAME_SPEED_MS * 2) + 1)
            expect(animation.getCurrentAnimationFrame()).toBe(1);
            expect(animation.getImages()[animation.getCurrentAnimationFrame()]).toBe(IMAGE_NAMES.RHINO_CELEBRATE2)

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
            const images = [IMAGE_NAMES.RHINO_CELEBRATE1, IMAGE_NAMES.RHINO_CELEBRATE2]
            const animation = new Animation(images, false, ANIMATION_FRAME_SPEED_MS);
            const gameStartTime = Date.now();
            expect(animation.getCurrentAnimationFrame()).toBe(0);

            // start animation
            console.log('start animation')
            animation.animate(gameStartTime)
            expect(animation.getCurrentAnimationFrame()).toBe(0);


            // not enough time passes to move to next frame
            console.log('cant move forwards')

            animation.animate(gameStartTime + (ANIMATION_FRAME_SPEED_MS / 2))
            expect(animation.getCurrentAnimationFrame()).toBe(0);

            // enough time passed
            animation.animate(gameStartTime + ANIMATION_FRAME_SPEED_MS + 1)

            expect(animation.getCurrentAnimationFrame()).toBe(1);
            expect(animation.getImages()[animation.getCurrentAnimationFrame()]).toBe(IMAGE_NAMES.RHINO_CELEBRATE2)

        });
    });

});