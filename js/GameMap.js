export default class GameMap {
  constructor(w, h, bg) {
    this.w = w;
    this.h = h;
    this.bg = bg;
  }

  draw(ctx, sx, sy, cw, ch) {
    ctx.drawImage(this.bg, -sx, -sy, cw, ch, 0, 0, cw, ch);
  }
}
