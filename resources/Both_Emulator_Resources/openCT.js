import * as fs from 'fs';
import { DIR_DEMUL_CT_FILES, DIR_PCSX2_CT_FILES, CT_EXT } from './JS_TOOLS/Utils/Paths.js';
import { exec } from 'child_process';

export function reduceNewestFile(DIR_CT_FILES, previous, current) {
  let prev = fs.statSync(`${DIR_CT_FILES}/${previous}`).mtimeMs;
  let curr = fs.statSync(`${DIR_CT_FILES}/${current}`).mtimeMs;
  return prev > curr ? previous : current;
}

export function filterCTFile(DIR_CT_FILES) {
  const files = fs.readdirSync(DIR_CT_FILES);
  const cheatTables = files.filter((file) => file.endsWith(CT_EXT));
  if (cheatTables.length === 0) {
    console.log(`No cheat tables found in directory: ${DIR_CT_FILES}`);
    return null;
  }
  return cheatTables.reduce((prev, curr) => reduceNewestFile(DIR_CT_FILES, prev, curr));
}

export function openNewestCTFile(emulator) {
  let DIR_CT_FILES;
  if (emulator === 'pcsx2') {
    DIR_CT_FILES = DIR_PCSX2_CT_FILES;
  } else if (emulator === 'demul') {
    DIR_CT_FILES = DIR_DEMUL_CT_FILES;
    console.log(DIR_CT_FILES);
  } else {
    console.log('Invalid emulator');
    return;
  }

  const newestCTFile = filterCTFile(DIR_CT_FILES);
  if (newestCTFile) {
    exec(`${DIR_CT_FILES}/${newestCTFile}`, { cwd: DIR_CT_FILES }, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing file: ${error.message}`);
        return;
      }
      if (stderr) {
        console.error(`stderr: ${stderr}`);
        return;
      }
      console.log(`Opening file: ${newestCTFile}`);

      // Introduce a delay to keep the console open
      new Promise((resolve) => {
        setTimeout(() => {
          resolve();
        }, 5000); // 5 seconds delay
      }).then(() => {
        console.log('Closing console after delay');
      });
    });
  }
}
