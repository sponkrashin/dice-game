import { Injectable } from '@angular/core';
import { Guid } from 'guid-typescript';
import { GameEngine, Size } from 'engine';

export class GameStatistics {
  playersStaistics: PlayerStaistics[];
  winnerPlayer: string;
  readonly creatingDate: Date;

  constructor(public gameGuid: string, public gameType: string, public fieldSize: Size, public startPlayer: string) {
    this.playersStaistics = [];
    this.creatingDate = new Date();
  }
}

export class PlayerStaistics {
  score: number;
  turnsCount: number;

  constructor(public playerId: string) {
    this.score = 0;
    this.turnsCount = 0;
  }
}

@Injectable()
export abstract class StatisticsService {
  abstract getAllStatistics(): GameStatistics[];
  abstract getGameStatistics(gameGuid: Guid): GameStatistics[];
  abstract getPlayerStatistics(playerId: string): GameStatistics[];

  abstract create(gameGuid: Guid, gameEngine: GameEngine, startPlayer: string): void;
  abstract saveTurn(gameGuid: Guid, playerId: string, score: number, turnsCount: number): void;
  abstract finish(gameGuid: Guid, winnerPlayer: string): void;
}
