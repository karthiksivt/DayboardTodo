const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('dayboard', {
  platform: process.platform,
  version: require('electron').app?.getVersion?.() || '1.0.0',
  notify: reminder => ipcRenderer.send('show-reminder', reminder),
  checkForUpdates: () => ipcRenderer.invoke('check-for-updates'),
  downloadUpdate: () => ipcRenderer.invoke('download-update'),
  installUpdate: () => ipcRenderer.invoke('install-update'),
  openUpdatePage: () => ipcRenderer.invoke('open-update-page'),
  onUpdateStatus: callback => ipcRenderer.on('update-status', (_event, payload) => callback(payload))
});
