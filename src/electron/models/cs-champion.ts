import { Model } from '../api';

export class CSChampion extends Model {
  disabled: boolean;
  freeToPlay: boolean;
  freeToPlayForQueue: boolean;
  freeToPlayReward: boolean;
  id: number;
  masteryChestGranted: boolean;
  masteryLevel: number;
  masteryPoints: number;
  name: string;
  owned: boolean;
  positionsFavorited: any[];
  rented: boolean;
  roles: string[];
  selectionStatus: SelectionStatus;
  squarePortraitPath: string;
}

class SelectionStatus {
  banIntented: boolean;
  banIntentedByMe: boolean;
  isBanned: boolean;
  pickIntented: boolean;
  pickIntentedByMe: boolean;
  pickIntentedPosition: string;
  pickedByOtherOrBanned: boolean;
  selectedByMe: boolean;
}