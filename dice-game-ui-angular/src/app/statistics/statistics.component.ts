import { Component, OnInit } from '@angular/core';
import { StatisticsService } from '../services/statistics-service';
import { UserService } from '../services/user-service';

export interface StatisticsDTO {
  gameType: string;
  fieldSize: string;
  turnsCount: number;
  score: number;
  isWinner: boolean;
  wasCompleted: boolean;
}

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss'],
})
export class StatisticsComponent implements OnInit {
  private userId: string;
  statistics: StatisticsDTO[] = [];
  displayedColumns: string[];

  constructor(private userService: UserService, private statisticsService: StatisticsService) {
    this.displayedColumns = ['wasCompleted', 'gameType', 'fieldSize', 'turnsCount', 'score', 'isWinner'];
  }

  ngOnInit(): void {
    this.SetUserId(this.userService.userId);

    this.userService.registerOnAuthStateChanged((user) => {
      this.SetUserId(user.id);
    });
  }

  private SetUserId(userId: string): void {
    this.userId = userId;
    this.getUserStatistics();
  }

  private getUserStatistics(): void {
    this.statistics = this.statisticsService
      .getPlayerStatistics(this.userId)
      .sort((game1, game2) => (game1.creatingDate < game2.creatingDate ? 1 : -1))
      .map((s) => {
        const player = s.playersStaistics?.find((ps) => ps.playerId === this.userId);
        return {
          gameType: s.gameType,
          fieldSize: `${s.fieldSize.width} x ${s.fieldSize.height}`,
          turnsCount: player?.turnsCount ?? 0,
          score: player?.score ?? 0,
          isWinner: s.winnerPlayer === this.userId,
          wasCompleted: !!s.winnerPlayer,
        } as StatisticsDTO;
      });
  }
}
