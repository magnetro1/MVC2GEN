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

// console.time('wholeApp');
writeStaticDataCNV(updatedObj);
writeTotalFramesCNV(updatedObj);
writeStageDataCNV(updatedObj);
countIsPausedCNV(updatedObj);
writeInputCNV(updatedObj);
writeP1P2Addresses(updatedObj);
writeNewStates(updatedObj);

const pMemObj = {};
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
  // push the tempArr into the pMemObj with the tempObj as the key
  pMemObj[tempObj] = tempArr;
  // tempArr.forEach((pMemAdr) => {
  //   getPMem(giantObjectCopy, tempObj.toString(), 1, pMemAdr.toString(), 1);
  //   getPMem(giantObjectCopy, tempObj.toString(), 2, pMemAdr.toString(), 1);
  // });
}
console.log(pMemObj);

// console.timeEnd('wholeApp');
