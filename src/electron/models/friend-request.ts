import { Model } from '../api';

export class FriendRequest extends Model {
  direction?: string;
  gameName: string;
  gameTag: string;
  icon: number;
  id: string;
  name: string;
  note: string;
  pid: string;
  puuid: string;
  summonerId: number;
}
