import * as fs from "fs";
import { cwd } from "process";
import path from 'path';

export const DIR_MAIN_TRUNK = cwd();
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

// Paths to Emulator Directories; using the executables
// to verify the directories
let tempPSCSX2 = '';
let tempDEMUL = '';

// Define the base directories
const baseDirs = [
  ['F:', 'OneDrive', 'DesktopPC', 'Emulators'],
  ['C:', 'Users', 'davil', 'OneDrive', 'L2', 'Emulators'],
  ['C:', 'Users', 'davil', 'OneDrive', 'L3', 'Emulators'],
];

// Emulator names and corresponding executable file names
const emulatorFolders = ['PCSX2RR', 'DEMUL'];
const emulatorExecutables = ['pcsx2.exe', 'demul.exe'];

function testFileExists(dir, file) {
  const filePath = path.join(dir, file);
  return fs.existsSync(filePath);
}

/*
Need to access elements from both arrays simultaneously

The for...of loop: only need to access the elements of
baseDirs sequentially.
The i-loop: access elements of emulatorFolders and
emulatorExecutables array at the same index.
*/
for (const baseDir of baseDirs) { // iterate over base directories
  for (let i = 0; i < emulatorFolders.length; i++) {
    const dir = path.join(...baseDir, emulatorFolders[i]);
    // console.log(dir)
    if (testFileExists(dir, emulatorExecutables[i])) {
      if (i === 0) {
        // console.log("PCSX2 Directory:", dir);
        tempPSCSX2 = dir;
      } else {
        // console.log("DEMUL Directory:", dir);
        tempDEMUL = dir;
      }
    }
  }
}

export const DIR_PCSX2 = tempPSCSX2;
export const DIR_DEMUL = tempDEMUL;

function testDir(dir) {
  // check if the directory exists
  if (fs.existsSync
    (dir)) {
    console.log("Directory exists:", dir);
    // log the contents of the directory
    const files = fs.readdirSync(dir);
    console.log("Files in directory:", files);
  } else {
    console.log("Directory does not exist:");
  }
}

// testDir(DIR_PCSX2);
