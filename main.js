const { app, BrowserWindow, Menu, ipcMain, Notification } = require('electron');
const { autoUpdater } = require('electron-updater');
const path = require('path');

let mainWindow;

function sendUpdateStatus(status, details = {}) {
  if (mainWindow && !mainWindow.isDestroyed()) mainWindow.webContents.send('update-status', { status, ...details });
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1440,
    height: 920,
    minWidth: 1100,
    minHeight: 720,
    titleBarStyle: 'hiddenInset',
    backgroundColor: '#f7f1e7',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });
  mainWindow = win;
  win.loadFile('index.html');
}

ipcMain.on('show-reminder', (_event, reminder) => {
  if (!Notification.isSupported()) return;
  new Notification({ title: reminder.title || 'Dayboard reminder', body: reminder.body || 'Your planned time is here.', sound: 'default', silent: false }).show();
});

autoUpdater.autoDownload = false;
autoUpdater.autoInstallOnAppQuit = true;
autoUpdater.on('checking-for-update', () => sendUpdateStatus('checking'));
autoUpdater.on('update-available', info => sendUpdateStatus('available', { version: info.version }));
autoUpdater.on('update-not-available', info => sendUpdateStatus('not-available', { version: info.version }));
autoUpdater.on('download-progress', progress => sendUpdateStatus('downloading', { percent: Math.round(progress.percent) }));
autoUpdater.on('update-downloaded', info => sendUpdateStatus('downloaded', { version: info.version }));
autoUpdater.on('error', error => sendUpdateStatus('error', { message: error?.message || 'Update check failed.' }));

ipcMain.handle('check-for-updates', async () => {
  if (!app.isPackaged) return { status: 'development' };
  try {
    await autoUpdater.checkForUpdates();
    return { status: 'checking' };
  } catch (error) {
    sendUpdateStatus('error', { message: error?.message || 'Update check failed.' });
    return { status: 'error', message: error?.message || 'Update check failed.' };
  }
});
ipcMain.handle('download-update', async () => { await autoUpdater.downloadUpdate(); return { status: 'downloading' }; });
ipcMain.handle('install-update', () => { autoUpdater.quitAndInstall(); });

app.whenReady().then(() => {
  Menu.setApplicationMenu(null);
  createWindow();
  app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
});

app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
