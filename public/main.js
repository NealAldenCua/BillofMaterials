const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    title: "Bill of Materials",
    frame:true,

    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      worldSafeExecution: true,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });
  // win.loadFile(path.join(__dirname, 'build', 'index.html'));
  win.loadURL(
    true
      ? 'http://localhost:3000'
      : `file://${path.resolve(path.join(__dirname,'..','build','index.html'))}`
  );
}

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
