// Open Newest CT file from directory
import * as fs from 'fs';
import { exec } from 'child_process';

const CT_EXT = '.CT';

// We get our current directory and remove the file name
const DIR_CT_FILES = import.meta.url
  .replace('file:///', '')
  .replace('openNewestDemulCTFile.js', '');

function reduceNewestFile(previous, current) {
  let prev = fs.statSync(DIR_CT_FILES + previous).mtimeMs;
  let curr = fs.statSync(DIR_CT_FILES + current).mtimeMs;
  if (prev > curr) {
    return previous;
  } else {
    return current;
  }
};

// filter for CT files
function filterCTFile() {
  const files = fs.readdirSync(DIR_CT_FILES);
  const cheatTables = files.filter(function (file) {
    return file.endsWith(CT_EXT);
  });
  return cheatTables.reduce(reduceNewestFile)
}
exec(filterCTFile(), {
  cwd: DIR_CT_FILES
});
