import { Injectable } from '@angular/core';
import { Guid } from 'guid-typescript';
import { GameEngine, SimpleGameEngine, Size } from 'engine';
import { GameStorageService } from './game-storage-service';

@Injectable()
export class LocalGameStorageService implements GameStorageService {
  createGame(gameEngine: GameEngine): Guid {
    const guid = Guid.create();
    localStorage.setItem(guid.toString(), gameEngine.fieldSize.width.toString());
    return guid;
  }

  saveGame(gameEngine: GameEngine, guid: Guid): Guid {
    if (!localStorage.getItem(guid.toString())) {
      throw new Error('The saved game was not found in the store');
    }
    localStorage.setItem(guid.toString(), gameEngine.fieldSize.width.toString());
    return guid;
  }

  restoreGame(guid: Guid): GameEngine {
    const fieldSize: number = JSON.parse(localStorage.getItem(guid.toString()));
    let gameEngine = null; // temporary decision!!
    if (fieldSize) {
      gameEngine = new SimpleGameEngine(fieldSize, fieldSize);
    }
    return gameEngine;
  }

  removeGame(guid: Guid): void {
    localStorage.removeItem(guid.toString());
  }
}
