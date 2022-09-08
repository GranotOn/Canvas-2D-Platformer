const HIT_LIFETIME = 1000;
import HitUI from "./HitUI.js";
import BoundingBox from "./BoundingBox.js";
import SpriteBox from "./SpriteBox.js";
import animationStates from "/Configs/animationStates.js";
import { Logger } from "./logger.js";

export default class Entity {
  constructor(x, y, width, height, face = 1) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.scene = null;
    this.face = face;
    this.debugColor = "#e00000";
    this.logger = new Logger("Entity.js");
  }

  addSpriteBox(config, scene = null) {
    if (!this.scene && !scene) {
      this.logger.error("No scene to add spritebox to");
      return;
    }
    this.spriteBox = new SpriteBox(config, scene);
    this.spriteBox.follow(this);
  }

  addBoundingBox() {
    this.boundingBox = new BoundingBox(this.x, this.y, this.width, this.height);
    this.boundingBox.follow(this);
  }

  addHitQueue() {
    this.hitQueue = [];
  }

  addDamageUI(damage) {
    this.hitQueue.push(new HitUI(damage, this.hitQueue.length));
    const dequeueHit = () => this.hitQueue.shift().remove();
    setTimeout(dequeueHit, HIT_LIFETIME);
  }

  onDead() {
    this.state = animationStates.dead;
    this.boundingBox = null;
  }

  setId(id) {
    this.id = id;
  }

  setScene(scene) {
    this.scene = scene;
  }

  remove() {
    this.scene.removeEntity(this);
  }

  update(delta, collisions) {
    if (this.boundingBox) this.boundingBox.update();
  }

  draw(ctx, offsetX, offsetY, debugMode = false) {
    if (debugMode) {
      ctx.lineWidth = 5;
      ctx.strokeStyle = this.debugColor;
      ctx.strokeRect(
        this.x + offsetX,
        this.y + offsetY,
        this.width,
        this.height
      );
    }

    if (this.hitQueue) this.drawHitQueue(ctx, offsetX, offsetY, debugMode);
    if (this.spriteBox) this.spriteBox.draw(ctx, offsetX, offsetY, debugMode);
  }

  drawHitQueue(ctx, offsetX, offsetY, debugMode) {
    this.hitQueue.forEach((hitObject, idx) => {
      const x = this.x + offsetX + (idx % 2 === 0 ? -3 : 3) + this.width / 2;
      const y = this.y + offsetY - hitObject.yOrder * 25;
      hitObject.draw(ctx, x, y, debugMode);
    });
  }
}
