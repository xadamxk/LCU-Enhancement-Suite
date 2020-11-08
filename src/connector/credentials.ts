import { Protocol } from './enums';

export interface ILeagueCredentials {
  name: string;
  pid: number;
  host: string;
  port: number;
  protocol: Protocol;
  username: string;
  token: string;
  readonly secure: boolean;
  getApiUrl(path: string): string;
  getWebSocketUrl(path: string): string;
  getBasicAuthHeader(): string;
}

export class LeagueCredentials implements ILeagueCredentials {
  name: string;
  pid: number;

  apiHost = '127.0.0.1'; // for some reason API authentication only works when the host is the IP address
  websocketHost = 'localhost';  // ws.WebSocket will warn about DEP0123 if using IP address for TLS ServerName
  host = this.apiHost; // the IP address should work for any purpose, but a deprecation warning may occur
  port: number;
  protocol: Protocol;

  username = 'riot';
  token: string;

  public constructor(credentials: Partial<LeagueCredentials>) {
    this.name = credentials.name;
    this.pid = credentials.pid;
    this.port = credentials.port;
    this.token = credentials.token;
    this.protocol = credentials.protocol;
  }

  get secure(): boolean {
    return this.protocol === Protocol.HTTPS || this.protocol === Protocol.WSS;
  }

  public getApiUrl(path: string = null): string {
    return this.getUrl(this.secure ? Protocol.HTTPS : Protocol.HTTP, this.apiHost, this.port, path);
  }

  public getWebSocketUrl(path: string = null): string {
    return this.getUrl(this.secure ? Protocol.WSS : Protocol.WS, this.websocketHost, this.port, path);
  }

  private getUrl(protocol: Protocol, host: string, port: number, path: string = null) : string {
    let url = `${protocol}://${host}:${port}`;

    if (path !== null) {
      path = path.replace(/^\/+/, '');
      url = new URL(path, url).toString();
    }

    return url;
  }

  public getBasicAuthHeader(): string {
    return 'Basic ' + Buffer.from(`${this.username}:${this.token}`).toString('base64');
  }
}
