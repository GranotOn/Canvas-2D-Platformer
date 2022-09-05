import { Logger } from "./logger.js";
import { DevScene } from "./Scene.js";

const logger = new Logger("main.js");
var scene = null;
var canvas = null;
var ctx = null;
var lastRender = new Date();

function gameLoop() {
  const time = new Date();
  const delta = time - lastRender;
  lastRender = time;
  if (scene) {
    scene.onTick(delta);
  }
}

function keydown(e) {
  if (scene) {
    scene.onKeyDown(e);
  }
}

function keyup(e) {
  if (scene) {
    scene.onKeyUp(e);
  }
}

onresize = (e) => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
};

function initGame() {
  logger.log("Init");

  canvas = document.createElement("canvas");
  const wrapper = document.getElementById("wrapper");
  canvas.width = wrapper.offsetWidth;
  canvas.height = wrapper.offsetHeight;
  wrapper.append(canvas);
  ctx = canvas.getContext("2d");

  logger.log("Creating Scene");

  scene = new DevScene(canvas, ctx);

  document.addEventListener("keydown", (e) => keydown(e));
  document.addEventListener("keyup", (e) => keyup(e));
}

initGame();
setInterval(gameLoop, 1000 / 60);
