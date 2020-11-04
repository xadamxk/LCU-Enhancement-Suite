import { Model } from '../api';
import { PlayerResponse } from '../enums';

export class ReadyCheck extends Model {
  declinerIds: Array<number>;
  dodgeWarning: string; // 'None' | ...
  playerResponse: PlayerResponse; // 'None' | 'Declined' | 'Accepted' | ...
  state: string; // 'InProgress' | 'EveryoneReady' | ...
  suppressUx: boolean;
  timer: number;
}
