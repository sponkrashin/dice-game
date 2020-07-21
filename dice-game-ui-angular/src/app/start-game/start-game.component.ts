import { Component, OnInit, OnDestroy } from '@angular/core';
import { SubscriptionLike } from 'rxjs';
import { Router } from '@angular/router';
import { SimpleGameEngine } from 'engine';
import { GameStorageService } from '../services/game-storage-service';
import { StatisticsService } from '../services/statistics-service';
import { UserService } from '../services/user-service';

@Component({
  selector: 'app-start-game',
  templateUrl: './start-game.component.html',
  styleUrls: ['./start-game.component.scss'],
})
export class StartGameComponent implements OnInit, OnDestroy {
  size: number;
  sizeOptions: number[] = [];

  private userId: string;
  private userServiceSubscription: SubscriptionLike;

  constructor(
    private router: Router,
    private gameStorageService: GameStorageService,
    private userService: UserService,
    private statisticsService: StatisticsService
  ) { }

  ngOnInit(): void {
    this.userServiceSubscription = this.userService.getUser().subscribe((user) => {
      this.userId = user.id;
    });
    this.sizeOptions = [];
    for (let size = 6; size < 21; size++) {
      this.sizeOptions.push(size);
    }
  }

  startGame() {
    const newGame = new SimpleGameEngine(this.size, this.size, this.userId);
    const gameGuid = this.gameStorageService.saveGame(newGame);
    this.statisticsService.create(gameGuid, newGame, this.userId);
    this.router.navigate(['/game', gameGuid.toString()]);
  }

  ngOnDestroy() {
    if (this.userServiceSubscription) {
      this.userServiceSubscription.unsubscribe();
      this.userServiceSubscription = null;
    }
  }
}
