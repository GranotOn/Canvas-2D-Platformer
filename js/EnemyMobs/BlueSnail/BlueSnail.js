import BoundingBox from "../../BoundingBox.js";
import Entity from "../../Entity.js";
import HitUI from "../../HitUI.js";

import Config from "/Configs/BlueSnail.js";
import mobTypes from "/Configs/entityTypes.js";
export default class BlueSnail extends Entity {
  constructor(x, y, face = 1) {
    super(x, y, Config.spriteOptions.width, Config.spriteOptions.height);
    this.type = mobTypes.enemy;
    this.scene = null;
    this.frameTime = Config.spriteOptions.frameTime;
    this.frameTimeDefault = Config.spriteOptions.frameTime;
    this.hp = Config.hp;
    this.state = "walk";
    this.face = face;
    this.hitQueue = [];
    this.boundingBox = new BoundingBox(x, y, this.width, this.height);
    this.debugColor = "#e00000";
  }

  setScene(scene) {
    this.scene = scene;
    this.spriteAnimation = scene.getSpriteAnimation(
      Config.id,
      Config.spriteOptions.spriteFile,
      Config.spriteOptions
    );
  }

  onDead() {
    this.state = "dead";
    this.boundingBox = null;
  }

  addDamageUI(damage) {
    const lifeTime = 1000;
    this.hitQueue.push(new HitUI(damage, this.hitQueue.length));
    const dequeueHit = () => this.hitQueue.shift().remove();
    setTimeout(dequeueHit, lifeTime);
  }

  update(delta, collisions) {
    if (collisions.length > 0) {
      collisions.forEach((ent) => {
        if (ent.type === mobTypes.playerAttack) {
          const [min, max] = ent.damageRange;
          const damage = Math.floor(Math.random() * (max - min) + min);
          if (damage <= Config.minimumDamageThreshold) {
            this.addDamageUI(0);
            // miss;
          } else if (this.hp > 0) {
            // hit;
            this.addDamageUI(damage);
            this.hp -= damage;
            if (this.hp <= 0) {
              this.onDead();
            }
          }
        }
      });
      this.debugColor = "#0000e0";
    } else {
      this.debugColor = "#e00000";
    }
  }

  setId(id) {
    this.id = id;
  }

  drawHitQueue(ctx, offsetX, offsetY, debugMode) {
    this.hitQueue.forEach((hitObject, idx) => {
      const x = this.x + offsetX + (idx % 2 === 0 ? -3 : 3) + this.width / 2;
      const y = this.y + offsetY - hitObject.yOrder * 25;
      hitObject.draw(ctx, x, y, debugMode);
    });
  }

  draw(ctx, offsetX, offsetY, debugMode) {
    const x = this.x + offsetX;
    const y = this.y + offsetY;

    if (
      this.state === "dead" &&
      this.spriteAnimation.isAnimationOverOnce("dead")
    ) {
      this.scene.removeEntity(this);
      return;
    }
    var frameShouldUpdateFlag = false;
    if (this.frameTime <= 0) {
      frameShouldUpdateFlag = true;
      this.frameTime = this.frameTimeDefault;
    }

    this.frameTime -= 1;

    this.spriteAnimation.drawFrame(
      ctx,
      this.state,
      x,
      y,
      frameShouldUpdateFlag,
      this.face
    );

    this.drawHitQueue(ctx, offsetX, offsetY, debugMode);

    super.draw(ctx, offsetX, offsetY, debugMode);
  }
}
