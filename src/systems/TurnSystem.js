// @flow

import { System } from 'systems/system';
import type { Entity } from 'entity';
import { Metadata, Turn } from 'component';
import ComponentManager from 'component-manager';

export default class TurnSystem implements System {
  componentManager: ComponentManager;
  game: *;

  constructor(componentManager: ComponentManager, game: *) {
    this.componentManager = componentManager;
    this.game = game;
  }

  update(entities: Array<Entity>) {
    // TODO In the future, do this:
    // https://github.com/libgdx/ashley/wiki/How-to-use-Ashley#entity-systems
    let nextToAct: ?Turn;

    for (let myEntity of entities) {
      // TODO pull this out
      const turnComponent = this.componentManager.get({
        entity: myEntity,
        component: Turn,
      });

      if (turnComponent) {
        if (turnComponent.myTurn) {
          // TODO Add helper for getting name
          const metadata = this.componentManager.get({
            entity: myEntity,
            component: Metadata,
          });

          if (metadata) {
            // console.log(`${metadata.name}'s turn to act.'`);
          }
          return;
        }

        if (!nextToAct) {
          nextToAct = turnComponent;
        }

        if (turnComponent.nextTurnTime < nextToAct.nextTurnTime) {
          nextToAct = turnComponent;
        }
      }
    }

    if (!nextToAct) {
      throw new Error('Could not find next actor to act.');
    }

    nextToAct.myTurn = true;
    nextToAct.nextTurnTime += nextToAct.recharge_time;
  }
}
