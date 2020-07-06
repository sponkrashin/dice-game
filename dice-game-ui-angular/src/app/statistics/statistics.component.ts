import { Component, OnInit } from '@angular/core';

import { GameStatistics, StatisticsService } from '../services/statistics-service';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss'],
})
export class StatisticsComponent implements OnInit {
  statistics: GameStatistics[];
  displayedColumns: string[];

  constructor(private statisticsService: StatisticsService) {
    this.displayedColumns = ['playerId', 'gameType', 'score'];
  }

  ngOnInit(): void {
    this.getAllStatistics();
  }

  private getAllStatistics() {
    this.statistics = this.statisticsService
      .getAllStatistics()
      .sort((game1, game2) => (game1.creatingDate < game2.creatingDate ? 1 : -1));
  }
}
