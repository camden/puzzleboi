// @flow

import { System } from 'systems/system';
import type { Entity } from 'entity';
import { Attacked, Metadata } from 'component';
import ComponentManager from 'component-manager';
import { log } from 'utils';

export default class AttackedSystem implements System {
  componentManager: ComponentManager;
  game: *;

  constructor(componentManager: ComponentManager, game: *) {
    this.componentManager = componentManager;
    this.game = game;
  }

  update(entities: Array<Entity>) {
    for (let myEntity of entities) {
      const attackedComponent = this.componentManager.get({
        entity: myEntity,
        component: Attacked,
      });

      if (attackedComponent) {
        const metadataComponent = this.componentManager.get({
          entity: myEntity,
          component: Metadata,
        });
        if (metadataComponent) {
          log({
            componentManager: this.componentManager,
            message: `${metadataComponent.name} has been attacked! Ouch!`,
          });
        }
        // Once attack is resolved, remove the "Attacked" component
        this.componentManager.remove({
          entity: myEntity,
          component: Attacked,
        });
      }
    }
  }
}
