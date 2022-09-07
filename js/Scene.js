import Img from "./Img.js";
import { Logger } from "./logger.js";
import DebugLayer from "./DebugLayer.js";
import SpriteAnimationManager from "./SpriteAnimation.js";
import Camera from "./Camera.js";

import { Player } from "./Player.js";
import BlueSnail from "./EnemyMobs/BlueSnail/BlueSnail.js";
import RedSnail from "./EnemyMobs/RedSnail/RedSnail.js";

import { guid } from "./utils.js";

import mobTypes from "/Configs/entityTypes.js";
import { Platform } from "./Platform.js";
class Scene {
  constructor(
    canvas,
    ctx,
    bg,
    player,
    bgWidth,
    bgHeight,
    cameraWidth,
    cameraHeight,
    debug
  ) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.background = bg;
    this.player = player;
    this.logger = new Logger("Scene.js");
    this.debug = debug;
    this.camera = new Camera(player.x, player.y, cameraWidth, cameraHeight);
    this.camera.follow(player);
    this.entities = [];
    this.debugLayer = new DebugLayer();
    this.spriteMap = new Map();
    this.width = bgWidth;
    this.height = bgHeight;
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
    this.camera.update(delta);

    const ctx = this.ctx;
    const debugMode = this.debug;

    const width = this.camera.width;
    const height = this.camera.height;

    const cx = this.camera.x;
    const cy = this.camera.y;
    2;

    const canvasWidth = this.canvas.width;
    const canvasHeight = this.canvas.height;

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    ctx.drawImage(this.background, cx, cy);

    this.player.draw(ctx, debugMode);
    this.entities.forEach((ent) => ent.draw(ctx, debugMode, cx, cy));

    if (debugMode) {
      this.debugLayer.draw(ctx, this.entities.length, delta, 10, 50);
    }
  }
}

class DevScene extends Scene {
  constructor(canvas, ctx) {
    const bg = Img("BG.png");
    const player = new Player(null, 50, 5, 700, 600);
    const enemies = [
      new BlueSnail(100, 100, 1),
      new BlueSnail(180, 100, -1),
      new BlueSnail(250, 100, 1),
      new RedSnail(250, 200, 1),
    ];

    const bgHeight = bg.naturalHeight;
    const bgWidth = bg.naturalWidth;

    const platforms = [new Platform(300, 645, 730, 1)];

    super(canvas, ctx, bg, player, bgWidth, bgHeight, 100, 100, true);
    this.name = "Dev Scene";
    enemies.forEach((enemy) => super.addEntity(enemy));
    platforms.forEach((platform) => super.addEntity(platform));

    player.setScene(this);
    enemies.forEach((enemy) => enemy.setScene(this));
  }
}

export { DevScene };
