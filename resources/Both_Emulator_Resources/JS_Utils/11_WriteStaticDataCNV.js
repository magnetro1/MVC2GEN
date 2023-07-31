import * as fs from 'fs';
import {
  DIR_OUTPATH,
} from './00_DataObject.js';
import {
  getPlayerMemory
} from './03A_GetPlayerMem.js';
import {
  KNOCKDOWN_STATE_OBJ,
  IS_PROX_BLOCK_OBJ,
  DEC_NAME_TABLE_OBJ,
  PORTRAITS_TO_TIME_OBJ,
  AE_TO_POSITION_OBJ,
  AE_TO_CVS2_POSITION_OBJ
} from './JS_UTIL_staticData.js';


// Write Static Data Conversion. Example ID_2: 01 turns into "Ryu"
/**
 * @returns {Number[]} returns an array of numbers and writes a file with _CNV appended to its name
 * @description Writes and converts the point character's values for Knockdown State, Is_Prox_Block, ID_2 and _PortraitsToTime
 * Files are written and then appended as the function loops over each player-memory-address & player.
*/
async function writeStaticDataCNV() {
  const STATIC_DATA_OBJS = [KNOCKDOWN_STATE_OBJ, IS_PROX_BLOCK_OBJ, DEC_NAME_TABLE_OBJ, PORTRAITS_TO_TIME_OBJ]
  const STATIC_DATA_ADRS = ["Knockdown_State", "Is_Prox_Block", "ID_2", "ID_2"]
  let lookUpArr = [[], [], []];
  for (let p1OrP2 = 1; p1OrP2 < 3; p1OrP2++) {
    for (let staticDataLen = 0; staticDataLen < STATIC_DATA_ADRS.length; staticDataLen++) {
      // Write base file
      if (STATIC_DATA_OBJS[staticDataLen] == PORTRAITS_TO_TIME_OBJ) // PortraitsToTime Condition
      {
        fs.writeFileSync(`${DIR_OUTPATH}P${p1OrP2}_PortraitsToTime.js`,
          `var result = [];` + '\n',
          'utf8'
        );
        fs.writeFileSync(`${DIR_OUTPATH}P${p1OrP2}_PortraitPosition.js`,
          `var result = [];` + '\n',
          'utf8'
        );
        fs.writeFileSync(`${DIR_OUTPATH}P${p1OrP2}_CVS2PortraitPosition.js`,
          `var result = [];` + '\n',
          'utf8'
        );
      }
      else {
        fs.writeFileSync(`${DIR_OUTPATH}P${p1OrP2}_${STATIC_DATA_ADRS[staticDataLen]}_CNV.js`,
          `var result = [];` + '\n',
          'utf8'
        );
      }
    }
    for (let statAdr = 0; statAdr < STATIC_DATA_ADRS.length; statAdr++) {
      const staticDataPromise = new Promise((resolve, reject) => {
        resolve(getPlayerMemory(`${p1OrP2}`, STATIC_DATA_ADRS[statAdr].toString(), 0));
        reject("Error");
      });
      const callPlayerMemoryFN = await staticDataPromise;
      for (let pABC = 0; pABC < callPlayerMemoryFN.length; pABC++) // [0][1][2]
      {
        for (let clipLen = 0; clipLen < callPlayerMemoryFN[pABC].length; clipLen++) {
          lookUpArr[pABC].push(`'${Object.values(STATIC_DATA_OBJS[statAdr])[callPlayerMemoryFN[pABC][clipLen]]}'`);
        }
        if (STATIC_DATA_OBJS[statAdr] == PORTRAITS_TO_TIME_OBJ) // PortraitsToTime Condition && Portraits to Position
        {
          fs.appendFileSync(`${DIR_OUTPATH}P${p1OrP2}_PortraitsToTime.js`,
            `result[${pABC}] = [${lookUpArr[pABC]}];\n`,
            'utf8'
          );

          // AE_TO_NormalComposition_POS
          let posArray = lookUpArr[pABC].map((portrait) => {
            portrait = portrait.toString();
            portrait = portrait.replace(/"/g, '');
            portrait = AE_TO_POSITION_OBJ[portrait];
            portrait = [`[${portrait}]`]; /// wrap in brackets
            return portrait;
          });

          fs.appendFileSync(`${DIR_OUTPATH}P${p1OrP2}_PortraitPosition.js`,
            `result[${pABC}] = [${posArray}];\n`,
            'utf8'
          );

          // AE_TO_CVS2Composition_POS
          let posArray2 = lookUpArr[pABC].map((portrait) => {
            portrait = portrait.toString();
            portrait = portrait.replace(/"/g, '');
            portrait = AE_TO_CVS2_POSITION_OBJ[portrait];
            portrait = [`[${portrait}]`]; /// wrap in brackets
            return portrait;
          });

          fs.appendFileSync(`${DIR_OUTPATH}P${p1OrP2}_CVS2PortraitPosition.js`,
            `result[${pABC}] = [${posArray2}];\n`,
            'utf8'
          );

          lookUpArr = [[], [], []];
        } else {
          fs.appendFileSync(`${DIR_OUTPATH}P${p1OrP2}_${STATIC_DATA_ADRS[statAdr]}_CNV.js`,
            `result[${pABC}] = [${lookUpArr[pABC]}];\n`,
            'utf8'
          );
          lookUpArr = [[], [], []];
        }
      }
    }
  }
};

// writeStaticDataCNV()

export { writeStaticDataCNV };
