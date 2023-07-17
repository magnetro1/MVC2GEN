import * as fs from 'fs';
import {
  DIR_OUTPATH,
  dataObject,
} from './00_DataObject.js';
import {
  COMBO_CALLOUTS,
} from './JS_UTIL_staticData.js';

function writeComboCallouts() {
  for (let p1OrP2 = 1; p1OrP2 <= 2; p1OrP2++) {
    let tempP1OrP2Str = dataObject[`P${p1OrP2}_Combo_Meter_Value`].split(',');
    let resultsArr = [];
    // console.log(...tempP1OrP2Str);
    tempP1OrP2Str.forEach((element, index) => {
      if (parseInt(element) <= 2) {
        resultsArr.push(''); // ''
      } else if (parseInt(element) == 3) {
        resultsArr.push(`${COMBO_CALLOUTS[0]}`); // Yes
      } else if ((parseInt(element) == 4) || (parseInt(element) == 5)) {
        resultsArr.push(`${COMBO_CALLOUTS[1]}`); // Good
      } else if ((parseInt(element) == 6) || (parseInt(element) == 7)) {
        resultsArr.push(`${COMBO_CALLOUTS[2]}`); // Great
      } else if ((parseInt(element) == 8) || (parseInt(element) == 9)) {
        resultsArr.push(`${COMBO_CALLOUTS[3]}`); // Very Good
      } else if ((parseInt(element) >= 10) && (parseInt(element) <= 29)) {
        resultsArr.push(`${COMBO_CALLOUTS[4]}`); // Wonderful
      } else if ((parseInt(element) >= 30) && (parseInt(element) <= 49)) {
        resultsArr.push(`${COMBO_CALLOUTS[5]}`); // Fantastic
      } else if ((parseInt(element) >= 50) && (parseInt(element) <= 99)) {
        resultsArr.push(`${COMBO_CALLOUTS[6]}`); // Monster
      } else if ((parseInt(element) >= 100)) {
        resultsArr.push(`${COMBO_CALLOUTS[7]}`); // Marvelous
      } else {
        resultsArr.push('');
      }
    });
    //Write results array to a file and put qutoes around each element if it's not empty.
    if (!fs.existsSync(`${DIR_OUTPATH}/P${p1OrP2}_Combo_Callouts.js`)) {
      fs.writeFile(`${DIR_OUTPATH}/P${p1OrP2}_Combo_Callouts.js`,
        `var result = [];\nresult[0] = [${resultsArr.map((element) => {
          // return (element == '') ? ' ' : `'${element}'`
          return `'${element}'`
        })}];`,
        'utf8', (err) => { if (err) throw err; }
      );
    }
  }
}
writeComboCallouts();
