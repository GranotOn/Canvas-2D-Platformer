import BoundingBox from "./BoundingBox.js";
import { Logger } from "./logger.js";
import Shuriken from "./Shuriken.js";

export class Player {
  constructor(
    scene = null,
    velocityX = 50,
    velocityY = 50,
    x = 0,
    y = 0,
    face = 1
  ) {
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.velocityX = velocityX;
    this.velocityY = velocityY;
    this.face = face;
    this.width = 150;
    this.boundingColor = "#e41f1f";
    this.height = 150;
    this.boundingBox = new BoundingBox(x, y, this.width, this.height);
    this.logger = new Logger("Player");
  }

  setScene(scene) {
    this.scene = scene;
  }

  #handleCollisions(collisions) {
    if (collisions.length > 0) this.boundingColor = "#0000ff";
    else this.boundingColor = "#ff0000";
  }

  #emitShuriken() {
    var x = this.face === 1 ? this.width + 10 : -15;
    x += this.x;
    this.scene.addEntity(
      new Shuriken(this.scene, this.face, 0, x, this.y + this.height / 2)
    );
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
      onNotIdle();
    }
    if (this.leftPressed) {
      this.x = Math.max(this.x - this.velocityX / delta, 0);
      onNotIdle();
    }
    if (this.upPressed) {
      this.y = Math.max(this.y - this.velocityY / delta, 0);
      onNotIdle();
    }
    if (this.downPressed) {
      this.y = Math.min(this.y + this.velocityY / delta, window.innerHeight);
      onNotIdle();
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
        this.face = 1;
        break;
      case "ArrowLeft":
        this.leftPressed = true;
        this.face = -1;
        break;
      case "ArrowUp":
        this.upPressed = true;
        break;
      case "ArrowDown":
        this.downPressed = true;
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
      case "ArrowUp":
        this.upPressed = false;
        break;
      case "ArrowDown":
        this.downPressed = false;
        break;
      case "Space":
        this.spacePressed = false;
        break;
    }
  }

  onCollision(otherEntity) {}
}
