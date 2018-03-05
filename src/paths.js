/*eslint import/no-commonjs:0*/
//This file is in commonjs form because esm does not define __dirname, so we hack around it :P
const path = require('path');

const USER = process.env.HOME;

Object.assign(module.exports, {

	dirname: path.resolve(__dirname),

	USER
});
