import { BaseProvider, IProvider } from './BaseProvider';

export class UGGProvider extends BaseProvider implements IProvider {
    baseUrl = 'https://u.gg';
    baseBuildPath = '';
    aramBuildPath = '';
    championMap = {
        20: 'nunu'
    };

    async buildUrl(championId: number): Promise<string> {
        // ex. https://u.gg/lol/champions/wukong/build
        // ex. https://u.gg/lol/champions/aram/wukong-aram
        const championName = await this.getChampionName(championId);
        if (this.isAram) {
            return `${this.baseUrl}/lol/champions/aram/${championName}-aram`;
        }
        return `${this.baseUrl}/lol/champions/${championName}/build`;
    }
}
