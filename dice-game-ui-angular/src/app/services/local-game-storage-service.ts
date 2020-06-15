import { Injectable } from '@angular/core';
import { GameEngine, SimpleGameEngine, Size } from 'engine';
import { GameStorageService } from './game-storage-service';

@Injectable({
  providedIn: 'root',
})
export class LocalGameStorageService implements GameStorageService {
  private gameEngine: GameEngine;

  saveGame(gameEngine: GameEngine): void {
    this.gameEngine = gameEngine;
    localStorage.setItem('field-size', gameEngine.fieldSize.width.toString());
  }

  restoreGame(): GameEngine {
    const fieldSize: number = JSON.parse(localStorage.getItem('field-size'));
    if (fieldSize && !this.gameEngine) {
      this.gameEngine = new SimpleGameEngine(fieldSize, fieldSize);
    }
    return this.gameEngine;
  }

  removeSavedGame(gameEngine: GameEngine): void {
    this.gameEngine = null;
    localStorage.removeItem('field-size');
  }
}
