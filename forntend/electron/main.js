// electron/main.js
import { app, BrowserWindow, powerMonitor } from 'electron';
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function createWindow() {
  const preloadPath = path.join(__dirname, 'preload.cjs');

  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: preloadPath,
      contextIsolation: true,
      nodeIntegration: false,
    }
  });

  win.webContents.on("did-finish-load", () => {

    let isInactive = false;

    // Check every 2 seconds
    setInterval(() => {
      const idleTime = powerMonitor.getSystemIdleTime(); // seconds

      // If idle more than 5 sec → inactive
      if (idleTime >= 60 && !isInactive) {
        isInactive = true;
        
        win.webContents.send("user-status", false);
      }

      // If user becomes active again
      if (idleTime < 5 && isInactive) {
        isInactive = false;
        
        win.webContents.send("user-status", true);
      }

    }, 2000);
  });

  if (process.env.NODE_ENV === "development") {
    win.loadURL("http://localhost:5173");
  } else {
    win.loadFile(path.join(__dirname, "../dist/index.html"));
  }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});