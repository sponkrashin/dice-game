import { Injectable } from '@angular/core';
import { Guid } from 'guid-typescript';
import { GameEngine, SimpleGameEngine } from 'engine';
import { GameStorageService, SavedGameEngine } from './game-storage-service';

@Injectable()
export class LocalGameStorageService implements GameStorageService {
  private readonly savedGamesKey = 'saved-games';

  createGame(gameEngine: GameEngine): Guid {
    const savedGameEngine = new SavedGameEngine(gameEngine);
    const curSavedGames = this.getAllSavedGames();
    if (curSavedGames.filter((savedGame) => savedGame.guid === savedGameEngine.guid).length === 0) {
      curSavedGames.push(savedGameEngine);
      localStorage.setItem(this.savedGamesKey, JSON.stringify(curSavedGames));
    }
    return Guid.parse(savedGameEngine.guid);
  }

  saveGame(gameEngine: GameEngine, guid: Guid): Guid {
    const allSavedGames = this.getAllSavedGames();
    if (allSavedGames.length === 0) {
      throw new Error('This game was not created in the store.');
    }
    const curSavedGame = allSavedGames.find((savedGame) => savedGame.guid === guid.toString());
    if (!curSavedGame) {
      throw new Error('This game was not created in the store.');
    }
    curSavedGame.gameEngine = gameEngine;
    localStorage.setItem(this.savedGamesKey, JSON.stringify(allSavedGames));
    return guid;
  }

  restoreGame(guid: Guid): GameEngine {
    const allSavedGames = this.getAllSavedGames();
    if (!allSavedGames) {
      return null;
    }
    const curSavedGame = allSavedGames.filter((savedGame) => savedGame.guid === guid.toString());
    if (!curSavedGame) {
      return null;
    }
    return new SimpleGameEngine(
      curSavedGame[0].gameEngine.fieldSize.width,
      curSavedGame[0].gameEngine.fieldSize.height
    );
  }

  getAllSavedGames(): SavedGameEngine[] {
    const savedGames = localStorage.getItem(this.savedGamesKey);
    return savedGames ? (JSON.parse(savedGames) as SavedGameEngine[]) : [];
  }

  removeGame(guid: Guid): void {
    const curSavedGames = this.getAllSavedGames();
    const curSavedGameIndex = curSavedGames.findIndex((savedGame) => savedGame.guid === guid.toString());
    if (curSavedGameIndex === -1) {
      throw new Error(`A game with id: ${guid.toString()} was not found.`);
    }
    curSavedGames.splice(curSavedGameIndex, 1);
    localStorage.setItem(this.savedGamesKey, JSON.stringify(curSavedGames));
  }
}
