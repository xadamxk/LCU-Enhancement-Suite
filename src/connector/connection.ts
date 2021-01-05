import { Agent } from 'https';
import fetch, { RequestInit, Response } from 'node-fetch';
import { URLSearchParams } from 'url';
import { ClientOptions } from 'ws';
import { FriendRequest } from '../electron/models';
import { LeagueCredentials } from './credentials';
import { EventType, Method, Protocol } from './enums';
import { LeagueEvent } from './event';
import { readCertificateAuthority, readLockfile } from './util';
import { LeagueWebSocket } from './websocket';

export interface ILeagueConnection {
  subscribe(uri: string, eventType: EventType, listener: (event: LeagueEvent) => void): void;
  unsubscribe(uri: string, eventType: EventType, listener: (event: LeagueEvent) => void): void;
  get(uri: string): Promise<Response>;
  post(uri: string): Promise<Response>;
  request(uri: string, method: Method): Promise<Response>;
}

export class LeagueConnection implements ILeagueConnection {
  private certificateAuthority: string;
  private credentials: LeagueCredentials;
  private websocket: LeagueWebSocket;

  constructor() {
    this.initCertificateAuthority();
    this.initCredentials();
    this.initWebSocket();
  }

  private initCertificateAuthority(): void {
    this.certificateAuthority = readCertificateAuthority();
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
    const options: ClientOptions = {
      headers: {
        Authorization: this.credentials.getBasicAuthHeader()
      }
    };

    if (this.credentials.secure) {
      options.ca = this.certificateAuthority;
    }

    this.websocket = new LeagueWebSocket(this.credentials.getWebSocketUrl(), options);
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

  public async post(uri: string, body:
  Record<string | number, unknown> | Array<Record<string | number, unknown>> |
  Array<unknown> |
  FriendRequest |
  URLSearchParams = null
  ): Promise<Response> {
    return this.request(uri, Method.POST, body);
  }

  public async put(uri: string, body: any): Promise<Response> {
    return this.request(uri, Method.PUT, body);
  }

  public async request(uri: string, method: Method, body: Record<string | number, unknown> | Array<Record<string | number, unknown>> | Array<unknown> | FriendRequest | URLSearchParams = null): Promise<Response> {
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
        ca: this.certificateAuthority
      });
    }

    return fetch(this.credentials.getApiUrl(uri), options);
  }
}
