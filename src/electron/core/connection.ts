import { Response } from 'node-fetch';
import { LeagueConnection } from '../../connector';
import { Subscription } from '../api';
import { Endpoints } from '../enums';

let connection: LeagueConnection = null;

export { connection };

export function initConnection(): void {
  connection = new LeagueConnection();
}

declare module '../../connector' {
  interface LeagueConnection {
    addSubscription(subscription: Subscription): void;
    removeSubscription(subscription: Subscription): void
    inviteSummoners(...summonerIds: number[]): Promise<Response>
  }
}

LeagueConnection.prototype.addSubscription = function(this: LeagueConnection, subscription: Subscription): void {
  this.subscribe(subscription.getPath(), subscription.getEventType(), subscription.getListener().bind(subscription));
};

LeagueConnection.prototype.removeSubscription = function(this: LeagueConnection, subscription: Subscription): void {
  this.unsubscribe(subscription.getPath(), subscription.getEventType(), subscription.getListener().bind(subscription));
};

LeagueConnection.prototype.inviteSummoners = async function(this: LeagueConnection, ...summonerIds: number[]): Promise<Response> {
  return await this.post(Endpoints.INVITATIONS, summonerIds.map((summonerId: number) => new Object({ 'toSummonerId': summonerId })));
};
