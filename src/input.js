// @flow
import { Command, ConsoleCommand } from './command';
import { getCommand } from './keymap';

export const onKeyUp = event => {
  const c = getCommand(event.keyCode);
  c.execute();
};

export const onKeyDown = event => {};
