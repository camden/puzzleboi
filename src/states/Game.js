// @flow
import Phaser from 'phaser';
import seedrandom from 'seedrandom';

import { System } from 'systems/system';
import AISystem from 'systems/AISystem';
import AttackedSystem from 'systems/AttackedSystem';
import RenderSystem from 'systems/RenderSystem';
import TurnSystem from 'systems/TurnSystem';
import type { Entity } from 'entity';
import { createEntity } from 'entity';

import {
  Actor,
  Attackable,
  Attacked,
  Collidable,
  Cursor,
  Log,
  Metadata,
  Player,
  PlayerControlled,
  Renderable,
  Transform,
  Turn,
} from 'component';
import { onKeyEvent } from 'input';
import ComponentManager from 'component-manager';
import ROT from '../../vendor/rot.min.js';
import MapConfig from 'config/map.json';
import UIConfig from 'config/ui.json';
import GameConfig from 'config/game.json';

export default class extends Phaser.State {
  // TODO Make this its own class
  componentManager: ComponentManager;
  systems: {
    render: Array<System>,
    update: Array<System>,
  };
  entities: Array<Entity>;

  init() {}
  preload() {}

  create() {
    // Set the random seed
    const seed = 40;
    seedrandom(seed, { global: true });
    ROT.RNG.setSeed(seed);

    // TODO rename this? or don't make it top level?
    this.ui = {};

    this.componentManager = new ComponentManager();
    this.componentManager.register({
      components: [
        Actor,
        Attacked,
        Attackable,
        Collidable,
        Cursor,
        Log,
        Metadata,
        Player,
        PlayerControlled,
        Renderable,
        Transform,
        Turn,
      ],
    });

    this.entities = [];

    const rm = new ROT.Map.Cellular(MapConfig.width, MapConfig.height);
    rm.randomize(0.42);

    rm.create((x, y, createWallNumber) => {
      if (createWallNumber === 0) {
        return;
      }

      const nextEntity = createEntity({
        componentManager: this.componentManager,
        components: [
          new Collidable(),
          new Transform({ x: x, y: y }),
          new Renderable({ glyph: 'W' }),
          new Metadata({ name: 'Wall', description: 'A solid stone wall.' }),
        ],
      });
      this.entities.push(nextEntity);
    });

    // TODO add assemblages
    const enemyEntity = createEntity({
      componentManager: this.componentManager,
      components: [
        new Actor({
          // TODO make these classes, not strings
          tactics: [
            {
              name: 'attack_adjacent',
            },
            // {
            //   name: 'move_towards_player',
            //   params: {
            //     sight: 10,
            //   },
            // },
            {
              name: 'wander',
            },
          ],
        }),
        new Attackable(),
        new Collidable(),
        new Metadata({
          name: 'Skeleton',
          description: 'A spooky boneman',
        }),
        new Renderable({ glyph: 'S', visible: true }),
        new Transform({ x: 4, y: 4 }),
        new Turn({ recharge_time: 12 }),
      ],
    });
    this.entities.push(enemyEntity);

    // Do this automatically
    const playerEntity = createEntity({
      componentManager: this.componentManager,
      components: [
        new Attackable(),
        new Collidable(),
        new Player({ state: 'PLAYING' }),
        new PlayerControlled(),
        new Turn({ recharge_time: 10 }),
        new Transform({
          x: Math.floor(MapConfig.width / 2),
          y: Math.floor(MapConfig.height / 2),
        }),
        new Renderable({ glyph: '@', visible: true }),
        new Metadata({
          name: 'Player (you)',
          description: 'The hero of our tale.',
        }),
      ],
    });
    this.entities.push(playerEntity);

    // Do this automatically
    const cursorEntity = createEntity({
      componentManager: this.componentManager,
      components: [
        new Cursor(),
        new Transform({ x: 1, y: 1 }),
        new Renderable({ glyph: 'X', visible: false }),
      ],
    });
    this.entities.push(cursorEntity);

    // Do this automatically
    const logEntity = createEntity({
      componentManager: this.componentManager,
      components: [new Log()],
    });
    this.entities.push(logEntity);

    this.systems = this.initializeSystems();

    this.createUI();

    this.fps = this.game.add.text(0, 0, 10);
    this.game.time.advancedTiming = true;

    window.addEventListener(
      'keydown',
      event => {
        onKeyEvent(event, this.componentManager);
      },
      false
    );
  }

  createUI() {
    const SCREEN_BOUNDS = this.game.scale.bounds;

    const gameRect = new Phaser.Rectangle(
      0,
      0,
      GameConfig.gamePanelWidth,
      GameConfig.gamePanelHeight
    );

    const messagesRect = new Phaser.Rectangle(
      0,
      0,
      SCREEN_BOUNDS.width,
      SCREEN_BOUNDS.height - gameRect.height - MapConfig.tileSize
    );

    const messagesPanel = this.game.add.graphics();
    messagesPanel.beginFill(0x555555, 1);
    messagesPanel.drawRect(
      messagesRect.x,
      messagesRect.y,
      messagesRect.width,
      messagesRect.height
    );
    messagesPanel.endFill();
    messagesPanel.alignIn(SCREEN_BOUNDS, Phaser.BOTTOM_CENTER);

    this.ui.logMessages = this.game.add.bitmapText(
      0,
      0,
      'monaco',
      '',
      UIConfig.logTextSize
    );

    this.ui.logMessages.alignIn(messagesPanel, Phaser.TOP_LEFT, -15, -10);
  }

  updateUI() {
    const logComponent: Log = this.componentManager
      .getAll({
        component: Log,
      })
      .values()
      .next().value;

    if (!logComponent) {
      throw new Error('Log component must exist!');
    }

    this.ui.logMessages.setText(
      logComponent.messages.slice().reverse().join('\n')
    );
  }

  initializeSystems() {
    const systems = {
      update: [],
      render: [],
    };

    systems.render.push(new RenderSystem(this.componentManager, this.game));

    // This ordering is very important!
    systems.update.push(
      new TurnSystem(this.componentManager, this.game),
      new AISystem(this.componentManager, this.game),
      new AttackedSystem(this.componentManager, this.game)
    );

    return systems;
  }

  update() {
    for (let system of this.systems.update) {
      system.update(this.entities);
    }

    this.fps.setText(this.game.time.fps);
  }

  render() {
    this.updateUI();

    for (let system of this.systems.render) {
      system.update(this.entities);
    }
  }
}
