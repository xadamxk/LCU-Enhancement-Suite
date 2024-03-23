import { MenuItem, Menu, dialog } from 'electron';
import { WebSocketModule } from '../api';
import { connection } from '../core';
import { Friend, FriendRequest } from '../models';

const fs = require('fs');

export class FriendsListModule extends WebSocketModule {
  id = 'FriendsList';
  exportedFriendProps = [
    'gameName',
    'gameTag',
    'icon',
    'id',
    // 'groupName',
    'name',
    'note',
    'pid',
    'puuid',
    'summonerId'
  ];

  async register(): Promise<void> {
    // Sub Menu
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

  async refresh(): Promise<void> {
    //
  }

  private async importFriends(): Promise<void> {
    const importDialog = await dialog.showOpenDialog({
      defaultPath: process.env.HOME,
      filters: [{
        name: 'JSON', extensions: ['json']
      }]
    });
    if (importDialog.canceled || importDialog.filePaths.length !== 1) {
      return;
    }
    const rawFile = fs.readFileSync(importDialog.filePaths[0]);
    const importedFriends = JSON.parse(rawFile);
    const promptOptions = {
      type: 'question',
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      message: `Are you sure you want to import ${importedFriends.length} friend(s)?`,
      buttons: [
        'Yes, add them.',
        'Cancel.'
      ]
    };
    // Confirm adding friends
    const promptResponse = await dialog.showMessageBox(null, promptOptions);
    if (promptResponse.response !== 0) {
      return;
    }

    const successfulFriends = [];
    const notFoundFriends = [];
    const failedFriends = [];
    // Loop friends object, send request
    for (const friend of importedFriends) {
      friend['direction'] = 'out';
      const statusCode = await this.addFriend({ ...friend });
      switch (statusCode) {
        case 204: successfulFriends.push(friend);
          break;
        case 404: notFoundFriends.push(friend);
          break;
        default: failedFriends.push(friend);
      }
    }
    const notFoundCount = notFoundFriends.length;
    const failedCount = failedFriends.length;
    // Prompt user for errors or success
    if (notFoundCount > 0 || failedCount > 0) {
      const errorPromptOptions = {
        type: 'error',
        title: `Failed to add ${notFoundCount + failedCount} friend(s).`,
        message: `Usernames not found: ${this.printNames(notFoundFriends)}\nFailed to add: ${this.printNames(failedFriends)}`
      };
      dialog.showMessageBox(null, errorPromptOptions);
    } else {
      const successPromptOptions = {
        type: 'info',
        title: 'Success',
        message: `Added ${successfulFriends.length} friend(s).`
      };
      dialog.showMessageBox(null, successPromptOptions);
    }
  }

  private printNames(friendList: FriendRequest[]): string {
    return friendList.map(friend => friend.gameName).toString();
  }

  private async getFriends(): Promise<Friend[]> {
    const friendsResponse = await connection.getFriends();
    return friendsResponse.json();
  }

  private async addFriend(friendRequest: FriendRequest) {
    const addFriendResponse = await connection.sendFriendRequest(friendRequest);
    return addFriendResponse.status;
  }

  private async exportFriends(): Promise<Friend[]> {
    const friends = await this.getFriends();
    // Filter out irrelavent properties
    const condensedFriends = friends.map(friend => {
      const obj = {};
      for (const prop of this.exportedFriendProps) {
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
