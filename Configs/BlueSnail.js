const Config = {
  id: 0,
  name: "Blue Snail",
  hp: 20,
  minimumDamageThreshold: 2,
  spriteOptions: {
    spriteFile: "BlueSnailSprite.png",
    frameTime: 15,
    width: 53,
    height: 47,
    states: {
      idle: {
        row: 0,
        cols: 1,
      },
      walk: {
        row: 1,
        cols: 4,
      },
      hit: {
        row: 2,
        cols: 1,
      },
      dead: {
        row: 3,
        cols: 3,
      },
    },
  },
};

export default Config;
