import { MenuItem } from 'electron';
import { LeagueEvent } from '../../connector';
import { WebSocketModule } from '../api';
import { connection } from '../core';
import { Endpoints, PlayerResponse } from '../enums';
import { ReadyCheck } from '../models';
import { ReadyCheckSubscription } from '../subscriptions';

const SETTINGS_KEY = 'isAutoAcceptQueueEnabled';

export class AutoAcceptQueueModule extends WebSocketModule {
  id = 'AutoAcceptQueue';
  enabled = this.storage.get(SETTINGS_KEY, false);

  async register(): Promise<void> {
    connection.addSubscription(
      new ReadyCheckSubscription((event) => {
        if (this.storage.get(SETTINGS_KEY)) {
          this.refresh(event);
        }
      })
    );

    const menuItem = new MenuItem({
      label: 'Auto-Accept Queue',
      type: 'checkbox',
      checked: this.enabled,
      click: (menuItem) => {
        this.enabled = menuItem.checked = !this.enabled;
        this.storage.set(SETTINGS_KEY, this.enabled);
      }
    });

    return this.updateMenu(menuItem);
  }

  async refresh(event: LeagueEvent = null): Promise<void> {
    const readyCheck = new ReadyCheck(event.data);

    if (readyCheck.playerResponse === PlayerResponse.NONE) {
      await connection.post(Endpoints.READY_CHECK_ACCEPT);
    }
  }
}
