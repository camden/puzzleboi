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
    const RENDERED_MAP_WIDTH = Math.min(ACTUAL_MAP_WIDTH, maxMapWidth);
    const RENDERED_MAP_HEIGHT = Math.min(ACTUAL_MAP_HEIGHT, maxMapHeight);

    const blankChar = ' ';
    const floorChar = '·';
    const textSize = 30;

    this.renderedMap = new Array(RENDERED_MAP_WIDTH);

    for (let x = 0; x < RENDERED_MAP_WIDTH; x++) {
      this.renderedMap[x] = [];
      for (let y = 0; y < RENDERED_MAP_HEIGHT; y++) {
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

    this.clearAndDrawFloor = () => {
      // Clear everything on screen
      for (let x = 0; x < RENDERED_MAP_WIDTH; x++) {
        for (let y = 0; y < RENDERED_MAP_HEIGHT; y++) {
          this.renderedMap[x][y].setText(blankChar);
        }
      }

      // Draw the floor
      for (let x = 0; x < ACTUAL_MAP_WIDTH; x++) {
        for (let y = 0; y < ACTUAL_MAP_HEIGHT; y++) {
          const xInRenderedBounds = x < RENDERED_MAP_WIDTH;
          const yInRenderedBounds = y < RENDERED_MAP_HEIGHT;

          const onScreenAndInMapBounds = xInRenderedBounds && yInRenderedBounds;
          if (onScreenAndInMapBounds) {
            this.renderedMap[x][y].setText(floorChar);
          }
        }
      }
    };

    this.draw = ({ x, y, glyph }) => {
      if (x < 0 || x >= RENDERED_MAP_WIDTH) {
        return;
      }

      if (y < 0 || y >= RENDERED_MAP_HEIGHT) {
        return;
      }

      this.renderedMap[x][y].setText(glyph);
    };
  }

  update(entities: Array<Entity>) {
    this.clearAndDrawFloor();

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
  }
}
