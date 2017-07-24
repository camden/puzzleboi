// @flow
import Phaser from 'phaser';

import { RenderSystem, PlayerInputSystem, System } from 'systems';
import { Entity } from 'entity';
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

    const wallEntity = new Entity();
    wallEntity.uuid = 2;
    this.entities.push(wallEntity);
    this.engine.collidables.set(wallEntity.uuid, new Collidable());
    this.engine.transforms.set(wallEntity.uuid, new Transform({ x: 4, y: 6 }));
    this.engine.renderables.set(
      wallEntity.uuid,
      new Renderable({
        glyph: 'W',
      })
    );

    const playerEntity = new Entity();
    // Do this automatically
    playerEntity.uuid = 1;
    this.entities.push(playerEntity);
    this.engine.players.set(playerEntity.uuid, new Player());
    this.engine.readyForTurns.set(playerEntity.uuid, new ReadyForTurn());
    this.engine.collidables.set(playerEntity.uuid, new Collidable());
    this.engine.transforms.set(
      playerEntity.uuid,
      new Transform({ x: 1, y: 2 })
    );
    this.engine.renderables.set(
      playerEntity.uuid,
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

  // TODO remove me
  createGameText() {
    const bannerText = 'Game State!';
    let banner = this.add.text(
      this.world.centerX,
      this.world.centerY,
      bannerText
    );
    banner.padding.set(10, 16);
    banner.fontSize = 40;
    banner.fill = '#77BFA3';
    banner.smoothed = false;
    banner.anchor.setTo(0.5);
  }
}
