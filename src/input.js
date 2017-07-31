// @flow
import { Command, MoveCommand, WaitCommand, NoOpCommand } from 'command';

const commandMap = {
  MOVE_DOWN: new MoveCommand('down'),
  MOVE_UP: new MoveCommand('up'),
  MOVE_LEFT: new MoveCommand('left'),
  MOVE_RIGHT: new MoveCommand('right'),
  WAIT: new WaitCommand(),
};

export const keyMap: Map<KeyCode, string> = new Map();
keyMap.set('j', 'MOVE_DOWN');
keyMap.set('k', 'MOVE_UP');
keyMap.set('h', 'MOVE_LEFT');
keyMap.set('l', 'MOVE_RIGHT');
keyMap.set('ArrowDown', 'MOVE_DOWN');
keyMap.set('ArrowUp', 'MOVE_UP');
keyMap.set('ArrowLeft', 'MOVE_LEFT');
keyMap.set('ArrowRight', 'MOVE_RIGHT');
keyMap.set('.', 'WAIT');

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
  const command = getCommand(event.key);
  command.execute(componentManager);
};
