const { app, BrowserWindow, globalShortcut } = require('electron')
const path = require('path')

let mainWindow; // Pencere referansını global olarak tutuyoruz

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

    // Kısayol tuşlarını tanımlıyoruz
    globalShortcut.register('Alt+Left', () => {
        if (mainWindow.webContents.canGoBack()) {
            mainWindow.webContents.goBack()
        }
    })

    globalShortcut.register('Alt+Right', () => {
        if (mainWindow.webContents.canGoForward()) {
            mainWindow.webContents.goForward()
        }
    })

    // F5 ile sayfa yenileme kısayolu
    globalShortcut.register('F5', () => {
        mainWindow.webContents.reload()
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