// @flow

export class Component {}

export class Renderable extends Component {
  glyph: string;

  constructor({ glyph }: { glyph: string }) {
    super();

    if (glyph.length !== 1) {
      throw new Error('Glyph length must equal 1.');
    }

    this.glyph = glyph;
  }
}

export class Transform extends Component {
  // TODO Put this in position class
  x: number;
  y: number;

  constructor({ x, y }: { x: number, y: number }) {
    super();
    this.x = x;
    this.y = y;
  }

  toString() {
    return `(${this.x}, ${this.y})`;
  }
}

export class Metadata extends Component {
  name: string;
  description: string;

  constructor({ name, description }: { name: string, description: string }) {
    super();
    this.name = name;
    this.description = description;
  }
}

export class Collidable extends Component {}

export class Actor extends Component {
  tactics: { [string]: any };

  constructor({ tactics }: { tactics: { [string]: any } }) {
    super();
    this.tactics = tactics;
  }
}

export class Player extends Component {}

export class Turn extends Component {
  recharge_time: number;
  nextTurnTime: number;
  myTurn: boolean;

  constructor({ recharge_time }: { recharge_time: number }) {
    super();
    this.myTurn = false;
    this.recharge_time = recharge_time;
    this.nextTurnTime = recharge_time;
  }
}
