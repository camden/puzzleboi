// @flow
import Phaser from 'phaser';

import { Command, MoveCommand, WaitCommand, NoOpCommand } from 'command';

const key = Phaser.KeyCode;

const commandMap = {
  MOVE_DOWN: new MoveCommand('down'),
  MOVE_UP: new MoveCommand('up'),
  MOVE_LEFT: new MoveCommand('left'),
  MOVE_RIGHT: new MoveCommand('right'),
  MOVE_UP_LEFT: new MoveCommand('up-left'),
  MOVE_UP_RIGHT: new MoveCommand('up-right'),
  MOVE_DOWN_LEFT: new MoveCommand('down-left'),
  MOVE_DOWN_RIGHT: new MoveCommand('down-right'),
  WAIT: new WaitCommand(),
};

export const keyMap: Map<KeyCode, string> = new Map();
keyMap.set(key.J, 'MOVE_DOWN');
keyMap.set(key.K, 'MOVE_UP');
keyMap.set(key.H, 'MOVE_LEFT');
keyMap.set(key.L, 'MOVE_RIGHT');
keyMap.set(key.Y, 'MOVE_UP_LEFT');
keyMap.set(key.U, 'MOVE_UP_RIGHT');
keyMap.set(key.B, 'MOVE_DOWN_LEFT');
keyMap.set(key.N, 'MOVE_DOWN_RIGHT');
keyMap.set(key.DOWN, 'MOVE_DOWN');
keyMap.set(key.UP, 'MOVE_UP');
keyMap.set(key.LEFT, 'MOVE_LEFT');
keyMap.set(key.RIGHT, 'MOVE_RIGHT');
keyMap.set(key.PERIOD, 'WAIT');

export const getCommand = (key: KeyCode): Command => {
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

export const onKeyEvent = (event, componentManager) => {
  const command = getCommand(event.keyCode);
  command.execute(componentManager);
};
