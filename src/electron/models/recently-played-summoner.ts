import * as moment from 'moment';
import { Moment } from 'moment';
import { Model } from '../api';

export class RecentlyPlayedSummoner extends Model {
  championId: number;
  gameCreationDate: Moment;
  gameId: number;
  puuid: string;
  summonerId: number;
  summonerName: string;
  teamId: number;

  constructor(recentlyPlayedSummoner: Partial<RecentlyPlayedSummoner>) {
    super(recentlyPlayedSummoner);
    this.gameCreationDate = moment(this.gameCreationDate);
  }
}
