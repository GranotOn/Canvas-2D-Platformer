const DEPTH = 5;

export default class HitUI {
  constructor(damage, y) {
    this.damage = damage === 0 ? "MISS" : damage;
    this.y = y;
  }

  draw(ctx, x) {
    ctx.font = "25pt Calibri";
    ctx.fillStyle = "black";

    ctx.textAlign = "center";
    ctx.textBaseLine = "middle";

    var i;

    for (i = 0; i < DEPTH; ++i) ctx.fillText(this.damage, x - i, this.y - i);

    ctx.fillStyle = this.damage === "MISS" ? "#BDB5D5" : "#FF7518";
    ctx.shadowColor = "black";
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = DEPTH + 2;
    ctx.shadowOffsetY = DEPTH + 2;
    ctx.fillText(this.damage, x - i, this.y - i);
  }
}
