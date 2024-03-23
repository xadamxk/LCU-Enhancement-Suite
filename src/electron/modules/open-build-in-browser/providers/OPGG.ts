import { BaseProvider, IProvider } from './BaseProvider';

export class OPGGProvider extends BaseProvider implements IProvider {
  baseUrl = 'https://www.op.gg';
  baseBuildPath = '/build';
  aramBuildPath = '/aram';
  championMap = {
    20: 'nunu'
  };

  async buildUrl(championId: number): Promise<string> {
    // ex. https://www.op.gg/champions/nunu/build
    // ex. https://www.op.gg/modes/aram/nunu/build
    const championName = await this.getChampionName(championId);
    if (this.isAram) {
      return `${this.baseUrl}/modes/aram/${championName}/build`;
    }
    return `${this.baseUrl}/champions/${championName}/build`;
  }
}
