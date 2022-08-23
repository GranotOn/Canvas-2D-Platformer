import { Colors, Logger } from "./logger.js";

const logger = new Logger("main.js");

const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
document.body.append(canvas);
