import Img from "./Img.js";
import { Logger } from "./logger.js";
import { Player } from "./Player.js";
import FlyingBoxOfDeath from "./FlyingBoxOfDeath.js";
import DebugLayer from "./DebugLayer.js";

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
  }

  onTick(delta) {
    this.#update(delta);
    this.#draw(delta);
  }

  onKeyDown(e) {
    this.player.onKeyDown(e);
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
      new FlyingBoxOfDeath(100, 100),
      new FlyingBoxOfDeath(300, 200),
      new FlyingBoxOfDeath(500, 200),
    ];
    super(canvas, ctx, bg, player, enemies, 600, 600, true);
    player.setScene(this);
  }
}

const sceneContext = {};

export { DevScene };
