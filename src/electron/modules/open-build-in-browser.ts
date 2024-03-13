import { Menu, MenuItem } from 'electron';
import { WebSocketModule } from '../api';

enum providers {
  'Mobalytics' = 'Mobalytics'
}

export class OpenBuildInBrowserModule extends WebSocketModule {
  id = 'OpenBuildInBrowser';
  checked = this.storage.get('openIn', '');

  async register(): Promise<void> {
    const submenu = new Menu();
    // None - default
    submenu.append(
      new MenuItem({
        label: 'None',
        type: 'radio',
        click: async() => {
          this.storage.set('openIn', '');
        }
      })
    );

    // Providers
    for (const provider in providers) {
      submenu.append(
        new MenuItem({
          label: `${provider}`,
          type: 'radio',
          click: async() => {
            this.storage.set('openIn', provider.toString());
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
    //
  }
}
