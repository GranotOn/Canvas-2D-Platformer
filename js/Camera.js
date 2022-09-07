export default class Camera {
  constructor(viewport) {
    this.x = 0;
    this.y = 0;
    this.viewport = viewport;
    this.lerp = 0.1;
  }
  follow(entity) {
    this.follows = entity;
  }

  #lerp(start, end, amt) {
    return (1 - amt) * start + amt * end;
  }
  update(delta) {
    this.x = this.#lerp(
      this.x,
      this.viewport.width / 2 - this.follows.x,
      this.lerp
    );
    this.y = this.#lerp(
      this.y,
      this.viewport.height / 2 - this.follows.y,
      this.lerp
    );
  }
}
