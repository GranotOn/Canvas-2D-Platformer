import { Logger } from "./logger.js";
import { DevScene } from "./Scene.js";

class Game {
  constructor() {
    this.scene = null;
    this.canvas = null;
    this.ctx = null;
    this.wrapper = null;
    this.logger = new Logger("main.js");
    this.lastUpdate = 0;
  }

  init() {
    this.logger.log("Game init");
    // create canvas and append to wrapper
    this.canvas = document.createElement("canvas");
    this.wrapper = document.getElementById("wrapper");
    this.wrapper.appendChild(this.canvas);
    this.#onResize(); // set width & height first time manually

    // add event listeners
    document.addEventListener("resize", (e) => this.#onResize(e));
    document.addEventListener("keydown", (e) => this.#onKeyDown(e));
    document.addEventListener("keyup", (e) => this.#onKeyUp(e));

    this.ctx = this.canvas.getContext("2d");
  }

  setScene(scene) {
    this.logger.log(`Game setting scene {${scene.name}}`);
    this.scene = scene;
  }

  #onKeyDown(e) {
    this.scene && this.scene.onKeyDown(e.code);
  }

  #onKeyUp(e) {
    this.scene && this.scene.onKeyUp(e.code);
  }

  #onResize() {
    this.canvas.width = this.wrapper.clientWidth;
    this.canvas.height = this.wrapper.clientHeight;
  }

  animate(ts) {
    const delta = ts - this.lastUpdate;
    this.scene.onTick(delta);
    this.lastUpdate = ts;
    window.requestAnimationFrame((t) => this.animate(t));
  }
}

function Init() {
  const game = new Game();
  game.init();
  game.setScene(new DevScene(game.canvas, game.ctx));
  game.animate(0);
}

window.onload = () => {
  Init();
};
