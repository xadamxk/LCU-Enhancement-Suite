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

    constructor() { }

    updatePlayerMenu(subMenuItems: any[] = []) {
        this.recentlyPlayedMenu = {
            label: this.recentlyPlayedLabel,
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

export default TrayMenu;