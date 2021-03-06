const electron = require('electron')
const ipcMain = electron.ipcMain;
const isDev = require('electron-is-dev')
const log = require('electron-log')
const autoUpdater = require("electron-updater").autoUpdater
const settings = require("electron-settings")
const fs = require('fs')
const path = require('path')

const ipcEvents = require('./ipc-events')
const packageJson = require('../package.json')

autoUpdater.logger = log
autoUpdater.logger.transports.file.level = 'info'
log.info('App starting...')

// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

const url = require('url')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({ width: 800, height: 600 })

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Open the DevTools.
  if (isDev) {
    mainWindow.webContents.openDevTools()
    // require('devtron').install()
  }

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })

  mainWindow.webContents.on('did-finish-load', () => {
    checkForUpdate();
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  log.info('window-all-closed called')
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('will-quit', function () {
  log.info('wll-quit called')

  saveFirtsRun()
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

function sendIpcToWindow(message, arg) {
  if (!mainWindow)
    return;

  mainWindow.webContents.send(message, arg)
}

// =================================================
// Auto Update Block
// =================================================
function checkForUpdate() {
  if (isDev) {
    log.info('Application update is not working in dev mode.')
    return
  }

  if (isFirstRun()) {
    log.info('Application update is skipping at first run.')
    return
  }

  autoUpdater.checkForUpdates()
}

autoUpdater.on('checking-for-update', () => {
  sendIpcToWindow(ipcEvents.autoUpdate.checkingForUpdate)
})

autoUpdater.on('update-available', (ev, info) => {
  autoUpdater.downloadUpdate()
  sendIpcToWindow(ipcEvents.autoUpdate.updateAvalilable, info)
})

autoUpdater.on('update-not-available', (ev, info) => {
  sendIpcToWindow(ipcEvents.autoUpdate.updateNotAvailable, info)
})

autoUpdater.on('error', (ev, err) => {
  sendIpcToWindow(ipcEvents.autoUpdate.autoUpdateError, err)
})

autoUpdater.on('download-progress', (progressObj) => {
  sendIpcToWindow(ipcEvents.autoUpdate.autoUpdateDownloadProgress, progressObj)
})

autoUpdater.on('update-downloaded', (ev, info) => {
  sendIpcToWindow(ipcEvents.autoUpdate.autoUpdateDownloaded, info)
})

ipcMain.on(ipcEvents.autoUpdate.autoUpdateRestart, () => {
  autoUpdater.quitAndInstall()
})

function isFirstRun() {
  if (!settings.has('firstRunVersion')) {
    return true
  }
  const firstRunVersion = settings.get('firstRunVersion')
  log.info(`firstRunVersion: ${firstRunVersion}`)
  log.info(`package.version: ${packageJson.version}`)

  return firstRunVersion !== packageJson.version
}

function saveFirtsRun() {
  settings.set('firstRunVersion', packageJson.version)
}
