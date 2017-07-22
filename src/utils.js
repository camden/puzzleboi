// @flow

export const centerGameObjects = (objects: Array<{ anchor: { setTo: * } }>) => {
  objects.forEach(function(object) {
    object.anchor.setTo(0.5);
  });
};

declare var __DEV__: boolean;
export const DEV_MODE = __DEV__;
