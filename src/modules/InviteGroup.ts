const { Menu } = require('electron')
const LCUHelper = require("./LCUHelper");
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
    let groups = data.map((group: any) => {
      // TODO: Filter OFFLINE, **Default
      return {
        id: group["name"],
        label: group["name"],
        subLabel: "-",
        type: "normal"
      }
    })
    log(groups);
    this.updateTray(groups)
  }

  updateTray(groups: any[]) {
    this.trayMenu.updateInviteGroupMenu(this.label, groups)
    let contextMenu = Menu.buildFromTemplate(this.trayMenu.getMenu())
    this.trayMenu.updateTray(contextMenu);
  }
}

export { InviteGroup };