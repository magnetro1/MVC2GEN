// Open Newest CT file from directory
import * as fs from 'fs';
import {exec} from 'child_process';

import {PCSX2_CT_FILES_DIR} from './paths_aliases.js';

const CT_EXT = '.CT';

function getNewestCTFile()
{
  const files = fs.readdirSync(PCSX2_CT_FILES_DIR);
  const cheatTables = files.filter(file =>
    file.endsWith(CT_EXT));
  const newestPCSX2CT = cheatTables.reduce((previous, current) =>
    fs.statSync(PCSX2_CT_FILES_DIR + previous).mtimeMs > fs.statSync(PCSX2_CT_FILES_DIR + current).mtimeMs ? previous : current);
  return newestPCSX2CT;
}
// Launch newest CT file
function launchNewestPCSX2CTFile()
{
  const newestPCSX2CTFullPath = PCSX2_CT_FILES_DIR + getNewestCTFile();
  exec(newestPCSX2CTFullPath)
}
launchNewestPCSX2CTFile();