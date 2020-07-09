import { Component, OnInit } from '@angular/core';
import { SocialAuthService, SocialUser } from 'angularx-social-login';
import { StatisticsService } from '../services/statistics-service';

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
  private user: SocialUser;
  statistics: StatisticsDTO[];
  displayedColumns: string[];

  constructor(private authService: SocialAuthService, private statisticsService: StatisticsService) {
    this.displayedColumns = ['wasCompleted', 'gameType', 'fieldSize', 'turnsCount', 'score', 'isWinner'];
  }

  ngOnInit(): void {
    this.authService.authState.subscribe((user) => {
      this.user = user;
      this.getUserStatistics();
    });
  }

  private getUserStatistics(): void {
    const curPlayer = this.user?.email ?? 'local player';
    this.statistics = this.statisticsService
      .getPlayerStatistics(curPlayer)
      .sort((game1, game2) => (game1.creatingDate < game2.creatingDate ? 1 : -1))
      .map((s) => {
        const player = s.playersStaistics?.find((ps) => ps.playerId === curPlayer);
        return <StatisticsDTO>{
          gameType: s.gameType,
          fieldSize: `${s.fieldSize.width} x ${s.fieldSize.height}`,
          turnsCount: player?.turnsCount ?? 0,
          score: player?.score ?? 0,
          isWinner: s.winnerPlayer === curPlayer,
          wasCompleted: !!s.winnerPlayer,
        };
      });
  }
}
