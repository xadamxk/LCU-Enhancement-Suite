import { MenuItem, Menu, dialog, SaveDialogReturnValue } from 'electron';
import { LeagueEvent } from '../../connector';
import { WebSocketModule } from '../api';
import { connection } from '../core';
import { Endpoints, PlayerResponse } from '../enums';
import { Friend } from '../models';
import { ReadyCheckSubscription } from '../subscriptions';

const fs = require('fs');

export class FriendsListModule extends WebSocketModule {
  id = 'FriendsList';

  async register(): Promise<void> {
    // Sub Menu (Import, Export, etc?)
    const submenu = new Menu();

    const menuItem = new MenuItem({
      label: 'Friends List',
      submenu: submenu
    });

    submenu.append(new MenuItem({
      label: 'Import Friends',
      click: async() => this.importFriends()
    }));

    submenu.append(new MenuItem({
      label: 'Export Friends',
      click: async() => this.exportFriends()
    }));

    return this.updateMenu(menuItem);
  }

  async refresh(event: LeagueEvent = null): Promise<void> {
    //
  }

  private async importFriends(): Promise<void> {
    const importDialog =  await dialog.showOpenDialog({
      defaultPath: process.env.HOME,
      filters: [{
        name: 'JSON', extensions: ['json']
      }]
    });
    if (importDialog.canceled) {
      return;
    }
    console.log(importDialog);
    return;
  }

  private async getFriends(): Promise<Friend[]> {
    const friendsResponse = await connection.getFriends();
    return friendsResponse.json();
  }

  private async exportFriends(): Promise<Friend[]> {
    const friends = await this.getFriends();
    const propsToKeep = [
      'gameName',
      'gameTag',
      'groupName',
      'name',
      'note',
      'summonerId'
    ];
    // Filter out irrelavent properties
    const condensedFriends = friends.map(friend => {
      const obj = {};
      for (const prop of propsToKeep) {
        obj[prop] = friend[prop];
      }
      return obj;
    });

    const d = new Date();
    const fileName = [
      'ExportedFriends',
      d.getFullYear(),
      d.getMonth() + 1,
      d.getDate(),
      d.getHours(),
      d.getMinutes()
    ].join('-');

    dialog.showSaveDialog({
      defaultPath: `${process.env.HOME}/${fileName}.json`,
      filters: [{
        name: 'JSON', extensions: ['json']
      }]
    }).then((file) => {
      if (!file.canceled) {
        fs.writeFile(
          file.filePath.toString(),
          JSON.stringify(condensedFriends), function(err) {
            if (err) throw err;
            console.log('Exported friends list!');
          });
      }
    });
    return;
  }
}
