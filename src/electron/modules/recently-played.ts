import { Menu, MenuItem } from 'electron';
import { StatusCode } from '../../connector';
import { WebsocketModule } from '../api';
import { connection } from '../core';
import { Endpoints, GameflowPhase } from '../enums';
import { RecentlyPlayedSummoner } from '../models';
import { GameflowPhaseSubscription } from '../subscriptions';

export class RecentlyPlayedModule extends WebsocketModule {
  id = 'RecentlyPlayed';

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

      let summoners = json.map((summoner: RecentlyPlayedSummoner) => new RecentlyPlayedSummoner(summoner));

      // sort newest first
      summoners = summoners.sort((summonerA: RecentlyPlayedSummoner, summonerB: RecentlyPlayedSummoner) => summonerB.gameCreationDate.diff(summonerA.gameCreationDate));

      // keep newest duplicates
      summoners = summoners.filter((summoner: RecentlyPlayedSummoner, index: number) => {
        return summoners.findIndex((newestSummoner: RecentlyPlayedSummoner) => newestSummoner.summonerId === summoner.summonerId) === index;
      });

      // keep only the 20 most recent
      summoners = summoners.slice(0, 20);

      summoners.forEach((summoner: RecentlyPlayedSummoner) => {
        submenu.append(new MenuItem({
          label: summoner.summonerName,
          sublabel: `Seen: ${summoner.gameCreationDate.fromNow()}`,
          type: 'normal',
          click: async() => {
            const response = await connection.inviteSummoners(summoner.summonerId);
            console.log(response.status);
            const json = await response.json();
            console.log(json);
          }
        }));
      });

      menuItem.sublabel = '';
      this.updateMenu(menuItem);
    }
  }
}
