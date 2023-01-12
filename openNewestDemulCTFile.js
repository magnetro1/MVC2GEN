// Open Newest CT file from directory
import * as fs from 'fs';
import {exec} from 'child_process';

import {DEMUL_CT_FILES_DIR} from './paths_aliases.js';

const CT_EXT = '.CT';

function getNewestCTFile()
{
  const files = fs.readdirSync(DEMUL_CT_FILES_DIR);
  const cheatTables = files.filter(file =>
    file.endsWith(CT_EXT));
  const newestDemulCT = cheatTables.reduce((previous, current) =>
    fs.statSync(DEMUL_CT_FILES_DIR + previous).mtimeMs > fs.statSync(DEMUL_CT_FILES_DIR + current).mtimeMs ? previous : current);
  return newestDemulCT;
}
// Launch newest CT file
function launchNewestDemulCTFile()
{
  const newestDemulCTFullPath = DEMUL_CT_FILES_DIR + getNewestCTFile();
  exec(newestDemulCTFullPath)
}
launchNewestDemulCTFile();