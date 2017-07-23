// @flow
import { keyMap, getCommand } from 'input';
import { Entity } from 'entity';
import { Moveable, Player } from 'component';

export interface System {
  update(entities: Array<Entity>): void,
}

export class PlayerInputSystem implements System {
  game;

  constructor(game) {
    this.game = game;
  }

  update(entities: Array<Entity>) {
    // In the future, do this:
    // https://github.com/libgdx/ashley/wiki/How-to-use-Ashley#entity-systems
    for (let entity of entities) {
      // pull this out
      if (entity.hasAllComponents([Moveable, Player])) {
        for (let keyCode of keyMap.keys()) {
          if (this.game.input.keyboard.isDown(keyCode)) {
            console.log('keycode is down: ' + keyCode);
          }
        }
      }
    }
  }
}
