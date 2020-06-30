import { Injectable } from '@angular/core';
import { Guid } from 'guid-typescript';
import { GameEngine } from 'engine';

export class StatisticsData {
  gameGuid: string;
  playerId: string;
  totalScore: number;
  gameType: string;
  finishedDate: Date;

  constructor(gameGuid: string, playerId: string, totalScore: number, gameType: string) {
    this.gameGuid = gameGuid;
    this.playerId = playerId;
    this.totalScore = totalScore;
    this.gameType = gameType;
    this.finishedDate = new Date();
  }
}

@Injectable()
export abstract class StatisticsService {
  abstract getStatistics(gameGuid: Guid, playerId: string): StatisticsData;
  abstract getGameStatistics(gameGuid: Guid): StatisticsData[];
  abstract getPlayerStatistics(playerId: string): StatisticsData[];
  abstract saveStatistics(gameGuid: Guid, gameEngine: GameEngine): void;
  abstract getAllStatistics(): StatisticsData[];
}
