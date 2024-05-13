// Open Newest CT file from directory
import * as fs from 'fs';
import { exec } from 'child_process';

const CT_EXT = '.CT' || '.ct';

// We get our current directory and remove the file name
const DIR_CT_FILES = import.meta.url
  .replace('file:///', '')
  .replace('openNewestPCSX2CTFile.js', '');

// get the newest file
function reduceNewestFile(prev, curr) {
  let prevFileDate = fs.statSync(DIR_CT_FILES + prev).mtimeMs;
  let currFileDate = fs.statSync(DIR_CT_FILES + curr).mtimeMs;
  if (prevFileDate > currFileDate) {
    return prev;
  } else {
    return curr;
  }
};

// Find CT file
function filterCTFile() {
  const files = fs.readdirSync(DIR_CT_FILES);
  const cheatTables = files.filter((file) => file.endsWith(CT_EXT));
  return cheatTables.reduce(reduceNewestFile)
}

// Open CT file
exec(filterCTFile(), {
  cwd: DIR_CT_FILES,
  windowsHide: true,
  detached: true,
  shell: true,
});
