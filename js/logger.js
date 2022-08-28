export const Colors = {
  black: "black",
  white: "white",
  red: "#a8323e",
  green: "#32a852",
  yellow: "#d2e312",
  grey: "#484a48",
};

export class Logger {
  constructor(entity) {
    this.entity = entity;
  }

  _getTime() {
    return new Date().toLocaleTimeString();
  }
  log(text, color = Colors.white) {
    const time = this._getTime();
    console.log(`%c[${this.entity}] (${time}): ${text}`, `color:${color}`);
  }

  info(text) {
    const time = this._getTime();
    console.log(
      `%c[${this.entity}] (${time}) {INFO}: ${text}`,
      `color:${Colors.grey}`
    );
  }

  warn(text) {
    const time = this._getTime();
    console.log(
      `%c[${this.entity}] (${time}) {WARN}: ${text}`,
      `color:${Colors.yellow}`
    );
  }

  error(text) {
    const time = this._getTime();
    console.log(
      `%c[${this.entity}] (${time}) {ERROR}: ${text}`,
      `color:${Colors.red}`
    );
  }

  success(text) {
    const time = this._getTime();
    console.log(
      `%c[${this.entity}] (${time}) {SUCCESS}: ${text}`,
      `color:${Colors.green}`
    );
  }
}
