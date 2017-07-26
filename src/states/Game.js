// @flow
import Phaser from 'phaser';

import { RenderSystem, PlayerInputSystem, System } from 'systems';
import type { Entity } from 'entity';
import {
  Metadata,
  Collidable,
  ReadyForTurn,
  Transform,
  Player,
  Renderable,
  Component,
} from 'component';
import ComponentManager from 'component-manager';
import ROT from '../../vendor/rot.min.js';
import MapConfig from 'config/map.json';

export default class extends Phaser.State {
  // TODO Make this its own class
  componentManager: ComponentManager;
  systems: Array<System>;
  entities: Array<Entity>;

  init() {}
  preload() {}

  create() {
    this.engine = {};

    this.engine.log = ['log initialized'];

    this.componentManager = new ComponentManager();
    this.componentManager.register({
      components: [
        Metadata,
        Player,
        ReadyForTurn,
        Collidable,
        Transform,
        Renderable,
      ],
    });

    this.entities = [];

    const rm = new ROT.Map.DividedMaze(MapConfig.width, MapConfig.height);

    let nextEntity = 2;

    rm.create((x, y, createWallNumber) => {
      if (createWallNumber === 0) {
        return;
      }

      this.entities.push(nextEntity);
      this.componentManager.add({
        entity: nextEntity,
        components: [
          new Collidable(),
          new Transform({ x: x, y: y }),
          new Renderable({ glyph: 'W' }),
          new Metadata({ name: 'Wall', description: 'A solid stone wall.' }),
        ],
      });
      nextEntity++;
    });

    // Do this automatically
    const playerEntity = 1;
    this.entities.push(playerEntity);
    this.componentManager.add({
      entity: playerEntity,
      components: [
        new Collidable(),
        new Player(),
        new ReadyForTurn(),
        new Transform({ x: 1, y: 4 }),
        new Renderable({ glyph: '@' }),
        new Metadata({
          name: 'Player (you)',
          description: 'The hero of our tale.',
        }),
      ],
    });

    this.initializeSystems();
    this.log = this.game.add.text('', 200, 10, {
      font: '10pt Monaco, monospace',
      wordWrapWidth: 100,
    });
    this.log.alignIn(this.game.world.bounds, Phaser.RIGHT_TOP, -400);

    this.fps = this.game.add.text(0, 0, 10);
    this.game.time.advancedTiming = true;
  }

  initializeSystems() {
    this.systems = [];

    this.systems.push(new RenderSystem(this.componentManager, this.game));
    this.systems.push(new PlayerInputSystem(this.componentManager, this.game));
  }

  update() {
    for (let system of this.systems) {
      system.update(this.entities);
    }

    this.log.setText(this.engine.log.slice().reverse().join('\n'));
    this.fps.setText(this.game.time.fps);
  }

  render() {}
}
