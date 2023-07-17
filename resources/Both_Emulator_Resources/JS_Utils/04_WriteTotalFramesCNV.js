import {
  DIR_OUTPATH,
  dataObject,
} from './00_DataObject.js';

import * as fs from 'fs';

/**
 * @description outputs arrays containing Total_Frames in ascending and 
 * descending order, and Max number in clip. The first three arrays are
 * arrays of numbers, the remaining are arrays of strings
 */
export function writeTotalFramesCNV() {
  let totalFrameArrT1 = [];
  let totalFrameArrT2 = [];

  (dataObject['Total_Frames']).split(',').forEach((frame, indexT1) => {
    totalFrameArrT1.push(indexT1);
  });
  // Padded Zeroes for program pad comp
  (dataObject['Total_Frames']).split(',').forEach((frame, indexT2) => {
    if (indexT2 == 0) {
      indexT2++
    }
    else if (indexT2 < 10) {
      indexT2.toString()
      indexT2 = '000' + indexT2
    }
    else if (indexT2 < 100) {
      indexT2.toString()
      indexT2 = '00' + indexT2
    }
    else if (indexT2 < 1000) {
      indexT2.toString()
      indexT2 = '0' + indexT2
    }
    else {
      indexT2
    }
    totalFrameArrT2.push(`'${indexT2}'`);
  });

  // T1 for Normal Compositions
  if (!fs.existsSync(`${DIR_OUTPATH}Total_Frames_CNV.js`)) {
    fs.writeFileSync(`${DIR_OUTPATH}Total_Frames_CNV.js`,
      `var result = [];\nresult[0] = [${totalFrameArrT1}];\n`,
      'utf8'
    );
    totalFrameArrT1.reverse()
    fs.appendFileSync(`${DIR_OUTPATH}Total_Frames_CNV.js`,
      `result[1] = [${totalFrameArrT1}];\n`,
      'utf8'
    );
    for (let idx in totalFrameArrT1) {
      totalFrameArrT1[idx] = totalFrameArrT1[0]
    }
    fs.appendFileSync(`${DIR_OUTPATH}Total_Frames_CNV.js`,
      `result[2] = [${totalFrameArrT1}];\n`,
      'utf8'
    );

    // T2 for ASCII Pad Composition. 
    //Uses an array of Strings since the numbers are padded with zeroes
    totalFrameArrT2.splice(0, 1)
    fs.appendFileSync(`${DIR_OUTPATH}Total_Frames_CNV.js`,
      // replace two '' with one '
      `result[3] = [${totalFrameArrT2.toString()}];\n`,
      'utf8'
    )
      ;
    totalFrameArrT2.reverse()
    fs.appendFileSync(`${DIR_OUTPATH}Total_Frames_CNV.js`,
      `result[4] = [${totalFrameArrT2}];\n`,
      'utf8'
    );
    for (let idx in totalFrameArrT2) {
      totalFrameArrT2[idx] = totalFrameArrT2[0]
    }
    fs.appendFileSync(`${DIR_OUTPATH}Total_Frames_CNV.js`,
      `result[5] = [${totalFrameArrT2}];\n`,
      'utf8'
    );
  }
}
