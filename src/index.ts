export { };
// Node Imports
const LCUConnector = require('lcu-connector');
const { app, Menu, Tray } = require('electron')
const getJSONValue = require('lodash/get');

const LCUHelper = require("./LCUHelper");
const TrayMenu = require("./TrayMenu");
const nativeImage = require('electron').nativeImage

const connector = new LCUConnector();
const trayMenu = new TrayMenu();
const log = console.log;
let tray: typeof Tray = null;

// TODO: Trigger context menu update when game is done loaded - how?
app.whenReady().then(() => {
    tray = new Tray(nativeImage.createEmpty());
    const contextMenu = Menu.buildFromTemplate(trayMenu.getMenu());
    tray.setToolTip('This is my application.')
    tray.setContextMenu(contextMenu);
    // Connect
    connector.start();
    connector.on('connect', (connectorInfo: any) => {
        let lcuHelper = new LCUHelper(connectorInfo);
        log(`Found active client instance. Loading instance (${lcuHelper.getCreds()})`)
        getRecentlyPlayed(lcuHelper);
    });
})

function getRecentlyPlayed(lcuHelper: any) {
    lcuHelper.getRecentlyPlayed()
        .then((response: any) => {
            const statusCode = getJSONValue(response, "status");
            const data = getJSONValue(response, "data");
            switch (statusCode) {
                case 200: updateTray(data, lcuHelper);
                    break;
                default: log("Recent players not found...")
            }
        })
}

function updateTray(data: any, lcuHelper: any) {
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
            help: lcuHelper,
            label: player["summonerName"],
            sublabel: "Seen: " + timeSince(new Date(player["gameCreationDate"])),
            type: "normal",
            click: handleClick
        }
    })
    // Update context menu
    trayMenu.updateRecentlyPlayedMenu(items)
    const contextMenu = Menu.buildFromTemplate(trayMenu.getMenu())
    tray.setContextMenu(contextMenu);
}

function handleClick(menuItem: any) {
    menuItem["help"].sendInvite(menuItem["id"])
        .then((response: any) => {
            const statusCode = getJSONValue(response, "status");
            const data = getJSONValue(response, "data");
            switch (statusCode) {
                case 200: log("invite sent")
                    break;
                default: log(`Failed to send invite: ${getJSONValue(data, "message")}`)
            }
        })
}

// https://stackoverflow.com/a/3177838
function timeSince(date: any) {
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

// https://stackoverflow.com/a/48288237
function addItemEvery(arr: any[], item: any, frequency: number, starting: number = 0) {
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