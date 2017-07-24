// @flow

export class Entity {
  uuid: number;

  toString() {
    return `{Entity uuid: ${this.uuid}}`;
  }
}
