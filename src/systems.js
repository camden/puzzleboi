// @flow
import { Graph, astar as AStar } from 'javascript-astar';
import { keyMap, getCommand } from 'input';
import type { Entity } from 'entity';
import {
  Actor,
  Collidable,
  Metadata,
  Player,
  Renderable,
  Transform,
  Turn,
} from 'component';
import ComponentManager from 'component-manager';
import MapConfig from 'config/map.json';

export interface System {
  update(entities: Array<Entity>): void,
}

// TODO move each one into its own file
export class AISystem implements System {
  componentManager: ComponentManager;
  game: *;

  constructor(componentManager: ComponentManager, game: *) {
    this.componentManager = componentManager;
    this.game = game;
  }

  update(entities: Array<Entity>) {
    // TODO In the future, do this:
    // https://github.com/libgdx/ashley/wiki/How-to-use-Ashley#entity-systems
    for (let entity of entities) {
      // TODO pull this out
      const turnComponent = this.componentManager.get({
        entity: entity,
        component: Turn,
      });
      const actorComponent = this.componentManager.get({
        entity: entity,
        component: Actor,
      });

      if (turnComponent && actorComponent) {
        if (!turnComponent.myTurn) {
          return;
        }

        const transformComponent = this.componentManager.get({
          entity: entity,
          component: Transform,
        });

        if (transformComponent) {
          if (actorComponent.tactics.move_towards_player) {
            const nearby_distance =
              actorComponent.tactics.move_towards_player.sight;

            const nearbyEntities = Array.from(
              this.componentManager.getAll({
                component: Transform,
              })
            )
              .filter(entry => {
                const transform = entry[1];

                const XInRange =
                  Math.abs(transform.x - transformComponent.x) <
                  nearby_distance;
                const YInRange =
                  Math.abs(transform.y - transformComponent.y) <
                  nearby_distance;
                return XInRange && YInRange;
              })
              .map(entry => {
                const transformEntity = entry[0];
                return transformEntity;
              })
              .filter(entity => {
                // TODO For now, do it like this
                // in the future, add a "hostility" to dynamically determine
                // what entity you are targeting
                const entityPlayerComponent = this.componentManager.get({
                  entity: entity,
                  component: Player,
                });

                return !!entityPlayerComponent;
              });

            const target = nearbyEntities[0];
            if (target) {
              const targetTransform = this.componentManager.get({
                entity: target,
                component: Transform,
              });

              if (targetTransform) {
                // now path towards target
                // TODO add a method to get all entities that have
                // all components in passed-in array
                // (in this case, Collidable and Transform)
                const collidableEntities = Array.from(
                  this.componentManager.getAll({
                    component: Collidable,
                  })
                ).map(entry => entry[0]);

                const allTransformsThatAreCollidable = Array.from(
                  this.componentManager.getAll({
                    component: Transform,
                  })
                )
                  .filter(entry => {
                    const transformEntity = entry[0];
                    const transform = entry[1];
                    return (
                      transformEntity !== entity &&
                      transform.x !== targetTransform.x &&
                      transform.y !== targetTransform.y
                    );
                  })
                  .filter(entry => {
                    const transformEntity = entry[0];
                    return collidableEntities.includes(transformEntity);
                  })
                  .map(entry => {
                    const renderable = this.componentManager.get({
                      entity: entry[0],
                      component: Renderable,
                    });
                    renderable.glyph = '!';
                    return entry;
                  })
                  .map(entry => entry[1]);

                const mapArray = new Array(MapConfig.width);
                for (let x = 0; x < MapConfig.width; x++) {
                  mapArray[x] = [];
                  for (let y = 0; y < MapConfig.height; y++) {
                    let gridNode = 1;
                    const collidableExists = allTransformsThatAreCollidable.find(
                      transform => {
                        return transform.x === x && transform.y === y;
                      }
                    );
                    if (collidableExists) {
                      gridNode = 0;
                    }
                    mapArray[x][y] = gridNode;
                  }
                }

                const graph = new Graph(mapArray);
                const startX = transformComponent.x;
                const startY = transformComponent.y;
                const goalX = targetTransform.x;
                const goalY = targetTransform.y;
                const startPoint = graph.grid[startX][startY];
                const goalPoint = graph.grid[goalX][goalY];
                const path = AStar.search(graph, startPoint, goalPoint);

                if (path[0]) {
                  transformComponent.x = path[0].x;
                  transformComponent.y = path[0].y;
                } else {
                  console.log('COULD NOT FIND PATH');
                }
              }
            }
          }
        }

        const metadata = this.componentManager.get({
          entity: entity,
          component: Metadata,
        });

        if (metadata) {
          console.log(`${metadata.name} acted.`);
        }

        turnComponent.myTurn = false;
      }
    }
  }
}

export class TurnSystem implements System {
  componentManager: ComponentManager;
  game: *;

  constructor(componentManager: ComponentManager, game: *) {
    this.componentManager = componentManager;
    this.game = game;
  }

  update(entities: Array<Entity>) {
    // TODO In the future, do this:
    // https://github.com/libgdx/ashley/wiki/How-to-use-Ashley#entity-systems
    let nextToAct: Turn;

    for (let entity of entities) {
      // TODO pull this out
      const turnComponent = this.componentManager.get({
        entity: entity,
        component: Turn,
      });

      if (turnComponent) {
        if (turnComponent.myTurn) {
          // TODO Add helper for getting name
          const metadata = this.componentManager.get({
            entity: entity,
            component: Metadata,
          });

          if (metadata) {
            // console.log(`${metadata.name}'s turn to act.'`);
          }
          return;
        }

        if (!nextToAct) {
          nextToAct = turnComponent;
        }

        if (turnComponent.nextTurnTime < nextToAct.nextTurnTime) {
          nextToAct = turnComponent;
        }
      }
    }

    if (!nextToAct) {
      throw new Error('Could not find next actor to act.');
    }

    nextToAct.myTurn = true;
    nextToAct.nextTurnTime += nextToAct.speed;
  }
}

export class RenderSystem implements System {
  componentManager: ComponentManager;
  game: *;
  // TODO remove this
  draw: Function;
  clear: Function;
  map: Array<Array<*>>;

  constructor(componentManager: ComponentManager, game: *) {
    this.componentManager = componentManager;
    this.game = game;

    // Init map - should this be somewhere else?
    const MAP_WIDTH = MapConfig.width;
    const MAP_HEIGHT = MapConfig.height;
    const blankChar = '·';
    // TODO this is ugly... use a camera
    const spacing = 20;
    const x_offset = 30;
    const y_offset = 300;
    this.map = new Array(MAP_WIDTH);

    for (let x = 0; x < MAP_WIDTH; x++) {
      this.map[x] = [];
      for (let y = 0; y < MAP_HEIGHT; y++) {
        const cell = this.game.add.text(
          x_offset + x * spacing,
          // Multiply by -1 to make origin at bottom left
          y_offset + y * spacing * -1,
          blankChar,
          {
            font: '10pt Monaco, monospace',
          }
        );
        this.map[x][y] = cell;
      }
    }

    this.clear = () => {
      for (let x = 0; x < MAP_WIDTH; x++) {
        for (let y = 0; y < MAP_HEIGHT; y++) {
          this.map[x][y].setText(blankChar);
        }
      }
    };

    this.draw = ({ x, y, glyph }) => {
      if (x < 0 || x >= MAP_WIDTH) {
        return;
      }

      if (y < 0 || y >= MAP_HEIGHT) {
        return;
      }

      this.map[x][y].setText(glyph);
    };
  }

  update(entities: Array<Entity>) {
    this.clear();
    for (let entity of entities) {
      const renderable = this.componentManager.get({
        entity: entity,
        component: Renderable,
      });
      const transform = this.componentManager.get({
        entity: entity,
        component: Transform,
      });

      // Eventually do a bitmask?
      if (renderable && transform) {
        // TODO Rename this
        this.draw({
          x: transform.x,
          y: transform.y,
          glyph: renderable.glyph,
        });
      }
    }
  }
}
