import Scene from "../Scene.js";
import Img from "../Img.js";

import Player from "../Player.js";
import BlueSnail from "../EnemyMobs/BlueSnail/BlueSnail.js";

import { Platform } from "../Platform.js";
import GameMap from "../GameMap.js";

const Config = {
  platforms: [
    {
      x: 40,
      y: 650,
      w: 560,
      h: 1,
    },
    {
      x: 640,
      y: 595,
      w: 140,
      h: 1,
    },
    {
      x: 640,
      y: 715,
      w: 140,
      h: 1,
    },
  ],
};

export default class DevScene extends Scene {
  constructor(canvas, ctx) {
    const bg = Img("BG.png");

    const gameMap = new GameMap(1500, 2500, bg);
    const player = new Player(null, 20, 615, 400);
    const enemies = [
      new BlueSnail(100, 600, 1),
      new BlueSnail(180, 600, -1),
      new BlueSnail(250, 600, 1),
    ];

    const platforms = Config.platforms.map(
      (platform) => new Platform(...Object.values(platform))
    );

    super(canvas, ctx, player, gameMap, true);
    this.name = "Dev Scene";

    // Add entity through Scene
    enemies.forEach((enemy) => super.addEntity(enemy));
    platforms.forEach((platform) => super.addEntity(platform));

    // Set scene (sprite requirement)

    player.setScene(this);
    enemies.forEach((enemy) => enemy.setScene(this));
  }
}
