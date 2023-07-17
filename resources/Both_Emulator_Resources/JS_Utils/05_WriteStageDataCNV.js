import {
  DIR_OUTPATH,
  dataObject,
  clipDataAE,
} from './00_DataObject.js';

import {
  STAGES_OBJ,
  STAGES_NAMES
} from './JS_UTIL_staticData.js';

import * as fs from 'fs';

export function writeStageDataCNV() {
  let stageData = [];
  let stageDataCNV = [];
  let stageNamesCNV = [];
  // Numbers
  dataObject['Stage_Selector'].split(',').forEach((frame) => {
    stageData.push(frame)
  });
  // Color-Hexes
  dataObject['Stage_Selector'].split(',').forEach((frame) => {
    stageDataCNV.push(`'${Object.values(STAGES_OBJ)[frame]}'`)
  });
  // Stage Names
  dataObject['Stage_Selector'].split(',').forEach((frame) => {
    stageNamesCNV.push(`'${Object.values(STAGES_NAMES)[frame]}'`)
  });
  fs.writeFileSync(`${DIR_OUTPATH}Stage_Selector_CNV.js`,
    `var result = [];\nresult[0] = [${stageData}];\nresult[1] = [${stageDataCNV}];\nresult[2] = [${stageNamesCNV}];\n`,
    'utf8'
  );
  fs.appendFileSync(`${DIR_OUTPATH}${clipDataAE}.js`,
    `result[3] = ${stageNamesCNV[0].toString()};`
  );

  stageData = [];
  stageDataCNV = [];
  stageNamesCNV = [];
};

writeStageDataCNV()
