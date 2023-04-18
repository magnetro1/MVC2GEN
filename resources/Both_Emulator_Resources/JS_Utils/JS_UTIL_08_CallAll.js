// import * as fs from 'fs';
// import { DIR_EXPORT_TO_AE } from './JS_UTIL_paths.js';
// 02
import giantObjectCopy from './JS_UTIL_02_MinMaxRound.js';
// 04
import writePlayerMemory from './JS_UTIL_03_PlayerMemory.js';
// 05
import {
  writeStaticDataCNV,
  writeTotalFramesCNV,
  writeStageDataCNV,
  countIsPausedCNV,
} from './JS_UTIL_04_StaticDataCNV.js';
import writeInputCNV from './JS_UTIL_05_InputsCNV.js';
import writeP1P2Addresses from './JS_UTIL_06_P1P2Addresses.js';
import writeNewStates from './JS_UTIL_07_NewStates.js';

console.time('timer');
// 01 Uncalled here as 02 calls it.
// 02 Imported giantObjectCopy
const updatedObj = giantObjectCopy;
// 03
for (const tempObj in updatedObj) {
  let tempArr = [];
  const playerMemoryRegex = /(P[1-2]_[A-C]_)/g; // [1] = P1_A
  for (const key in updatedObj[tempObj]) {
    if (key.toString().match(playerMemoryRegex)) {
      tempArr.push(key);
    }
  }
  tempArr = tempArr.map((label) => label.replace(playerMemoryRegex, ''));
  tempArr = [...new Set(tempArr)];
  const playerMemoryEntries = tempArr;
  playerMemoryEntries.forEach((pMemAdr) => {
    writePlayerMemory(tempObj.toString(), 1, pMemAdr.toString(), 1);
    writePlayerMemory(tempObj.toString(), 2, pMemAdr.toString(), 1);
  });
}
// 05
writeStaticDataCNV(updatedObj);
writeTotalFramesCNV(updatedObj);
writeStageDataCNV(updatedObj);
countIsPausedCNV(updatedObj);
// 06
writeInputCNV(updatedObj);
// 07
writeP1P2Addresses(updatedObj);
// 08
await writeNewStates(updatedObj);

// end the timer
console.timeEnd('timer');
