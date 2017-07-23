// @flow
import Phaser from 'phaser';

import { DEV_MODE } from '../utils';
import rot from '../../vendor/rot.min.js';

import { PlayerInputSystem, System } from '../systems';

export default class extends Phaser.State {
  systems: Array<System>;

  init() {}
  preload() {}

  create() {
    this.createGameText();
    this.initializeSystems();
  }

  initializeSystems() {
    this.systems = [];

    const playerInputSystem = new PlayerInputSystem(this.game);
    this.systems.push(playerInputSystem);
  }

  update() {
    for (let system of this.systems) {
      system.update();
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
