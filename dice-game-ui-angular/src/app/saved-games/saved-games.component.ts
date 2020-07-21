import { Component, OnInit } from '@angular/core';
import { SubscriptionLike } from 'rxjs';
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
  private userServiceSubscription: SubscriptionLike;

  constructor(private gameStorageService: GameStorageService, private userService: UserService) { }

  ngOnInit(): void {
    this.userServiceSubscription = this.userService.getUser().subscribe((user) => {
      this.userId = user.id;
      this.loadSavedGames();
    });
  }

  getGameLink(gameEngine: SavedGameEngine) {
    return ['/game', gameEngine.guid];
  }

  removeSavedGame(guid: Guid) {
    this.gameStorageService.removeGame(guid);
    this.loadSavedGames();
  }

  private loadSavedGames() {
    this.games = this.gameStorageService
      .getPlayerSavedGames(this.userId)
      .sort((game1, game2) => (game1.creationDate < game2.creationDate ? 1 : -1));
  }

  ngOnDestroy() {
    if (this.userServiceSubscription) {
      this.userServiceSubscription.unsubscribe();
      this.userServiceSubscription = null;
    }
  }
}
