// @flow

export class Component {}

export class Renderable extends Component {
  // TODO Put this in position class
  x: number;
  y: number;

  constructor({ x, y }: { x: number, y: number }) {
    super();
    this.x = x;
    this.y = y;
  }
}

export class Moveable extends Component {}
export class Player extends Component {}
