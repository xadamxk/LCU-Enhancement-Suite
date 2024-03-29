import { Menu, MenuItem, shell } from 'electron';
import { WebSocketModule } from '../../api';
import { connection } from '../../core';
import { CSCurrentChampionSubscription, TBCurrentChampionSubscription } from '../../subscriptions';
import { BlitzProvider, IProvider, LolalyticsProvider, MobalyticsProvider, OPGGProvider, PROVIDERS, UGGProvider } from './providers';
import { GameModes } from '../../enums';
import { LOLLobbyV2Lobby } from '../../models';

const SETTINGS_KEY = 'openIn';

export class OpenBuildInBrowserModule extends WebSocketModule {
  id = 'OpenBuildInBrowser';
  checked = this.storage.get(SETTINGS_KEY, '');
  mostRecentChampionId = 0;

  async register(): Promise<void> {
    this.refresh();
    connection.addSubscription(
      new TBCurrentChampionSubscription((event) => {
        const championId = event.data;
        this.onLockIn(championId);
      })
    );

    connection.addSubscription(
      new CSCurrentChampionSubscription((event) => {
        const championId = event.data;
        this.onLockIn(championId);
      })
    );

    const submenu = new Menu();
    // None - default
    submenu.append(
      new MenuItem({
        label: 'None',
        type: 'radio',
        click: () => {
          this.storage.set(SETTINGS_KEY, '');
        }
      })
    );

    // Providers
    for (const provider in PROVIDERS) {
      submenu.append(
        new MenuItem({
          label: `${provider}`,
          type: 'radio',
          click: () => {
            this.storage.set(SETTINGS_KEY, provider.toString());
          }
        })
      );
    }

    const menuItem = new MenuItem({
      label: 'Open Build In...',
      submenu: submenu
    });

    return this.updateMenu(menuItem);
  }

  async refresh(): Promise<void> {
    // Not yet implemented
  }

  async onLockIn(championId: number): Promise<void> {
    // Prevent multiple calls
    if (this.mostRecentChampionId === championId) return;
    this.mostRecentChampionId = championId;

    // Prevent lock in with no champion
    if (championId === 0 || championId === null) return;

    // Get provider from settings
    const openInKey = this.storage.get(SETTINGS_KEY, '');
    if (openInKey === '') return;

    // Get game mode from lobby
    const lobbyData: LOLLobbyV2Lobby = await (await connection.getLobbyV2Lobby()).json();
    const isAram = lobbyData.gameConfig.gameMode === GameModes.ARAM;

    // Initialize provider
    let provider: IProvider;
    switch (openInKey) {
      default:
      case PROVIDERS.Mobalytics:
        provider = new MobalyticsProvider(connection, isAram);
        break;
      case PROVIDERS.Blitz:
        provider = new BlitzProvider(connection, isAram);
        break;
      case PROVIDERS.OPGG:
        provider = new OPGGProvider(connection, isAram);
        break;
      case PROVIDERS.Lolalytics:
        provider = new LolalyticsProvider(connection, isAram);
        break;
      case PROVIDERS.UGG:
        provider = new UGGProvider(connection, isAram);
        break;
    }

    const url = await provider.buildUrl(championId);
    shell.openExternal(url);
  }
}
