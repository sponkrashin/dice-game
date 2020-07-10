import { Component, OnInit } from '@angular/core';
import { Guid } from 'guid-typescript';
import { SocialAuthService, SocialUser } from 'angularx-social-login';
import { GameStorageService, SavedGameEngine } from '../services/game-storage-service';

@Component({
  selector: 'app-saved-games',
  templateUrl: './saved-games.component.html',
  styleUrls: ['./saved-games.component.scss'],
})
export class SavedGamesComponent implements OnInit {
  private readonly localPlayer = 'local player';
  games: SavedGameEngine[] = [];
  user: SocialUser;

  constructor(private gameStorageService: GameStorageService, private authService: SocialAuthService) {}

  ngOnInit(): void {
    this.setAllGameEngines();
    this.authService.authState.subscribe((user) => {
      this.user = user;
      this.setAllGameEngines();
    });
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
      .getPlayerSavedGames(this.user?.email ?? this.localPlayer)
      .sort((game1, game2) => (game1.creationDate < game2.creationDate ? 1 : -1));
  }
}
