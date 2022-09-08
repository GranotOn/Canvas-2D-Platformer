import animationStates from "/Configs/animationStates.js";

export default class SpriteBox {
  constructor(Config, scene) {
    this.frameTime = Config.spriteOptions.frameTime;
    this.frameTimeDefault = Config.spriteOptions.frameTime;
    this.spriteAnimation = scene.getSpriteAnimation(
      Config.id,
      Config.spriteOptions.spriteFile,
      Config.spriteOptions
    );
    this.follows = null;
  }

  follow(entity) {
    this.follows = entity;
  }

  draw(ctx, offsetX, offsetY, debugMode = false) {
    const ent = this.follows;
    const x = ent.x + offsetX;
    const y = ent.y + offsetY;

    if (
      ent.state === animationStates.dead &&
      this.spriteAnimation.isAnimationOverOnce(animationStates.dead)
    ) {
      ent.remove();
      return;
    }

    if (
      ent.state === animationStates.hit &&
      this.spriteAnimation.isAnimationOverOnce(animationStates.hit)
    ) {
      ent.state = animationStates.idle;
    }

    var frameShouldUpdateFlag = false;
    if (this.frameTime <= 0) {
      frameShouldUpdateFlag = true;
      this.frameTime = this.frameTimeDefault;
    }

    this.frameTime -= 1;

    this.spriteAnimation.drawFrame(
      ctx,
      ent.state,
      x,
      y,
      frameShouldUpdateFlag,
      ent.face
    );
  }
}
