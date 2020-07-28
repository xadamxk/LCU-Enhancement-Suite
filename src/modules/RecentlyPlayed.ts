const { Menu } = require('electron')
const LCUHelper = require("../LCUHelper");
const getJSONValue = require('lodash/get');
const log = console.log;

class RecentlyPlayed {
  private lcuHelper: LCUHelper;
  private trayMenu: any;
  private label = "Recently Played";
  private menu: Object = {
    label: this.label,
    submenu: []
  }

  constructor(lcuHelper: any, trayMenu: any) {
    this.lcuHelper = lcuHelper;
    this.trayMenu = trayMenu;
    trayMenu.updateRecentlyPlayedMenu(this.label)
    this.getRecentlyPlayed();
  }

  getRecentlyPlayed() {
    this.lcuHelper.getRecentlyPlayed()
      .then((response: any) => {
        const statusCode = getJSONValue(response, "status");
        const data = getJSONValue(response, "data");
        switch (statusCode) {
          case 200: this.parseData(data)
            break;
          default: log("Recent players not found...")
        }
      })
  }

  // TODO: Type for array entry
  parseData(data: any[]) {
    // Sort by most recent
    data = data.sort((a: any, b: any) => (Date.parse(a["gameCreationDate"]) < Date.parse(b["gameCreationDate"])) ? 1 : -1);
    // Keep the newest duplicate
    data = data.filter((item: any, index: any) => {
      return data.indexOf(item) >= index;
    })
    data = data.slice(0, 20);
    // Create array of menu items
    let items = data.map((player: any) => {
      return {
        id: player["summonerId"],
        label: player["summonerName"],
        sublabel: "Seen: " + this.timeSince(new Date(player["gameCreationDate"])),
        type: "normal",
        click: this.handleClick,
        this: this
      }
    });
    this.updateTray(items)
  }

  updateTray(items: any[]) {
    this.trayMenu.updateRecentlyPlayedMenu(this.label, items)
    let contextMenu = Menu.buildFromTemplate(this.trayMenu.getMenu())
    this.trayMenu.updateTray(contextMenu);
  }

  handleClick(menuItem: any) {
    menuItem["this"].lcuHelper.sendInvite([menuItem["id"]])
      .then((response: any) => {
        const statusCode = getJSONValue(response, "status");
        const data = getJSONValue(response, "data");
        switch (statusCode) {
          case 200: log("Invite sent")
            break;
          default: log(`Failed to send invite: ${getJSONValue(data, "message")}`)
        }
      })
  }

  // https://stackoverflow.com/a/3177838
  timeSince(date: any) {
    let now: any = new Date();
    var seconds = Math.floor((now - date) / 1000);
    var interval = Math.floor(seconds / 31536000);
    if (interval > 1) {
      return interval + " years ago";
    }
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) {
      return interval + " months ago";
    }
    interval = Math.floor(seconds / 86400);
    if (interval > 1) {
      return interval + " days ago";
    }
    interval = Math.floor(seconds / 3600);
    if (interval > 1) {
      return interval + " hrs ago";
    }
    interval = Math.floor(seconds / 60);
    if (interval > 1) {
      return interval + " mins ago";
    }
    return Math.floor(seconds) + " secs ago";
  }

  updateMenu(items: any[] = []) {
    this.menu = {
      label: this.label,
      menu: items
    }
  }

  // https://stackoverflow.com/a/48288237
  addItemEvery(arr: any[], item: any, frequency: number, starting: number = 0) {
    for (var i = 0, a = []; i < arr.length; i++) {
      a.push(arr[i]);
      if ((i + 1 + starting) % frequency === 0) {
        a.push(item);
        i++;
        if (arr[i]) a.push(arr[i]);
      }
    }
    return a;
  }

  getMenu() {
    return this.menu;
  }
}


export { RecentlyPlayed };