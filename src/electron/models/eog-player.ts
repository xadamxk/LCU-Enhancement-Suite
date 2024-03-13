import { Model } from '../api';
import { EOGStats } from './eog-stats';

export class EOGPlayer extends Model {
  'botPlayer': boolean;
  'championId': number;
  'detectedTeamPosition': string;
  'elo': number;
  'eloChange': number;
  'gameId': number;
  'isReportingDisabled': false;
  'items': number[];
  'leaver': number;
  'leaves': number;
  'level': number;
  'losses': number;
  'profileIconId': number;
  'selectedPosition': string;
  'skinIndex': number;
  'skinName': string;
  'spell1Id': number;
  'spell2Id': number;
  'stats': EOGStats;
  'summonerId': number;
  'summonerName': string;
  'teamId': number;
  'userId': number;
  'wins': number;
}
