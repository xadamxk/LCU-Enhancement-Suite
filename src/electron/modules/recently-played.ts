import { Menu, MenuItem } from 'electron';
import { StatusCode } from '../../connector';
import { WebSocketModule } from '../api';
import { connection } from '../core';
import { Endpoints, GameflowPhase } from '../enums';
import { RecentlyPlayedSummoner, CSChampion } from '../models';
import { GameflowPhaseSubscription } from '../subscriptions';

export class RecentlyPlayedModule extends WebSocketModule {
  id = 'RecentlyPlayed';
  recentSummonerLimit = 18;

  async register(): Promise<void> {
    // TODO: Add subscription for call when client initially loads friends (ie. signing into different account)
    connection.addSubscription(
      new GameflowPhaseSubscription(() => {
        this.refresh();
      }, GameflowPhase.PRE_END_OF_GAME)
    );

    return this.refresh();
  }

  async refresh(): Promise<void> {
    const submenu = new Menu();

    const menuItem = new MenuItem({
      label: 'Recently Played',
      sublabel: 'Updating...',
      submenu: submenu
    });

    const champions: CSChampion[] = await (await connection.getChampionSelectChampions()).json();

    await this.updateMenu(menuItem);

    const response = await connection.get(Endpoints.RECENTLY_PLAYED_SUMMONERS);

    if (response.status === StatusCode.OK) {
      const json: RecentlyPlayedSummoner[] = await response.json();

      const summoners = json.map((summoner: RecentlyPlayedSummoner) => new RecentlyPlayedSummoner(summoner));

      // sort newest first
      const sortedSummoners = summoners.sort((summonerA: RecentlyPlayedSummoner, summonerB: RecentlyPlayedSummoner) => summonerB.gameCreationDate.diff(summonerA.gameCreationDate));

      // keep newest duplicates
      const uniqueSummoners = sortedSummoners.filter((summoner: RecentlyPlayedSummoner, index: number) => {
        return sortedSummoners.findIndex((newestSummoner: RecentlyPlayedSummoner) => newestSummoner.summonerId === summoner.summonerId) === index;
      }).slice(0, this.recentSummonerLimit);

      // group summoners by game
      const summonersByGame = uniqueSummoners.reduce((summonersByGame: Record<number, RecentlyPlayedSummoner[]>, summoner: RecentlyPlayedSummoner) => {
        summonersByGame[summoner.gameId] = summonersByGame[summoner.gameId] || [];
        summonersByGame[summoner.gameId].push(summoner);
        return summonersByGame;
      }, {});

      // reverse order of games to show most recent game first
      Object.keys(summonersByGame).reverse().forEach((gameId, index, reversedGameIds) => {
        const summoners: RecentlyPlayedSummoner[] = summonersByGame[gameId];
        submenu.append(new MenuItem({
          label: `Game #${gameId}`,
          sublabel: `${summoners[0].gameCreationDate.fromNow()}`,
          enabled: false
        }));
        let previousTeamId = -1;
        // append each unique player in game
        const sortedSummoners = summoners.sort((summonerA: RecentlyPlayedSummoner, summonerB: RecentlyPlayedSummoner) => summonerA.teamId - summonerB.teamId);
        sortedSummoners.forEach((summoner: RecentlyPlayedSummoner) => {
          const championNameMatch = champions.filter((champion: CSChampion) => {
            return champion.id == summoner.championId;
          });
          if (previousTeamId !== summoner.teamId) {
            previousTeamId = summoner.teamId;
            const currentSummonerTeamId = summoner.teamId;
            const currentSummonerTeammates = sortedSummoners.filter((summoner: RecentlyPlayedSummoner) => summoner.teamId === currentSummonerTeamId);
            const teamLabel = currentSummonerTeammates.length === 5 ? 'Enemy' : 'Ally';
            const sideName = summoner.teamId === 100 ? 'Blue' : 'Red';
            submenu.append(new MenuItem({
              label: `${teamLabel} Team`,
              sublabel: `${sideName} Side`,
              click: async() => {
                for (const teammate of currentSummonerTeammates) {
                  await connection.inviteSummoners(teammate.summonerId);
                }
              }
            }));
          }

          const championName = championNameMatch ? championNameMatch[0].name : 'N/A';

          submenu.append(new MenuItem({
            label: `  ${championName}`,
            sublabel: `  ${summoner.summonerName}`,
            click: async() => {
              await connection.inviteSummoners(summoner.summonerId);
            }
          }));
        });

        // append separator between games
        if (index + 1 < reversedGameIds.length) {
          submenu.append(new MenuItem({
            type: 'separator'
          }));
        }
      });

      menuItem.sublabel = '';
      return this.updateMenu(menuItem);
    } else {
      menuItem.sublabel = 'Failed to Load';
      return this.updateMenu(menuItem);
    }
  }

  private async getChampionIcon(championId: number): Promise<string> {
    const championIcon = await connection.getChampionIcon(championId);
    return championIcon.url;
  }
}
