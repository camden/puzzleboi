// @flow

import { Component } from 'component';

export class Entity {
  // TODO convert to set?
  components: Array<Component>;

  constructor() {
    this.components = [];
  }

  hasAllComponents(componentNames: Array<string>): boolean {
    for (let componentName of componentNames) {
      if (!this.hasComponent(componentName)) {
        return false;
      }
    }

    return true;
  }

  hasComponent(componentName: string): boolean {
    for (let ownComponent of this.components) {
      if (ownComponent.name === componentName) {
        return true;
      }
    }

    return false;
  }

  addComponent(component: Component) {
    // Add checking for dupes
    this.components.push(component);
  }

  removeComponent(component: Component) {
    const index = this.components.indexOf(component);

    if (index !== -1) {
      this.components.splice(index, 1);
    }
  }

  getComponent(componentName: string): Component {
    const c = this.components.find(component => {
      return component.name === componentName;
    });

    if (c) {
      return c;
    }

    throw new Error(
      `Component "${componentName}" not found on Entity "${this.toString()}"`
    );
  }
}
