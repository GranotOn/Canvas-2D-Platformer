export default class BoundingBox {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;
  }

  isColliding(otherBox) {
    return !(
      this.y + this.height < otherBox.y ||
      this.y > otherBox.y + otherBox.height ||
      this.x + this.width < otherBox.x ||
      this.x > otherBox.x + otherBox.width
    );
  }

  follow(entity) {
    this.follows = entity;
  }

  update() {
    this.x = this.follows.x;
    this.y = this.follows.y;
  }
}
