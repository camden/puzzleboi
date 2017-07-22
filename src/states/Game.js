// @flow
import Phaser from 'phaser';

import { DEV_MODE } from '../utils.js';
import Mushroom from '../sprites/Mushroom';
import rot from '../../vendor/rot.min.js';

export default class extends Phaser.State {
  init() {}
  preload() {}

  create() {
    const bannerText = 'Phaser + ES6 + Webpack';
    let banner = this.add.text(
      this.world.centerX,
      this.game.height - 80,
      bannerText
    );
    banner.padding.set(10, 16);
    banner.fontSize = 40;
    banner.fill = '#77BFA3';
    banner.smoothed = false;
    banner.anchor.setTo(0.5);

    this.mushroom = new Mushroom({
      game: this.game,
      x: this.world.centerX,
      y: this.world.centerY,
      asset: 'mushroom',
    });

    this.game.add.existing(this.mushroom);
  }

  render() {
    if (DEV_MODE) {
      this.game.debug.spriteInfo(this.mushroom, 32, 32);
    }
  }
}
