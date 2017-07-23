// @flow
import Phaser from 'phaser';

import { RenderSystem, PlayerInputSystem, System } from 'systems';
import { Entity } from 'entity';
import { Moveable, Player, Renderable } from 'component';

export default class extends Phaser.State {
  entities: Array<Entity>;
  systems: Array<System>;

  init() {}
  preload() {}

  create() {
    this.entities = [];
    const playerEntity = new Entity();
    playerEntity.addComponent(new Moveable());
    playerEntity.addComponent(new Player());
    playerEntity.addComponent(new Renderable());
    this.entities.push(playerEntity);

    this.createGameText();
    this.initializeSystems();
  }

  initializeSystems() {
    this.systems = [];

    this.systems.push(new PlayerInputSystem(this.game));
    this.systems.push(new RenderSystem(this.game));
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
    debugger;
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
