import { Guid } from 'guid-typescript';
import { StatisticsService, StatisticsData } from './statistics-service';
import { GameEngine } from 'engine';

export class LocalStatisticsService extends StatisticsService {
  private statisticsKey: string = 'statistics';

  getStatistics(gameGuid: Guid): StatisticsData {
    const allStats = this.getAllStatistics();
    if (allStats.length === 0) {
      throw new Error('Not any saved statistics data for this game.');
    }

    const stat = allStats.filter((s) => s.gameGuid === gameGuid.toString());
    if (!stat) {
      throw new Error(`Statistics for the game with id ${gameGuid.toString()} wasn't found.`);
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
      playerStat = new StatisticsData(gameGuid.toString(), player.playerId, player.score, 'single game', 0);
      allStats.push(playerStat);
    }
    localStorage.setItem(this.statisticsKey, JSON.stringify(allStats));
  }

  private getAllStatistics(): StatisticsData[] {
    const statistics = localStorage.getItem(this.statisticsKey);
    return statistics ? (JSON.parse(statistics) as StatisticsData[]) : [];
  }
}
