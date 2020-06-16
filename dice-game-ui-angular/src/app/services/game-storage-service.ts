import { Injectable } from '@angular/core';
import { Guid } from 'guid-typescript';
import { GameEngine } from 'engine';

@Injectable()
export abstract class GameStorageService {
  abstract createGame(gameEngine: GameEngine): Guid;
  abstract saveGame(gameEngine: GameEngine, guid: Guid): Guid;
  abstract restoreGame(guid: Guid): GameEngine;
  abstract removeGame(guid: Guid): void;
}
