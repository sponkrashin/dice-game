import { GameEngine } from '../../../../engine';

export interface GameStorageService {
  saveGame(gameEngine: GameEngine): void;
  restoreGame(): GameEngine;
  removeSavedGame(gameEngine: GameEngine): void;
}
