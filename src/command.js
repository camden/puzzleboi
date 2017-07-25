// @flow
import type { Entity } from 'entity';
import ComponentManager from 'component-manager';
import { Transform, Collidable } from 'component';

import { getEntitiesAtPosition } from 'utils';

export interface Command {
  execute(componentManager: ComponentManager, entity: Entity): void,
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

  execute(componentManager: ComponentManager, entity: Entity) {
    const transform = componentManager.get({
      entity: entity,
      component: Transform,
    });

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

    const next_x = transform.x + x_delta;
    const next_y = transform.y + y_delta;
    // TODO add collision checking
    // TODO do i like camel case or snake case more?
    const entities_on_tile = getEntitiesAtPosition({
      componentManager: componentManager,
      x: next_x,
      y: next_y,
    });

    const collidablesOnNextTile = entities_on_tile.reduce(
      (anyEntitiesOnTile, entityOnTile) => {
        // Here is where you would dispatch a "collision" event!!
        const collidableHere = componentManager.has({
          entity: entityOnTile,
          component: Collidable,
        });
        return anyEntitiesOnTile || collidableHere;
      },
      false
    );

    if (collidablesOnNextTile) {
      // Here is where you would dispatch a "collision" event!!
      return;
    }

    transform.x = next_x;
    transform.y = next_y;

    console.log(
      `Moving entity '${entity}' in direction '${this
        .direction}' -> New position: ${transform.toString()}`
    );
  }
}
