// @flow

import { Graph, astar as AStar } from 'javascript-astar';
import type { Entity } from 'entity';
import { Collidable, Component, Log, Transform } from 'component';
import ComponentManager from 'component-manager';
import MapConfig from 'config/map.json';

export const log = ({
  componentManager,
  message,
}: {
  componentManager: ComponentManager,
  message: string,
}): void => {
  const logComponent: Log = componentManager
    .getAll({
      component: Log,
    })
    .values()
    .next().value;

  if (!logComponent) {
    throw new Error('Log component must exist!');
  }

  logComponent.messages.push(message);
};

export const getEntitiesWithin = ({
  componentManager,
  transform,
  distance,
}: {
  componentManager: ComponentManager,
  transform: Transform,
  distance: number,
}): Array<Entity> => {
  const nearbyEntities = Array.from(
    componentManager.getAll({
      component: Transform,
    })
  )
    .filter(entry => {
      const entityTransform: Transform = entry[1];
      if (entityTransform === transform) {
        return false;
      }

      const XInRange = Math.abs(entityTransform.x - transform.x) <= distance;
      const YInRange = Math.abs(entityTransform.y - transform.y) <= distance;
      return XInRange && YInRange;
    })
    .map(entry => {
      const transformEntity = entry[0];
      return transformEntity;
    });

  return nearbyEntities;
};

export const getPathToTarget = ({
  componentManager,
  transform,
  targetTransform,
}: {
  componentManager: ComponentManager,
  transform: Transform,
  targetTransform: Transform,
}): Array<*> => {
  const collidableEntities = Array.from(
    componentManager.getAll({
      component: Collidable,
    })
  ).map(entry => entry[0]);

  const allTransformsThatAreCollidable = Array.from(
    componentManager.getAll({
      component: Transform,
    })
  )
    .filter(entry => {
      // Don't included transforms for the target
      const transform: Transform = entry[1];
      return !(
        transform.x === targetTransform.x && transform.y === targetTransform.y
      );
    })
    .filter(entry => {
      const transformEntity = entry[0];
      return collidableEntities.includes(transformEntity);
    })
    .map(entry => entry[1]);

  const mapArray = new Array(MapConfig.width);
  for (let x = 0; x < MapConfig.width; x++) {
    mapArray[x] = [];
    for (let y = 0; y < MapConfig.height; y++) {
      let gridNode = 1;
      const collidableExists = allTransformsThatAreCollidable.find(
        (transform: Transform) => {
          return transform.x === x && transform.y === y;
        }
      );
      if (collidableExists) {
        gridNode = 0;
      }
      mapArray[x][y] = gridNode;
    }
  }

  const graph = new Graph(mapArray, { diagonal: true });
  const startX = transform.x;
  const startY = transform.y;
  const goalX = targetTransform.x;
  const goalY = targetTransform.y;
  const startPoint = graph.grid[startX][startY];
  const goalPoint = graph.grid[goalX][goalY];
  const path = AStar.search(graph, startPoint, goalPoint);

  return path;
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
