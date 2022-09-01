import BoundingBox from "./BoundingBox.js";
import mobTypes from "./entityTypes.json" assert { type: "json" };

export default class Shuriken {
  constructor(scene, x, y, face, enemies, damageRange, lifetime = 40) {
    this.type = mobTypes.playerAttack;
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.face = face;
    this.speed = 100;
    this.width = 10;
    this.height = 10;
    this.enemies = enemies;
    this.lifetime = lifetime;
    this.damageRange = damageRange;
    this.EPSILON = 10;
    this.boundingBox = new BoundingBox(this.x, this.y, this.width, this.h);
  }

  update(delta, collisions = []) {
    if (collisions.length > 0 || (this.life < 0 && this.enemies.length === 0)) {
      this.scene.removeEntity(this);
    } else if (this.enemies.length === 0) {
      this.x += (this.face * this.speed) / delta;
      this.boundingBox.x = this.x;
    } else {
      const target = this.enemies[0];
      const a = (this.y - target.y) / (this.x - target.x);
      const b = this.y - a * this.x;

      this.x += (this.face * this.speed) / delta;
      this.y = a * this.x + b;
      this.boundingBox.x = this.x;
      this.boundingBox.y = this.y;
    }

    this.life = this.life - 1;
  }

  setId(id) {
    this.id = id;
  }

  draw(ctx, debug) {
    if (debug) {
      ctx.lineWidth = 5;
      ctx.strokeStyle = "#ff0000";
      ctx.strokeRect(this.x, this.y, this.width, this.height);
    }
  }
}
