// @flow
import Phaser from 'phaser';

import { RenderSystem, PlayerInputSystem, System } from 'systems';
import { Entity } from 'entity';
import { Moveable, Player, Renderable, Component } from 'component';

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
    this.entities = [];

    const playerEntity = new Entity();
    // Do this automatically
    playerEntity.uuid = 1;
    this.entities.push(playerEntity);

    this.engine.renderables = new Map();
    this.engine.renderables.set(
      playerEntity.uuid,
      new Renderable({ x: 69, y: 100 })
    );

    // this.createGameText();
    this.initializeSystems();
  }

  initializeSystems() {
    this.systems = [];

    this.systems.push(new RenderSystem(this.engine, this.game));
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
