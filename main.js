const { app, BrowserWindow } = require('electron')
const path = require('path')

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: true
        }
    });

    mainWindow.loadURL('https://www.chatgpt.com')
    mainWindow.setMenu(null)

    // CSS enjekte etme
    mainWindow.webContents.on('did-finish-load', () => {
        mainWindow.webContents.insertCSS(
            require('fs').readFileSync(
                path.join(__dirname, 'styles.css'),
                'utf8'
            )
        )
    })

    // Lokalize edilmiş kısayol kontrolü
    mainWindow.webContents.on('before-input-event', (event, input) => {
        if (input.key === 'F5') {
            mainWindow.webContents.reload()
        }
        else if (input.alt && input.key === 'ArrowLeft') {
            if (mainWindow.webContents.canGoBack()) {
                mainWindow.webContents.goBack()
            }
        }
        else if (input.alt && input.key === 'ArrowRight') {
            if (mainWindow.webContents.canGoForward()) {
                mainWindow.webContents.goForward()
            }
        }
    })
}

// Uygulama kapanırken kısayolları temizleme
app.on('will-quit', () => {
    globalShortcut.unregisterAll()
})

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
    try {
        const favicon = document.createElement('link');
        favicon.rel = 'shortcut icon'
        favicon.type = 'image/x-icon';
        favicon.href = './libs/icon.ico';
        document.head.appendChild(favicon);
    }
    catch (e) {
        alert(e)
    }

    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
});
