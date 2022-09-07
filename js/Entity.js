import BoundingBox from "./BoundingBox.js";
export default class Entity {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.boundingBox = new BoundingBox(x, y, width, height);
  }

  setId(id) {
    this.id = id;
  }

  update(delta, collisions) {}

  draw(ctx, debugMode, vx, vy) {
    const dx = this.x - vx;
    const dy = this.y - vy;

    if (debugMode) {
      ctx.lineWidth = 5;
      ctx.strokeStyle = this.debugColor;
      ctx.strokeRect(dx, dy, this.width, this.height);
    }
  }
}
