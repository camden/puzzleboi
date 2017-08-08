// @flow

import { System } from 'systems/system';
import type { Entity } from 'entity';
import { Player, Renderable, Transform } from 'component';
import ComponentManager from 'component-manager';
import MapConfig from 'config/map.json';
import GameConfig from 'config/game.json';

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

    // Height and width in pixels
    const GAME_WIDTH = GameConfig.gamePanelWidth;
    const GAME_HEIGHT = GameConfig.gamePanelHeight;

    const spacing = MapConfig.tileSize;
    const maxMapWidth = Math.floor(GAME_WIDTH / spacing);
    const maxMapHeight = Math.floor(GAME_HEIGHT / spacing);
    const MAP_WIDTH = Math.min(MapConfig.width, maxMapWidth);
    const MAP_HEIGHT = Math.min(MapConfig.height, maxMapHeight);

    const blankChar = '·';
    const textSize = 30;

    this.map = new Array(MAP_WIDTH);

    for (let x = 0; x < MAP_WIDTH; x++) {
      this.map[x] = [];
      for (let y = 0; y < MAP_HEIGHT; y++) {
        const cell = this.game.add.bitmapText(
          x * spacing,
          y * spacing,
          'monaco',
          blankChar,
          textSize
        );
        cell.tint = 0x000000;
        this.map[x][y] = cell;
      }
    }

    // TODO fix flow error
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
      if (x < 0 || x >= this.map.length) {
        return;
      }

      if (y < 0 || y >= this.map[x].length) {
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
        const x = transform.x - playerTransform.x;
        const y = transform.y - playerTransform.y;
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
