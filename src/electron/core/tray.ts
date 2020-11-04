import { Tray } from 'electron';
import * as path from 'path';
import { app } from './app';
import { menu } from './menu';
import { window } from './window';

let tray: Tray = null;

export { tray };

export function initTray(): void {
  tray = new Tray(path.join(app.getAppPath(), 'dist/electron/assets/icons/icon.png'));
  tray.setContextMenu(menu);

  tray.on('click', () => {
    if (window !== null && !window.isVisible()) {
      window.show();
    }
  });
}
