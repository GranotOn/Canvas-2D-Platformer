export const Colors = {
  black: "black",
  red: "#a8323e",
  green: "#32a852",
  yellow: "#d2e312",
};

function log(text, color = Colors.black) {
  console.log(`%c${time}: ${text}`, `color:${color}`);
}

export class Logger {
  constructor(entity) {
    this.entity = entity;
  }

  _getTime() {
    return new Date().toLocaleTimeString();
  }
  log(text, color = Colors.black) {
    const time = this._getTime();
    console.log(`%c[${this.entity}] (${time}): ${text}`, `color:${color}`);
  }

  warn(text) {
    const time = this._getTime();
    console.log(
      `%c[${this.entity}] (${time}): ${text}`,
      `color:${Colors.yellow}`
    );
  }

  error(text) {
    const time = this._getTime();
    console.log(`%c[${this.entity}] (${time}): ${text}`, `color:${Colors.red}`);
  }

  success(text) {
    const time = this._getTime();
    console.log(
      `%c[${this.entity}] (${time}): ${text}`,
      `color:${Colors.green}`
    );
  }
}
