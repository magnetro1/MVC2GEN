import * as fs from 'fs';
import {
  DIR_OUTPATH,
  dataObject,
} from './00_DataObject.js';

function writeDataObject() {
  for (let key in dataObject) {
    if ((key == undefined) || (key == null) || (key == '')) {
      continue;
    }
    // Don't write PMem or Camera data
    const playerMemoryRegex = /(P[1-2]_[A-C]_)|Camera\w+/g;
    if (playerMemoryRegex.test(key)) {
      continue;
    }
    // if the file doesn't exist, create it
    if (!fs.existsSync(`${DIR_OUTPATH}/${key}.js`)) {
      fs.writeFile(`${DIR_OUTPATH}/${key}.js`,
        `var result = [];\nresult[0] = [${dataObject[key]}];`,
        'utf8', (err) => { if (err) throw err; }
      );
    }
  }
}

writeDataObject();
