import { Menu, MenuItem } from 'electron';
import { StatusCode } from '../../connector';
import { WebsocketModule } from '../api';
import { connection } from '../core';
import { Endpoints, GameflowPhase } from '../enums';
import { RecentlyPlayedSummoner } from '../models';
import { GameflowPhaseSubscription } from '../subscriptions';

export class RecentlyPlayedModule extends WebsocketModule {
  id = 'RecentlyPlayed';
  recentSummonerLimit = 20;

  async register(): Promise<void> {
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
      const orderedSummoners = summoners.sort((summonerA: RecentlyPlayedSummoner, summonerB: RecentlyPlayedSummoner) => summonerB.gameCreationDate.diff(summonerA.gameCreationDate));

      // keep newest duplicates
      const uniqueSummoners = orderedSummoners.filter((summoner: RecentlyPlayedSummoner, index: number) => {
        return orderedSummoners.findIndex((newestSummoner: RecentlyPlayedSummoner) => newestSummoner.summonerId === summoner.summonerId) === index;
      }).slice(0, this.recentSummonerLimit);

      // create object by game id
      const summonersByGame = uniqueSummoners.reduce((acc, post) => {
        const gameId = post.gameId;
        if (gameId in acc) {
          acc[gameId].push(post);
        } else {
          acc[gameId] = [post];
        }
        return { ...acc };
      }, {});

      // Append each unique player to recently played menu
      // Reverse order of games to show most recent first
      Object.entries(summonersByGame).reverse().map((playersByGame, index) => {
        const gameEntry = <RecentlyPlayedSummoner[]>playersByGame[1];

        gameEntry.forEach((summoner) => {
          submenu.append(new MenuItem({
            label: summoner.summonerName,
            sublabel: `Played: ${summoner.gameCreationDate.fromNow()}`,
            type: 'normal',
            click: async () => {
              const response = await connection.inviteSummoners(summoner.summonerId);
              console.log(response.status);
              const json = await response.json();
              console.log(json);
            }
          }));
        });
        // Append separator between games
        // Exclude separator at end of menu
        if (index + 1 < Object.keys(summonersByGame).length) {
          submenu.append(new MenuItem({
            type: 'separator',
          }));
        }
      });

      menuItem.sublabel = '';
      this.updateMenu(menuItem);
    }
  }
}
