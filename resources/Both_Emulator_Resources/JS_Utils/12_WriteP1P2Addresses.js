import * as fs from 'fs';
import {
  DIR_OUTPATH,
  dataObject,
} from './00_DataObject.js';
import {
  P1P2_ADDRESSES,
} from './JS_UTIL_staticData.js';
/**
 * @description Writes individual JS files for each address in MISC_ADDRESSES.
 */
function writeP1P2Addresses() {
  /**
   * @example "P1_Meter_Big", "Camera_Field_of_View", "P2_Combo_Meter_Value"
   */
  const p1p2AddressesArray = [[]];
  for (const p1p2AdrIDX in P1P2_ADDRESSES) {
    dataObject[P1P2_ADDRESSES[p1p2AdrIDX]].split(',').forEach((address) => {
      p1p2AddressesArray[0].push(address);
    });
    if (!fs.existsSync(`${DIR_OUTPATH}${P1P2_ADDRESSES[p1p2AdrIDX]}.js`)) {
      fs.writeFileSync(`${DIR_OUTPATH}${P1P2_ADDRESSES[p1p2AdrIDX]}.js`,
        `var result = [];\nresult[0] = [${p1p2AddressesArray}];`,
        'utf8'
      );
      p1p2AddressesArray[0] = []; // clear the array for the next player iteration.
    }
  }
};

// writeP1P2Addresses();
export { writeP1P2Addresses }
