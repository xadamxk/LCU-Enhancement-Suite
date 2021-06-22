import { EventType } from '../../connector';
import { Subscription } from '../api';
import { Endpoints } from '../enums';

export class EndOfGameSubscription extends Subscription {
  path = Endpoints.END_OF_GAME_STATS;
  eventType = EventType.CREATE;
}
