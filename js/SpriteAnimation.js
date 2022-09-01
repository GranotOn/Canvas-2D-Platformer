class SpriteAnimation {
  constructor({ row, cols }) {
    this.row = row;
    this.cols = cols;
    this.frame = 0;
    this.isOverOnce = false;
  }

  updateFrame() {
    if (this.frame === this.cols - 1) {
      this.frame = 0;
      this.isOverOnce = true;
    } else {
      this.frame = this.frame + 1;
    }
  }

  isAnimationOverOnce() {
    return this.isOverOnce;
  }

  getFrame(spriteWidth, spriteHeight) {
    const coords = {
      spriteX: this.frame * spriteWidth,
      spriteY: this.row * spriteHeight,
    };

    return coords;
  }

  reset() {
    this.frame = 0;
  }
}

export default class SpriteAnimationManager {
  constructor(img, opts) {
    this.opts = opts;
    this.spriteWidth = opts.width;
    this.spriteHeight = opts.height;
    this.spriteSheet = img;
    this.spriteAnimations = new Map();
    this.lastState = null;
    Object.entries(opts.states).forEach((state) => {
      this.spriteAnimations.set(state[0], new SpriteAnimation(state[1]));
    });
  }

  isAnimationOverOnce(state) {
    return this.spriteAnimations.get(state).isAnimationOverOnce();
  }

  drawFrame(ctx, state, x, y, frameShouldUpdate = false, face = 1) {
    if (state !== this.lastState) {
      this.lastState && this.spriteAnimations.get(this.lastState).reset();
      this.lastState = state;
    }

    const width = this.spriteWidth;
    const height = this.spriteHeight;

    const spriteAnimation = this.spriteAnimations.get(state);

    if (frameShouldUpdate) {
      spriteAnimation.updateFrame();
    }

    const { spriteX, spriteY } = spriteAnimation.getFrame(width, height);
    ctx.save();
    if (face === -1) {
      ctx.translate(x + width / 2, y + height / 2);
      ctx.scale(-1, 1);
      ctx.translate(-(x + width / 2), -(y + height / 2));
    }

    ctx.drawImage(
      this.spriteSheet,
      spriteX,
      spriteY,
      width,
      height,
      x,
      y,
      width,
      height
    );
    ctx.restore();
  }
}
