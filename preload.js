const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('dayboard', {
  platform: process.platform,
  version: '1.0.0',
  notify: reminder => ipcRenderer.send('show-reminder', reminder)
});
