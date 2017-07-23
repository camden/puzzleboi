// @flow

export interface Command {
  execute(): void,
}

export class NoOpCommand implements Command {
  execute() {}
}

export class ConsoleCommand implements Command {
  input: string;

  constructor(input: string) {
    this.input = input;
  }

  execute() {
    console.log(`Got input: ${this.input}`);
  }
}
