import { app, BrowserWindow, globalShortcut } from "electron";
// import { autoUpdater } from 'update-electron-app';
import path from "path";
import { fileURLToPath } from "url";
import Store from "electron-store";

import startNeteaseMusicApi from "./src/electron/services.mjs";
import IpcMainEvent from "./src/electron/ipcMain.mjs";
import MusicDownload from "./src/electron/download.mjs";
import LocalFiles from "./src/electron/localmusic.mjs";
import InitTray from "./src/electron/tray.mjs";
import registerShortcuts from "./src/electron/shortcuts.mjs";

const settingsStore = new Store({ name: "settings" });

// 获取 __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let myWindow = null;

// Electron 单例
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
    app.quit();
} else {
    app.on("second-instance", (event, commandLine, workingDirectory) => {
        if (myWindow) {
            if (myWindow.isMinimized()) myWindow.restore();
            if (!myWindow.isVisible()) myWindow.show();
            myWindow.focus();
        }
    });

    app.whenReady().then(() => {
        createWindow();
        app.on("activate", () => {
            if (BrowserWindow.getAllWindows().length === 0) createWindow();
        });
    });

    app.on("window-all-closed", () => {
        if (process.platform !== "darwin") app.quit();
    });

    app.on("will-quit", () => {
        // 注销所有快捷键
        globalShortcut.unregisterAll();
    });
}

const createWindow = () => {
    process.env.DIST = path.join(__dirname, "./");
    const indexHtml = path.join(process.env.DIST, "dist/index.html");

    const win = new BrowserWindow({
        defaultWidth: 1024,
        defaultHeight: 672,
        minWidth: 1024,
        minHeight: 672,
        frame: false,
        title: "Hydrogen Music",
        icon: path.resolve(__dirname, "./src/assets/icon/icon.ico"),
        backgroundColor: "#fff",
        // 记录窗口大小
        //...winState.winOptions,
        show: false,
        webPreferences: {
            // 预加载脚本
            preload: path.resolve(__dirname, "./src/electron/preload.mjs"),
            webSecurity: false,
        },
    });

    myWindow = win;

    if (process.resourcesPath.includes("\\node_modules\\")) {
        // dev mode
        win.loadURL("http://localhost:5173/");
    } else {
        win.loadFile(indexHtml);
    }

    win.once("ready-to-show", () => {
        win.show();
        // 先关了自动更新
        // if (process.resourcesPath.indexOf('\\node_modules\\') === -1) {
        //     autoUpdater.autoDownload = false;
        //     autoUpdater.on('update-available', info => {
        //         win.webContents.send('check-update', info.version);
        //     });
        //     autoUpdater.checkForUpdatesAndNotify();
        // }
    });


    win.on("close", async (event) => {
        event.preventDefault();
        const settings = await settingsStore.get("settings");
        if (settings.other.quitApp === "minimize") {
            win.hide();
        } else if (settings.other.quitApp === "quit") {
            win.webContents.send("player-save");
        }
    });

    // API 初始化
    startNeteaseMusicApi();

    // ipcMain 初始化
    IpcMainEvent(win, app);
    MusicDownload(win);
    LocalFiles(win, app);
    InitTray(win, app, path.resolve(__dirname, "./src/assets/icon/icon.ico"));
    registerShortcuts(win);
};

process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = "true";
