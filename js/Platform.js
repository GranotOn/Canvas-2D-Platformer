import entityTypes from "../Configs/entityTypes.js";
import Entity from "./Entity.js";

export class Platform extends Entity {
  constructor(x, y, width, height) {
    super(x, y, width, height);
    this.type = entityTypes.platform;
  }
}
