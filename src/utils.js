// Inclusive
// TODO add tests
// clamp({ value: 3, min: 5 }) -> 5
// clamp({ value: 3, min: 3 }) -> 3
// clamp({ value: 3, min: 1 }) -> 3
// clamp({ value: 3, max: 1 }) -> 1
// clamp({ value: 3, max: 3 }) -> 3
// clamp({ value: 6, min: 2, max: 3 }) -> 3
export const clamp = ({ value, min, max }) => {
  const minExists = min !== undefined && min !== null;
  const maxExists = max !== undefined && max !== null;

  if (!minExists && !maxExists) {
    throw new Error("Either min or max value must be specified for clamp()");
  }

  if (
    min !== undefined &&
    min !== null &&
    max !== undefined &&
    max !== null &&
    min > max
  ) {
    throw new Error("Min cannot be greater than Max for clamp()");
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

export const centerGameObjects = objects => {
  objects.forEach(function(object) {
    object.anchor.setTo(0.5);
  });
};

export const DEV_MODE = __DEV__;
