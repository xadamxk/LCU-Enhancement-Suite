import { MenuItem } from 'electron';
import { LeagueEvent } from '../../connector';
import { insertMenuItem } from '../core/menu';

export abstract class Module {
  abstract id: string;
  abstract async register(): Promise<void>;

  async updateMenu(menuItem: MenuItem): Promise<void> {
    menuItem.id = this.id;
    return insertMenuItem(menuItem);
  }
}

export abstract class WebsocketModule extends Module {
  abstract async refresh(event: LeagueEvent): Promise<void>;
}
