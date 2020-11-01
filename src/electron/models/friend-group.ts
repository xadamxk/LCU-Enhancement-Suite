import { Model } from '../api';

export class FriendGroup extends Model {
  collapsed: boolean;
  id: number;
  isLocalized: boolean;
  isMetaGroup: boolean;
  name: string;
  priority: number;
}
