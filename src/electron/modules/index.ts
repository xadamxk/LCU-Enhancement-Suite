import { Module } from '../api';
import { AutoAcceptQueueModule } from './auto-accept-queue';
import { DisenchantLootModule } from './disenchant-loot';
import { InviteGroupModule } from './invite-group';
import { RecentlyPlayedModule } from './recently-played';

export * from './auto-accept-queue';
export * from './disenchant-loot';
export * from './invite-group';
export * from './recently-played';

const modules: Module[] = [
  new RecentlyPlayedModule(),
  new InviteGroupModule(),
  new DisenchantLootModule(),
  new AutoAcceptQueueModule()
];

export { modules };
