// Open Newest CT file from directory
import * as fs from 'fs';
import {exec} from 'child_process';

import {DIR_PCSX2_CT_FILES} from '../../Both_Emulator_Resources/JS_Utils/JS_UTIL_paths.js';

const CT_EXT = '.CT';

function getNewestCTFile()
{
  const files = fs.readdirSync(DIR_PCSX2_CT_FILES);
  const cheatTables = files.filter(file =>
    file.endsWith(CT_EXT));
  const newestPCSX2CT = cheatTables.reduce((previous, current) =>
    fs.statSync(DIR_PCSX2_CT_FILES + previous).mtimeMs > fs.statSync(DIR_PCSX2_CT_FILES + current).mtimeMs ? previous : current);
  return newestPCSX2CT;
}
// Launch newest CT file
function launchNewestPCSX2CTFile()
{
  const newestPCSX2CTFullPath = DIR_PCSX2_CT_FILES + getNewestCTFile();
  exec(newestPCSX2CTFullPath)
}
launchNewestPCSX2CTFile();