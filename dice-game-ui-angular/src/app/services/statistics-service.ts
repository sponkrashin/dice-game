import { Injectable } from '@angular/core';
import { Guid } from 'guid-typescript';
import { GameEngine } from 'engine';

export class StatisticsData {
  gameGuid: string;
  playerId: string;
  totalScore: number;
  gameType: string;
  gameTimeSecs: number;

  constructor(gameGuid: string, playerId: string, totalScore: number, gameType: string, gameTimeSecs: number) {
    this.gameGuid = gameGuid;
    this.playerId = playerId;
    this.totalScore = totalScore;
    this.gameType = gameType;
    this.gameTimeSecs = gameTimeSecs;
  }
}

@Injectable()
export abstract class StatisticsService {
  abstract getStatistics(gameGuid: Guid): StatisticsData;
  abstract saveStatistics(gameGuid: Guid, gameEngine: GameEngine): void;
}
