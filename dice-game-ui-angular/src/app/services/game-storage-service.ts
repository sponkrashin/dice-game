import { GameEngine } from '../../../../engine';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export abstract class GameStorageService {
  abstract saveGame(gameEngine: GameEngine): void;
  abstract restoreGame(): GameEngine;
  abstract removeSavedGame(gameEngine: GameEngine): void;
}
