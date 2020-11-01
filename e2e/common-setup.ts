import * as path from 'path';
import { Application } from 'spectron';

let electronPath = path.join(__dirname, '..', 'node_modules', '.bin', 'electron');

if (process.platform === 'win32') {
  electronPath += '.cmd';
}

export default function setup(): void {
  beforeEach(async function() {
    this.app = new Application({
      path: electronPath,
      args: [path.join(__dirname, '..')],
      webdriverOptions: {}
    });

    await this.app.start();
  });

  afterEach(async function() {
    if (this.app && this.app.isRunning()) {
      await this.app.stop();
    }
  });
}
