import * as fs from "fs";
import { fileURLToPath } from 'url';
import path from 'path';

const REPO_NAME = 'MVC2GEN';

// Get the current file path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Find the position of the repository name in the path
const repoNameLocation = __dirname.indexOf(REPO_NAME);

// Extract the base directory path up to the repository name
let baseDir = __dirname.substring(0, repoNameLocation + REPO_NAME.length);

// Normalize the path
baseDir = path.join(baseDir);

export const DIR_MAIN_TRUNK = baseDir;
export const DIR_RESOURCES = path.join(DIR_MAIN_TRUNK, 'resources');
export const DIR_JS_UTILS = path.join(DIR_RESOURCES, 'Both_Emulator_Resources', 'JS_Utils');
export const DIR_CSVS = path.join(DIR_JS_UTILS, 'CSV_FILES');
export const DIR_EXPORT_TO_AE = path.join(DIR_JS_UTILS, 'exportToAE');

//// export const DIR_SORTED_JS = `${DIR_JS_UTILS}SortedJS/`;
//// export const TAIL_TEXT = "_Sorted_Node.js";

// Paths to Cheat Tables in this Github Repository
export const DIR_DEMUL_CT_FILES = path.join(DIR_RESOURCES, 'Demul_and_CheatEngine', 'CheatTables_Demul');
export const DIR_PCSX2_CT_FILES = path.join(DIR_RESOURCES, 'PCSX2RR_and_CheatEngine', 'CheatTables_PCSX2');
export const CT_EXT = ".CT";

// Paths to Emulator Directories
// Using the executables as verification
let tempPSCSX2 = '';
let tempDEMUL = '';

// Define the base directories of each machine
const baseDirs = [
  ['F:', 'OneDrive', 'DesktopPC', 'Emulators'],
  ['C:', 'Users', 'davil', 'OneDrive', 'L2', 'Emulators'],
  ['C:', 'Users', 'davil', 'OneDrive', 'L3', 'Emulators'],
];

const emulatorFolders = ['PCSX2RR', 'DEMUL'];
const emulatorExecutables = ['pcsx2.exe', 'demul.exe'];

function testFileExists(dir, file) {
  const filePath = path.join(dir, file);
  return fs.existsSync(filePath);
}

/*
The for...of loop: only need to access the elements of
baseDirs sequentially.
The i-loop: access elements of emulatorFolders and
emulatorExecutables array at the same index.
*/
for (const baseDir of baseDirs) {
  for (let i = 0; i < emulatorFolders.length; i++) {
    const EMULATOR_DIR = path.join(...baseDir, emulatorFolders[i]);
    if (testFileExists(EMULATOR_DIR, emulatorExecutables[i])) {
      if (i === 0) { // if true and if i is 0, then it's PCSX2
        tempPSCSX2 = EMULATOR_DIR;
      } else {
        tempDEMUL = EMULATOR_DIR;
      }
    }
  }
}

export const DIR_PCSX2 = tempPSCSX2;
export const DIR_DEMUL = tempDEMUL;
