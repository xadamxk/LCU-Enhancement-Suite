import { MenuItem } from 'electron';
import { LeagueEvent } from '../../connector';
import { WebSocketModule } from '../api';
import { connection } from '../core';
import { Endpoints, PlayerResponse } from '../enums';
import { EOGData } from '../models';
import { EndOfGameSubscription } from '../subscriptions';

export class EndOfGameListenerModule extends WebSocketModule {
  id = 'EndOfGameListener';

  async register(): Promise<void> {
    connection.addSubscription(
      new EndOfGameSubscription((event) => {
        this.refresh(event);
      })
    );

    // const menuItem = new MenuItem({
    //   label: 'Auto-Accept Queue',
    //   type: 'checkbox',
    //   checked: this.checked,
    //   click: (menuItem) => {
    //     this.checked = menuItem.checked = !this.checked;
    //     this.storage.set('checked', this.checked);
    //   }
    // });
    // return this.updateMenu(menuItem);
  }

  async refresh(event: LeagueEvent = null): Promise<void> {
    console.log('In EOG Listener refresh:')
    console.log(event.eventType);
    console.log(event.uri);
    const endOfGame = new EOGData(event.data);
    console.log(endOfGame.gameId);

    // manipulate data?
  }

  // TODO:
  // 1. Fetch current league patch (ideally from client)
  // 2. Seperate data into new object for DynamoDB (Player table, and Game table)
}