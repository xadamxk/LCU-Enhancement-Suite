import { Module } from '../api';
import { AutoAcceptQueueModule } from './auto-accept-queue';
import { DisenchantLootModule } from './disenchant-loot';
import { InviteGroupModule } from './invite-group';
import { RecentlyPlayedModule } from './recently-played';
import { FriendsListModule } from './friends-list';
import { SpoofProfileModule } from './spoof-profile';
import { OpenBuildInBrowserModule } from './open-build-in-browser/open-build-in-browser';

export * from './auto-accept-queue';
export * from './disenchant-loot';
export * from './invite-group';
export * from './recently-played';
export * from './friends-list';
export * from './spoof-profile';
export * from './open-build-in-browser/open-build-in-browser';

const modules: Module[] = [
  new RecentlyPlayedModule(),
  new InviteGroupModule(),
  new DisenchantLootModule(),
  new FriendsListModule(),
  new SpoofProfileModule(),
  new OpenBuildInBrowserModule(),
  new AutoAcceptQueueModule()
];

export { modules };
