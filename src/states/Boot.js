// @flow
import Phaser from 'phaser';

export default class extends Phaser.State {
  init() {
    const hue = Math.random();
    const saturation = 1;
    const lightness = 0.98;
    const color = Phaser.Color.HSLtoRGB(hue, saturation, lightness).color;
    this.stage.setBackgroundColor(color);
  }

  preload() {
    this.load.image('loaderBg', './assets/images/loader-bg.png');
    this.load.image('loaderBar', './assets/images/loader-bar.png');
    this.load.bitmapFont(
      'monaco',
      './assets/fonts/monaco/monaco.png',
      './assets/fonts/monaco/monaco.fnt'
    );
  }

  create() {
    this.state.start('Splash');
  }
}
