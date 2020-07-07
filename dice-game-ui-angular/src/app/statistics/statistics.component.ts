import { Component, OnInit } from '@angular/core';

import { GameStatistics, StatisticsService } from '../services/statistics-service';

export class StatisticsDTO {
  constructor(
    public gameType: string,
    public fieldSize: string,
    public turnsCount: number,
    public score: number,
    public isWinner: boolean
  ) {}
}

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss'],
})
export class StatisticsComponent implements OnInit {
  statistics: StatisticsDTO[];
  displayedColumns: string[];

  constructor(private statisticsService: StatisticsService) {
    this.displayedColumns = ['gameType', 'fieldSize', 'turnsCount', 'score', 'isWinner'];
  }

  ngOnInit(): void {
    this.getAllStatistics();
  }

  private getAllStatistics() {
    const curPlayer = 'local player';
    this.statistics = this.statisticsService
      .getPlayerStatistics(curPlayer)
      .sort((game1, game2) => (game1.creatingDate < game2.creatingDate ? 1 : -1))
      .map(
        (s) =>
          new StatisticsDTO(
            s.gameType,
            `${s.fieldSize.width} x ${s.fieldSize.height}`,
            s.playersStaistics?.find((ps) => ps.playerId === curPlayer)?.score ?? 0,
            s.playersStaistics?.find((ps) => ps.playerId === curPlayer)?.turnsCount ?? 0,
            s.winnerPlayer === curPlayer
          )
      );
  }
}
