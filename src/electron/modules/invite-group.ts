import { Menu, MenuItem } from 'electron';
import { StatusCode } from '../../connector';
import { WebSocketModule } from '../api';
import { connection } from '../core';
import { Endpoints } from '../enums';
import { Friend, FriendGroup } from '../models';
import { FriendGroupsCreateSubscription, FriendGroupsDeleteSubscription } from '../subscriptions';

export class InviteGroupModule extends WebSocketModule {
  id = 'InviteGroup';
  groupBlacklist = ['MOBILE', 'OFFLINE'];
  availabilityBlacklist = ['mobile', 'dnd'];

  async register(): Promise<void> {
    connection.addSubscription(
      new FriendGroupsCreateSubscription(() => {
        this.refresh();
      })
    );

    connection.addSubscription(
      new FriendGroupsDeleteSubscription(() => {
        this.refresh();
      })
    );

    return this.refresh();
  }

  async refresh(): Promise<void> {
    const submenu = new Menu();

    const menuItem = new MenuItem({
      label: 'Invite Group',
      sublabel: 'Updating...',
      submenu: submenu
    });

    this.updateMenu(menuItem);

    const response = await connection.get(Endpoints.FRIEND_GROUPS);

    if (response.status === StatusCode.OK) {
      const json: FriendGroup[] = await response.json();

      const friendGroups = json.map((friendGroup: FriendGroup) => new FriendGroup(friendGroup));

      submenu.append(new MenuItem({
        label: 'All Friends',
        click: async() => this.inviteFriendGroup()
      }));

      friendGroups.forEach((friendGroup: FriendGroup) => {
        if (!this.groupBlacklist.includes(friendGroup.name)) {
          submenu.append(new MenuItem({
            label: friendGroup.name === '**Default' ? 'General' : friendGroup.name,
            click: async() => this.inviteFriendGroup(friendGroup.id)
          }));
        }
      });

      menuItem.sublabel = '';
      this.updateMenu(menuItem);
    }
  }

  async inviteFriendGroup(friendGroupId = -1): Promise<void> {
    const response = await connection.get(Endpoints.FRIENDS);

    if (response.status === StatusCode.OK) {
      const json: Friend[] = await response.json();

      const friends = json.map((friend: Friend) => new Friend(friend));

      const filteredFriends = friends.filter((friend: Friend) => {
        return (friendGroupId === -1 || friendGroupId === friend.groupId)
          && friend.product === 'league_of_legends'
          && friend.patchline === 'live'
          && !this.availabilityBlacklist.includes(friend.availability);
      });

      const filteredSummonerIds = filteredFriends.map((friend: Friend) => {
        return friend.summonerId;
      });

      const inviteResponse = await connection.inviteSummoners(...filteredSummonerIds);
      console.log(inviteResponse.status);
      const inviteJson = await inviteResponse.json();
      console.log(inviteJson);
    }
  }
}
