const fs = require('fs');
const path = require('path');

const {KNOCKDOWN_STATE_OBJ, PROX_BLOCK_OBJ, NAME_TABLE_OBJ, FLOATING_POINT_ADRS, MIN_MAX_ADRS, MISC_ADRS, STAGES_OBJ, PORTRAITS_TO_TIME_OBJ} = require("./main_files/staticData");

const DO_ROM_FILES = false; // Skip ROM logic files

const FILE_NAME_NO_EXT = `Combo_Sentinel10`; // replace with a read-line-sync prompt

const TAIL_TEXT = `_Sorted_Node.js`;
const DIR_MAIN_FILES = `./main_files/`;
const DIR_EXPORT_TO_AE = path.join(process.cwd(), `exportToAE/`);
const DIR_OUTPATH = `${ DIR_EXPORT_TO_AE }${ FILE_NAME_NO_EXT }/`;
const ORG_JS_FILE = `${ DIR_MAIN_FILES }${ FILE_NAME_NO_EXT }${ TAIL_TEXT }`; // Current-Active-Working-File
const NEW_JS_FILE = `${ DIR_MAIN_FILES }New_${ FILE_NAME_NO_EXT }${ TAIL_TEXT }`;

let tempMinMaxBuffer = '';


import(ORG_JS_FILE)
  .then((orgData) => // Imports Object with key : value pairs
  {
    const CLIP_LENGTH = orgData.A_2D_Game_Timer.split(",").length;
    for (adr in MIN_MAX_ADRS)
    {
      const KEY = MIN_MAX_ADRS[adr];
      const VALUE = orgData[MIN_MAX_ADRS[adr]];
      const MIN = Math.min(...VALUE.split(","));
      const MAX = Math.max(...VALUE.split(","));
      let tempMin = [];
      let tempMax = [];

      for (clipLen = 0; clipLen < CLIP_LENGTH; clipLen++)
      {
        tempMax[clipLen] = MAX;
        tempMin[clipLen] = MIN;
      }
      tempMinMaxBuffer += `exports.${ KEY }_Max = "${ tempMax }";\n`;
      tempMinMaxBuffer += `exports.${ KEY }_Min = "${ tempMin }";\n`;
    }
    console.log(tempMinMaxBuffer);
  });