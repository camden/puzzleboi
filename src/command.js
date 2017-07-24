// @flow
import { Entity } from 'entity';

export interface Command {
  execute(game: *, entity: Entity): void,
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

export class MoveCommand implements Command {
  direction: string;

  constructor(direction: string) {
    this.direction = direction;
  }

  execute(game: *, entity: Entity) {
    console.log(
      `Moving entity '${entity.toString()}' in direction '${this.direction}'`
    );
  }
}
