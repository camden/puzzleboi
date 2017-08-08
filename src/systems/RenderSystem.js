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
  // TODO replace * with BitmapText
  renderedMap: Array<Array<*>>;
  actualMap: Array<Array<string>>;
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
    const ACTUAL_MAP_WIDTH = MapConfig.width;
    const ACTUAL_MAP_HEIGHT = MapConfig.height;

    this.RENDERED_MAP_WIDTH = maxMapWidth;
    this.RENDERED_MAP_HEIGHT = maxMapHeight;

    const blankChar = ' ';
    const floorChar = '·';
    const textSize = 30;

    this.actualMap = new Array(ACTUAL_MAP_WIDTH);
    this.renderedMap = new Array(this.RENDERED_MAP_WIDTH);

    // Initialize the actualMap
    for (let x = 0; x < ACTUAL_MAP_WIDTH; x++) {
      this.actualMap[x] = [];
      for (let y = 0; y < ACTUAL_MAP_HEIGHT; y++) {
        this.actualMap[x][y] = blankChar;
      }
    }

    // Initialize the renderedMap
    for (let x = 0; x < this.RENDERED_MAP_WIDTH; x++) {
      this.renderedMap[x] = [];
      for (let y = 0; y < this.RENDERED_MAP_HEIGHT; y++) {
        const cell = this.game.add.bitmapText(
          x * spacing,
          y * spacing,
          'monaco',
          blankChar,
          textSize
        );
        cell.tint = 0x000000;

        this.renderedMap[x][y] = cell;
      }
    }

    // TODO fix flow error
    this.playerEntity = componentManager
      .getAll({
        component: Player,
      })
      .keys()
      .next().value;

    this.setActualMapText = ({ x, y, glyph }) => {
      if (x < 0 || x >= ACTUAL_MAP_WIDTH) {
        return;
      }

      if (y < 0 || y >= ACTUAL_MAP_HEIGHT) {
        return;
      }

      const actualMapGlyph = this.actualMap[x][y];
      if (actualMapGlyph === glyph) {
        return;
      }

      this.actualMap[x][y] = glyph;
    };

    this.clearActualMap = () => {
      for (let x = 0; x < ACTUAL_MAP_WIDTH; x++) {
        for (let y = 0; y < ACTUAL_MAP_HEIGHT; y++) {
          this.actualMap[x][y] = floorChar;
        }
      }
    };

    this.drawActualMapToScreen = ({ offset_x, offset_y }) => {
      for (let x = 0; x < this.RENDERED_MAP_WIDTH; x++) {
        for (let y = 0; y < this.RENDERED_MAP_HEIGHT; y++) {
          const calculated_x = x + offset_x;
          const calculated_y = y + offset_y;

          const xOutOfActualBounds =
            calculated_x < 0 || calculated_x >= ACTUAL_MAP_WIDTH;
          const yOutOfActualBounds =
            calculated_y < 0 || calculated_y >= ACTUAL_MAP_HEIGHT;

          if (xOutOfActualBounds || yOutOfActualBounds) {
            this.renderedMap[x][y].setText(blankChar);
          } else {
            const actualMapGlyph = this.actualMap[calculated_x][calculated_y];
            this.renderedMap[x][y].setText(actualMapGlyph);
          }
        }
      }
    };

    this.draw = ({ x, y, glyph }) => {
      this.setActualMapText({ x, y, glyph });
    };
  }

  update(entities: Array<Entity>) {
    this.clearActualMap();

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
        const x = transform.x;
        const y = transform.y;
        // TODO Rename this
        this.draw({
          x: x,
          y: y,
          glyph: renderable.glyph,
        });
      }
    }

    this.drawActualMapToScreen({
      offset_x: playerTransform.x - this.RENDERED_MAP_WIDTH / 2,
      offset_y: playerTransform.y - this.RENDERED_MAP_HEIGHT / 2,
    });
  }
}
