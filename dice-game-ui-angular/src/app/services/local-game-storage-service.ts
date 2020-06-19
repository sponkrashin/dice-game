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
    if (!allSavedGames) {
      throw new Error('This game was not created in the store.');
    }
    const curSavedGame = allSavedGames.filter((savedGame) => savedGame.guid === guid.toString());
    if (!curSavedGame) {
      throw new Error('This game was not created in the store.');
    }
    curSavedGame[0].gameEngine = gameEngine;
    localStorage.setItem(this.savedGamesKey, JSON.stringify(curSavedGame));
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
    let curSavedGames: SavedGameEngine[] = [];
    const savedGames = localStorage.getItem(this.savedGamesKey);
    if (savedGames) {
      curSavedGames = (JSON.parse(savedGames) as SavedGameEngine[]) ?? [];
    }
    return curSavedGames.sort((game1, game2) => (game1.creationDate < game2.creationDate ? 1 : -1));
  }

  removeGame(guid: Guid): void {
    let curSavedGames = this.getAllSavedGames();
    const curSavedGame = curSavedGames.filter((savedGame) => savedGame.guid === guid.toString());
    if (!curSavedGame) {
      throw new Error(`A game with id: ${guid.toString()} was not found.`);
    }
    const index = curSavedGames.indexOf(curSavedGame[0]);
    if (index > -1) {
      curSavedGames.splice(index, 1);
    }
    localStorage.setItem(this.savedGamesKey, JSON.stringify(curSavedGames));
  }
}
