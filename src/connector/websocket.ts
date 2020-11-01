import { EventEmitter2 } from 'eventemitter2';
import * as WebSocket from 'ws';
import { ClientOptions } from 'ws';
import { EventType, MessageType } from './enums';
import { LeagueEvent } from './event';

export interface ILeagueWebSocket {
  subscribe(uri: string, eventType: EventType, listener: (event: LeagueEvent) => void): void;
  unsubscribe(uri: string, eventType: EventType, listener: (event: LeagueEvent) => void): void;
}

export class LeagueWebSocket extends WebSocket implements ILeagueWebSocket {
  private emitter = new EventEmitter2({
    wildcard: true,
    delimiter: '/'
  });

  constructor(address: string, options: ClientOptions) {
    super(address, options);
    this.subscribeAllMessages();
    this.addMessageHandler();
  }

  private subscribeAllMessages(): void {
    this.on('open', () => {
      this.send(JSON.stringify([MessageType.SUBSCRIBE, 'OnJsonApiEvent']));
    });
  }

  private addMessageHandler(): void {
    this.on('message', (json: string) => {
      try {
        const [messageType, source, event]: [MessageType, string, LeagueEvent] = JSON.parse(json);

        if (messageType === MessageType.EVENT && source === 'OnJsonApiEvent') {
          this.emitter.emit(this.getEventName(event.uri, event.eventType), new LeagueEvent(event));
        }
      } catch (e) {
        if (e instanceof SyntaxError) {
          // Failed JSON parsing
        } else {
          console.log(e, json);
        }
      }
    });
  }

  private getEventName(uri: string, eventType: EventType) {
    return `${eventType}:${uri}`;
  }

  public subscribe(uri: string, eventType: EventType, listener: (event: LeagueEvent) => void): void {
    this.emitter.on(this.getEventName(uri, eventType), listener);
  }

  public unsubscribe(uri: string, eventType: EventType, listener: (event: LeagueEvent) => void): void {
    this.emitter.off(this.getEventName(uri, eventType), listener);
  }
}
