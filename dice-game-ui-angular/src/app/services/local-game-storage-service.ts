import { Injectable } from '@angular/core';
import { Guid } from 'guid-typescript';
import { GameEngine, SimpleGameEngine } from 'engine';
import { GameStorageService, SavedGameEngine } from './game-storage-service';

@Injectable()
export class LocalGameStorageService implements GameStorageService {
  private readonly savedGamesKey = 'saved-games';

  saveGame(gameEngine: GameEngine, guid: Guid = null): Guid {
    const allSavedGames = this.getAllSavedGames();
    if (guid && allSavedGames.length === 0) {
      throw new Error('This game was not created in the store.');
    }

    let savedGame: SavedGameEngine = allSavedGames.find((sg) => sg.guid === guid?.toString());
    // if saving previously saved game
    if (guid) {
      if (!savedGame) {
        throw new Error('This game was not created in the store.');
      }
      savedGame.gameEngine = gameEngine;

      // if saving a new game
    } else {
      savedGame = new SavedGameEngine(gameEngine);
      allSavedGames.push(savedGame);
      guid = Guid.parse(savedGame.guid);
    }

    localStorage.setItem(this.savedGamesKey, JSON.stringify(allSavedGames));
    return guid;
  }

  restoreGame(guid: Guid): GameEngine {
    if (!guid) {
      throw new Error('A guid of the game should be defined.');
    }

    const allSavedGames = this.getAllSavedGames();
    if (allSavedGames.length === 0) {
      throw new Error('There are no saved games.');
    }

    const curSavedGame = allSavedGames.find(sg => sg.guid === guid.toString());
    return curSavedGame
      ? new SimpleGameEngine(curSavedGame.gameEngine.fieldSize.width, curSavedGame.gameEngine.fieldSize.height)
      : null;
  }

  getAllSavedGames(): SavedGameEngine[] {
    const savedGames = localStorage.getItem(this.savedGamesKey);
    return savedGames ? (JSON.parse(savedGames) as SavedGameEngine[]) : [];
  }

  removeGame(guid: Guid): void {
    if (!guid) {
      throw new Error('A guid of the game should be defined.');
    }

    const curSavedGames = this.getAllSavedGames();
    if (curSavedGames.length === 0) {
      throw new Error('There are no saved games.');
    }
    const curSavedGameIndex = curSavedGames.findIndex((savedGame) => savedGame.guid === guid.toString());
    if (curSavedGameIndex === -1) {
      throw new Error(`A game with id: ${guid.toString()} was not found.`);
    }
    curSavedGames.splice(curSavedGameIndex, 1);
    localStorage.setItem(this.savedGamesKey, JSON.stringify(curSavedGames));
  }
}
