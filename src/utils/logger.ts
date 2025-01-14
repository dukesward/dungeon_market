type AppLoggerFunction = (message: string, ...optionalParams: any[]) => void;

interface AppLogger {
  log: AppLoggerFunction
  debug: AppLoggerFunction
  info: AppLoggerFunction
  warn: AppLoggerFunction
  error: AppLoggerFunction
}

class AppLoggerImpl implements AppLogger {
  readonly log: AppLoggerFunction
  readonly debug: AppLoggerFunction
  readonly info: AppLoggerFunction
  readonly warn: AppLoggerFunction
  readonly error: AppLoggerFunction
  constructor() {
    this.log = console.log.bind(console);
    this.debug = console.debug.bind(console);
    this.info = console.info.bind(console);
    this.warn = console.warn.bind(console);
    this.error = console.error.bind(console);
  }
}

export type {
  AppLogger,
  AppLoggerFunction
}

export {
  AppLoggerImpl
}