import React, { ComponentType, useCallback } from "react";

export type LoggerProps = {
  log: (...args: any[]) => void;
};

const colors = {
  none: "",
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  dim: "\x1b[2m",
  underscore: "\x1b[4m",
  reverse: "\x1b[7m",
  black: "\x1b[30m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  white: "\x1b[37m",
  bgBlack: "\x1b[40m",
  bgRed: "\x1b[41m",
  bgGreen: "\x1b[42m",
  bgYellow: "\x1b[43m",
  bgBlue: "\x1b[44m",
  bgMagenta: "\x1b[45m",
  bgCyan: "\x1b[46m",
  bgWhite: "\x1b[47m",
} as const;

export type LoggerOptions = {
  name: string;
  color?: Color;
};

type Color = keyof typeof colors;

export function withLogger<T>(
  options: LoggerOptions | string,
  WrappedComponent: ComponentType<T & LoggerProps>,
) {
  return (props: T) => {
    const log = useCallback((...args: any[]) => {
      const name = typeof options === "string" ? options : options.name;
      const color = typeof options === "string" ? colors.red : options.color;
      const date = ""; //new Date().toLocaleTimeString();
      console.log(`${date} ${color}[${name}]${colors.reset}`, ...args);
    }, []);

    // useEffect(() => {
    //   log("Component mounted");
    //   return () => log("Component unmounted");
    // }, []);

    return <WrappedComponent {...props} log={log} />;
  };
}

export interface LogClass {
  log(...args: any[]): void;
  error(...args: any[]): void;
}
// export abstract class LogClass {
//   private static color: Color = "red";
//   log(...args: any[]) {
//     const date = ""; //new Date().toLocaleTimeString();
//     console.log(
//       `${date} ${colors[LogClass.color]}[${LogClass.name}]${colors.reset}`,
//       ...args,
//     );
//   }
//   // error(...args: any[]) {
//   //   const date = ""; //new Date().toLocaleTimeString();
//   //   console.error(
//   //     `${date} ${colors[LogClass.color]}[${LogClass.name}]${colors.reset}`,
//   //     ...args,
//   //   );
//   // }
//   static log(...args: any[]) {
//     const date = ""; //new Date().toLocaleTimeString();
//     console.log(
//       `${date} ${colors[this.color]}[${this.name}]${colors.reset}`,
//       ...args,
//     );
//   }
// }
// return <U extends T>(constructor: U) => {constructor};
// a class decorator function, that adds a log method to the class instance, that can be used to log messages
export function Logger(name: string, color: Color = "red") {
  return function <T extends { new (...args: any[]): {} }>(constructor: T) {
    return class extends constructor {
      log(...args2: any[]) {
        const date = ""; //new Date().toLocaleTimeString();
        console.log(
          `${date} ${colors[color]}[${name}]${colors.reset}`,
          ...args2,
        );
      }
      error(...args: any[]) {
        const date = ""; //new Date().toLocaleTimeString();
        console.error(
          `${date} ${colors[color]}[${name}]${colors.reset}`,
          ...args,
        );
      }
    };
  };
}
