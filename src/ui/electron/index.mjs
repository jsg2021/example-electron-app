import fs from 'fs';
import path from 'path';
import url from 'url';
import https from 'https';

import {dirname} from '../../paths';

const agent = new https.Agent({
	rejectUnauthorized: false
});

const DEV_UI_URL = 'https://localhost:3000';
const DEV_UI_WSS = Object.assign(url.parse(DEV_UI_URL), {protocol: 'wss'}).format();


export default async function createUI () {
	const {app, shell, BrowserWindow} = global.ElectronAPI;
	const pathname = path.join(dirname, '../packages/electron-view/build/index.html');
	const isDev = !fs.existsSync(pathname);

	// Keep a global reference of the window object, if you don't, the window will
	// be closed automatically when the JavaScript object is garbage collected.
	let win;

	function createWindow () {
		// Create the browser window.
		win = new BrowserWindow({
			width: 800,
			height: 600,
			show: false,
		});

		const handleRedirect = (e, url) => {
			if(url !== win.webContents.getURL()) {
				e.preventDefault();
				shell.openExternal(url);
			}
		};

		win.webContents.on('will-navigate', handleRedirect);
		win.webContents.on('new-window', handleRedirect);

		win.once('ready-to-show', () => {
			win.show();
			// Open the DevTools.
			// win.webContents.openDevTools()
		});

		// and load the index.html of the app.
		win.loadURL(isDev
			? DEV_UI_URL
			: url.format({
				pathname,
				protocol: 'file:',
				slashes: true
			})
		);

		// Open the DevTools.
		// win.webContents.openDevTools();

		// Emitted when the window is closed.
		win.on('closed', () => {
			// Dereference the window object, usually you would store windows
			// in an array if your app supports multi windows, this is the time
			// when you should delete the corresponding element.
			win = null;
		});
	}

	// Quit when all windows are closed.
	app.on('window-all-closed', () => {
		console.log('all-closed')
		// On macOS it is common for applications and their menu bar
		// to stay active until the user quits explicitly with Cmd + Q
		if (process.platform !== 'darwin') {
			app.quit();
		}
	});

	if (isDev) {
		app.on('certificate-error', (event, webContents, sourceUrl, error, certificate, callback) => {
			if (sourceUrl.startsWith(DEV_UI_URL) || sourceUrl.startsWith(DEV_UI_WSS)) {
				//ignore dev-server's self-signed cert and allow the content to load from the dev server, deny all else.
				event.preventDefault();
				callback(true);
			} else {
				callback(false);
			}
		});
	}

	app.on('activate', () => {
		// On macOS it's common to re-create a window in the app when the
		// dock icon is clicked and there are no other windows open.
		if (win == null) { //(BrowserWindow.getAllWindows().length === 0)
			createWindow();
		}
	});

	// This method will be called when Electron has finished
	// initialization and is ready to create browser windows.
	// Some APIs can only be used after this event occurs.
	await app.whenReady();
	createWindow();
}
