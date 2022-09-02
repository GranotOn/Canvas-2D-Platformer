import Img from "./Img.js";
import { Logger } from "./logger.js";
import { Player } from "./Player.js";
import DebugLayer from "./DebugLayer.js";
import BlueSnail from "./EnemyMobs/BlueSnail/BlueSnail.js";
import RedSnail from "./EnemyMobs/RedSnail/RedSnail.js";
import SpriteAnimationManager from "./SpriteAnimation.js";
import mobTypes from "./entityTypes.json" assert { type: "json" };
import { guid } from "./utils.js";

class Scene {
  constructor(
    canvas,
    ctx,
    bg,
    player,
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
    this.entities = [];
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
    ent.setId(guid());
    this.entities.push(ent);
  }

  removeEntity(ent) {
    this.entities = this.entities.filter((e) => e.id !== ent.id);
  }

  getKEnemiesInRange(k, range, direction) {
    if (k === 0) return [];
    // direction -> 0 = every direction, -1 = -x, 1 = x
    const playerX = this.player.x;
    const playerY = this.player.y;

    const getDist = (x1, y1, x2, y2) =>
      Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));

    const kEnemiesInRange = this.entities.filter((ent) => {
      const { x, y, state, type } = ent;
      const shouldIgnore =
        (direction === 1 && x < playerX) ||
        (direction === -1 && x > playerX) ||
        type !== mobTypes.enemy ||
        state === "dead";

      const dist = getDist(playerX, playerY, x, y);
      if (!shouldIgnore && dist <= range && k > 0) {
        --k;
        return true;
      }

      return false;
    });

    return kEnemiesInRange.sort(
      (a, b) =>
        getDist(playerX, playerY, a.x, a.y) >
        getDist(playerX, playerY, b.x, b.y)
    );
  }

  #update(delta) {
    // Check for collisions
    const entities = this.entities
      .concat(this.player)
      .filter((ent) => ent.boundingBox !== null);
    entities.forEach((entity, i) => {
      let collisions = [];
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
      new RedSnail(250, 200, 1),
    ];
    super(canvas, ctx, bg, player, 600, 600, true);
    enemies.forEach((enemy) => super.addEntity(enemy));

    player.setScene(this);
    enemies.forEach((enemy) => enemy.setScene(this));
  }
}

export { DevScene };
