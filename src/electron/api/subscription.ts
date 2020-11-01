import { EventType, LeagueEvent } from '../../connector';

export class Subscription {
  protected path: string;
  protected eventType: EventType;
  protected listener: (event: LeagueEvent) => void;

  constructor(listener: (event: LeagueEvent) => void) {
    this.listener = listener;
  }

  getPath(): string {
    return this.path;
  }

  getEventType(): EventType {
    return this.eventType;
  }

  getListener(): (event: LeagueEvent) => void {
    return this.listener;
  }
}

export class WildcardSubscription extends Subscription {
  constructor(listener: (event: LeagueEvent) => void) {
    super(listener);
  }

  getPath(): string {
    return this.path + '/*';
  }
}
