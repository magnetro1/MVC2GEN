let fs = require('fs');
let rd = require('readline-sync');
let nameRaw = 'hello';
let fExt = '.txt';
let fName = nameRaw + fExt;
let userText = rd.question('Enter text:');
let newTxt = nameRaw + '_bak' + fExt

fs.promises.copyFile(fName, nameRaw + '_bak' + fExt).then(() =>
  fs.promises.appendFile(newTxt, userText)).then(() =>
    fs.promises.readFile(newTxt, 'utf-8')).then((data) => console.log(data)).catch((err) => console.log(err));