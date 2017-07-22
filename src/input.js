// @flow
import { Command, ConsoleCommand } from './command';

export const onKeyUp = event => {
  // use rotjs keys?
  // iterate over all keys
  if (event.key === 'c') {
    new ConsoleCommand('cam').execute();
  }
};

export const onKeyDown = event => {};
