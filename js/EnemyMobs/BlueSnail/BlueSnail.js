import Entity from "../../Entity.js";

import Config from "/Configs/BlueSnail.js";
import mobTypes from "/Configs/entityTypes.js";
import animationStates from "/Configs/animationStates.js";

export default class BlueSnail extends Entity {
  constructor(x, y, face) {
    super(x, y, Config.spriteOptions.width, Config.spriteOptions.height, face);
    super.addBoundingBox();
    super.addHitQueue();

    this.type = mobTypes.enemy;
    this.hp = Config.hp;
    this.state = animationStates.walk;
  }

  setScene(scene) {
    super.setScene(scene);
    super.addSpriteBox(Config, scene);
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
            } else {
              this.state = animationStates.hit;
            }
          }
        }
      });
      this.debugColor = "#0000e0";
    } else {
      this.debugColor = "#e00000";
    }

    super.update(delta, collisions);
  }
}
