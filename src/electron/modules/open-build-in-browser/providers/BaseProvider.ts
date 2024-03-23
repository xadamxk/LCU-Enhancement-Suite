import { LeagueConnection } from '../../../../connector';
import { CSChampion } from '../../../models';

export enum PROVIDERS {
  'Blitz' = 'Blitz',
  'Lolalytics' = 'Lolalytics',
  'Mobalytics' = 'Mobalytics',
  'OPGG' = 'OPGG',
  'UGG' = 'UGG',
}
// TODO: https://www.leagueofgraphs.com/
// TODO: https://www.metasrc.com/

export interface IProvider {
  baseUrl: string;
  baseBuildPath: string;
  aramBuildPath: string;
  championMap: Record<number, string>; // championId: provider champion name
  // eslint-disable-next-line @typescript-eslint/no-misused-new
  buildUrl(championId: number): Promise<string>;
  getChampionName(championId: number): Promise<string>;
}

export abstract class BaseProvider {
  abstract baseBuildPath: string;
  abstract aramBuildPath: string;
  abstract championMap: Record<number, string>;

  isAram: boolean;
  leagueConnection: LeagueConnection;

  constructor(leagueConnection: LeagueConnection, isAram: boolean) {
    this.leagueConnection = leagueConnection;
    this.isAram = isAram;
  }

  getGameModeSuffix(): string {
    return this.isAram ? this.aramBuildPath : this.baseBuildPath;
  }

  async getChampionName(championId: number): Promise<string> {
    // Check provider custom mapping
    if (this.championMap[championId]) {
      return this.championMap[championId];
    }

    // Check champion select champions mapping
    const champions: CSChampion[] = await (await this.leagueConnection.getChampionSelectChampions()).json();
    const champion = champions.find((champion) => champion.id === championId);

    if (champion) {
      return champion.name.toLowerCase();
    }

    throw new Error(`Champion with id ${championId} not found`);
  }

}







