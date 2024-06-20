import { fileURLToPath } from 'url';
import path from 'path';

const REPO_NAME = 'MVC2GEN';

// Get the current file path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Find the position of the repository name in the path
const repoNameLocation = __dirname.indexOf(REPO_NAME);

// Extract everything to the left of the repository name
let baseDir = __dirname.substring(0, repoNameLocation + REPO_NAME.length);
// Normalize the path
baseDir = path.join(baseDir);

export const CT_EXT = ".CT";
export const DIR_MAIN_TRUNK = baseDir;
export const DIR_RESOURCES = path.join(DIR_MAIN_TRUNK, 'resources');
export const DIR_BOTH_EMULATOR_RESOURCES = path.join(DIR_RESOURCES, 'Both_Emulator_Resources');
export const DIR_JS_UTILS = path.join(DIR_RESOURCES, DIR_BOTH_EMULATOR_RESOURCES, 'JS_TOOLS');
export const DIR_CSVS = path.join(DIR_JS_UTILS, 'CSV_FILES');
export const DIR_EXPORT_TO_AE = path.join(DIR_JS_UTILS, 'exportToAE');
// Paths to Cheat Tables in this Github Repository
export const DIR_DEMUL_CT_FILES = path.join(DIR_RESOURCES, 'Demul_and_CheatEngine', 'CheatTables_Demul');
export const DIR_PCSX2_CT_FILES = path.join(DIR_RESOURCES, 'PCSX2RR_and_CheatEngine', 'CheatTables_PCSX2');
