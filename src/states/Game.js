// @flow
import Phaser from 'phaser';

import { RenderSystem, PlayerInputSystem, System } from 'systems';
import type { Entity } from 'entity';
import {
  Collidable,
  ReadyForTurn,
  Transform,
  Player,
  Renderable,
  Component,
} from 'component';
import ComponentManager from 'component-manager';

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
      components: [Player, ReadyForTurn, Collidable, Transform, Renderable],
    });

    this.entities = [];

    const wallEntity = 2;
    this.entities.push(wallEntity);

    this.componentManager.add({
      entity: wallEntity,
      components: [
        new Collidable(),
        new Transform({ x: 1, y: 6 }),
        new Renderable({ glyph: 'W' }),
      ],
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
      ],
    });

    this.initializeSystems();
    this.log = this.game.add.text('', 200, 10, {
      font: '10pt Monaco, monospace',
      wordWrapWidth: 100,
    });
    this.log.alignIn(this.game.world.bounds, Phaser.RIGHT_TOP, -400);
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
  }

  render() {}
}
