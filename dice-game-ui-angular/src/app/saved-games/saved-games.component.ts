import { Component, OnInit } from '@angular/core';
import { Guid } from 'guid-typescript';
import { GameStorageService, SavedGameEngine } from '../services/game-storage-service';
import { UserService } from '../services/user-service';

@Component({
  selector: 'app-saved-games',
  templateUrl: './saved-games.component.html',
  styleUrls: ['./saved-games.component.scss'],
})
export class SavedGamesComponent implements OnInit {
  games: SavedGameEngine[] = [];
  private userId: string;

  constructor(private gameStorageService: GameStorageService, private userService: UserService) {}

  ngOnInit(): void {
    this.SetUserId(this.userService.userId);

    this.userService.registerOnAuthStateChanged((user) => {
      this.SetUserId(user.id);
    });
  }

  private SetUserId(userId: string): void {
    this.userId = userId;
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
      .getPlayerSavedGames(this.userId)
      .sort((game1, game2) => (game1.creationDate < game2.creationDate ? 1 : -1));
  }
}
