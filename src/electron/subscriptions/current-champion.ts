import { EventType } from '../../connector';
import { Subscription } from '../api';
import { Endpoints } from '../enums';

// TeamBuilder
export class TBCurrentChampionSubscription extends Subscription {
  path = Endpoints.TEAM_BUILDER_CURRENT_CHAMPION;
  eventType = EventType.UPDATE;
}

// ChampSelect
export class CSCurrentChampionSubscription extends Subscription {
  path = Endpoints.CHAMPION_SELECT_CURRENT_CHAMPION;
  eventType = EventType.CREATE;
}
