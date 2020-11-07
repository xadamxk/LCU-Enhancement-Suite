import { Module } from '../api';
import { AutoAcceptQueueModule } from './auto-accept-queue';
import { InviteGroupModule } from './invite-group';
import { RecentlyPlayedModule } from './recently-played';
import { DisenchantLootModule } from './disenchant-loot';

export * from './auto-accept-queue';
export * from './invite-group';
export * from './recently-played';

const modules: Module[] = [
  new RecentlyPlayedModule(),
  new InviteGroupModule(),
  new DisenchantLootModule(),
  new AutoAcceptQueueModule(),
];

export { modules };
