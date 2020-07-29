const { Menu } = require('electron')
const LCUHelper = require("../LCUHelper");
const getJSONValue = require('lodash/get');
const log = console.log;

class InviteGroup {
  private lcuHelper: LCUHelper;
  private trayMenu: any;
  private label = "Invite Group";
  private menu: Object = {
    label: this.label,
    submenu: []
  }

  constructor(lcuHelper: any, trayMenu: any) {
    this.lcuHelper = lcuHelper;
    this.trayMenu = trayMenu;
    trayMenu.updateInviteGroupMenu(this.label)
    this.getInviteGroups();
  }

  getInviteGroups() {
    this.lcuHelper.getInviteGroups()
      .then((response: any) => {
        const statusCode = getJSONValue(response, "status");
        const data = getJSONValue(response, "data");
        switch (statusCode) {
          case 200: this.parseData(data);
            break;
          default: log("Recent players not found...")
        }
      })
  }

  // TODO: Type for array entry
  parseData(data: any[]) {
    const blacklist = ["MOBILE", "OFFLINE"];
    const onlineGroup = "**Default";
    // Remove blacklisted groups
    let groups = data.reduce((filteredGroups, group) => {
      const groupName = group["name"];
      if (!blacklist.includes(groupName)) {
        let name = groupName == onlineGroup ? "General" : groupName;
        filteredGroups.push({
          id: groupName,
          label: name,
          subLabel: "-",
          type: "normal",
          click: this.handleClick,
          this: this
        })
      }
      return filteredGroups;
    }, []);
    // Add all friends at beginning
    groups.unshift({
      id: "",
      label: "All Friends",
      subLabel: "-",
      type: "normal",
      click: this.handleClick,
      this: this
    });

    this.updateTray(groups)
  }

  handleClick(menuItem: any) {
    const friendGroupId = menuItem["id"];
    menuItem["this"].lcuHelper.getFriends()
      .then((response: any) => {
        const statusCode = getJSONValue(response, "status");
        const data = getJSONValue(response, "data");
        switch (statusCode) {
          case 200: menuItem["this"].filterFriends(data, friendGroupId);
            break;
          default: log("Failed to fetch friends...")
        }
      })
  }

  filterFriends(friends: any[], friendGroupId: string) {
    const availabilityBlacklist = ["mobile", "dnd"]
    // Filter by group, status, game, and patch
    friends = friends.filter((friend: any) => {
      return (friendGroupId == "" || friend["groupName"] == friendGroupId) &&
        friend["product"] == "league_of_legends" &&
        friend["patchline"] == "live" &&
        !availabilityBlacklist.includes(friend["availability"])
    })
    // Create array of menu items
    let summonerIds = friends.map((player: any) => {
      return player["summonerId"]
    })
    this.lcuHelper.sendInvite(summonerIds);
  }

  updateTray(groups: any[]) {
    this.trayMenu.updateInviteGroupMenu(this.label, groups)
    let contextMenu = Menu.buildFromTemplate(this.trayMenu.getMenu())
    this.trayMenu.updateTray(contextMenu);
  }
}

export { InviteGroup };