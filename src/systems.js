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

  constructor(engine, game) {
    this.engine = engine;
    this.game = game;
  }

  update(entities: Array<Entity>) {
    for (let entity of entities) {
      // pull this out
      // Add a way to check for certain components
      const renderable = this.engine.renderables.get(entity.uuid);
      // Eventually do a bitmask?
      if (renderable) {
        // TODO This is adding text EVERY FRAME
        // this.game.add.text(
        //   this.game.world.centerX,
        //   this.game.world.centerY,
        //   `component is at (${renderable.x}, ${renderable.y})`
        // );
      }
    }
  }
}
