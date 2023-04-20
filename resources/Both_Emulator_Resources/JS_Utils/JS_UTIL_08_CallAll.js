import giantObjectCopy from './JS_UTIL_02_MinMaxRound.js';
// import getPMem from './JS_UTIL_03_PlayerMemory.js';
// import writePMem from './JS_UTIL_03B_WritePlayerMemory.js';
import {
  // writeStaticDataCNV,
  writeTotalFramesCNV,
  writeStageDataCNV,
  countIsPausedCNV,
} from './JS_UTIL_04_StaticDataCNV.js';
import writeInputCNV from './JS_UTIL_05_InputsCNV.js';
import writeP1P2Addresses from './JS_UTIL_06_P1P2Addresses.js';
// import writeNewStates from './JS_UTIL_07_NewStates.js';

console.time('CallAll');
// processCSV(CSV_FILES_ARRAY);
const updatedObj = giantObjectCopy;
// writeStaticDataCNV(updatedObj);
writeTotalFramesCNV(updatedObj);
writeStageDataCNV(updatedObj);
countIsPausedCNV(updatedObj);
writeInputCNV(updatedObj);
writeP1P2Addresses(updatedObj);
// writeNewStates(updatedObj);

// writePMem(updatedObj);
console.timeEnd('CallAll');
