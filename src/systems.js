// @flow
import { keyMap, getCommand } from 'input';
import { Entity } from 'entity';
import { Renderable, Moveable, Player } from 'component';

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
      if (entity.hasAllComponents(['Player'])) {
        for (let keyCode of keyMap.keys()) {
          if (this.game.input.keyboard.isDown(keyCode)) {
            console.log('keycode is down: ' + keyCode);
          }
        }
      }
    }
  }
}

export class RenderSystem implements System {
  engine;
  game;

  constructor(engine, game) {
    this.engine = engine;
    this.game = game;
  }

  update(entities: Array<Entity>) {
    for (let entity of entities) {
      // pull this out
      if (this.engine.renderables.get(entity.uuid)) {
        this.game.add.text(
          this.game.world.centerX,
          this.game.world.centerY,
          'component!'
        );
      }
    }
  }
}
