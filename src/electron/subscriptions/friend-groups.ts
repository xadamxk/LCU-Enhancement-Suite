import { EventType } from '../../connector';
import { WildcardSubscription } from '../api';
import { Endpoints } from '../enums';

export class FriendGroupsCreateSubscription extends WildcardSubscription {
  path = Endpoints.FRIEND_GROUPS;
  eventType = EventType.CREATE;
}

export class FriendGroupsDeleteSubscription extends WildcardSubscription {
  path = Endpoints.FRIEND_GROUPS;
  eventType = EventType.DELETE;
}
