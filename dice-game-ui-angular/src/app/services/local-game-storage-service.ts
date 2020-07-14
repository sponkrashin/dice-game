import { Injectable } from '@angular/core';
import { Guid } from 'guid-typescript';
import { GameEngine, SimpleGameEngine } from 'engine';
import { GameStorageService, SavedGameEngine } from './game-storage-service';
import { UserService } from './user-service';

@Injectable()
export class LocalGameStorageService extends GameStorageService {
  private readonly savedGamesKey = 'saved-games';
  private userId: string;

  // ToDo: remove using social auth service when factory will be created
  constructor(private userService: UserService) {
    super();
    this.userId = this.userService.userId;
    this.userService.registerOnAuthStateChanged((user) => {
      this.userId = user.id;
    });
  }

  saveGame(gameEngine: GameEngine, guid: Guid = null): Guid {
    const allSavedGames = this.getAllSavedGames();
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

    const curSavedGame = allSavedGames.find((sg) => sg.guid === guid.toString());
    if (!curSavedGame) {
      throw new Error(`A game with the guid ${guid.toString()} wasn't found in the stored games`);
    }
    return new SimpleGameEngine(
      curSavedGame.gameEngine.fieldSize.width,
      curSavedGame.gameEngine.fieldSize.height,
      this.userId
    );
  }

  getPlayerSavedGames(playerId: string): SavedGameEngine[] {
    return this.getAllSavedGames().filter((sg) => sg.gameEngine.players.find((p) => p.playerId === playerId));
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

  protected getAllSavedGames(): SavedGameEngine[] {
    const savedGames = localStorage.getItem(this.savedGamesKey);
    return savedGames ? (JSON.parse(savedGames) as SavedGameEngine[]) : [];
  }
}
