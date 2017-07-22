// @flow

export interface Command {
  execute(): void,
}

export class ConsoleCommand implements Command {
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  execute() {
    console.log(`Hello ${this.name}`);
  }
}
