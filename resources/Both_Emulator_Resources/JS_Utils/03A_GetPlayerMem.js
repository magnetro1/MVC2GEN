import {
  tempJS,
  CLIP_LENGTH,
  POINT_OBJ_P1,
  POINT_OBJ_P2,
} from './00_DataObject.js';

import {
  writeSortedJS
} from './01_writeSortedJS.js';

/**
   * @param {number|string} p1OrP2 number or string, ex: 1 or "P1"
   * @param {string} pMemAdr ex: "Health_Big"
   * @returns {Number[]} Returns an array of numbers
   * @description Finds the point character, and returns an array of numbers for the playerMemoryAddress in the clip.
   */
async function getPlayerMemory(p1OrP2, pMemAdr) {
  let valArr = [[], [], []];
  let pObjSwitch;// Switches between the Player1 and Player2 objects
  let playerSwitcher; // Switches between "P1" and "P2"

  if ((p1OrP2 == 1) || (p1OrP2 == "P1") || (p1OrP2 == "1")) {
    pObjSwitch = POINT_OBJ_P1;
    playerSwitcher = "P1";
  }
  else if ((p1OrP2 == 2) || (p1OrP2 == "P2") || (p1OrP2 == "2")) {
    pObjSwitch = POINT_OBJ_P2;
    playerSwitcher = "P2";
  }

  await writeSortedJS();
  await import(`file://${tempJS}`).then((pMemFile) => {
    for (let clipLen = 0; clipLen < CLIP_LENGTH; clipLen++) {
      // 3-Character Bug
      if ((Object.values(pObjSwitch)[0][clipLen] == 0)
        && (Object.values(pObjSwitch)[1][clipLen] == 0)
        && (Object.values(pObjSwitch)[2][clipLen] == 0)) {
        // console.log(`${playerSwitcher}: 3 - Character Bug: A == 0 && B == 0 && C == 0    P1: ABC`);
        valArr[0].push(pMemFile[`${Object.keys(pObjSwitch)[0]}${pMemAdr}`].split(',')[clipLen]);
        valArr[1].push(pMemFile[`${Object.keys(pObjSwitch)[1]}${pMemAdr}`].split(',')[clipLen]);
        valArr[2].push(pMemFile[`${Object.keys(pObjSwitch)[2]}${pMemAdr}`].split(',')[clipLen]);
      }
      // 2-Character Bug
      else if ((Object.values(pObjSwitch)[0][clipLen] == 0)
        && (Object.values(pObjSwitch)[1][clipLen] == 0)
        && (Object.values(pObjSwitch)[2][clipLen] != 0)) {
        // console.log(`${playerSwitcher}: 2 - Character Bug: A == 0 && B == 0 && C != 0    P1: AB`);
        valArr[0].push(pMemFile[`${Object.keys(pObjSwitch)[0]}${pMemAdr}`].split(',')[clipLen]);
        valArr[1].push(pMemFile[`${Object.keys(pObjSwitch)[1]}${pMemAdr}`].split(',')[clipLen]);
      }
      else if ((Object.values(pObjSwitch)[0][clipLen] == 0)
        && (Object.values(pObjSwitch)[1][clipLen] != 0)
        && (Object.values(pObjSwitch)[2][clipLen] == 0)) {
        // console.log(`${playerSwitcher}: 2 - Character Bug: A == 0 && B != 0 && C == 0    P1: AC`);
        valArr[0].push(pMemFile[`${Object.keys(pObjSwitch)[0]}${pMemAdr}`].split(',')[clipLen]);
        valArr[1].push(pMemFile[`${Object.keys(pObjSwitch)[2]}${pMemAdr}`].split(',')[clipLen]);
      }
      else if ((Object.values(pObjSwitch)[0][clipLen] != 0)
        && (Object.values(pObjSwitch)[1][clipLen] == 0)
        && (Object.values(pObjSwitch)[2][clipLen] == 0)) {
        // console.log(`${playerSwitcher}: 2 - Character Bug: A != 0 && B == 0 && C == 0    P1: BC`);
        valArr[0].push(pMemFile[`${Object.keys(pObjSwitch)[1]}${pMemAdr}`].split(',')[clipLen]);
        valArr[1].push(pMemFile[`${Object.keys(pObjSwitch)[2]}${pMemAdr}`].split(',')[clipLen]);
      }
      // 1-Character
      else if ((Object.values(pObjSwitch)[0][clipLen] == 0)
        && (Object.values(pObjSwitch)[1][clipLen] != 0)
        && (Object.values(pObjSwitch)[2][clipLen] != 0)) {
        // console.log(`${playerSwitcher}: 1 - Character: A == 0 && B != 0 && C != 0        P1: A`);
        valArr[0].push(pMemFile[`${Object.keys(pObjSwitch)[0]}${pMemAdr}`].split(',')[clipLen]);
      }//          replayObject[               P1_A_            Health_Big.split(',')[i]
      else if ((Object.values(pObjSwitch)[0][clipLen] != 0)
        && (Object.values(pObjSwitch)[1][clipLen] == 0)
        && (Object.values(pObjSwitch)[2][clipLen] != 0)) {
        // console.log(`${playerSwitcher}: 1 - Character: A != 0 && B == 0 && C != 0        P1: B`);
        valArr[0].push(pMemFile[`${Object.keys(pObjSwitch)[1]}${pMemAdr}`].split(',')[clipLen]);
      }//          replayObject[               P1_B_            Health_Big.split(',')[i]
      else if ((Object.values(pObjSwitch)[0][clipLen] != 0)
        && (Object.values(pObjSwitch)[1][clipLen] != 0)
        && (Object.values(pObjSwitch)[2][clipLen] == 0)) {
        // console.log(`${playerSwitcher}: 1 - Character: A != 0 && B != 0 && C == 0       P1: C`);
        valArr[0].push(pMemFile[`${Object.keys(pObjSwitch)[2]}${pMemAdr}`].split(',')[clipLen]);
      }//          replayObject[               P1_C_            Health_Big.split(',')[i]
    }
  });
  // console.log(`valArr: ${valArr}`);
  return valArr;
}

export { getPlayerMemory };
