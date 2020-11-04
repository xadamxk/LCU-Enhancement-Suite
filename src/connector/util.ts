import * as cp from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { ClientNotFoundError, CredentialsNotFoundError } from './exceptions';

export function readLockfile(): string {
  const re = process.platform === 'win32' ? /"--install-directory=(.*?)"/ : /--install-directory=(.*?)( --|\n|$)/;
  const cmd = process.platform === 'win32' ? 'WMIC PROCESS WHERE name=\'LeagueClientUx.exe\' GET CommandLine' : 'ps x -o args | grep \'LeagueClientUx\'';

  const result = cp.execSync(cmd, { encoding: 'utf8', stdio: 'pipe' });
  const [, installDirectory] = re.exec(result) || [];

  if (installDirectory !== undefined) {
    const lockfile = path.join(installDirectory, 'lockfile');

    if (fs.existsSync(lockfile)) {
      return fs.readFileSync(lockfile, { encoding: 'utf8' });
    } else {
      throw new CredentialsNotFoundError();
    }
  } else {
    throw new ClientNotFoundError();
  }
}
