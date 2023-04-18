import giantObjectCopy from './JS_UTIL_02_MinMaxRound.js';
import getPMem from './JS_UTIL_03_PlayerMemory.js';
import {
  writeStaticDataCNV,
  writeTotalFramesCNV,
  writeStageDataCNV,
  countIsPausedCNV,
} from './JS_UTIL_04_StaticDataCNV.js';
import writeInputCNV from './JS_UTIL_05_InputsCNV.js';
import writeP1P2Addresses from './JS_UTIL_06_P1P2Addresses.js';
import writeNewStates from './JS_UTIL_07_NewStates.js';

const updatedObj = giantObjectCopy;

writeStaticDataCNV(updatedObj);
writeTotalFramesCNV(updatedObj);
writeStageDataCNV(updatedObj);
countIsPausedCNV(updatedObj);
writeInputCNV(updatedObj);
writeP1P2Addresses(updatedObj);
writeNewStates(updatedObj);

console.time('timer');
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

  tempArr.forEach((pMemAdr) => {
    // console.time('pMemP1');
    getPMem(giantObjectCopy, tempObj.toString(), 1, pMemAdr.toString(), 1);
    // console.timeEnd('pMemP1');
    // console.time('pMemP2');
    getPMem(giantObjectCopy, tempObj.toString(), 2, pMemAdr.toString(), 1);
    // console.timeEnd('pMemP2');
  });
  console.timeEnd('timer');
}
