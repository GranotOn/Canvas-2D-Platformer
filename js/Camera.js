export default class Camera {
  constructor(x, y, width, height, lerp = 0.1) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.player = null;
    this.lerp = lerp;
  }

  #lerp(a, b, delta) {
    return (a - b) * this.lerp * delta;
  }

  follow(player) {
    this.player = player;
  }

  update(delta) {
    this.x += this.#lerp(this.player.x, this.x, delta);
    this.y += this.#lerp(this.player.y, this.y, delta);
  }
}
