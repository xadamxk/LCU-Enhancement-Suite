import { Module } from '../api';
import { AutoAcceptQueueModule } from './auto-accept-queue';
import { DisenchantLootModule } from './disenchant-loot';
import { InviteGroupModule } from './invite-group';
import { RecentlyPlayedModule } from './recently-played';
import { FriendsListModule } from './friends-list';

export * from './auto-accept-queue';
export * from './disenchant-loot';
export * from './invite-group';
export * from './recently-played';
export * from './friends-list';


const modules: Module[] = [
  new RecentlyPlayedModule(),
  new InviteGroupModule(),
  new DisenchantLootModule(),
  new FriendsListModule(),
  new AutoAcceptQueueModule()
];

export { modules };
