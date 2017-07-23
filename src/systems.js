// @flow
import { keyMap, getCommand } from './input';
import { Entity } from './entity';

export interface System {
  update(entities: Array<Entity>): void,
}

export class PlayerInputSystem implements System {
  game;

  constructor(game) {
    this.game = game;
  }

  update(entities: Array<Entity>) {
    for (let entity of entities) {
      // pull this out
      if (true) {
        for (let keyCode of keyMap.keys()) {
          if (this.game.input.keyboard.isDown(keyCode)) {
            console.log('keycode is down: ' + keyCode);
          }
        }
      }
    }
  }
}
