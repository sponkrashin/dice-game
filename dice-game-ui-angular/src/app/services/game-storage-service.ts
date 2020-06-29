import { Injectable } from '@angular/core';
import { Guid } from 'guid-typescript';
import { GameEngine } from 'engine';

export class SavedGameEngine {
  gameEngine: GameEngine;
  readonly guid: string;
  readonly creationDate: Date;

  constructor(gameEngine: GameEngine) {
    this.gameEngine = gameEngine;
    this.guid = Guid.create().toString();
    this.creationDate = new Date();
  }
}

@Injectable()
export abstract class GameStorageService {
  abstract restoreGame(guid: Guid): GameEngine;
  abstract removeGame(guid: Guid): void;
  abstract getAllSavedGames(): SavedGameEngine[];

  saveGame(gameEngine: GameEngine, guid: Guid = null): Guid {
    throw new Error('The method was not implemented');
  }
}
