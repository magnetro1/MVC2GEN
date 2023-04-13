import * as readline from 'node:readline/promises';
import * as fs from 'fs';
import {DIR_CSVS} from './JS_UTIL_paths.js';
const rl = readline.createInterface
  ({
    input: process.stdin,
    output: process.stdout,
  });

export const answer = await rl.question('Rename to? ');
rl.close();

// Find newest CSV file
const csvFiles = fs.readdirSync(DIR_CSVS).filter(function (file)
{
  return file.endsWith('.csv') || file.endsWith('.CSV');
});
const newestCSV = csvFiles.reduce(function (previous, current) // needs directory + previouis/current
{
  return fs.statSync(DIR_CSVS + previous).mtimeMs > fs.statSync(DIR_CSVS + current).mtimeMs
    ? previous
    : current;
});

fs.renameSync(DIR_CSVS + newestCSV, DIR_CSVS + answer + '.csv');

//dizzy formula?
//  attack_immune = 2
//  proxblock = 13
//  knockdown = 32
//  Dizzy_Reset_Timer = 60 // normally 0
//  dizzy = 80
