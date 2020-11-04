import { BrowserWindow, protocol, screen } from 'electron';
import * as path from 'path';
import * as url from 'url';
import { app } from './app';

let window: BrowserWindow = null;

export { window };

const args = process.argv.slice(1);
const live = args.some(val => val === '--live');

export function initWindow(): void {
  const size = screen.getPrimaryDisplay().workAreaSize;
  const width = Math.min(800, size.width);
  const height = Math.min(600, size.height);

  window = new BrowserWindow({
    x: (size.width - width) / 2,
    y: (size.height - height) / 2,
    width: width,
    height: height,
    webPreferences: {
      nodeIntegration: true,
      allowRunningInsecureContent: live,
    },
  });

  // Set icon when running developmentally.
  if (!app.isPackaged) {
    window.setIcon(path.join(app.getAppPath(), 'dist', 'electron', 'assets', 'icons', 'icon.png'));
  }

  if (live) {
    window.loadURL('http://localhost:4200');
  } else {
    window.loadURL(url.format({
      pathname: path.join(app.getAppPath(), 'dist/angular/index.html'),
      protocol: 'file:',
      slashes: true
    }));

    // Fix refreshing.
    protocol.interceptFileProtocol('file', (req, callback) => {
      let filePath = url.fileURLToPath(req.url);
      const relativePath = path.relative(path.join(app.getAppPath(), 'dist/angular'), filePath);

      if (relativePath && !relativePath.startsWith('..') && !path.isAbsolute(relativePath)) {
        if (path.extname(filePath) === '') {
          filePath = path.join(app.getAppPath(), 'dist/angular/index.html');
        }
      }

      callback(path.normalize(filePath));
    });
  }

  window.on('minimize', (event: Event) => {
    event.preventDefault();
    window.hide();
  });

  // Emitted when the window is closed.
  window.on('closed', () => {
    // Dereference the window object, usually you would store window
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    window = null;
  });
}
