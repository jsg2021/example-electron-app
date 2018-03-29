/*eslint import/no-commonjs: 0, strict: 0*/
'use strict';
const path = require('path');

if (process.versions.electron) {
	//eslint-disable-next-line
	global.ElectronAPI = require('electron');
}

const mainModule = path.resolve(__dirname, '../index.mjs');

require('./polyfills');
require('esm')(module)(mainModule);
