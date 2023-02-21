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
const csvFiles = fs.readdirSync(DIR_CSVS).filter(file => file.endsWith('.csv'));
const newestCSV = csvFiles.reduce((previous, current) => fs.statSync(DIR_CSVS + previous).mtimeMs > fs.statSync(DIR_CSVS + current).mtimeMs ? previous : current);

fs.renameSync(DIR_CSVS + newestCSV, DIR_CSVS + answer + '_Original.csv');