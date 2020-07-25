// Node Imports
const LCUConnector = require('lcu-connector');
const { app, Menu, Tray } = require('electron')
const getJSONValue = require('lodash/get');

const LCUHelper = require("./LCUHelper");

const connector = new LCUConnector();
const log = console.log;
let currentLCUHelperInstance = null;
let tray = null;

// TODO: Trigger context menu update when game is done loaded - how?

app.whenReady().then(() => {
    tray = new Tray('assets/icon.png');
    const contextMenu = Menu.buildFromTemplate([])
    tray.setToolTip('This is my application.')
    tray.setContextMenu(contextMenu);
    //
    // Run
    connector.start();
    connector.on('connect', (connectorInfo) => {
        let lcuHelper = new LCUHelper(connectorInfo);
        log(`Found active client instance. Loading instance (${lcuHelper.getCreds()})`)
        currentLCUHelperInstance = lcuHelper;
        getRecentlyPlayed(lcuHelper);
    });
})

function getRecentlyPlayed(lcuHelper) {
    lcuHelper.getRecentlyPlayed()
        .then(response => {
            const statusCode = getJSONValue(response, "status");
            const data = getJSONValue(response, "data");
            switch (statusCode) {
                case 200: updateTray(data, lcuHelper);
                    break;
                default: log("Recent players not found...")
            }
        })
}

function updateTray(data, lcuHelper) {
    // Sort by most recent
    data = data.sort((a, b) => (Date.parse(a["gameCreationDate"]) < Date.parse(b["gameCreationDate"])) ? 1 : -1);
    // Keep the newest duplicate
    data = data.filter((item, index) => {
        return data.indexOf(item) >= index;
    })
    data = data.slice(0, 20);
    // Create array of menu items
    // TODO: Add logic for champion icon (dataURL = base64)
    let items = data.map((player) => {
        return {
            id: player["summonerId"],
            help: lcuHelper,
            label: player["summonerName"],
            sublabel: "Seen: " + timeSince(new Date(player["gameCreationDate"])),
            type: "normal",
            click: handleClick
        }
    })
    // TODO: Make a method that adds a seperator between different times
    items = addItemEvery(items, { type: "separator" }, 9);
    // Update context menu
    const contextMenu = Menu.buildFromTemplate([{ label: "Recently Played", submenu: items }])
    tray.setContextMenu(contextMenu);
}

function buildContextMenu() {

}


function handleClick(menuItem) {
    menuItem["help"].sendInvite(menuItem["id"])
        .then(response => {
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
function timeSince(date) {
    var seconds = Math.floor((new Date() - date) / 1000);
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
function addItemEvery(arr, item, frequency, starting = 0) {
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