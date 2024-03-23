import { BaseProvider, IProvider } from './BaseProvider';

export class LolalyticsProvider extends BaseProvider implements IProvider {
  baseUrl = 'https://lolalytics.com';
  baseBuildPath = '/build';
  aramBuildPath = '/aram/build';
  championMap = {
    20: 'nunu'
  };

  async buildUrl(championId: number): Promise<string> {
    // ex. https://lolalytics.com/lol/nunu/build/
    // ex. https://lolalytics.com/lol/nunu/aram/build/
    const championName = await this.getChampionName(championId);
    return `${this.baseUrl}/lol/${championName}` + this.getGameModeSuffix();

  }
}
