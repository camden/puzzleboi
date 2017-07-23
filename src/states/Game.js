// @flow
import Phaser from 'phaser';

import { DEV_MODE } from '../utils';
import rot from '../../vendor/rot.min.js';

import { onKeyDown, onKeyUp } from '../input';

export default class extends Phaser.State {
  init() {}
  preload() {}

  create() {
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

    this.createInputCallbacks();
  }

  createInputCallbacks() {
    this.game.input.keyboard.addCallbacks(this, onKeyDown, onKeyUp);
  }

  update() {}

  render() {}
}
