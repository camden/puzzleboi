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

type componentMap = Map<number, Component>;

export default class extends Phaser.State {
  // TODO Make this its own class
  engine: {
    [string]: componentMap,
  };
  systems: Array<System>;
  entities: Array<Entity>;

  init() {}
  preload() {}

  create() {
    this.engine = {};

    this.engine.players = new Map();
    this.engine.readyForTurns = new Map();
    this.engine.collidables = new Map();
    this.engine.transforms = new Map();
    this.engine.renderables = new Map();

    this.entities = [];

    const wallEntity = 2;
    this.entities.push(wallEntity);
    this.engine.collidables.set(wallEntity, new Collidable());
    this.engine.transforms.set(wallEntity, new Transform({ x: 4, y: 6 }));
    this.engine.renderables.set(
      wallEntity,
      new Renderable({
        glyph: 'W',
      })
    );

    // Do this automatically
    const playerEntity = 1;
    this.entities.push(playerEntity);
    this.engine.players.set(playerEntity, new Player());
    this.engine.readyForTurns.set(playerEntity, new ReadyForTurn());
    this.engine.collidables.set(playerEntity, new Collidable());
    this.engine.transforms.set(playerEntity, new Transform({ x: 1, y: 2 }));
    this.engine.renderables.set(
      playerEntity,
      new Renderable({
        glyph: '@',
      })
    );

    // this.createGameText();
    this.initializeSystems();
  }

  initializeSystems() {
    this.systems = [];

    this.systems.push(new RenderSystem(this.engine, this.game));
    this.systems.push(new PlayerInputSystem(this.engine, this.game));
  }

  update() {
    for (let system of this.systems) {
      system.update(this.entities);
    }
  }

  render() {}
}
