import * as fs from 'fs';
import {
  tempJS,
  dataObject,
} from './00_DataObject.js';

async function writeSortedJS() {
  let dataObjectExport = '';
  for (let key in dataObject) {
    if (dataObject[key]) {
      dataObjectExport += `export const ${key} = '${dataObject[key]}';\n`;
    }
  }
  if (!fs.existsSync(tempJS)) {
    fs.writeFileSync(tempJS, dataObjectExport);
  }
}
// writeSortedJS();
export { writeSortedJS }
