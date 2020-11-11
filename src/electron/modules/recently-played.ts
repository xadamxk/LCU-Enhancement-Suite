import { Menu, MenuItem } from 'electron';
import { StatusCode } from '../../connector';
import { WebSocketModule } from '../api';
import { connection } from '../core';
import { Endpoints, GameflowPhase } from '../enums';
import { RecentlyPlayedSummoner } from '../models';
import { GameflowPhaseSubscription } from '../subscriptions';

export class RecentlyPlayedModule extends WebSocketModule {
  id = 'RecentlyPlayed';
  recentSummonerLimit = 20;

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

    this.updateMenu(menuItem);

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
        // append each unique player in game
        summonersByGame[gameId].forEach((summoner: RecentlyPlayedSummoner) => {
          submenu.append(new MenuItem({
            label: summoner.summonerName,
            sublabel: `Played: ${summoner.gameCreationDate.fromNow()}`,
            click: async() => {
              const response = await connection.inviteSummoners(summoner.summonerId);
              console.log(response.status);
              const json = await response.json();
              console.log(json);
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
      this.updateMenu(menuItem);
    }
  }
}
