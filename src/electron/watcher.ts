import * as chokidar from 'chokidar';
import * as spawn from 'cross-spawn';
import * as path from 'path';
import * as pstree from 'ps-tree';

let buildProcess = null;
let electronProcess = null;
let killCallback = null;

function runBuildProcess(): Promise<boolean> {
  return new Promise((resolve, reject) => {
    buildProcess = spawn('npm', ['run', 'electron:build'], { stdio: 'inherit' });

    buildProcess.on('exit', (code: number, signal: string) => {
      buildProcess = null;

      if (code === 0) {
        resolve(true);
      } else if (signal !== null) {
        console.log('Killed build process.');

        if (killCallback !== null) {
          killCallback();
          killCallback = null;
          resolve(false);
        } else {
          reject(signal);
        }
      } else {
        reject(code);
      }
    });
  });
}

function runElectronProcess(): Promise<boolean> {
  return new Promise((resolve, reject) => {
    electronProcess = spawn('npm', ['run', 'electron', '.'], { stdio: 'inherit' });

    electronProcess.on('exit', (code: number, signal: string) => {
      electronProcess = null;

      if (code === 0) {
        resolve(true);
      } else if (signal !== null) {
        console.log('Killed electron process.');

        if (killCallback !== null) {
          killCallback();
          killCallback = null;
          resolve(false);
        } else {
          reject(signal);
        }
      } else {
        reject(code);
      }
    });
  });
}

async function start(): Promise<boolean> {
  if (await runBuildProcess()) {
    return await runElectronProcess();
  }

  return false;
}

async function stop(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (buildProcess !== null && !buildProcess.killed) {
      console.log('Killing build process.');

      killCallback = resolve;
      buildProcess.kill();
    } else if (electronProcess !== null && !electronProcess.killed) {
      console.log('Killing electron process.');

      pstree(electronProcess.pid, (error, children) => {
        if (error === null) {
          children.map(child => child.PID).forEach(pid => {
            process.kill(Number(pid));
          });

          killCallback = resolve;
          electronProcess.kill();
        } else {
          reject(error);
        }
      });
    } else {
      console.log('No process to kill.');
      resolve();
    }
  });
}

function finish(finished: boolean): void {
  if (finished) {
    process.exit();
  }
}

const watcher = chokidar.watch(path.join(__dirname, 'electron', '**', '*.ts'), { ignored: [__filename] });

watcher.on('change', (path: string) => {
  console.log(`Change at ${path}.`);

  stop().then(start).then(finish);
});

start().then(finish);
