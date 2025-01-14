class IllegalArgumentException extends Error {
  private argName: string;
  private argObject: any;
  constructor(argName: string, argObject: any) {
    super();
    this.argName = argName;
    this.argObject = argObject;
    this.message = this.composeMessage();
    this.name = "IllegalArgumentException";
  }
  composeMessage(): string {
    return `Illegal ${this.argName}: ${this.argObject}`;
  }
}

export { IllegalArgumentException };