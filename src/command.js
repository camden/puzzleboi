// @flow
import { Entity } from 'entity';

export interface Command {
  execute(engine: *, entity: Entity): void,
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

  execute(engine: *, entity: Entity) {
    const transform = engine.transforms.get(entity.uuid);

    let x_delta = 0;
    let y_delta = 0;

    // Don't use "up", "down", etc... enum? or x/y?
    switch (this.direction) {
      case 'right':
        x_delta = 1;
        break;
      case 'left':
        x_delta = -1;
        break;
      case 'up':
        y_delta = 1;
        break;
      case 'down':
        y_delta = -1;
        break;
      default:
        break;
    }

    transform.x += x_delta;
    transform.y += y_delta;

    console.log(
      `Moving entity '${entity.toString()}' in direction '${this
        .direction}' -> New position: ${transform.toString()}`
    );
  }
}
