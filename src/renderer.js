// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const ipcRenderer = require('electron').ipcRenderer

const packageJson = require('../package.json')
const ipcEvents = require('./ipc-events')

// =======================================
// Auto update IPC events
// =======================================
ipcRenderer.on(ipcEvents.autoUpdate.updateAvalilable, (event, arg) => {
  writeUpdateState(ipcEvents.autoUpdate.updateAvalilable, arg)
})

ipcRenderer.on(ipcEvents.autoUpdate.updateNotAvailable, (event, arg) => {
  writeUpdateState(ipcEvents.autoUpdate.updateNotAvailable, arg)
})

ipcRenderer.on(ipcEvents.autoUpdate.autoUpdateError, (event, arg) => {
  writeUpdateState(ipcEvents.autoUpdate.autoUpdateError, arg)
})

ipcRenderer.on(ipcEvents.autoUpdate.autoUpdateError, (event, arg) => {
  writeUpdateState(ipcEvents.autoUpdate.autoUpdateError, arg)
})

ipcRenderer.on(ipcEvents.autoUpdate.autoUpdateDownloadProgress, (event, arg) => {
  writeUpdateState(ipcEvents.autoUpdate.autoUpdateDownloadProgress, arg)
})

ipcRenderer.on(ipcEvents.autoUpdate.autoUpdateDownloaded, (event, arg) => {
  writeUpdateState(ipcEvents.autoUpdate.autoUpdateDownloaded, arg)
  updateDownloaded();
})

function writeUpdateState(state, arg) {
  const div = document.getElementById('update-state');
  div.innerHTML = JSON.stringify({ state, arg });
}

function updateDownloaded() {
  const div = document.getElementById('update-available-panel');
  div.className = div.className.replace('hidden', '')
}

document.getElementById('updateButton').addEventListener('click', () => {
  ipcRenderer.send(ipcEvents.autoUpdate.autoUpdateRestart)
})

document.getElementById('noUpdateButton').addEventListener('click', () => {
  const div = document.getElementById('update-available-panel');
  div.className = div.className + ' hidden'
})

document.getElementById('appVersion').innerHTML = packageJson.version
