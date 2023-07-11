import { cwd, argv } from "process";
// export const DIR_MAIN_TRUNK = `H:\\Git\\MVC2GEN\\`;
export const DIR_MAIN_TRUNK = `${cwd().replace("/", "\\")}\\`;
export const DIR_RESOURCES = `${DIR_MAIN_TRUNK}resources\\`;
export const DIR_JS_UTILS = `${DIR_RESOURCES}Both_Emulator_Resources\\JS_Utils\\`;
export const DIR_CSVS = `${DIR_JS_UTILS}CSV_FILES/`;
export const DIR_EXPORT_TO_AE = `${DIR_JS_UTILS}exportToAE/`;
export const DIR_SORTED_JS = `${DIR_JS_UTILS}SortedJS/`;
export const TAIL_TEXT = "_Sorted_Node.js";
// Paths to Cheat Tables
export const DIR_DEMUL_CT_FILES = `${DIR_RESOURCES}Demul_and_CheatEngine\\CheatTables_Demul\\`;
export const DIR_PCSX2_CT_FILES = `${DIR_RESOURCES}PCSX2RR_and_CheatEngine\\CheatTables_PCSX2\\`;
// Hard-Paths to emulators
export const DIR_PCSX2 = "G:/PCSX2RR/";
export const DIR_DEMUL = "G:/DemulDC/demul07_111117";

// Other stuff
let str = argv[2];
for (let i = 3; i < argv.length; i++) {
  str += " " + argv[i];
}

// Make an object with dummy data
export const obj = {
  str: str,
  arr: [1, 2, 3],
  nested: { hello: "world" },
  value1: "1Value",
};
