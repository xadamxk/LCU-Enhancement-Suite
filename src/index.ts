export { };
// Node Imports
const LCUConnector = require('lcu-connector');
const { app, Menu, Tray } = require('electron')
const getJSONValue = require('lodash/get');

const LCUHelper = require("./LCUHelper");
const TrayMenu = require("./TrayMenu");
const nativeImage = require('electron').nativeImage

const connector = new LCUConnector();
const log = console.log;
//let tray: typeof Tray = null;
import { RecentlyPlayed } from "./modules/RecentlyPlayed";
import { InviteGroup } from "./modules/InviteGroup";

// TODO: Trigger context menu update when game is done loaded - how?
app.whenReady().then(() => {
    const tray = new Tray(nativeImage.createEmpty());
    const trayMenu = new TrayMenu(tray);
    const contextMenu = Menu.buildFromTemplate(trayMenu.getMenu());
    tray.setToolTip('This is my application.')
    tray.setContextMenu(contextMenu);
    // Connect
    connector.start();
    connector.on('connect', (connectorInfo: any) => {
        let lcuHelper = new LCUHelper(connectorInfo);
        log(`Found active client instance. Loading instance (${lcuHelper.getCreds()})`)
        const recentlyPlayed = new RecentlyPlayed(lcuHelper, trayMenu);
        const inviteGroup = new InviteGroup(lcuHelper, trayMenu);

    });
})