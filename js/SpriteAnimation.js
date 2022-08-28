import img from "./Img.js";

export default class SpriteAnimation {
  images = [];
  constructor(fname, nImages, timer, state, stopAtEnd, spriteDirectory) {
    for (let i = 1; i <= nImages; ++i) {
      const image = img(fname.replace("?", i), spriteDirectory);
      this.images.push(image);
    }

    this.timer = timer;
    this.timerDefault = timer;
    this.imageIndex = 0;
    this.state = state;
    this.stopAtEnd = stopAtEnd;
  }

  isState(state) {
    return this.state === state;
  }

  getImage() {
    this.#setImageIndex();
    return this.images[this.imageIndex];
  }

  reset() {
    this.imageIndex = 0;
  }

  #setImageIndex() {
    --this.timer;
    if (this.timer <= 0 && !this.#shouldStop()) {
      this.timer = this.timerDefault;
      ++this.imageIndex;

      if (this.imageIndex >= this.images.length) this.reset();
    }
  }

  #shouldStop() {
    return this.stopAtEnd && this.imageIndex === this.images.length - 1;
  }
}
