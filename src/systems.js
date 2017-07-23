// @flow

export interface System {
  update(): void,
}

export class PlayerInputSystem implements System {
  update() {
    // console.log('Player update!');
  }
}
