// @flow

import { System } from 'systems/system';
import type { Entity } from 'entity';
import { Player, Renderable, Transform } from 'component';
import ComponentManager from 'component-manager';
import MapConfig from 'config/map.json';

export default class RenderSystem implements System {
  componentManager: ComponentManager;
  game: *;
  // TODO remove this
  draw: Function;
  clear: Function;
  map: Array<Array<*>>;
  playerEntity: Entity;

  constructor(componentManager: ComponentManager, game: *) {
    this.componentManager = componentManager;
    this.game = game;

    // Init map - should this be somewhere else?
    const MAP_WIDTH = MapConfig.width;
    const MAP_HEIGHT = MapConfig.height;
    const cameraBounds = {
      width: this.game.scale.width / MapConfig.tileSize,
      height: 10,
    };
    const blankChar = '·';
    // TODO this is ugly... use a camera
    const spacing = MapConfig.tileSize;
    this.map = new Array(MAP_WIDTH);

    for (let x = 0; x < MAP_WIDTH; x++) {
      this.map[x] = [];
      for (let y = 0; y < MAP_HEIGHT; y++) {
        const cell = this.game.add.text(x * spacing, y * spacing, blankChar, {
          font: `15pt Monaco, monospace`,
        });
        this.map[x][y] = cell;
      }
    }

    this.playerEntity = componentManager
      .getAll({
        component: Player,
      })
      .keys()
      .next().value;

    this.clear = () => {
      for (let x = 0; x < MAP_WIDTH; x++) {
        for (let y = 0; y < MAP_HEIGHT; y++) {
          this.map[x][y].setText(blankChar);
        }
      }
    };

    this.draw = ({ x, y, glyph }) => {
      if (x < 0 || x >= cameraBounds.width) {
        return;
      }

      if (y < 0 || y >= cameraBounds.height) {
        return;
      }

      this.map[x][y].setText(glyph);
    };
  }

  update(entities: Array<Entity>) {
    this.clear();

    const playerTransform = this.componentManager.get({
      entity: this.playerEntity,
      component: Transform,
    });

    for (let myEntity of entities) {
      const renderable = this.componentManager.get({
        entity: myEntity,
        component: Renderable,
      });
      const transform = this.componentManager.get({
        entity: myEntity,
        component: Transform,
      });

      // Eventually do a bitmask?
      if (renderable && renderable.visible && transform) {
        const x =
          transform.x -
          playerTransform.x +
          Math.round((MapConfig.width - 1) / 2);
        const y =
          transform.y -
          playerTransform.y +
          Math.round((MapConfig.height - 1) / 2);
        // TODO Rename this
        this.draw({
          x: x,
          y: y,
          glyph: renderable.glyph,
        });
      }
    }
  }
}
