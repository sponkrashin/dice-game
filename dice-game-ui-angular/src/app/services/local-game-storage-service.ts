import { Injectable } from '@angular/core';
import { Guid } from 'guid-typescript';
import { GameEngine, SimpleGameEngine, Size } from 'engine';
import { GameStorageService } from './game-storage-service';

@Injectable()
export class LocalGameStorageService implements GameStorageService {
  private readonly savedGamesKey = 'saved-games';

  createGame(gameEngine: GameEngine): Guid {
    const guid = Guid.create();
    localStorage.setItem(guid.toString(), gameEngine.fieldSize.width.toString());
    this.addGameToSaved(guid);
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
    if (!fieldSize) {
      return null;
    }
    return new SimpleGameEngine(fieldSize, fieldSize);
  }

  removeGame(guid: Guid): void {
    localStorage.removeItem(guid.toString());
    this.removeGameFromSaved(guid);
  }

  getAllSavedGames(): GameEngine[] {
    const savedGameEngines = this.getSavedGameGuids().map((guid) => this.restoreGame(guid));
    return savedGameEngines;
  }

  private addGameToSaved(guid: Guid): void {
    const curSavedGames = this.getSavedGameGuids();
    if (!curSavedGames.includes(guid)) {
      curSavedGames.push(guid);
      localStorage.setItem(this.savedGamesKey, JSON.stringify(curSavedGames.map((g) => g.toString())));
    }
  }

  private removeGameFromSaved(guid: Guid): void {
    const curSavedGames = this.getSavedGameGuids();
    const index = curSavedGames.indexOf(guid);
    if (index > -1) {
      curSavedGames.splice(index, 1);
    }
    localStorage.setItem(this.savedGamesKey, JSON.stringify(curSavedGames.map((g) => g.toString())));
  }

  private getSavedGameGuids(): Guid[] {
    let curSavedGames = [];
    if (localStorage.getItem(this.savedGamesKey)) {
      curSavedGames = (JSON.parse(localStorage.getItem(this.savedGamesKey)) as Guid[]) ?? [];
    }
    return curSavedGames;
  }
}
