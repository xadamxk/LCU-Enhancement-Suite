import { EventType } from '../../connector';
import { Subscription } from '../api';
import { Endpoints } from '../enums';

export class ReadyCheckSubscription extends Subscription {
  path = Endpoints.READY_CHECK;
  eventType = EventType.UPDATE;
}
