/* eslint-disable no-console */
/* eslint-disable no-multi-spaces */
import * as fs from 'fs';
import giantObjectCopy from './JS_UTIL_02_MinMaxRound.js';
import { DIR_EXPORT_TO_AE } from './JS_UTIL_paths.js';

const updatedObj = giantObjectCopy;
const enableLogging = false;

// Main function to write data to files OR return finalValues array
/**
* @param {string} objectName string
* @param {number|string} PlayerOneOrPlayerTwo number or string, ex: 1 or "P1"
* @param {string} pMemAdr string, ex: "Health_Big"
* @param {number|boolean} write flag to return array or write to file
* @returns {Number[]} returns an array of numbers or writes a file for
* the pMemAdr in the clip.
* @description Finds the point character, and returns an array of numbers
* for the pMemAdr in the clip.
*/
// eslint-disable-next-line consistent-return
export default function writePlayerMemory(objectName, PlayerOneOrPlayerTwo, pMemAdr, write) {
  if (enableLogging) {
    console.log(objectName, PlayerOneOrPlayerTwo, pMemAdr, write);
  }
  const DIR_OUTPATH = `${DIR_EXPORT_TO_AE}${objectName}`;
  const CLIP_LENGTH = updatedObj[objectName].A_2D_Game_Timer.split(',').length;

  const POINT_OBJ_P1 = {
    P1_A_: updatedObj[objectName].P1_A_Is_Point.split(','),
    P1_B_: updatedObj[objectName].P1_B_Is_Point.split(','),
    P1_C_: updatedObj[objectName].P1_C_Is_Point.split(','),
  };
  const POINT_OBJ_P2 = {
    P2_A_: updatedObj[objectName].P2_A_Is_Point.split(','),
    P2_B_: updatedObj[objectName].P2_B_Is_Point.split(','),
    P2_C_: updatedObj[objectName].P2_C_Is_Point.split(','),
  };

  const resArr = [[], [], []]; // 3 Arrays to hold all 3 player slots.

  /**
   * @description Switches between the Player1 and Player2 objects,
   * @example POINT_OBJ_P1 or POINT_OBJ_P2 which contain key value pairs of
   * P1_A... and P2_A... to
   * `updatedObject[tempDataObject]['P1_A_Is_Point'].split(',')`... etc
   */
  let p1OrP2Obj;// Switches between the Player1 and Player2 objects

  /** @description "P1" | "P2" */
  let playerSwitcher; // Switches between "P1" and "P2"

  if ((PlayerOneOrPlayerTwo === 1)
    || (PlayerOneOrPlayerTwo === 'P1')
    || (PlayerOneOrPlayerTwo === '1')) {
    p1OrP2Obj = POINT_OBJ_P1;
    playerSwitcher = 'P1';
  } else if ((PlayerOneOrPlayerTwo === 2)
    || (PlayerOneOrPlayerTwo === 'P2')
    || (PlayerOneOrPlayerTwo === '2')) {
    p1OrP2Obj = POINT_OBJ_P2;
    playerSwitcher = 'P2';
  }

  // Pushes the POINT_OBJ values (P1_A[n]) into the finalValuesArray
  for (let clipLen = 0; clipLen < CLIP_LENGTH; clipLen++) {
    // 3-Character Bug Logic
    if ((parseFloat(Object.values(p1OrP2Obj)[0][clipLen]) === 0)
      && (parseFloat(Object.values(p1OrP2Obj)[1][clipLen]) === 0)
      && (parseFloat(Object.values(p1OrP2Obj)[2][clipLen]) === 0)
    ) {
      if (enableLogging) {
        console.log(
          `${playerSwitcher}: 3-Character Bug Logic: A == 0 && B == 0 && C == 0    P1: ABC`,
        );
      }
      resArr[0].push(
        updatedObj[objectName][`${Object.keys(p1OrP2Obj)[0]}${pMemAdr}`]
          .split(',')[clipLen],
      );
      resArr[1].push(
        updatedObj[objectName][`${Object.keys(p1OrP2Obj)[1]}${pMemAdr}`]
          .split(',')[clipLen],
      );
      resArr[2].push(
        updatedObj[objectName][`${Object.keys(p1OrP2Obj)[2]}${pMemAdr}`]
          .split(',')[clipLen],
      );
      /* 2-Character Bug Logic */
    } else if ((parseFloat(Object.values(p1OrP2Obj)[0][clipLen]) === 0)
      && (parseFloat(Object.values(p1OrP2Obj)[1][clipLen]) === 0)
      && (parseFloat(Object.values(p1OrP2Obj)[2][clipLen]) !== 0)
    ) {
      if (enableLogging) {
        console.log(
          `${playerSwitcher}: 2-Character Bug Logic: A == 0 && B == 0 && C != 0    P1: AB`,
        );
      }
      resArr[0].push(
        updatedObj[objectName][`${Object.keys(p1OrP2Obj)[0]}${pMemAdr}`].split(',')[clipLen],
      );
      resArr[1].push(
        updatedObj[objectName][`${Object.keys(p1OrP2Obj)[1]}${pMemAdr}`].split(',')[clipLen],
      );
    } else if ((parseFloat(Object.values(p1OrP2Obj)[0][clipLen]) === 0)
      && (parseFloat(Object.values(p1OrP2Obj)[1][clipLen]) !== 0)
      && (parseFloat(Object.values(p1OrP2Obj)[2][clipLen]) === 0)
    ) {
      if (enableLogging) {
        console.log(
          `${playerSwitcher}: 2-Character Bug Logic: A == 0 && B != 0 && C == 0    P1: AC`,
        );
      }
      resArr[0].push(
        updatedObj[objectName][`${Object.keys(p1OrP2Obj)[0]}${pMemAdr}`].split(',')[clipLen],
      );
      resArr[1].push(
        updatedObj[objectName][`${Object.keys(p1OrP2Obj)[2]}${pMemAdr}`].split(',')[clipLen],
      );
    } else if ((parseFloat(Object.values(p1OrP2Obj)[0][clipLen]) !== 0)
      && (parseFloat(Object.values(p1OrP2Obj)[1][clipLen]) === 0)
      && (parseFloat(Object.values(p1OrP2Obj)[2][clipLen]) === 0)
    ) {
      if (enableLogging) {
        console.log(
          `${playerSwitcher}: 2-Character Bug Logic: A != 0 && B == 0 && C == 0    P1: BC`,
        );
      }
      resArr[0].push(
        updatedObj[objectName][`${Object.keys(p1OrP2Obj)[1]}${pMemAdr}`].split(',')[clipLen],
      );
      resArr[1].push(
        updatedObj[objectName][`${Object.keys(p1OrP2Obj)[2]}${pMemAdr}`].split(',')[clipLen],
      );
      // 1-Character Logic
    } else if ((parseFloat(Object.values(p1OrP2Obj)[0][clipLen]) === 0)
      && (parseFloat(Object.values(p1OrP2Obj)[1][clipLen]) !== 0)
      && (parseFloat(Object.values(p1OrP2Obj)[2][clipLen]) !== 0)
    ) {
      if (enableLogging) {
        console.log(
          `${playerSwitcher}: 1-Character Logic: A == 0 && B != 0 && C != 0        P1: A`,
        );
      }
      resArr[0].push(
        updatedObj[objectName][`${Object.keys(p1OrP2Obj)[0]}${pMemAdr}`].split(',')[clipLen],
      );                                  // P1|P2   P1_A Health_Big
    } else if ((parseFloat(Object.values(p1OrP2Obj)[0][clipLen]) !== 0)
      && (parseFloat(Object.values(p1OrP2Obj)[1][clipLen]) === 0)
      && (parseFloat(Object.values(p1OrP2Obj)[2][clipLen]) !== 0)
    ) {
      if (enableLogging) {
        console.log(
          `${playerSwitcher}: 1-Character Logic: A != 0 && B == 0 && C != 0        P1: B`,
        );
      }
      resArr[0].push(
        updatedObj[objectName][`${Object.keys(p1OrP2Obj)[1]}${pMemAdr}`].split(',')[clipLen],
      );
    } else if ((parseFloat(Object.values(p1OrP2Obj)[0][clipLen]) !== 0)
      && (parseFloat(Object.values(p1OrP2Obj)[1][clipLen]) !== 0)
      && (parseFloat(Object.values(p1OrP2Obj)[2][clipLen]) === 0)
    ) {
      if (enableLogging) {
        console.log(
          `${playerSwitcher}: 1 - Character Logic: A != 0 && B != 0 && C == 0       P1: C`,
        );
      }
      resArr[0].push(
        updatedObj[objectName][`${Object.keys(p1OrP2Obj)[2]}${pMemAdr}`].split(',')[clipLen],
      );
    } else {
      throw new Error('Error: No Logic Matched');
    }
  }

  // Return if not writing files
  if ((write === 0) || (write === false)) {
    return resArr;
  }
  if ((write === 1) || (write === true)) {
    // Create file if it doesn't exist
    const tempStr = `${DIR_OUTPATH}/${playerSwitcher}_${pMemAdr.split(',')}.js`;
    if (!fs.existsSync(tempStr)) {
      fs.writeFileSync(
        tempStr,
        'var result = [];\n',
        'utf8',
      );
      // Append main data
      for (const perCharArr in resArr) {
        fs.appendFileSync(
          `${DIR_OUTPATH}/${playerSwitcher}_${pMemAdr.split(',')}.js`,
          `result[${perCharArr}] = [${resArr[perCharArr]}];\n`,
          'utf8',
        );
      }
    } else {
      throw new Error('Error: File already exists.');
    }
  }
}
