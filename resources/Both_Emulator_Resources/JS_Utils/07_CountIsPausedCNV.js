import * as fs from 'fs';
import {
  DIR_OUTPATH,
  dataObject,
} from './00_DataObject.js';
import { count } from 'console';

function countIsPausedCNV() {
  let State_Is_Paused = [];
  let counter = 0;
  dataObject.Is_Paused.split(',').forEach((element, index) => {
    if (element == 0) {
      counter = 0
      State_Is_Paused[index] = 0
    }
    else {
      State_Is_Paused[index] = (counter + 1)
      counter++
    }
  });
  if (!fs.existsSync(`${DIR_OUTPATH}Is_Paused_CNV.js`)) {
    fs.writeFileSync(`${DIR_OUTPATH}Is_Paused_CNV.js`,
      `var result = [];\nresult[0] = [${dataObject['Is_Paused']}];\nresult[1] = [${State_Is_Paused.toString()}];`,
      'utf8'
    );
  }
}

countIsPausedCNV()
