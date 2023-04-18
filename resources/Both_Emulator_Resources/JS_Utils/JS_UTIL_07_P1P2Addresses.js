import * as fs from 'fs';
import { P1P2_ADDRESSES } from './JS_UTIL_staticData.js';
import { DIR_EXPORT_TO_AE } from './JS_UTIL_paths.js';

// const updatedObj = findMinMaxRound(giantObject);
/**
 * @description Writes individual JS files for each address in MISC_ADDRESSES.
 */
export default function writeP1P2Addresses(deepCopyObj) {
  for (const tempObj in deepCopyObj) {
    const DIR_OUTPATH = `${DIR_EXPORT_TO_AE}${tempObj}/`;
    const p1p2AddressesArray = [[]]; // Example: "P1_Meter_Big", "Camera_Field_of_View"
    for (const p1p2AdrIDX in P1P2_ADDRESSES) {
      deepCopyObj[tempObj][P1P2_ADDRESSES[p1p2AdrIDX]].split(',').forEach((address) => {
        p1p2AddressesArray[0].push(address);
      });
      fs.writeFileSync(
        `${DIR_OUTPATH}${P1P2_ADDRESSES[p1p2AdrIDX]}.js`,
        `var result = [];\nresult[0] = [${p1p2AddressesArray}];`,
        'utf8',
      );
      p1p2AddressesArray[0] = [];
    }
  }
}
writeP1P2Addresses();
