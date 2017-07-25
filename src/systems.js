// @flow
import { keyMap, getCommand } from 'input';
import type { Entity } from 'entity';
import {
  Transform,
  ReadyForTurn,
  Renderable,
  Moveable,
  Player,
} from 'component';
import ComponentManager from 'component-manager';
import MapConfig from 'config/map.json';

export interface System {
  update(entities: Array<Entity>): void,
}

export class PlayerInputSystem implements System {
  componentManager;
  game;

  constructor(componentManager, game) {
    this.componentManager = componentManager;
    this.game = game;
  }

  update(entities: Array<Entity>) {
    // TODO In the future, do this:
    // https://github.com/libgdx/ashley/wiki/How-to-use-Ashley#entity-systems
    for (let entity of entities) {
      // TODO pull this out
      const playerComponent = this.componentManager.get({
        entity: entity,
        component: Player,
      });
      const readyForTurnComponent = this.componentManager.get({
        entity: entity,
        component: ReadyForTurn,
      });

      if (playerComponent && readyForTurnComponent) {
        for (let keyCode of keyMap.keys()) {
          if (this.game.input.keyboard.isDown(keyCode)) {
            getCommand(keyCode).execute(this.componentManager, entity);
            this.componentManager.remove({
              entity: entity,
              component: ReadyForTurn,
            });
            // TODO This is terrible
            setTimeout(() => {
              this.componentManager.add({
                entity: entity,
                components: [new ReadyForTurn()],
              });
            }, 100);
            // This 'return' is to make sure that user can't do multiple inputs in one turn
            return;
          }
        }
      }
    }
  }
}

export class RenderSystem implements System {
  componentManager;
  game;
  // TODO remove this
  draw: Function;
  clear: Function;
  map;

  constructor(componentManager, game) {
    this.componentManager = componentManager;
    this.game = game;

    // Init map - should this be somewhere else?
    const MAP_WIDTH = MapConfig.width;
    const MAP_HEIGHT = MapConfig.height;
    const blankChar = '·';
    // TODO this is ugly... use a camera
    const spacing = 30;
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
          blankChar,
          {
            font: '20pt Monaco, monospace',
          }
        );
        this.map[x][y] = cell;
      }
    }

    this.clear = () => {
      for (let x = 0; x < MAP_WIDTH; x++) {
        for (let y = 0; y < MAP_HEIGHT; y++) {
          this.map[x][y].setText(blankChar);
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
      const renderable = this.componentManager.get({
        entity: entity,
        component: Renderable,
      });
      const transform = this.componentManager.get({
        entity: entity,
        component: Transform,
      });

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
