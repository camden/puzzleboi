// @flow
import Phaser from "phaser";

import { onKeyEvent } from "input";

export default class extends Phaser.State {
  init() {}
  preload() {}

  create() {
    this.fps = this.game.add.text(0, 0, 10);
  }

  update() {
    this.fps.setText(this.game.time.fps);
  }

  render() {}
}
