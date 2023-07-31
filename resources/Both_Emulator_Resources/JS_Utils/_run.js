import * as fs from 'fs';
import {
  DIR_EXPORT_TO_AE,
  DIR_CSVS,
  DIR_SORTED_JS
} from './JS_UTIL_paths.js';

import {
  csvFilesArr, csvSoloNameArr, dataObject, DIR_OUTPATH, tempJS,
  CLIP_LENGTH, POINT_OBJ_P1, POINT_OBJ_P2, clipDataAE,
} from './00_DataObject.js';
import { writeSortedJS } from './01_writeSortedJS.js';
import { fetchPMemEntries } from './02_FetchPlayerMemEntries.js';
import { pMemObject, getPlayerMemory } from './03A_GetPlayerMem.js';
import { writePlayerMemory } from './03B_WritePlayerMem.js';
import { writeTotalFramesCNV } from './04_WriteTotalFramesCNV.js';
import { writeTeamNames } from './05_WriteTeamNames.js';
import { playerOneInputs, playerTwoInputs, writeInputCNV } from './06_WriteInputCNV.js';
import { countIsPausedCNV } from './07_CountIsPausedCNV.js';
import { writeStageDataCNV } from './08_WriteStageDataCNV.js';
import { writeComboCallouts } from './09_WriteComboCallouts.js';
import { writeDataObject } from './10_WriteDataObject.js';
import { writeStaticDataCNV } from './11_WriteStaticDataCNV.js';
import { writeP1P2Addresses } from './12_WriteP1P2Addresses.js';

async function main() {
  await writeSortedJS();
  writeTeamNames(); // ✅
  writeInputCNV(); // ✅
  writeStageDataCNV(); // ✅
  writeP1P2Addresses(); // ✅
  writeComboCallouts(); // ✅
  countIsPausedCNV(); // ✅
  writeTotalFramesCNV(); // ✅
  writeStaticDataCNV(); // ✅
  writeDataObject(); // ✅
  fetchPMemEntries().forEach(async function (label) {
    await writePlayerMemory(1, label.toString());
    await writePlayerMemory(2, label.toString());
  });
  // await writeNewStates()

}
main();

// fs.readdirSync(DIR_CSVS).forEach(function (file) {
//   if (file.endsWith('.csv') || file.endsWith('.CSV')) {
//     csvFilesArr.push(file);
//   }
// });

// csvFilesArr.forEach((name) => {
//   let temp = name.toString().replace('.csv', '') || name.toString().replace('.CSV', '')
//   csvSoloNameArr.push(temp);
// });
// for (let csvFilesIDX = 0; csvFilesIDX < csvFilesArr.length; csvFilesIDX++) {
//   main();
// }
