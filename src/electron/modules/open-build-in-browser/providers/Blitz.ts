import { BaseProvider, IProvider } from './BaseProvider';
import { capitalizeStr } from '../utils';

export class BlitzProvider extends BaseProvider implements IProvider {
  baseUrl = 'https://blitz.gg';
  baseBuildPath = '/build';
  aramBuildPath = '/aram';
  championMap = {
    20: 'nunu',
    62: 'monkeyking'
  };

  async buildUrl(championId: number): Promise<string> {
    // ex. https://blitz.gg/lol/champions/Janna/build
    // ex. https://blitz.gg/lol/champions/Janna/aram
    const championName = await this.getChampionName(championId);
    return `${this.baseUrl}/lol/champions/${capitalizeStr(championName)}` + this.getGameModeSuffix();
  }
}
