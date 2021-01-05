import { Response } from 'node-fetch';
import { LeagueConnection } from '../../connector';
import { Subscription } from '../api';
import { Endpoints } from '../enums';
import { FriendRequest } from '../models/friend-request';
import { LOLChatMe } from '../models/lolchat-me';

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
    getLoot(): Promise<Response>
    disenchantLoot(lootId: string, lootType: string, repeatCount: number): Promise<Response>
    getBalance(): Promise<Response>
    getFriends(): Promise<Response>
    sendFriendRequest(friendRequest: FriendRequest): Promise<Response>;
    updateChatMe(icon: LOLChatMe): Promise<Response>;
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

LeagueConnection.prototype.getLoot = async function(this: LeagueConnection): Promise<Response> {
  return await this.get(Endpoints.LOOT_MAP);
};

// Example: /lol-loot/v1/recipes/CHAMPION_RENTAL_disenchant/craft?repeat=2
// Body:    ["CHAMPION_SKIN_RENTAL_8003"]
LeagueConnection.prototype.disenchantLoot = async function(this: LeagueConnection, lootId: string, lootType: string, repeatCount = 1): Promise<Response> {
  return await this.post(`${Endpoints.LOOT_RECIPES}/${lootType}_disenchant/craft?repeat=${repeatCount}`, [lootId]);
};

LeagueConnection.prototype.getBalance = async function(this: LeagueConnection) : Promise<Response> {
  return await this.get(Endpoints.WALLET);
};

LeagueConnection.prototype.getFriends = async function(this: LeagueConnection) : Promise<Response> {
  return await this.get(Endpoints.FRIENDS);
};

// TODO: Address type issue
LeagueConnection.prototype.sendFriendRequest = async function(this: LeagueConnection, friendRequest: FriendRequest): Promise<Response> {
  return await this.post(Endpoints.FRIEND_REQUESTS, friendRequest);
};

LeagueConnection.prototype.updateChatMe = async function(this: LeagueConnection, icon: LOLChatMe): Promise<Response> {
  return await this.put(Endpoints.CHAT_ME, icon);
};
