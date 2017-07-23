// @flow

import { Component } from 'component';

export class Entity {
  components: Array<Component>;

  constructor() {
    this.components = [];
  }

  hasAllComponents(components: Array<Component | Function>): boolean {
    for (let component of components) {
      if (!this.hasComponent(component)) {
        return false;
      }
    }

    return true;
  }

  // component can either be an instance of a Component
  // or a Component class itself
  hasComponent(component: Component | Function): boolean {
    if (component instanceof Component) {
      for (let ownComponent of this.components) {
        if (component.constructor.name === ownComponent.constructor.name) {
          return true;
        }
      }
    } else {
      for (let ownComponent of this.components) {
        if (ownComponent instanceof component) {
          return true;
        }
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
}
