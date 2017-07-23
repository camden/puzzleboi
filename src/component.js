// @flow

export class Component {
  get name(): string {
    return 'Component';
  }
}

export class Renderable extends Component {
  get name(): string {
    return 'Renderable';
  }
}
export class Moveable extends Component {
  get name(): string {
    return 'Moveable';
  }
}
export class Player extends Component {
  get name(): string {
    return 'Player';
  }
}
