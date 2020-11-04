import { EventType, LeagueEvent } from '../../connector';
import { Subscription } from '../api';
import { Endpoints, GameflowPhase } from '../enums';

export class GameflowPhaseSubscription extends Subscription {
  path = Endpoints.GAMEFLOW_PHASE;
  eventType = EventType.UPDATE;

  constructor(listener: (event: LeagueEvent) => void, ...phases: GameflowPhase[]) {
    super(listener);

    if (phases.length > 0) {
      this.listener = (event: LeagueEvent) => {
        if (phases.indexOf(event.data) >= 0) {
          listener(event);
        }
      };
    }
  }
}
