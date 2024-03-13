import { Model } from '../api';
import { EOGPlayer } from './eog-player';
import { EOGStats } from './eog-stats';

export class EOGTeam extends Model {
  'championBans': number[];
  'fullId': string;
  'isBottomTeam': boolean;
  'isPlayerTeam': boolean;
  'isWinningTeam': boolean;
  'memberStatusString': string;
  'name': string;
  'players': EOGPlayer;
  'stats': EOGStats;
  'tag': string;
  'teamId': number;
}
