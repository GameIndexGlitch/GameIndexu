const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
    const win = new BrowserWindow({
        width: 1280, // Resolução do Vazio de Marah
        height: 720,
        autoHideMenuBar: true, // Esconde o menu superior do Windows (Arquivo, Editar...)
    });

    // Carrega o arquivo HTML que o Vite vai gerar na pasta dist
    win.loadFile(path.join(__dirname, 'dist', 'index.html'));
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});