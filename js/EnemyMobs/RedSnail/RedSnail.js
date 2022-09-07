import BoundingBox from "../../BoundingBox.js";
import HitUI from "../../HitUI.js";

import Config from "/Configs/RedSnail.js";
import mobTypes from "/Configs/entityTypes.js";
export default class RedSnail {
  constructor(x, y, face = 1) {
    this.type = mobTypes.enemy;
    this.scene = null;
    this.x = x;
    this.y = y;
    this.width = Config.spriteOptions.width;
    this.height = Config.spriteOptions.height;
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

  setId(id) {
    this.id = id;
  }

  onDead() {
    this.state = "dead";
    this.boundingBox = null;
  }

  addDamageUI(damage) {
    const lifeTime = 2000;
    this.hitQueue.push(new HitUI(damage, this.y - this.hitQueue.length * 30));
    const dequeueHit = () => this.hitQueue.shift();
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

  draw(ctx, debugMode) {
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

    this.hitQueue.forEach((hitObject, idx) =>
      hitObject.draw(ctx, x + this.width / 2)
    );

    super(ctx, offsetX, offsetY, debugMode);
  }
}
