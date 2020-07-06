import { Injectable } from '@angular/core';
import { Guid } from 'guid-typescript';
import { GameEngine, Size } from 'engine';

export class GameStatistics {
  readonly creatingDate: Date;
  playersStaistics: PlayerStaistics[];
  public winnerPlayer: string;

  constructor(public gameGuid: string, public gameType: string, public fieldSize: Size, public startPlayer: string) {
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

  saveTurn(gameGuid: Guid, playerId: string, score: number, turnsCount: number, winnerPlayer: string = null): void {
    throw new Error('The method was not implemented');
  }
}
