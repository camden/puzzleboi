// @flow
import Phaser from 'phaser';

import { Command, MoveCommand, ConsoleCommand, NoOpCommand } from 'command';

const key = Phaser.KeyCode;

const commandMap = {
  MOVE_DOWN: new MoveCommand('down'),
  MOVE_UP: new MoveCommand('up'),
  MOVE_LEFT: new MoveCommand('left'),
  MOVE_RIGHT: new MoveCommand('right'),
};

export const keyMap: Map<KeyCode, string> = new Map();
keyMap.set(key.J, 'MOVE_DOWN');
keyMap.set(key.K, 'MOVE_UP');
keyMap.set(key.H, 'MOVE_LEFT');
keyMap.set(key.L, 'MOVE_RIGHT');
keyMap.set(key.DOWN, 'MOVE_DOWN');
keyMap.set(key.UP, 'MOVE_UP');
keyMap.set(key.LEFT, 'MOVE_LEFT');
keyMap.set(key.RIGHT, 'MOVE_RIGHT');

export const getCommand = (key: Phaser.KeyCode): Command => {
  const commandString: ?string = keyMap.get(key);

  if (commandString) {
    if (!commandMap[commandString]) {
      throw new Error(`Command ${commandString} not found.`);
    }

    return commandMap[commandString];
  } else {
    return new NoOpCommand();
  }
};

export const onKeyPress = (event, componentManager) => {
  // Force the uppercase letter
  const keyCode = event.key.toUpperCase().charCodeAt(0);
  const command = getCommand(keyCode);
  command.execute(componentManager);
};
