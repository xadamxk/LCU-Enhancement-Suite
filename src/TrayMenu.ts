class TrayMenu {
    private recentlyPlayedLabel: string = "Recently Played";
    private recentlyPlayedMenu: Object = {
        label: this.recentlyPlayedLabel,
        submenu: []
    }
    private inviteGroupLabel: string = "Invite By Group";
    private inviteGroupMenu: Object = {
        label: this.inviteGroupLabel,
        submenu: []
    }

    updateRecentlyPlayedMenu(subMenuItems: any[] = []) {
        this.recentlyPlayedMenu = {
            label: this.recentlyPlayedLabel,
            submenu: subMenuItems
        };
    }

    updateInviteGroupMenu(subMenuItems: any[] = []) {
        this.inviteGroupMenu = {
            label: this.inviteGroupLabel,
            submenu: subMenuItems
        };
    }

    getMenu() {
        return [
            this.recentlyPlayedMenu,
            this.inviteGroupMenu
        ]
    }
}

module.exports = TrayMenu;