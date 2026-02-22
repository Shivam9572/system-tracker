// electron/preload.js
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
   onStatus: (callback) => {
    ipcRenderer.on("user-status", (event, data) => {
      callback(data);
    });
}});
