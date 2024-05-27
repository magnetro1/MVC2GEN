import * as fs from "fs";
import { cwd } from "process";
import path from 'path';
import { fileURLToPath } from 'url';

// Convert import.meta.url to a file path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


export const DIR_MAIN_TRUNK = cwd();
export const DIR_RESOURCES = path.join(DIR_MAIN_TRUNK, 'resources');
export const DIR_JS_UTILS = path.join(DIR_RESOURCES, 'Both_Emulator_Resources', 'JS_Utils');
export const DIR_CSVS = path.join(DIR_JS_UTILS, 'CSV_FILES');
export const DIR_EXPORT_TO_AE = path.join(DIR_JS_UTILS, 'exportToAE');

//// export const DIR_SORTED_JS = `${DIR_JS_UTILS}SortedJS/`;
//// export const TAIL_TEXT = "_Sorted_Node.js";

// Paths to Cheat Tables
export const DIR_DEMUL_CT_FILES = path.join(DIR_RESOURCES, 'Demul_and_CheatEngine', 'CheatTables_Demul');
export const DIR_PCSX2_CT_FILES = path.join(DIR_RESOURCES, 'PCSX2RR_and_CheatEngine', 'CheatTables_PCSX2');
export const CT_EXT = ".CT";

// PCSX2RR Directory Check
export const PCSX2_DESKTOP_DIR = path.join('F:', 'OneDrive', 'DesktopPC', 'Emulators', 'PCSX2RR');
export const PCSX2_LAPTOP2_DIR = path.join('C:', 'Users', 'davil', 'OneDrive', 'L2', 'Emulators', 'PCSX2RR');
export const PCSX2_LAPTOP3_DIR = path.join('C:', 'Users', 'davil', 'OneDrive', 'L3', 'Emulators', 'PCSX2RR');

// DEMUL Directory Check
export const DEMUL_DESKTOP_DIR = path.join('F:', 'OneDrive', 'DesktopPC', 'Emulators', 'DEMUL');
export const DEMUL_LAPTOP2_DIR = path.join('C:', 'Users', 'davil', 'OneDrive', 'L2', 'Emulators', 'DEMUL');
export const DEMUL_LAPTOP3_DIR = path.join('C:', 'Users', 'davil', 'OneDrive', 'L3', 'Emulators', 'DEMUL');

// Check PCSX2RR Directories
const PCSX2RR_DESKTOP_DIR_EXISTS = fs.existsSync(PCSX2_DESKTOP_DIR);
const PCSX2RR_LAPTOP2_DIR_EXISTS = fs.existsSync(PCSX2_LAPTOP2_DIR);
const PCSX2RR_LAPTOP3_DIR_EXISTS = fs.existsSync(PCSX2_LAPTOP3_DIR);

// Check DEMUL Directories
const DEMUL_DESKTOP_DIR_EXISTS = fs.existsSync(DEMUL_DESKTOP_DIR);
const DEMUL_LAPTOP2_DIR_EXISTS = fs.existsSync(DEMUL_LAPTOP2_DIR);
const DEMUL_LAPTOP3_DIR_EXISTS = fs.existsSync(DEMUL_LAPTOP3_DIR);

// Set the PCSX2 directory of this machine
export const DIR_PCSX2 = PCSX2RR_DESKTOP_DIR_EXISTS ? PCSX2_DESKTOP_DIR : PCSX2RR_LAPTOP2_DIR_EXISTS ? PCSX2_LAPTOP2_DIR : PCSX2RR_LAPTOP3_DIR_EXISTS ? PCSX2_LAPTOP3_DIR : '';

// Set the DEMUL directory of this machine
export const DIR_DEMUL = DEMUL_DESKTOP_DIR_EXISTS ? DEMUL_DESKTOP_DIR : DEMUL_LAPTOP2_DIR_EXISTS ? DEMUL_LAPTOP2_DIR : DEMUL_LAPTOP3_DIR_EXISTS ? DEMUL_LAPTOP3_DIR : '';



// write a test function for each directory
function testDir(dir) {
  // print DIR_MAIN_TRUNK if that is the variable being tested
  if (dir === DIR_MAIN_TRUNK) { console.log(`Current variable name is DIR_MAIN_TRUNK: ${dir}`); }
  else if (dir === DIR_RESOURCES) { console.log(`Current variable name is DIR_RESOURCES: ${dir}`); }
  else if (dir === DIR_JS_UTILS) { console.log(`Current variable name is DIR_JS_UTILS: ${dir}`); }
  else if (dir === DIR_CSVS) { console.log(`Current variable name is DIR_CSVS: ${dir}`); }
  else if (dir === DIR_EXPORT_TO_AE) { console.log(`Current variable name is DIR_EXPORT_TO_AE: ${dir}`); }
  else if (dir === DIR_DEMUL_CT_FILES) { console.log(`Current variable name is DIR_DEMUL_CT_FILES: ${dir}`); }
  else if (dir === DIR_PCSX2_CT_FILES) { console.log(`Current variable name is DIR_PCSX2_CT_FILES: ${dir}`); }
  else if (dir === DIR_PCSX2) { console.log(`Current variable name is DIR_PCSX2: ${dir}`); }
  else if (dir === DIR_DEMUL) { console.log(`Current variable name is DIR_DEMUL: ${dir}`); }
  else { console.log(`Current variable name is unknown: ${dir}`); }
}

// testDir(DIR_DEMUL);
