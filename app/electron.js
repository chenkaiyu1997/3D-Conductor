'use strict'

const electron = require('electron')
const path = require('path')
const initLogin = require('./login');
const app = electron.app
const BrowserWindow = electron.BrowserWindow

let mainWindow
let config = {}

if (process.env.NODE_ENV === 'development') {
	config = require('../config')
	config.url = `http://localhost:${config.port}`
} else {
	config.devtron = false
	config.url = `file://${__dirname}/dist/index.html`
}

function createWindow () {
	/**
	 * Initial window options
	 */
	mainWindow = new BrowserWindow({
		height: 720,
		width: 1280,
		webPreferences: {
			webSecurity: false,
		},
	})

	if (process.env.NODE_ENV === 'development') {
		BrowserWindow.addDevToolsExtension(path.join(__dirname, '../node_modules/devtron'))

		let installExtension = require('electron-devtools-installer')

		installExtension.default(installExtension.VUEJS_DEVTOOLS)
			.then((name) => mainWindow.webContents.openDevTools())
			.catch((err) => console.log('An error occurred: ', err))
	}

	mainWindow.on('closed', () => {
		mainWindow = null
	})

	initLogin(mainWindow, config);

	console.log('mainWindow opened')
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit()
	}
})

app.on('activate', () => {
	if (mainWindow === null) {
		createWindow()
	}
})
