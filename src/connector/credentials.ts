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

  host = '127.0.0.1';
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
    return this.getUrl(this.secure ? Protocol.HTTPS : Protocol.HTTP, path);
  }

  public getWebSocketUrl(path: string = null): string {
    return this.getUrl(this.secure ? Protocol.WSS : Protocol.WS, path);
  }

  private getUrl(protocol: Protocol, path: string = null) : string {
    let url = `${protocol}://${this.host}:${this.port}`;

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
