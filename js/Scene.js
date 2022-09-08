import Img from "./Img.js";
import { Logger } from "./logger.js";
import DebugLayer from "./DebugLayer.js";
import SpriteAnimationManager from "./SpriteAnimation.js";
import Camera from "./Camera.js";

import { guid } from "./utils.js";

import mobTypes from "/Configs/entityTypes.js";

export default class Scene {
  constructor(canvas, ctx, player, gameMap, debugMode) {
    this.canvas = canvas;
    this.ctx = ctx;

    this.player = player;
    this.entities = [];
    this.camera = new Camera(canvas);
    this.camera.follow(player);
    this.gameMap = gameMap;

    this.logger = new Logger("Scene.js");
    this.debugMode = debugMode;
    this.debugLayer = new DebugLayer();
    this.spriteMap = new Map();
  }

  onTick(delta) {
    this.#update(delta);
    this.#draw(delta);
  }

  getSpriteAnimation(id, spriteFile, opts) {
    if (!this.spriteMap.has(id)) {
      this.spriteMap.set(id, new Img(spriteFile, "Assets/Sprites/"));
    }
    return new SpriteAnimationManager(this.spriteMap.get(id), opts);
  }

  onKeyDown(code) {
    this.player.onKeyDown(code);
    if (code === "F9") this.debugMode = !this.debugMode;
  }

  onKeyUp(code) {
    this.player.onKeyUp(code);
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

    this.camera.update(delta);
  }

  #draw(delta) {
    const ctx = this.ctx;

    // clear screen
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // get camera offsets
    const offsetX = this.camera.x;
    const offsetY = this.camera.y;

    // draw map
    this.gameMap.draw(
      ctx,
      offsetX,
      offsetY,
      this.canvas.width,
      this.canvas.height
    );

    // draw entities
    this.player.draw(ctx, offsetX, offsetY, this.debugMode);
    this.entities.forEach((ent) =>
      ent.draw(ctx, offsetX, offsetY, this.debugMode)
    );

    // draw UI layer

    // draw debug layer
    if (this.debugMode) {
      this.debugLayer.draw(ctx, this.entities.length, delta, 10, 50);
    }
  }
}
