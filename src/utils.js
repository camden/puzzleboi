// @flow

import type { Entity } from 'entity';

export const getEntitiesAtPosition = ({ engine, x, y }): Array<Entity> => {
  const entities = [];
  engine.transforms.forEach((transform, entity) => {
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
