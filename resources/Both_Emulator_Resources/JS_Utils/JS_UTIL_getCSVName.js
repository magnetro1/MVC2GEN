// import * as readline from 'node:readline/promises';
import * as fs from 'fs';
import {DIR_CSVS} from './JS_UTIL_paths.js';
var csvArray = [];

fs.readdirSync(DIR_CSVS).forEach(function (file)
{
  if (file.endsWith('.csv') || file.endsWith('.CSV'))
  {
    csvArray.push(file);
  }
});

export const answer = csvArray;
