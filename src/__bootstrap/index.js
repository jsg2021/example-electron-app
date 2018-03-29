/*eslint import/no-commonjs: 0, strict: 0*/
'use strict';
const path = require('path');

const esmOpts = {
	"cjs": {
		interop: true,
		namedExports: true
	}
};

if (process.versions.electron) {
	//eslint-disable-next-line
	global.ElectronAPI = require('electron');
}

const mainModule = path.resolve(__dirname, '../index.mjs');

require('./polyfills');
require('esm')(module, esmOpts)(mainModule);
