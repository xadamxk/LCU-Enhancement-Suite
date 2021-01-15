import { Model } from '../api';

export class LOLChatRank extends Model {
  'lol': {
    rankedLeagueQueue: string;
    rankedLeagueTier: string;
    rankedLeagueDivision: string;
  };
}
