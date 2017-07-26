// @flow

import type { Entity } from 'entity';
import { Component } from 'component';
import { getComponentName } from 'utils';

type componentMap = Map<number, Component>;

export default class ComponentManager {
  components: Map<string, componentMap>;

  constructor() {}

  register({ components }: { components: Array<Function> }) {
    this.components = initComponents({
      componentList: components,
    });
  }

  add({
    entity,
    components,
  }: {
    entity: Entity,
    components: Array<Component>,
  }) {
    for (let component of components) {
      addOne({
        currentComponents: this.components,
        entity: entity,
        component: component,
      });
    }
  }

  get({ entity, component }: { entity: Entity, component: Function }) {
    return get({
      currentComponents: this.components,
      entity: entity,
      component: component,
    });
  }

  // TODO rename to queryAll... I like that name better
  getAll({ component }: { component: Function }): componentMap {
    const componentName = getComponentName(component);
    const existingComponentMap = this.components.get(componentName);

    if (!existingComponentMap) {
      throw new Error(`Component '${componentName}' not registered!`);
    }

    return existingComponentMap;
  }

  has({ entity, component }: { entity: Entity, component: Function }): boolean {
    const componentName = getComponentName(component);
    const existingComponentMap = this.components.get(componentName);

    if (!existingComponentMap) {
      throw new Error(`Component '${componentName}' not registered!`);
    }

    return existingComponentMap.has(entity);
  }

  remove({
    entity,
    component,
  }: {
    entity: Entity,
    component: Function,
  }): boolean {
    const componentName = getComponentName(component);
    const existingComponentMap = this.components.get(componentName);

    if (!existingComponentMap) {
      throw new Error(`Component '${componentName}' not registered!`);
    }

    return existingComponentMap.delete(entity);
  }
}

const initComponents = ({
  componentList,
}: {
  componentList: Array<Function>,
}) => {
  const outputComponents = new Map();

  for (let component of componentList) {
    outputComponents.set(component.name, new Map());
  }

  return outputComponents;
};

// This mutates the Map
const addOne = ({
  currentComponents,
  entity,
  component,
}: {
  currentComponents: *,
  entity: Entity,
  component: Component,
}) => {
  const componentName = getComponentName(component);
  const existingComponentMap = currentComponents.get(componentName);

  if (!existingComponentMap) {
    throw new Error(`Component '${componentName}' not registered!`);
  }

  if (existingComponentMap && existingComponentMap.has(entity)) {
    console.warn(
      `Replacing component '${componentName}' on entity '${entity}'`
    );
  }

  existingComponentMap.set(entity, component);
};

function get<ComponentType>({
  currentComponents,
  entity,
  component,
}: {
  currentComponents: *,
  entity: Entity,
  component: Function,
}): ComponentType {
  const componentName = getComponentName(component);

  if (!currentComponents.has(componentName)) {
    throw new Error(`Component '${componentName}' not registered!`);
  }

  return currentComponents.get(componentName).get(entity);
}
