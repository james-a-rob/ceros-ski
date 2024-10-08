/**
 * Configuration for a single animation. Animations contain an array of images to play through. They can loop back
 * to the start when the full animation sequence has been played or they can not loop and just finish on the last image.
 * They can also have a callback set to fire when the animation sequence is complete.
 */
import { IMAGE_NAMES } from "../Constants";

export class Animation {
    private animationFrameSpeed: number;
    private curAnimationFrameTime: number | null = null;
    /**
     * The current frame of the animation
     */
    private curAnimationFrame: number = 0;

    /**
     * The sequence of images the animation cycles through
     */
    private readonly images: IMAGE_NAMES[];

    /**
     * Does the animation loop back to the beginning when complete?
     */
    private readonly looping: boolean;

    /**
     * Function to call when the animation is complete
     */
    private readonly callback?: Function;

    constructor(images: IMAGE_NAMES[], looping: boolean, animationFrameSpeed: number, callback?: Function) {
        this.animationFrameSpeed = animationFrameSpeed;
        this.images = images;
        this.looping = looping;
        this.callback = callback;
    }

    nextFrame(gameTime: number): void {
        // store time of first frame when starting animation
        if (!this.curAnimationFrameTime) {
            this.curAnimationFrameTime = Date.now();
        }

        // check if should step forwards
        if (gameTime - this.curAnimationFrameTime >= this.animationFrameSpeed) {
            // check if reached last image
            if (this.curAnimationFrame === this.images.length - 1) {
                if (this.looping) {
                    this.curAnimationFrame = 0;
                    this.curAnimationFrameTime = gameTime;
                } else {
                    this.curAnimationFrameTime = null;
                    this.curAnimationFrame = 0;

                    this.callback && this.callback();
                }
            } else {
                this.curAnimationFrameTime = gameTime;
                this.curAnimationFrame++;
            }
        }
    }

    getImages(): IMAGE_NAMES[] {
        return this.images;
    }

    getCurrentAnimationFrame(): number {
        return this.curAnimationFrame;
    }

    getLooping(): boolean {
        return this.looping;
    }

    getCallback(): Function | undefined {
        return this.callback;
    }
}
