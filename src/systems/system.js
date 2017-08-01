// @flow
import type { Entity } from 'entity';

export interface System {
  update(entities: Array<Entity>): void,
}
