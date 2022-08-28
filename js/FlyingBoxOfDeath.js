import BoundingBox from "./BoundingBox.js";

export default class FlyingBoxOfDeath {
  constructor(x, y, velocityX, velocityY, color = "#00ff00") {
    this.color = color;
    this.x = x;
    this.y = y;
    this.velocityX = velocityX;
    this.velocityY = velocityY;
    this.width = 100;
    this.height = 100;
    this.boundingBox = new BoundingBox(x, y, this.width, this.height);
  }

  #handleCollisions(collisions) {
    if (collisions.length > 0) this.color = "#0000ff";
    else this.color = "#e41f1f";
  }

  update(delta, collisions) {
    this.#handleCollisions(collisions);
  }

  draw(ctx, debugMode) {
    ctx.lineWidth = 5;
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}
