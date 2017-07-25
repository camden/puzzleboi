// @flow

import type { Entity } from 'entity';
import { Transform } from 'component';

export const getEntitiesAtPosition = ({
  componentManager,
  x,
  y,
}): Array<Entity> => {
  const entities = [];
  componentManager
    .getAll({
      component: Transform,
    })
    .forEach((transform, entity) => {
      if (transform.x === x && transform.y === y) {
        entities.push(entity);
      }
    });

  return entities;
};

// Inclusive
// TODO add tests
// clamp({ value: 3, min: 5 }) -> 5
// clamp({ value: 3, min: 3 }) -> 3
// clamp({ value: 3, min: 1 }) -> 3
// clamp({ value: 3, max: 1 }) -> 1
// clamp({ value: 3, max: 3 }) -> 3
// clamp({ value: 6, min: 2, max: 3 }) -> 3
export const clamp = ({
  value,
  min,
  max,
}: {
  value: number,
  min: ?number,
  max: ?number,
}): number => {
  const minExists = min !== undefined && min !== null;
  const maxExists = max !== undefined && max !== null;

  if (!minExists && !maxExists) {
    throw new Error('Either min or max value must be specified for clamp()');
  }

  if (minExists && maxExists && min > max) {
    throw new Error('Min cannot be greater than Max for clamp()');
  }

  if (minExists && value < min) {
    return min;
  }

  if (maxExists && value > max) {
    return max;
  }

  return value;
};

export const centerGameObjects = (objects: Array<{ anchor: { setTo: * } }>) => {
  objects.forEach(function(object) {
    object.anchor.setTo(0.5);
  });
};

declare var __DEV__: boolean;
export const DEV_MODE = __DEV__;
