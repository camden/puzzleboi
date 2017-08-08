// @flow

export type Entity = number;

let nextEntityId = 0;

export const createEntity = ({ componentManager, components }): Entity => {
  const newEntity = nextEntityId++;
  componentManager.add({
    entity: newEntity,
    components: components,
  });

  return newEntity;
};
