const {app, BrowserWindow} = require("electron");
const url = require("url");
const path = require("path");
// const logger = require("./process/process-logger");

require("dotenv").config({path: path.join(__dirname, ".env")});

const prod = process.env.NODE_ENV === "production" || process.env.NODE_ENV === "staging";

if (!prod) {
    require("electron-debug")({showDevTools: true, enabled: true});
}
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;

function createWindow () {
    // Create the browser window.
    win = new BrowserWindow({minHeight: 600, minWidth: 900});

    /* This line loads the web server URL which controls which content to display.
       In most cases, this will be the index.html file that react.js will send over.
       If we choose to do a web server and separate API, then this would be replaced
       with the URL of the web server.
  */
    if (prod) {
        // logger.transports[0].level = "debug";
        // logger.info("------------STARTING EMS IN PRODUCTION MODE------------");
        win.loadURL(url.format({
            pathname: path.join(__dirname, "./build/index.html"),
            protocol: "file:",
            slashes: true
        }));
    } else {
        // logger.transports[0].level = "debug";
        // logger.info("------------STARTING EMS IN DEVELOPMENT MODE------------");
        win.loadURL("http://localhost:3000/");
    }

    // require("./process/communication-process");
    // require("./process/request-dialogs");
    // require("./process/match-maker-process");

    win.maximize();
    win.setMenu(null);

    // Emitted when the window is closed.
    win.on("closed", () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        win = null;
    });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed.
app.on("window-all-closed", () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== "darwin") {
    app.quit();
}
});

app.on("activate", () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
    createWindow();
}
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.