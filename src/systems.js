// @flow
import Phaser from 'phaser';
import { keyMap, getCommand } from './input';

export interface System {
  update(): void,
}

export class PlayerInputSystem implements System {
  game;

  constructor(game) {
    this.game = game;
  }

  update() {
    for (let keyCode of keyMap.keys()) {
      if (game.input.keyboard.isDown(keyCode)) {
        console.log('keycode is down: ' + keyCode);
      }
    }
  }
}
