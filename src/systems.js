// @flow
import { keyMap, getCommand } from 'input';
import { Entity } from 'entity';
import { Renderable, Moveable, Player } from 'component';

export interface System {
  update(entities: Array<Entity>): void,
}

export class PlayerInputSystem implements System {
  engine;
  game;

  constructor(engine, game) {
    this.engine = engine;
    this.game = game;
  }

  update(entities: Array<Entity>) {
    // In the future, do this:
    // https://github.com/libgdx/ashley/wiki/How-to-use-Ashley#entity-systems
    for (let entity of entities) {
      // pull this out
      const playerComponent = this.engine.players.get(entity.uuid);

      if (playerComponent) {
        for (let keyCode of keyMap.keys()) {
          if (this.game.input.keyboard.isDown(keyCode)) {
            getCommand(keyCode).execute(this.engine, entity);
          }
        }
      }
    }
  }
}

export class RenderSystem implements System {
  engine;
  game;

  renderText;

  constructor(engine, game) {
    this.engine = engine;
    this.game = game;

    this.renderText = this.game.add.text(0, 0, 'hi');
  }

  update(entities: Array<Entity>) {
    for (let entity of entities) {
      // pull this out
      // Add a way to check for certain components
      // Perhaps, add a map from "TRANSFORM" to this.engine.transforms... or something?
      const renderable = this.engine.renderables.get(entity.uuid);
      const transform = this.engine.transforms.get(entity.uuid);
      // Eventually do a bitmask?
      if (renderable && transform) {
        this.renderText.setText(`Player position: ${transform.toString()}`);
      }
    }
  }
}
