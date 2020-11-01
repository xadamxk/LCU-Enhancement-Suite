import { Module } from '../api';
import { AutoAcceptQueueModule } from './auto-accept-queue';
import { InviteGroupModule } from './invite-group';
import { RecentlyPlayedModule } from './recently-played';

export * from './auto-accept-queue';
export * from './invite-group';
export * from './recently-played';

const modules: Module[] = [
  new RecentlyPlayedModule(),
  new InviteGroupModule(),
  new AutoAcceptQueueModule()
];

export { modules };
