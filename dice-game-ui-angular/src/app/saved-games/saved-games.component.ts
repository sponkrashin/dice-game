import { Component, OnInit } from '@angular/core';
import { Guid } from 'guid-typescript';
import { GameStorageService, SavedGameEngine } from '../services/game-storage-service';

@Component({
  selector: 'app-saved-games',
  templateUrl: './saved-games.component.html',
  styleUrls: ['./saved-games.component.scss'],
})
export class SavedGamesComponent implements OnInit {
  games: SavedGameEngine[];

  constructor(private gameStorageService: GameStorageService) {}

  ngOnInit(): void {
    this.setAllGameEngines();
  }

  getGameLink(gameEngine: SavedGameEngine) {
    return ['/game', gameEngine.guid];
  }

  removeSavedGame(guid: Guid) {
    this.gameStorageService.removeGame(guid);
    this.setAllGameEngines();
  }

  private setAllGameEngines() {
    this.games = this.gameStorageService
      .getAllSavedGames()
      .sort((game1, game2) => (game1.creationDate < game2.creationDate ? 1 : -1));
  }
}
