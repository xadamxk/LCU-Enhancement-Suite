import { MenuItem } from 'electron';
import * as ElectronStore from 'electron-store';
import { LeagueEvent } from '../../connector';
import { insertMenuItem } from '../core/menu';

const store = new ElectronStore();

export abstract class Module {
  abstract id: string;
  abstract async register(): Promise<void>;

  async updateMenu(menuItem: MenuItem): Promise<void> {
    menuItem.id = this.id;
    return insertMenuItem(menuItem);
  }

  storage = {
    get: <T>(key: string, defaultValue: T = undefined): T => {
      return store.get(`${this.id}.${key}`, defaultValue) as T;
    },

    set: <T>(key: string, value: T): void => {
      store.set(`${this.id}.${key}`, value);
    },

    clear: (): void => {
      store.delete(this.id);
    }
  };
}

export abstract class WebsocketModule extends Module {
  abstract async refresh(event: LeagueEvent): Promise<void>;
}
