import { Agent } from 'https';
import fetch, { RequestInit, Response } from 'node-fetch';
import { URLSearchParams } from 'url';
import { LeagueCredentials } from './credentials';
import { EventType, Method, Protocol } from './enums';
import { LeagueEvent } from './event';
import { readLockfile } from './util';
import { LeagueWebSocket } from './websocket';

export interface ILeagueConnection {
  subscribe(uri: string, eventType: EventType, listener: (event: LeagueEvent) => void): void;
  unsubscribe(uri: string, eventType: EventType, listener: (event: LeagueEvent) => void): void;
  get(uri: string): Promise<Response>;
  post(uri: string): Promise<Response>;
  request(uri: string, method: Method): Promise<Response>;
}

export class LeagueConnection implements ILeagueConnection {
  private credentials: LeagueCredentials;
  private websocket: LeagueWebSocket;

  constructor() {
    this.initCredentials();
    this.initWebSocket();
  }

  private initCredentials(): void {
    const content = readLockfile();
    const [name, pid, port, token, protocol] = content.split(':');

    this.credentials = new LeagueCredentials({
      name,
      pid: Number(pid),
      port: Number(port),
      token,
      protocol: protocol as Protocol
    });
  }

  private initWebSocket(): void {
    this.websocket = new LeagueWebSocket(this.credentials.getWebSocketUrl(), {
      headers: {
        Authorization: this.credentials.getBasicAuthHeader()
      },
      rejectUnauthorized: false
    });
  }

  public subscribe(uri: string, eventType: EventType, listener: (event: LeagueEvent) => void): void {
    this.websocket.subscribe(uri, eventType, listener);
  }

  public unsubscribe(uri: string, eventType: EventType, listener: (event: LeagueEvent) => void): void {
    this.websocket.unsubscribe(uri, eventType, listener);
  }

  public async get(uri: string): Promise<Response> {
    return this.request(uri, Method.GET);
  }

  public async post(uri: string, body: Record<string | number, unknown> | Array<Record<string | number, unknown>> | Array<unknown> | URLSearchParams = null): Promise<Response> {
    return this.request(uri, Method.POST, body);
  }

  public async request(uri: string, method: Method, body: Record<string | number, unknown> | Array<Record<string | number, unknown>> | Array<unknown> | URLSearchParams = null): Promise<Response> {
    const options: RequestInit = {
      method,
      headers: {
        'Accept': 'application/json',
        'Authorization': this.credentials.getBasicAuthHeader()
      }
    };

    if (body !== null) {
      if (body instanceof URLSearchParams) {
        options.body = body;
      } else {
        options.headers['Content-Type'] = 'application/json';
        options.body = JSON.stringify(body);
      }
    }

    if (this.credentials.secure) {
      options.agent = new Agent({
        rejectUnauthorized: false
      });
    }

    return fetch(this.credentials.getApiUrl(uri), options);
  }
}
