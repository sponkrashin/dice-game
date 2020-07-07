import { Guid } from 'guid-typescript';
import { GameEngine, SimpleGameEngine } from 'engine';
import { StatisticsService, GameStatistics, PlayerStaistics } from './statistics-service';


export class LocalStatisticsService extends StatisticsService {
  private statisticsKey = 'statistics';

  getAllStatistics(): GameStatistics[] {
    const statistics = localStorage.getItem(this.statisticsKey);
    return statistics ? (JSON.parse(statistics) as GameStatistics[]) : [];
  }

  getGameStatistics(gameGuid: Guid): GameStatistics[] {
    const allStats = this.getAllStatistics();
    if (allStats.length === 0) {
      throw new Error('Not any saved statistics data for this game.');
    }

    const stats = allStats.filter((s) => s.gameGuid === gameGuid.toString());
    if (stats.length === 0) {
      throw new Error(`Statistics for the game with id ${gameGuid.toString()} and wasn't found.`);
    }

    return stats;
  }

  getPlayerStatistics(playerId: string): GameStatistics[] {
    const allStats = this.getAllStatistics();
    if (allStats.length === 0) {
      throw new Error('Not any saved statistics data for this game.');
    }

    const stats = allStats.filter(
      (s) =>
        s.startPlayer === playerId ||
        s.winnerPlayer === playerId ||
        s.playersStaistics.find((p) => p.playerId === playerId)
    );
    if (stats.length === 0) {
      throw new Error(`Statistics for the player with id ${playerId} wasn't found.`);
    }

    return stats;
  }

  create(gameGuid: Guid, gameEngine: GameEngine, startPlayer: string): void {
    if (!gameGuid) {
      throw new Error('The game guid is empty');
    }
    if (!gameEngine) {
      throw new Error('The game engine is empty');
    }
    if (!startPlayer) {
      throw new Error('The initial player is empty');
    }
    const allStats = this.getAllStatistics();
    const gameStats = allStats.find((s) => s.gameGuid === gameGuid.toString());
    if (gameStats) {
      throw new Error('This game was already created');
    }

    const gameType = gameEngine instanceof SimpleGameEngine ? 'Single game' : 'Unkhown type';

    const newGameStat = new GameStatistics(gameGuid.toString(), gameType, gameEngine.fieldSize, startPlayer);
    allStats.push(newGameStat);
    localStorage.setItem(this.statisticsKey, JSON.stringify(allStats));
  }

  saveTurn(gameGuid: Guid, playerId: string, score: number, turnsCount: number): void {
    if (!gameGuid) {
      throw new Error('The game guid is empty');
    }
    if (!playerId) {
      throw new Error('The player id is empty');
    }
    if (score < 1) {
      throw new Error('The score should be more then zero');
    }

    const allStats = this.getAllStatistics();
    if (allStats.length === 0) {
      throw new Error('Not any saved statistics data for this game.');
    }

    const gameStat = allStats.find((sg) => sg.gameGuid === gameGuid.toString());
    if (!gameStat) {
      throw new Error(`Statistics for the game with id ${gameGuid.toString()} and wasn't found.`);
    }

    let playerStat = gameStat.playersStaistics.find((p) => p.playerId);
    if (!playerStat) {
      playerStat = new PlayerStaistics(playerId);
      gameStat.playersStaistics.push(playerStat);
    }
    playerStat.score = score;
    playerStat.turnsCount = turnsCount;
    localStorage.setItem(this.statisticsKey, JSON.stringify(allStats));
  }

  finish(gameGuid: Guid, winnerPlayer: string): void {
    if (!gameGuid) {
      throw new Error('The game guid is empty');
    }
    if (!winnerPlayer) {
      throw new Error('The player id is empty');
    }

    const allStats = this.getAllStatistics();
    if (allStats.length === 0) {
      throw new Error('Not any saved statistics data for this game.');
    }

    const gameStat = allStats.find((sg) => sg.gameGuid === gameGuid.toString());
    if (!gameStat) {
      throw new Error(`Statistics for the game with id ${gameGuid.toString()} and wasn't found.`);
    }
    gameStat.winnerPlayer = winnerPlayer;
    localStorage.setItem(this.statisticsKey, JSON.stringify(allStats));
  }
}
