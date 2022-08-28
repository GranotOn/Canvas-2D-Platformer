import BoundingBox from "./BoundingBox.js";

export default class Shuriken {
  constructor(scene, velocityX, velocityY, x, y, lifetime = 40) {
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.velocityX = velocityX;
    this.velocityY = velocityY;
    this.speed = 100;
    this.width = 10;
    this.height = 10;
    this.life = lifetime;
    this.boundingBox = new BoundingBox(this.x, this.y, this.width, this.h);
  }

  update(delta, collisions = []) {
    if (collisions.length > 0 || this.life < 0) {
      this.scene.removeEntity(this);
    }

    this.life = this.life - 1;
    this.x += (this.velocityX * this.speed) / delta;
    this.y += (this.velocityY * this.speed) / delta;
    this.boundingBox.x = this.x;
    this.boundingBox.y = this.y;
  }
  draw(ctx, debug) {
    if (debug) {
      ctx.lineWidth = 5;
      ctx.strokeStyle = "#ff0000";
      ctx.strokeRect(this.x, this.y, this.width, this.height);
    }
  }
}
