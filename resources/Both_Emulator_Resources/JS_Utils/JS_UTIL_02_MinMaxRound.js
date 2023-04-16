/* eslint-disable prefer-destructuring */
// import * as fs from 'fs';
// import DIR_EXPORT_TO_AE from './JS_UTIL_paths.js';
import {
  FLOATING_POINT_ADDRESSES,
  MIN_MAX_ADDRESSES,
} from './JS_UTIL_staticData.js';

import giantObject from './JS_UTIL_01_SortCSV.js';

/**
*  @description Rounds the floating point addresses and adds the
*  min and max values to the giantObject
*  @param {Object} objectFN giantObject
*  @returns {Object} giantObject
*/
export default function findMinMaxRound(objectFN) {
  const toFixedDigits = [0, 2, 4]; // 7 is the default
  const preFixes = ['P1_A_', 'P2_A_', 'P1_B_', 'P2_B_', 'P1_C_', 'P2_C_'];
  const suffixes = ['', '_Min', '_Max'];
  for (const tempDataObject in objectFN) {
    const CLIP_LENGTH = objectFN[tempDataObject].Total_Frames.length;
    let tempMinMaxBuffer = '';
    for (const adr in MIN_MAX_ADDRESSES) {
      const KEY = MIN_MAX_ADDRESSES[adr];
      // So all the values are a string, but we need to convert it into an array of numbers
      // We have to set the value equal to the new value, otherwise it won't change
      objectFN[tempDataObject][MIN_MAX_ADDRESSES[adr]] = objectFN[tempDataObject][MIN_MAX_ADDRESSES[adr]].split(',');
      const VALUE = objectFN[tempDataObject][MIN_MAX_ADDRESSES[adr]];
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
      objectFN[tempDataObject][lineSplit[0]] = lineSplit[1];// [0] is the key, [1] is the value
    }
    for (const item in objectFN[tempDataObject]) {
      // convert any object into a string
      if (typeof objectFN[tempDataObject][item] === 'object') {
        objectFN[tempDataObject][item] = objectFN[tempDataObject][item].toString();
      }
    }
    // Round the FLOATING_POINT_ADDRESSES using the toFixedDigits array.
    // The addresses' prefixes and suffxes need to be constructed into a tempString
    for (const adr in FLOATING_POINT_ADDRESSES) {
      let tempFullAddressString = '';
      for (const pre in preFixes) {
        for (const suf in suffixes) {
          tempFullAddressString = preFixes[pre] + FLOATING_POINT_ADDRESSES[adr] + suffixes[suf];
          if (objectFN[tempDataObject][tempFullAddressString]) {
            const dataSplit = objectFN[tempDataObject][tempFullAddressString].split(',');
            for (const digit in toFixedDigits) {
              const tempNewAddress = `${tempFullAddressString}_${toFixedDigits[digit]}`;
              let tempNewArray = [];
              for (const item in dataSplit) {
                tempNewArray[item] = parseFloat(dataSplit[item]).toFixed(toFixedDigits[digit]);
              }
              tempNewArray = tempNewArray.toString();
              objectFN[tempDataObject][tempNewAddress] = tempNewArray;
            }
          } else {
            console.log(`No address found for ${tempFullAddressString}`);
          }
        }
      }
    }
  }
  // console.log(giantObject);
  return objectFN;
  // // write the giantObject to a file with the name of the CSV file as the name of each object
  // for (let obj in objectFN)
  // {
  //   let tempString = '';
  //   for (let item in objectFN[obj])
  //   {
  //     tempString += `${ item }=${ objectFN[obj][item] }\n`;
  //   }
  //   // console.log(tempString);
  // fs.writeFileSync(`${DIR_EXPORT_TO_AE}/${obj}.txt`, tempString);
  // }
}
findMinMaxRound(giantObject);
