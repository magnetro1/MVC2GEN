// Open Newest CT file from directory
import * as fs from 'fs';
import { exec } from 'child_process';
import { DIR_DEMUL_CT_FILES, DIR_PCSX2_CT_FILES, CT_EXT } from '../../Both_Emulator_Resources/JS_Utils/JS_UTIL_paths.js';



// Open Newest CT file from directory using exec()
/**
 * @param {string} pcsx2OrDemul
 * @returns {void}
 * */
function openNewestCTFile(pcsx2OrDemul) {
  let answer = prompt('Please enter either "pcsx2" or "demul"');

  if (pcsx2OrDemul === 'pcsx2') {
    answer = DIR_PCSX2_CT_FILES
  }
  if (pcsx2OrDemul === 'demul') {
    answer = DIR_DEMUL_CT_FILES
  }

  const files = fs.readdirSync(answer);
  const cheatTables = files.filter((file) => file.endsWith(CT_EXT));

  const newestFile = cheatTables.reduce((previous, current) => {
    let prevTime = fs.statSync(answer + previous).mtimeMs;
    let currTime = fs.statSync(answer + current).mtimeMs;
    if (prevTime > currTime) {
      return previous;
    } else {
      return current;
    }
  });

  exec(newestFile, {
    cwd: answer
  });
}

openNewestCTFile('demul');
openNewestCTFile('pcsx2');
