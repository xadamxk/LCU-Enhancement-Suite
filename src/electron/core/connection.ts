import { Response } from 'node-fetch';
import { LeagueConnection } from '../../connector';
import { Subscription } from '../api';
import { Endpoints } from '../enums';
import { FriendRequest } from '../models/friend-request';
import { LOLChatIcon } from '../models/lolchat-icon';
import { LOLChatRank } from '../models/lolchat-rank';
import { LOLChatAvailability } from '../models/lolchat-availability';

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
    forgeLoot(recipeName: string, componentLootIds: string[], repeatCount: number): Promise<Response>
    getBalance(): Promise<Response>
    getFriends(): Promise<Response>
    sendFriendRequest(friendRequest: FriendRequest): Promise<Response>;
    changeIcon(icon: LOLChatIcon): Promise<Response>;
    updateChatMeRank(rankBody: LOLChatRank): Promise<Response>;
    changeAvailability(availability: LOLChatAvailability): Promise<Response>;
    getCurrentVersion(): Promise<Response>;
    getChampionIcon(championId: number): Promise<Response>;
    getChampionSelectChampions(): Promise<Response>;
  }
}

LeagueConnection.prototype.addSubscription = function(this, subscription): void {
  this.subscribe(subscription.getPath(), subscription.getEventType(), subscription.getListener().bind(subscription));
};

LeagueConnection.prototype.removeSubscription = function(this, subscription): void {
  this.unsubscribe(subscription.getPath(), subscription.getEventType(), subscription.getListener().bind(subscription));
};

LeagueConnection.prototype.inviteSummoners = async function(this, ...summonerIds): Promise<Response> {
  return await this.post(Endpoints.INVITATIONS, summonerIds.map((summonerId: number) => new Object({ 'toSummonerId': summonerId })));
};

LeagueConnection.prototype.getLoot = async function(this): Promise<Response> {
  return await this.get(Endpoints.LOOT_MAP);
};

// Example: /lol-loot/v1/recipes/CHAMPION_RENTAL_disenchant/craft?repeat=2
// Body:    ["CHAMPION_SKIN_RENTAL_8003"]
LeagueConnection.prototype.disenchantLoot = async function(this, lootId, lootType, repeatCount = 1): Promise<Response> {
  return await this.post(`${Endpoints.LOOT_RECIPES}/${lootType}_disenchant/craft?repeat=${repeatCount}`, [lootId]);
};

// Example: /lol-loot/v1/recipes/MATERIAL_key_fragment_forge/craft
// Body: ["MATERIAL_key_fragment"]
LeagueConnection.prototype.forgeLoot = async function(this, recipeName, componentLootIds, repeatCount = 1): Promise<Response> {
  return await this.post(`${Endpoints.LOOT_RECIPES}/${recipeName}/craft?repeat=${repeatCount}`, componentLootIds);
};

LeagueConnection.prototype.getBalance = async function(this) : Promise<Response> {
  return await this.get(Endpoints.WALLET);
};

LeagueConnection.prototype.getFriends = async function(this) : Promise<Response> {
  return await this.get(Endpoints.FRIENDS);
};

LeagueConnection.prototype.sendFriendRequest = async function(this, friendRequest): Promise<Response> {
  return await this.post(Endpoints.FRIEND_REQUESTS, friendRequest);
};

LeagueConnection.prototype.changeIcon = async function(this, iconCode): Promise<Response> {
  return await this.put(Endpoints.CHAT_ME, iconCode);
};

LeagueConnection.prototype.changeAvailability = async function(this, availability): Promise<Response> {
  return await this.put(Endpoints.CHAT_ME, availability);
};

LeagueConnection.prototype.updateChatMeRank = async function(this, rankBody): Promise<Response> {
  return await this.put(Endpoints.CHAT_ME, rankBody);
};

LeagueConnection.prototype.getCurrentVersion = async function(this): Promise<Response> {
  return await this.get(Endpoints.GAME_VERSION);
};

LeagueConnection.prototype.getChampionIcon = async function(championId): Promise<Response> {
  return await this.get(`/lol-game-data/assets/v1/champion-icons/${championId}.png`);
};

LeagueConnection.prototype.getChampionSelectChampions = async function(): Promise<Response> {
  return await this.get(Endpoints.CHAMPION_SELECT_ALL_CHAMPS);
};
