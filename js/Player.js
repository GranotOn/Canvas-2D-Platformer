import BoundingBox from "./BoundingBox.js";
import { Logger } from "./logger.js";
import Shuriken from "./Shuriken.js";
import jumpState from "../Configs/jumpStates.js";
import mobTypes from "/Configs/entityTypes.js";
import gravity from "../Configs/gravity.js";

export class Player {
  constructor(
    scene = null,
    velocityX = 50,
    velocityY = 5,
    x = 0,
    y = 0,
    face = 1
  ) {
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.formerY = y;
    this.type = mobTypes.player;
    this.jump = jumpState.notJumping;
    this.velocityX = velocityX;
    this.velocityY = velocityY;
    this.face = face;
    this.width = 100;
    this.boundingColor = "#e41f1f";
    this.height = 120;
    this.boundingBox = new BoundingBox(x, y, this.width, this.height);
    this.logger = new Logger("Player");
    this.cooldown = false;
    this.jumpLimit = 100;
    this.gravity = gravity;
    this.gravitySpeed = 0;
  }

  setScene(scene) {
    this.scene = scene;
  }

  #handleCollisions(collisions) {
    if (collisions.length > 0) this.boundingColor = "#0000ff";
    else this.boundingColor = "#ff0000";
  }

  #initCooldown(cooldown = 1000) {
    this.cooldown = true;
    const disableCooldown = () => (this.cooldown = false);
    setTimeout(disableCooldown, cooldown);
  }

  #emitShuriken() {
    if (this.cooldown === true) return;
    this.#initCooldown();

    const enemies = this.scene.getKEnemiesInRange(1, 400, this.face);

    var x = this.face === 1 ? this.width + 10 : -15;
    x += this.x;
    this.scene.addEntity(
      new Shuriken(
        this.scene,
        x,
        this.y + this.height / 2,
        this.face,
        enemies,
        [2, 6]
      )
    );
  }

  #handleJump() {
    if (this.jump === jumpState.notJumping) {
      this.jump = jumpState.goingUp;
      this.formerY = this.y;
    }
  }

  update(delta, collisions = []) {
    this.#handleCollisions(collisions);

    var idleFlag = true;

    const onNotIdle = () => {
      idleFlag = false;
      this.boundingBox.x = this.x;
      this.boundingBox.y = this.y;
    };

    if (this.rightPressed) {
      this.x = Math.min(this.x + this.velocityX / delta, window.innerWidth);
      this.face = 1;
      onNotIdle();
    }

    if (this.leftPressed) {
      this.x = Math.max(this.x - this.velocityX / delta, 0);
      this.face = -1;
      onNotIdle();
    }

    if (this.jump === jumpState.goingUp) {
      this.gravitySpeed += this.gravity;
      this.y -= this.velocityY + this.gravitySpeed;

      if (this.y <= this.formerY - this.jumpLimit) {
        this.jump = jumpState.goingDown;
      }
    }

    if (this.spacePressed) {
      this.#handleJump();
    }

    if (idleFlag) {
    }
  }

  draw(ctx, isDebug = false) {
    ctx.lineWidth = 5;
    ctx.strokeStyle = this.boundingColor;
    ctx.strokeRect(this.x, this.y, this.width, this.height);
  }

  onKeyDown(e) {
    switch (e.code) {
      case "ArrowRight":
        this.rightPressed = true;
        break;
      case "ArrowLeft":
        this.leftPressed = true;
        break;
      case "Space":
        this.spacePressed = true;
        break;
      case "ControlLeft":
        this.#emitShuriken();
    }
  }

  onKeyUp(e) {
    switch (e.code) {
      case "ArrowRight":
        this.rightPressed = false;
        break;
      case "ArrowLeft":
        this.leftPressed = false;
        break;
      case "Space":
        this.spacePressed = false;
        break;
    }
  }

  onCollision(otherEntity) {}
}
