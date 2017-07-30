// @flow

import type { Entity } from 'entity';
import { Component, Transform } from 'component';
import ComponentManager from 'component-manager';

export const getEntitiesWithin = ({
  componentManager,
  transform,
  distance,
}: {
  componentManager: ComponentManager,
  transform: Transform,
  distance: number,
}) => {
  const nearbyEntities = Array.from(
    componentManager.getAll({
      component: Transform,
    })
  )
    .filter(entry => {
      const entityTransform: Transform = entry[1];

      const XInRange = Math.abs(entityTransform.x - transform.x) < distance;
      const YInRange = Math.abs(entityTransform.y - transform.y) < distance;
      return XInRange && YInRange;
    })
    .map(entry => {
      const transformEntity = entry[0];
      return transformEntity;
    });

  return nearbyEntities;
};

export const getEntitiesAtPosition = ({
  componentManager,
  x,
  y,
}: {
  componentManager: ComponentManager,
  x: number,
  y: number,
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

  if (
    min !== undefined &&
    min !== null &&
    max !== undefined &&
    max !== null &&
    min > max
  ) {
    throw new Error('Min cannot be greater than Max for clamp()');
  }

  // Not using `minExists` because Flow would yell at me otherwise :)
  if (min !== undefined && min !== null) {
    if (value < min) {
      return min;
    }
  }

  if (max !== undefined && max !== null) {
    if (value > max) {
      return max;
    }
  }

  return value;
};

export const centerGameObjects = (objects: Array<{ anchor: { setTo: * } }>) => {
  objects.forEach(function(object) {
    object.anchor.setTo(0.5);
  });
};

export const getComponentName = (component: Function | Component) => {
  if (typeof component === 'function') {
    if (component.name) {
      return component.name;
    }
  }

  if (typeof component === 'object') {
    return component.constructor.name;
  }

  throw new Error(`Could not get name for component.`);
};

declare var __DEV__: boolean;
export const DEV_MODE = __DEV__;
