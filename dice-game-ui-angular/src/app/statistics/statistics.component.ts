import { Component, OnInit } from '@angular/core';

import { StatisticsData, StatisticsService } from '../services/statistics-service';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss'],
})
export class StatisticsComponent implements OnInit {
  statistics: StatisticsData[];
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
      .sort((game1, game2) => (game1.finishedDate < game2.finishedDate ? 1 : -1));
  }
}
