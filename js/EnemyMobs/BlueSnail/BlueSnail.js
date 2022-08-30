import BlueSnailConfig from "./BlueSnail.json" assert { type: "json" };
import BoundingBox from "../../BoundingBox.js";
export default class BlueSnail {
  constructor(x, y, face = 1) {
    this.scene = null;
    this.x = x;
    this.y = y;
    this.width = BlueSnailConfig.spriteOptions.width;
    this.height = BlueSnailConfig.spriteOptions.height;
    this.frameTime = BlueSnailConfig.spriteOptions.frameTime;
    this.frameTimeDefault = BlueSnailConfig.spriteOptions.frameTime;
    this.state = "walk";
    this.face = face;
    this.boundingBox = new BoundingBox(x, y, this.width, this.height);
  }

  setScene(scene) {
    this.scene = scene;
    this.spriteAnimation = scene.getSpriteAnimation(
      BlueSnailConfig.id,
      BlueSnailConfig.spriteOptions.spriteFile,
      BlueSnailConfig.spriteOptions
    );
  }

  update(delta, collisions) {}

  draw(ctx, debugMode) {
    var frameShouldUpdateFlag = false;
    if (this.frameTime <= 0) {
      frameShouldUpdateFlag = true;
      this.frameTime = this.frameTimeDefault;
    }

    this.frameTime -= 1;

    this.spriteAnimation.drawFrame(
      ctx,
      this.state,
      this.x,
      this.y,
      frameShouldUpdateFlag,
      this.face
    );

    if (debugMode) {
      ctx.lineWidth = 5;
      ctx.strokeStyle = "#e00000";
      ctx.strokeRect(this.x, this.y, this.width, this.height);
    }
  }
}
