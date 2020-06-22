import { Injectable } from '@angular/core';
import { Guid } from 'guid-typescript';
import { GameEngine, SimpleGameEngine } from 'engine';
import { GameStorageService, SavedGameEngine } from './game-storage-service';

@Injectable()
export class LocalGameStorageService implements GameStorageService {
  private readonly savedGamesKey = 'saved-games';

  saveGame(gameEngine: GameEngine, guid: Guid = null): Guid {
    const allSavedGames = this.getAllSavedGames();
    if (!guid && allSavedGames.length === 0) {
      throw new Error('This game was not created in the store.');
    }

    let savedGame: SavedGameEngine = allSavedGames.find(
      (sg) => sg.guid === (guid ? guid.toString() : Guid.EMPTY)
    );
    // if saving previously saved game
    if (guid) {
      if (!savedGame) {
        throw new Error('This game was not created in the store.');
      }
      savedGame.gameEngine = gameEngine;

      // if saving a new game
    } else {
      if (savedGame) {
        throw new Error('This game was previously created in the store.');
      }

      savedGame = new SavedGameEngine(gameEngine);
      allSavedGames.push(savedGame);
      guid = Guid.parse(savedGame.guid);
    }

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
