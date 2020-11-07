import { app } from 'electron';
import { connection, initConnection } from './connection';
import { initMenu, menu } from './menu';
import { initTray, tray } from './tray';
import { initWindow, window } from './window';

export { app };

declare module 'electron' {
  interface App {
    initialized: boolean;
    init(trayOnly: boolean): void;
    on(event: 'init-finished', listener: (event: Event) => void): this;
    on(event: 'init-error', listener: (event: Event) => void): this;
    once(event: 'init-finished', listener: (event: Event) => void): this;
    once(event: 'init-error', listener: (event: Event) => void): this;
    addListener(event: 'init-finished', listener: (event: Event) => void): this;
    addListener(event: 'init-error', listener: (event: Event) => void): this;
    removeListener(event: 'init-finished', listener: (event: Event) => void): this;
    removeListener(event: 'init-error', listener: (event: Event) => void): this;
  }
}

app.initialized = false;

app.init = (trayOnly): void => {
  if (!app.initialized) {
    app.allowRendererProcessReuse = true;

    // This method will be called when Electron has finished
    // initialization and is ready to create browser windows.
    // Some APIs can only be used after this event occurs.
    // Added 400 ms to fix the black background issue while using transparent window. More detais at https://github.com/electron/electron/issues/15947
    app.on('ready', () => {
      try {
        if (connection === null) {
          initConnection();
        }

        if (tray === null) {
          if (menu === null) {
            initMenu();
          }

          initTray();
        }

        if (!trayOnly && window === null) {
          initWindow();
        }

        app.emit('init-finished');
      } catch (error) {
        app.emit('init-error', error);
      }
    });

    // Quit when all windows are closed.
    app.on('window-all-closed', () => {
      // On OS X it is common for applications and their menu bar
      // to stay active until the user quits explicitly with Cmd + Q
      if (process.platform !== 'darwin') {
        app.quit();
      }
    });

    app.on('activate', () => {
      // On OS X it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (!trayOnly && window === null) {
        initWindow();
      }
    });

    app.initialized = true;
  }
};
