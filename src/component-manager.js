// @flow

import { Entity } from 'entity';
import { Component } from 'component';

type componentMap = Map<number, Component>;

const initComponents = ({ componentList }: { components: Array<Function> }) => {
  const outputComponents = new Map();

  for (let component of componentList) {
    outputComponents.set(component.name, new Map());
  }

  return outputComponents;
};

// This mutates the Map
const addOne = ({ currentComponents, entity, component }) => {
  const componentName = component.constructor.name;

  if (!currentComponents.has(componentName)) {
    throw new Error(`Component '${componentName}' not registered!`);
  }

  if (currentComponents.get(componentName).has(entity)) {
    console.warn(
      `Replacing component '${componentName}' on entity '${entity}'`
    );
  }
  currentComponents.get(componentName).set(entity, component);
};

export default class ComponentManager {
  components: Map<string, componentMap>;

  constructor() {}

  register({ components }) {
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

  get({
    entity,
    component,
  }: {
    entity: Entity,
    component: Function,
  }): Component {
    const componentName = component.constructor.name;

    if (!this.components.has(componentName)) {
      throw new Error(`Component '${componentName}' not registered!`);
    }

    return this.components.get(componentName).get(entity);
  }

  has({
    entity,
    component,
  }: {
    entity: Entity,
    component: Function,
  }): Component {
    const componentName = component.constructor.name;

    if (!this.components.has(componentName)) {
      throw new Error(`Component '${componentName}' not registered!`);
    }

    return this.components.get(componentName).has(entity);
  }
}
