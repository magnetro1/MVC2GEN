const fs = require('fs');
const kdFile = './constObjects/constKnockdownState.js';
let data = fs.readFileSync(kdFile, 'utf8');
var reg = /Pushblocking/gm;
var helloWorld = data.match(reg)
console.log(helloWorld)