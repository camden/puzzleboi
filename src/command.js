// @flow
import type { Entity } from 'entity';
import ComponentManager from 'component-manager';
import {
  Attackable,
  Attacked,
  Collidable,
  Metadata,
  Player,
  Transform,
  Turn,
} from 'component';
import MapConfig from 'config/map.json';

import { clamp, getEntitiesAtPosition } from 'utils';

export interface Command {
  execute(componentManager: ComponentManager): void,
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

export class WaitCommand implements Command {
  execute(componentManager: ComponentManager) {
    const playerComponents = componentManager.getAll({
      component: Player,
    });

    playerComponents.forEach((playerComponent, myEntity) => {
      let turnComponent = componentManager.get({
        entity: myEntity,
        component: Turn,
      });

      if (!turnComponent) {
        return;
      }

      if (turnComponent.myTurn) {
        console.log('Player is waiting...');
        turnComponent.myTurn = false;
      }
    });
  }
}
export class MoveCommand implements Command {
  direction: string;

  constructor(direction: string) {
    this.direction = direction;
  }

  execute(componentManager: ComponentManager) {
    const playerComponents = componentManager.getAll({
      component: Player,
    });

    playerComponents.forEach((playerComponent, myEntity) => {
      let transform = componentManager.get({
        entity: myEntity,
        component: Transform,
      });

      let turnComponent = componentManager.get({
        entity: myEntity,
        component: Turn,
      });

      if (!turnComponent || !transform) {
        return;
      }

      if (!turnComponent.myTurn) {
        return;
      }

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

      let next_x = transform.x + x_delta;
      let next_y = transform.y + y_delta;

      next_x = clamp({
        value: next_x,
        min: 0,
        max: MapConfig.width - 1,
      });

      next_y = clamp({
        value: next_y,
        min: 0,
        max: MapConfig.height - 1,
      });

      // TODO add collision checking
      // TODO do i like camel case or snake case more?
      const entities_on_tile = getEntitiesAtPosition({
        componentManager: componentManager,
        x: next_x,
        y: next_y,
      });

      const collidablesOnNextTile = entities_on_tile.reduce(
        (anyEntitiesOnTile, entityOnTile) => {
          if (entityOnTile === myEntity) {
            return anyEntitiesOnTile;
          }
          // Here is where you would dispatch a specific "collision" event!!
          // TODO DO GENERICS NOT CASTING
          const collidableHere = componentManager.has({
            entity: entityOnTile,
            component: Collidable,
          });

          if (collidableHere) {
            let entityOnTileName = entityOnTile;
            let entityOnTileMetadata = componentManager.get({
              entity: entityOnTile,
              component: Metadata,
            });
            if (entityOnTileMetadata) {
              entityOnTileName = entityOnTileMetadata.name;
            }
            const currentEntityName = componentManager.get({
              entity: myEntity,
              component: Metadata,
            }).name;
            console.log(
              `${currentEntityName} bumped into ${entityOnTileName}.`
            );

            const entityOnTileAttackable: ?Attackable = componentManager.get({
              entity: entityOnTile,
              component: Attackable,
            });

            if (entityOnTileAttackable) {
              componentManager.add({
                entity: entityOnTile,
                components: [new Attacked({ by: myEntity })],
              });

              turnComponent.myTurn = false;
            }
          }
          return anyEntitiesOnTile || collidableHere;
        },
        false
      );

      if (collidablesOnNextTile) {
        // Here is where you would dispatch a generic "collision" event!!
        return;
      }

      transform.x = next_x;
      transform.y = next_y;

      turnComponent.myTurn = false;
    });
  }
}
