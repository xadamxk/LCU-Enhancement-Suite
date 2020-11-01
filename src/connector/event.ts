import { EventType } from './enums';

export interface ILeagueEvent {
  uri: string;
  eventType: EventType;
  data: any;
}

export class LeagueEvent implements ILeagueEvent {
  uri: string;
  eventType: EventType;
  data: any;

  public constructor(event: Partial<LeagueEvent>) {
    this.uri = event.uri;
    this.eventType = event.eventType;
    this.data = event.data;
  }
}
