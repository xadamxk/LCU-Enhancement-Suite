import { MenuItem } from 'electron';
import { LeagueEvent } from '../../connector';
import { WebSocketModule } from '../api';
import { connection } from '../core';
import { Endpoints, PlayerResponse } from '../enums';
import { ReadyCheck } from '../models';
import { ReadyCheckSubscription } from '../subscriptions';

export class AutoAcceptQueueModule extends WebSocketModule {
  id = 'AutoAcceptQueue';
  checked = this.storage.get('checked', true);

  async register(): Promise<void> {
    connection.addSubscription(
      new ReadyCheckSubscription((event) => {
        this.refresh(event);
      })
    );

    const menuItem = new MenuItem({
      label: 'Auto-Accept Queue',
      type: 'checkbox',
      checked: this.checked,
      click: (menuItem) => {
        this.checked = menuItem.checked = !this.checked;
        this.storage.set('checked', this.checked);
      }
    });

    return this.updateMenu(menuItem);
  }

  async refresh(event: LeagueEvent = null): Promise<void> {
    const readyCheck = new ReadyCheck(event.data);

    if (readyCheck.playerResponse === PlayerResponse.NONE) {
      const response = await connection.post(Endpoints.READY_CHECK_ACCEPT);
      console.log(response.status);
      const json = await response.json();
      console.log(json);
    }
  }
}
