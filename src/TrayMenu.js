class TrayMenu {
    constructor() {
        this.recentlyPlayedLabel = "Recently Played";
        this.recentlyPlayedMenu = {
            label: this.recentlyPlayedLabel,
            submenu: []
        }
        this.inviteGroupLabel = "Invite By Group";
        this.inviteGroupMenu = {
            label: this.inviteGroupLabel,
            submenu: []
        }
    }

    updatePlayerMenu(subMenuItems) {
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