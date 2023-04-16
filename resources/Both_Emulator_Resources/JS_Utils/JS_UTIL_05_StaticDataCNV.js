import * as fs from 'fs';
import {
  KNOCKDOWN_STATE_OBJ,
  NAME_TABLE_OBJ,
  PORTRAITS_TO_TIME_OBJ,
  PROX_BLOCK_OBJ,
  STAGES_OBJ,
} from './JS_UTIL_staticData.js';
import {
  DIR_EXPORT_TO_AE,
  DIR_CSVS,
} from './JS_UTIL_paths.js';

import giantObject from './JS_UTIL_01_SortCSV.js';
import findMinMaxRound from './JS_UTIL_02_MinMaxRound.js';
import playerMemoryEntries from './JS_UTIL_03_PlayerMemoryEntries.js';
import writePlayerMemory from './JS_UTIL_04_PlayerMemory.js';

const updatedObj = findMinMaxRound(giantObject);
// console.log(updatedObj);
/**
 * @returns {Number[]} returns an array of numbers and writes a file with _CNV appended to its name
 * @description Writes and converts the point character's values for Knockdown State, Is_Prox_Block,
 * ID_2 and _PortraitsToTime
 * Files are written and then appended as the function loops over each
 * player-memory-address & player.
 * Example ID_2: 01 turns into "Ryu"
*/
function writeStaticDataCNV() {
  // These addresses do not need to be cleared or reset
  // after every tempObj iteration
  const STATIC_DATA_OBJS = [
    KNOCKDOWN_STATE_OBJ,
    PROX_BLOCK_OBJ, NAME_TABLE_OBJ,
    PORTRAITS_TO_TIME_OBJ,
  ];
  const STATIC_PMEM_ADRS = [
    'Knockdown_State',
    // 'Is_Prox_Block',
    // 'ID_2',
    // 'ID_2',
  ];

  let staticResultsArr = [[], [], []];
  for (const tempObj in updatedObj) {
    const DIR_OUTPATH = `${DIR_EXPORT_TO_AE}${tempObj}/`;
    const CLIP_LENGTH = updatedObj[tempObj].A_2D_Game_Timer.split(',').length;
    for (let playersLen = 1; playersLen < 3; playersLen++) {
      for (let staticDataIDX = 0; staticDataIDX < STATIC_PMEM_ADRS.length; staticDataIDX++) {
        // Write base file
        // PortraitsToTime Condition
        if (STATIC_DATA_OBJS[staticDataIDX] === PORTRAITS_TO_TIME_OBJ) {
          fs.writeFileSync(
            `${DIR_OUTPATH}P${playersLen}_PortraitsToTime.js`,
            'var result = []\n',
            'utf8',
          );
        } else {
          fs.writeFileSync(
            `${DIR_OUTPATH}P${playersLen}_${STATIC_PMEM_ADRS[staticDataIDX]}_CNV.js`,
            'var result = [];\n',
            'utf8',
          );
        }
      }
      for (let staticIDX = 0; staticIDX < STATIC_PMEM_ADRS.length; staticIDX++) {
        // writePlayerMemory('1', [STATIC_DATA_ADRS[staticDataEntry]], 0);
        const staticPMem = [STATIC_PMEM_ADRS[staticIDX]].toString();
        const callPMemFN = writePlayerMemory(playersLen, staticPMem, 0);
        for (let pSlot = 0; pSlot < callPMemFN.length; pSlot++) {
          // Push and convert all three arrays' values
          for (let clipLen = 0; clipLen < callPMemFN[pSlot].length; clipLen++) {
            const tempAdr = STATIC_DATA_OBJS[staticIDX];
            staticResultsArr[pSlot].push(
              `"${Object.values(tempAdr)[callPMemFN[pSlot][clipLen]]}"`,
            );
          }
          // PortraitsToTime Condition
          if (STATIC_DATA_OBJS[staticIDX] === PORTRAITS_TO_TIME_OBJ) {
            fs.appendFileSync(
              `${DIR_OUTPATH}P${playersLen}_PortraitsToTime.js`,
              `result[${pSlot}] = [${staticResultsArr[pSlot]}]; \n`,
              'utf8',
            );
            staticResultsArr = [[], [], []];
          } else {
            fs.appendFileSync(
              `${DIR_OUTPATH}P${playersLen}_${STATIC_PMEM_ADRS[staticIDX]}_CNV.js`,
              `result[${pSlot}] = [ ${staticResultsArr[pSlot]}]; \n`,
              'utf8',
            );
            staticResultsArr = [[], [], []];
          }
        }
      }
    }
  }
}
writeStaticDataCNV();

/**
* @description outputs arrays containing Total_Frames in ascending and
* descending order, and Max number in clip. The first three arrays are
* arrays of numbers, the remaining are arrays of strings
* */
function writeTotalFramesCNV() {
  for (const tempObj in updatedObj) {
    const totalFrameArrT1 = [];
    const totalFrameArrT2 = [];
    const DIR_OUTPATH = `${DIR_EXPORT_TO_AE}${tempObj}/`;
    const CLIP_LENGTH = updatedObj[tempObj].A_2D_Game_Timer.split(',').length;
    Object.values(updatedObj[tempObj].Total_Frames).
      forEach((frame, indexT1) => {
        totalFrameArrT1.push(indexT1);
      });
    // Padded Zeroes for program pad composition
    Object.values(updatedObj[tempObj].Total_Frames)
      .forEach((frame, indexT2) => {
        if (indexT2 === 0) {
          indexT2 += 1;
        } else if (indexT2 < 10) {
          indexT2.toString();
          indexT2 = `000${indexT2}`;
        } else if (indexT2 < 100) {
          indexT2.toString();
          indexT2 = `00${indexT2}`;
        } else if (indexT2 < 1000) {
          indexT2.toString();
          indexT2 = `0${indexT2}`;
        } else {
          indexT2;
        }
        totalFrameArrT2.push(`'${indexT2}'`);
      });

    // T1 for Normal Compositions
    fs.writeFileSync(
      `${DIR_OUTPATH}Total_Frames_CNV.js`,
      `var result = []; \nresult[0] = [${totalFrameArrT1}]; \n`,
      'utf8',
    );
    totalFrameArrT1.reverse();
    fs.appendFileSync(
      `${DIR_OUTPATH}Total_Frames_CNV.js`,
      `result[1] = [${totalFrameArrT1}]; \n`,
      'utf8',
    );
    for (const idx in totalFrameArrT1) {
      totalFrameArrT1[idx] = totalFrameArrT1[0];
    }
    fs.appendFileSync(
      `${DIR_OUTPATH}Total_Frames_CNV.js`,
      `result[2] = [${totalFrameArrT1}]; \n`,
      'utf8',
    );

    // T2 for ASCII Pad Composition.
    // Uses an array of Strings since the numbers are padded with zeroes
    totalFrameArrT2.splice(0, 1);
    fs.appendFileSync(
      `${DIR_OUTPATH}Total_Frames_CNV.js`,
      // replace two '' with one '
      `result[3] = [${totalFrameArrT2.toString()}]; \n`,
      'utf8',
    );
    totalFrameArrT2.reverse();
    fs.appendFileSync(
      `${DIR_OUTPATH}Total_Frames_CNV.js`,
      `result[4] = [${totalFrameArrT2}]; \n`,
      'utf8',
    );
    for (const idx in totalFrameArrT2) {
      totalFrameArrT2[idx] = totalFrameArrT2[0];
    }
    fs.appendFileSync(
      `${DIR_OUTPATH}Total_Frames_CNV.js`,
      `result[5] = [${totalFrameArrT2}]; \n`,
      'utf8',
    );
  }
}
// writeTotalFramesCNV();

// function writeStageDataCNV() // Fills out color data for stages in Hex in result[1]
// {
//   let stageData = [];
//   let stageDataCNV = [];
//   // Numbers
//   dataObject['Stage_Selector'].split(',').forEach((frame) => {
//     stageData.push(frame);
//   });
//   // Hex
//   dataObject['Stage_Selector'].split(',').forEach((frame) => {
//     stageDataCNV.push(`'${Object.values(STAGES_OBJ)[frame]}'`);
//   });
//   // Merge the stageDataCNV into the dataObject
//   // dataObject['Stage_Selector_CNV'] = stageDataCNV;
//   fs.writeFileSync(`${ DIR_OUTPATH } Stage_Selector_CNV.js`,
//     `var result = []; \nresult[0] = [${ stageData }]; \nresult[1] = [${ stageDataCNV }]; \n`,
//     'utf8',
//   );
//   stageData = [];
//   stageDataCNV = [];
// }
// function countIsPausedCNV() {
//   let State_Is_Paused = [];
//   let counter = 0;
//   dataObject.Is_Paused.split(',').forEach((element, index) => {
//     if (element == 0) {
//       counter = 0;
//       State_Is_Paused[index] = 0;
//     }
//     else {
//       State_Is_Paused[index] = (counter + 1);
//       counter += 1;
//     }
//   });

//   fs.writeFileSync(`${ DIR_OUTPATH } Is_Paused_CNV.js`,
//     `var result = [];\nresult[0] = [${ dataObject['Is_Paused']}]; \nresult[1] = ["${State_Is_Paused.toString()}];`,
//     'utf8',
//   );
// }
