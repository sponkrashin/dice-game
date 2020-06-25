import { Guid } from 'guid-typescript';
import { StatisticsService, StatisticsData } from './statistics-service';
import { GameEngine } from 'engine';

export class LocalStatisticsService extends StatisticsService {
  private statisticsKey = 'statistics';

  getStatistics(gameGuid: Guid, playerId: string): StatisticsData {
    const allStats = this.getAllStatistics();
    if (allStats.length === 0) {
      throw new Error('Not any saved statistics data for this game.');
    }

    const stat = allStats.filter((s) => s.gameGuid === gameGuid.toString() && s.playerId === playerId);
    if (!stat) {
      throw new Error(
        `Statistics for the game with id ${gameGuid.toString()} and player with id ${playerId} wasn't found.`
      );
    }

    return stat[0];
  }

  saveStatistics(gameGuid: Guid, gameEngine: GameEngine): void {
    if (!gameGuid) {
      throw new Error('The game guid is empty');
    }
    const allStats = this.getAllStatistics();
    const gameStats = allStats.filter((s) => s.gameGuid === gameGuid.toString());
    for (const player of gameEngine.players) {
      let playerStat = gameStats.find((statPlayer) => statPlayer.playerId === player.playerId);
      if (playerStat) {
        throw new Error(
          `Statistics for the game with id ${gameGuid.toString()} and the player with id ${
            player.playerId
          } was already saved.`
        );
      }
      playerStat = new StatisticsData(
        gameGuid.toString(),
        player.playerId,
        player.score,
        `Single game ${gameEngine.fieldSize.width} x ${gameEngine.fieldSize.height}`
      );
      allStats.push(playerStat);
    }
    localStorage.setItem(this.statisticsKey, JSON.stringify(allStats));
  }

  getAllStatistics(): StatisticsData[] {
    const statistics = localStorage.getItem(this.statisticsKey);
    return statistics ? (JSON.parse(statistics) as StatisticsData[]) : [];
  }
}
