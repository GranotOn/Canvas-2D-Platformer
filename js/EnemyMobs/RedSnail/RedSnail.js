import Config from "./RedSnail.json" assert { type: "json" };
import mobTypes from "../../entityTypes.json" assert { type: "json" };
import BoundingBox from "../../BoundingBox.js";

export default class BlueSnail {
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

  update(delta, collisions) {
    if (collisions.length > 0) {
      collisions.forEach((ent) => {
        if (ent.type === mobTypes.playerAttack) {
          const [min, max] = ent.damageRange;
          const damage = Math.floor(Math.random() * (max - min) + min);
          if (damage <= Config.minimumDamageThreshold) {
            // miss;
          } else if (this.hp > 0) {
            // hit;
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
      this.x,
      this.y,
      frameShouldUpdateFlag,
      this.face
    );

    if (debugMode) {
      ctx.lineWidth = 5;
      ctx.strokeStyle = this.debugColor;
      ctx.strokeRect(this.x, this.y, this.width, this.height);
    }
  }
}
