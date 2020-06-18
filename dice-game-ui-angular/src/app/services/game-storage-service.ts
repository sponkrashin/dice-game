import { Injectable } from '@angular/core';
import { Guid } from 'guid-typescript';
import { GameEngine } from 'engine';

export class SavedGameEngine {

  constructor(gameEngine: GameEngine) {
    this.gameEngine = gameEngine;
    this.guid = Guid.create().toString();
    this.creationDate = new Date();
  }

  gameEngine: GameEngine;
  readonly guid: string;
  readonly creationDate: Date;
}

@Injectable()
export abstract class GameStorageService {
  abstract createGame(gameEngine: GameEngine): Guid;
  abstract saveGame(gameEngine: GameEngine, guid: Guid): Guid;
  abstract restoreGame(guid: Guid): GameEngine;
  abstract removeGame(guid: Guid): void;
  abstract getAllSavedGames(): SavedGameEngine[];
}
