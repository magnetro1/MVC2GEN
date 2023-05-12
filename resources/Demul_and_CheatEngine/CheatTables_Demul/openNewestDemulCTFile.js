// Open Newest CT file from directory
import * as fs from 'fs';
import { exec } from 'child_process';

const DIR_Demul_CT_FILES = import.meta.url.replace('file:///', '').replace('openNewestDemulCTFile.js', '');
const CT_EXT = '.CT';

function reduceNewestFile(previous, current) {
  return fs.statSync(DIR_Demul_CT_FILES + previous).mtimeMs > fs.statSync(DIR_Demul_CT_FILES + current).mtimeMs ? previous : current;
};
// filter for CT files
function filterCTFile() {
  const files = fs.readdirSync(DIR_Demul_CT_FILES);
  const cheatTables = files.filter(function (file) {
    return file.endsWith(CT_EXT);
  });
  return cheatTables.reduce(reduceNewestFile)
}
exec(filterCTFile(), {
  cwd: DIR_Demul_CT_FILES
});
