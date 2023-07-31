import {
  tempJS,
  CLIP_LENGTH,
  POINT_OBJ_P1,
  POINT_OBJ_P2,
  DIR_OUTPATH,
  dataObject,
} from './00_DataObject.js';

import {
  writeSortedJS
} from './01_writeSortedJS.js';

import {
  fetchPMemEntries,
} from './02_FetchPlayerMemEntries.js';

import * as fs from 'fs';


/**
 * @param {number|string} p1OrP2 ex: 1 or "P1"
 * @param {string} pMemAdr ex: "Health_Big"
 * @description Finds the point character for each frame and writes
 * their PlayerMemory address to a file.
 */
async function writePlayerMemory(p1OrP2, pMemAdr) {
  let pMemArr = [[], [], []];
  /**
   * @type {Object} POINT_OBJ_P1 or POINT_OBJ_P2
   * @description Switches between the Player1 and Player2 objects,
   * which contain key value pairs of P1_A... and P2_A... 
   * to `dataObject['P1_A_Is_Point'].split(',')`
   */
  let pObjSwitch;
  /**
   * @description "P1" | "P2"
  */
  let playerSwitcher;

  if ((p1OrP2 == 1) || (p1OrP2 == "P1") || (p1OrP2 == "1")) {
    pObjSwitch = POINT_OBJ_P1;
    playerSwitcher = "P1";
  }
  else if ((p1OrP2 == 2) || (p1OrP2 == "P2") || (p1OrP2 == "2")) {
    pObjSwitch = POINT_OBJ_P2;
    playerSwitcher = "P2";
  }
  await writeSortedJS();
  import(`file://${tempJS}`).then((pMemFile) => {
    for (let clipLen = 0; clipLen < CLIP_LENGTH; clipLen++) {
      // 3-Character Bug Logic
      if ((Object.values(pObjSwitch)[0][clipLen] == 0)
        && (Object.values(pObjSwitch)[1][clipLen] == 0)
        && (Object.values(pObjSwitch)[2][clipLen] == 0)) {
        // console.log( `${ playerSwitcher }: 3 - Character Bug Logic: A == 0 && B == 0 && C == 0    P1: ABC` );
        pMemArr[0].push(pMemFile[`${Object.keys(pObjSwitch)[0]}${pMemAdr}`].split(',')[clipLen]);
        pMemArr[1].push(pMemFile[`${Object.keys(pObjSwitch)[1]}${pMemAdr}`].split(',')[clipLen]);
        pMemArr[2].push(pMemFile[`${Object.keys(pObjSwitch)[2]}${pMemAdr}`].split(',')[clipLen]);
      }
      // 2-Character Bug Logic
      else if ((Object.values(pObjSwitch)[0][clipLen] == 0)
        && (Object.values(pObjSwitch)[1][clipLen] == 0)
        && (Object.values(pObjSwitch)[2][clipLen] != 0)) {
        // console.log( `${ playerSwitcher }: 2 - Character Bug Logic: A == 0 && B == 0 && C != 0    P1: AB` );
        pMemArr[0].push(pMemFile[`${Object.keys(pObjSwitch)[0]}${pMemAdr}`].split(',')[clipLen]);
        pMemArr[1].push(pMemFile[`${Object.keys(pObjSwitch)[1]}${pMemAdr}`].split(',')[clipLen]);
      }
      else if ((Object.values(pObjSwitch)[0][clipLen] == 0)
        && (Object.values(pObjSwitch)[1][clipLen] != 0)
        && (Object.values(pObjSwitch)[2][clipLen] == 0)) {
        // console.log( `${ playerSwitcher }: 2 - Character Bug Logic: A == 0 && B != 0 && C == 0    P1: AC` );
        pMemArr[0].push(pMemFile[`${Object.keys(pObjSwitch)[0]}${pMemAdr}`].split(',')[clipLen]);
        pMemArr[1].push(pMemFile[`${Object.keys(pObjSwitch)[2]}${pMemAdr}`].split(',')[clipLen]);
      }
      else if ((Object.values(pObjSwitch)[0][clipLen] != 0)
        && (Object.values(pObjSwitch)[1][clipLen] == 0)
        && (Object.values(pObjSwitch)[2][clipLen] == 0)) {
        // console.log( `${ playerSwitcher }: 2 - Character Bug Logic: A != 0 && B == 0 && C == 0    P1: BC` );
        pMemArr[0].push(pMemFile[`${Object.keys(pObjSwitch)[1]}${pMemAdr}`].split(',')[clipLen]);
        pMemArr[1].push(pMemFile[`${Object.keys(pObjSwitch)[2]}${pMemAdr}`].split(',')[clipLen]);
      }
      // 1-Character Logic
      else if ((Object.values(pObjSwitch)[0][clipLen] == 0)
        && (Object.values(pObjSwitch)[1][clipLen] != 0)
        && (Object.values(pObjSwitch)[2][clipLen] != 0)) {
        // console.log(`${ playerSwitcher }: 1 - Character Logic: A == 0 && B != 0 && C != 0        P1: A`);
        pMemArr[0].push(pMemFile[`${Object.keys(pObjSwitch)[0]}${pMemAdr}`].split(',')[clipLen]);
      }//                       P1|P2        P1_A        Health_Big                        i     
      else if ((Object.values(pObjSwitch)[0][clipLen] != 0)
        && (Object.values(pObjSwitch)[1][clipLen] == 0)
        && (Object.values(pObjSwitch)[2][clipLen] != 0)) {
        // console.log(`${ playerSwitcher }: 1 - Character Logic: A != 0 && B == 0 && C != 0        P1: B`);
        pMemArr[0].push(pMemFile[`${Object.keys(pObjSwitch)[1]}${pMemAdr}`].split(',')[clipLen]);
      }
      else if ((Object.values(pObjSwitch)[0][clipLen] != 0)
        && (Object.values(pObjSwitch)[1][clipLen] != 0)
        && (Object.values(pObjSwitch)[2][clipLen] == 0)) {
        // console.log(`${ playerSwitcher }: 1 - Character Logic: A != 0 && B != 0 && C == 0       P1: C`);
        pMemArr[0].push(pMemFile[`${Object.keys(pObjSwitch)[2]}${pMemAdr}`].split(',')[clipLen]);
      }
    } // loop end

    // Write the file if it doesn't exist yet.
    if (!fs.existsSync(`${DIR_OUTPATH}/${playerSwitcher}_${pMemAdr.split(',')}.js`)) {
      fs.writeFileSync(
        `${DIR_OUTPATH}/${playerSwitcher}_${pMemAdr.split(',')}.js`,
        `var result = []; ` + "\n",
        'utf8',
      )
      // Append main data
      for (let dataArrayPerCharacter in pMemArr) {
        fs.appendFileSync(
          `${DIR_OUTPATH}/${playerSwitcher}_${pMemAdr.split(',')}.js`,
          `result[${dataArrayPerCharacter}] = [${pMemArr[dataArrayPerCharacter]}];\n`,
          'utf8',
        )
      }
    }
  });
}
fetchPMemEntries().forEach(function (label) {
  writePlayerMemory(1, label.toString());
  writePlayerMemory(2, label.toString());
});

export { writePlayerMemory }
