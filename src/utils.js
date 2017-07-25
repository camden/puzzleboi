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

export const centerGameObjects = (objects: Array<{ anchor: { setTo: * } }>) => {
  objects.forEach(function(object) {
    object.anchor.setTo(0.5);
  });
};

declare var __DEV__: boolean;
export const DEV_MODE = __DEV__;
