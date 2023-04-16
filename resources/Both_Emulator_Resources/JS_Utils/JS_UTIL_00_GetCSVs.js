/* eslint-disable import/extensions */
import * as fs from 'fs';
import {
  DIR_CSVS,
} from './JS_UTIL_paths.js';

const CSV_FILES_ARRAY = [];

try {
  fs.readdirSync(DIR_CSVS).forEach((file) => {
    if (file.endsWith('.csv')
      || file.endsWith('.CSV')) {
      let temp = '';
      temp = file.toString().replace('.csv', '')
        || file.toString().replace('.CSV', '');
      CSV_FILES_ARRAY.push(temp);
    }
  });
} catch (error) {
  console.log(error);
}

export default CSV_FILES_ARRAY;
