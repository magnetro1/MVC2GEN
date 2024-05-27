import { cwd, argv } from "process";
import * as fs from "fs";
export const DIR_MAIN_TRUNK = `${cwd().replace("/", "\\")}\\`;
export const DIR_RESOURCES = `${DIR_MAIN_TRUNK}resources\\`;
export const DIR_JS_UTILS = `${DIR_RESOURCES}Both_Emulator_Resources\\JS_Utils\\`;
export const DIR_CSVS = `${DIR_JS_UTILS}CSV_FILES/`;
export const DIR_EXPORT_TO_AE = `${DIR_JS_UTILS}exportToAE/`;
// export const DIR_SORTED_JS = `${DIR_JS_UTILS}SortedJS/`;
export const TAIL_TEXT = "_Sorted_Node.js";
// Paths to Cheat Tables
export const DIR_DEMUL_CT_FILES = `${DIR_RESOURCES}Demul_and_CheatEngine\\CheatTables_Demul\\`;
export const DIR_PCSX2_CT_FILES = `${DIR_RESOURCES}PCSX2RR_and_CheatEngine\\CheatTables_PCSX2\\`;
export const CT_EXT = ".CT";
// PCSX2 Directory Check
// join the current working directory with the path to the PCSX2 directory
const DESKTOP_DIR = 'F:/OneDrive/DesktopPC/Emulators/PCSX2RR/';
const LAPTOP2_DIR = 'C:/Users/davil/OneDrive/L2/Emulators/PCSX2RR/';
const LAPTOP3_DIR = 'C:/Users/davil/OneDrive/L3/Emulators/PCSX2RR/';

// Test which directory returns true
const DESKTOP_DIR_EXISTS = fs.existsSync(DESKTOP_DIR);
const LAPTOP2_DIR_EXISTS = fs.existsSync(LAPTOP2_DIR);
const LAPTOP3_DIR_EXISTS = fs.existsSync(LAPTOP3_DIR);

// Set the directory to the one that exists
export const DIR_PCSX2 = DESKTOP_DIR_EXISTS ? DESKTOP_DIR : LAPTOP2_DIR_EXISTS ? LAPTOP2_DIR : LAPTOP3_DIR_EXISTS ? LAPTOP3_DIR : '';
