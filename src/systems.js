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
  // TODO remove this
  draw: Function;
  clear: Function;
  map;

  renderText;

  constructor(engine, game) {
    this.engine = engine;
    this.game = game;

    // Init map - should this be somewhere else?
    const MAP_WIDTH = 10;
    const MAP_HEIGHT = 10;
    // TODO this is ugly... use a camera
    const spacing = 20;
    const x_offset = 30;
    const y_offset = 300;
    this.map = new Array(MAP_WIDTH);

    for (let x = 0; x < MAP_WIDTH; x++) {
      this.map[x] = [];
      for (let y = 0; y < MAP_HEIGHT; y++) {
        const cell = this.game.add.text(
          x_offset + x * spacing,
          // Multiply by -1 to make origin at bottom left
          y_offset + y * spacing * -1,
          '.'
        );
        this.map[x][y] = cell;
      }
    }

    console.log(this.map);

    this.clear = () => {
      for (let x = 0; x < MAP_WIDTH; x++) {
        for (let y = 0; y < MAP_HEIGHT; y++) {
          this.map[x][y].setText('.');
        }
      }
    };

    this.draw = ({ x, y, glyph }) => {
      if (x < 0 || x >= MAP_WIDTH) {
        return;
      }

      if (y < 0 || y >= MAP_HEIGHT) {
        return;
      }

      this.map[x][y].setText(glyph);
    };
  }

  update(entities: Array<Entity>) {
    this.clear();
    for (let entity of entities) {
      // TODO pull this out
      // Add a way to check for certain components
      // Perhaps, add a map from "TRANSFORM" to this.engine.transforms... or something?
      const renderable = this.engine.renderables.get(entity.uuid);
      const transform = this.engine.transforms.get(entity.uuid);
      // Eventually do a bitmask?
      if (renderable && transform) {
        // TODO Rename this
        this.draw({
          x: transform.x,
          y: transform.y,
          glyph: renderable.glyph,
        });
      }
    }
  }
}
