import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SocialAuthService, SocialUser } from 'angularx-social-login';
import { SimpleGameEngine } from 'engine';
import { GameStorageService } from '../services/game-storage-service';
import { StatisticsService } from '../services/statistics-service';

@Component({
  selector: 'app-start-game',
  templateUrl: './start-game.component.html',
  styleUrls: ['./start-game.component.scss'],
})
export class StartGameComponent implements OnInit {
  private readonly localPlayer = 'local player';
  size: number;
  sizeOptions: number[] = [];
  user: SocialUser;

  constructor(
    private router: Router,
    private gameStorageService: GameStorageService,
    private authService: SocialAuthService,
    private statisticsService: StatisticsService
  ) {}

  ngOnInit(): void {
    this.authService.authState.subscribe((user) => {
      this.user = user;
    });
    this.sizeOptions = [];
    for (let size = 6; size < 21; size++) {
      this.sizeOptions.push(size);
    }
  }

  startGame() {
    const newGame = new SimpleGameEngine(this.size, this.size, this.user?.email ?? this.localPlayer);
    const gameGuid = this.gameStorageService.saveGame(newGame);
    this.statisticsService.create(gameGuid, newGame, newGame.players[0].playerId ?? 'local player');
    this.router.navigate(['/game', gameGuid.toString()]);
  }
}
