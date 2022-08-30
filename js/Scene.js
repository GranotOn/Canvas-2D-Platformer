import Img from "./Img.js";
import { Logger } from "./logger.js";
import { Player } from "./Player.js";
import FlyingBoxOfDeath from "./FlyingBoxOfDeath.js";
import DebugLayer from "./DebugLayer.js";
import SpriteAnimation from "./SpriteAnimation.js";
import BlueSnail from "./EnemyMobs/BlueSnail/BlueSnail.js";
import SpriteAnimationManager from "./SpriteAnimation.js";

class Scene {
  constructor(
    canvas,
    ctx,
    bg,
    player,
    entities,
    cameraWidth = 600,
    cameraHeight = 600,
    debug = false
  ) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.background = bg;
    this.player = player;
    this.cameraWidth = cameraWidth;
    this.cameraHeight = cameraHeight;
    this.logger = new Logger("Scene.js");
    this.debug = debug;
    this.entities = entities;
    this.debugLayer = new DebugLayer();
    this.spriteMap = new Map();
  }

  onTick(delta) {
    this.#update(delta);
    this.#draw(delta);
  }

  onKeyDown(e) {
    this.player.onKeyDown(e);
    if (e.code === "F9") this.debug = !this.debug;
  }

  getSpriteAnimation(id, spriteFile, opts) {
    if (!this.spriteMap.has(id)) {
      this.spriteMap.set(id, new Img(spriteFile, "Assets/Sprites/"));
    }

    return new SpriteAnimationManager(this.spriteMap.get(id), opts);
  }

  onKeyUp(e) {
    this.player.onKeyUp(e);
  }

  addEntity(ent) {
    this.entities.push(ent);
  }

  removeEntity(ent) {
    this.entities = this.entities.filter((e) => e !== ent);
  }

  #update(delta) {
    // Check for collisions
    const entities = this.entities.concat(this.player);
    entities.forEach((entity, i) => {
      const collisions = [];
      entities.forEach((otherEntity, j) => {
        if (i !== j && entity.boundingBox.isColliding(otherEntity))
          collisions.push(otherEntity);
      });
      entity.update(delta, collisions);
    });
  }

  #draw(delta) {
    const playerX = this.player.x;
    const playerY = this.player.y;

    const sx = Math.max(
      Math.min(
        window.innerWidth - this.cameraWidth,
        playerX + this.cameraWidth / 2
      ),
      0
    );
    const sy = Math.max(
      Math.min(
        window.innerHeight - this.cameraHeight,
        playerY - this.cameraHeight / 2
      ),
      0
    );

    this.ctx.drawImage(
      this.background,
      sx,
      sy,
      this.cameraWidth,
      this.cameraHeight,
      0,
      0,
      window.innerWidth,
      window.innerHeight
    );
    const ctx = this.ctx;
    const debugMode = this.debug;

    this.player.draw(ctx, debugMode);
    this.entities.forEach((ent) => ent.draw(ctx, debugMode));

    if (debugMode) {
      this.debugLayer.draw(ctx, this.entities.length, delta, 10, 50);
    }
  }
}

class DevScene extends Scene {
  constructor(canvas, ctx) {
    const bg = Img("BG.png");
    const player = new Player(null, 50, 50, 700, 50);
    const enemies = [
      new BlueSnail(100, 100, 1),
      new BlueSnail(180, 100, -1),
      new BlueSnail(250, 100, 1),
    ];
    super(canvas, ctx, bg, player, enemies, 600, 600, true);

    player.setScene(this);
    enemies.forEach((enemy) => enemy.setScene(this));
  }
}

export { DevScene };
