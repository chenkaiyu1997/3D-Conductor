const path = require('path');
const config = require('./config');

function initLogin(window, elecConf) {

	function handleCallback (url) {
		const prefix = `${config.server}/oauth/success?login=`;
		if (url.startsWith(prefix)) {
			window.webContents.stop();
			const login = decodeURIComponent(url.slice(prefix.length));
			window.loadURL(elecConf.url);
		}
	}

	window.webContents.on('did-get-redirect-request', function (event, oldUrl, newUrl) {
		handleCallback(newUrl);
	});

	window.loadURL(`${config.server}/oauth/auth`);
}

module.exports = initLogin;
