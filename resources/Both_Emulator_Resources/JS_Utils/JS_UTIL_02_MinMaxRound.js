import giantObject from './JS_UTIL_01_SortCSV.js';
import {
  FLOATING_POINT_ADDRESSES,
  MIN_MAX_ADDRESSES,
} from './JS_UTIL_staticData.js';

/**
*  @description Rounds the floating point addresses and adds the
*  min and max values to the giantObject
*  @param {Object} objectFN giantObject
*  @returns {Object} giantObject
*/
function findMinMaxRound(objectFN) {
  const newObj = objectFN;
  // const toFixedDigits = [0, 2, 4]; // 7 is the default
  const toFixedDigits = [0]; // 7 is the default
  const preFixes = ['P1_A_', 'P2_A_', 'P1_B_', 'P2_B_', 'P1_C_', 'P2_C_'];
  const suffixes = ['', '_Min', '_Max'];
  for (const tempDataObject in newObj) {
    const CLIP_LENGTH = newObj[tempDataObject].Total_Frames.length;
    let tempMinMaxBuffer = '';
    for (const adr in MIN_MAX_ADDRESSES) {
      const KEY = MIN_MAX_ADDRESSES[adr];
      // So all the values are a string, but we need to convert it into an array of numbers
      // We have to set the value equal to the new value, otherwise it won't change
      const tempArray = newObj[tempDataObject][MIN_MAX_ADDRESSES[adr]].split(',');
      newObj[tempDataObject][MIN_MAX_ADDRESSES[adr]] = tempArray;
      const VALUE = newObj[tempDataObject][MIN_MAX_ADDRESSES[adr]];
      const MIN = Math.min(...VALUE);
      const MAX = Math.max(...VALUE);
      const tempMin = [];
      const tempMax = [];
      for (let clipLen = 0; clipLen < CLIP_LENGTH; clipLen++) {
        tempMax[clipLen] = MAX;
        tempMin[clipLen] = MIN;
      }
      tempMinMaxBuffer += `${KEY}_Max=${tempMax}\n`;
      tempMinMaxBuffer += `${KEY}_Min=${tempMin}\n`;
    }
    const tempMinMaxBufferSplit = tempMinMaxBuffer.split('\n');
    for (const line in tempMinMaxBufferSplit) {
      const lineSplit = tempMinMaxBufferSplit[line].split('=');
      const lineSplit0 = lineSplit[0];
      const lineSplit1 = lineSplit[1];
      newObj[tempDataObject][lineSplit0] = lineSplit1;// [0] is the key, [1] is the value
    }
    for (const item in newObj[tempDataObject]) {
      // convert any object into a string
      if (typeof newObj[tempDataObject][item] === 'object') {
        newObj[tempDataObject][item] = newObj[tempDataObject][item].toString();
      }
    }
    // Round the FLOATING_POINT_ADDRESSES using the toFixedDigits array.
    // The addresses' prefixes and suffxes need to be constructed into a tempString
    for (const adr in FLOATING_POINT_ADDRESSES) {
      let tempFullAddressString = '';
      for (const pre in preFixes) {
        for (const suf in suffixes) {
          tempFullAddressString = preFixes[pre] + FLOATING_POINT_ADDRESSES[adr] + suffixes[suf];
          if (newObj[tempDataObject][tempFullAddressString]) {
            const dataSplit = newObj[tempDataObject][tempFullAddressString].split(',');
            for (const digit in toFixedDigits) {
              const tempNewAddress = `${tempFullAddressString}_${toFixedDigits[digit]}`;
              let tempNewArray = [];
              for (const item in dataSplit) {
                tempNewArray[item] = parseFloat(dataSplit[item]).toFixed(toFixedDigits[digit]);
              }
              tempNewArray = tempNewArray.toString();
              newObj[tempDataObject][tempNewAddress] = tempNewArray;
            }
          } else {
            throw new Error(`Error: ${tempFullAddressString} does not exist in ${tempDataObject}`);
          }
        }
      }
    }
  }
  return newObj;
}
// make a deep copy of the newObj that gets returned from the function
const giantObjectCopy = JSON.parse(JSON.stringify(findMinMaxRound(giantObject)));
export default giantObjectCopy;
