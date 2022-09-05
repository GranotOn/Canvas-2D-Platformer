const Config = {
  id: 1,
  name: "RedSnail",
  hp: 25,
  minimumDamageThreshold: 2,
  spriteOptions: {
    spriteFile: "RedSnailSprite.png",
    frameTime: 15,
    width: 50,
    height: 45,
    states: {
      idle: {
        row: 0,
        cols: 3,
      },
      walk: {
        row: 1,
        cols: 3,
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
