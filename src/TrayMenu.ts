const { Tray, Menu } = require('electron')

class TrayMenu {
    private tray: typeof Tray = null;
    private recentlyPlayedMenu: Object = {
        label: "",
        submenu: []
    }
    private inviteGroupMenu: Object = {
        label: "",
        submenu: []
    }

    constructor(tray: typeof Tray) {
        this.tray = tray;
    }

    updateRecentlyPlayedMenu(label: string, subMenuItems: any[] = []) {
        this.recentlyPlayedMenu = {
            label: label,
            submenu: subMenuItems
        };
    }

    updateInviteGroupMenu(label: string, subMenuItems: any[] = []) {
        this.inviteGroupMenu = {
            label: label,
            submenu: subMenuItems
        };
    }

    updateTray(contextMenu: typeof Menu) {
        this.tray.setContextMenu(contextMenu);
    }

    getMenu() {
        return [
            this.recentlyPlayedMenu,
            this.inviteGroupMenu
        ]
    }
}

module.exports = TrayMenu;