import { BaseProvider, IProvider } from './BaseProvider';

export class MobalyticsProvider extends BaseProvider implements IProvider {
  baseUrl = 'https://mobalytics.gg';
  baseBuildPath = '/build';
  aramBuildPath = '/aram-builds';
  championMap = {
    20: 'nunu',
    62: 'monkeyking'
  };

  async buildUrl(championId: number): Promise<string> {
    // ex. https://mobalytics.gg/lol/champions/ahri/build
    // ex. https://mobalytics.gg/lol/champions/ahri/aram-builds
    const championName = await this.getChampionName(championId);
    return `${this.baseUrl}/lol/champions/${championName}` + this.getGameModeSuffix();
  }
}
