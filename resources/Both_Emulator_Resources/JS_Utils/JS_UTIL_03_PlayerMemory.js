/* eslint-disable no-console */
/* eslint-disable no-multi-spaces */
// import giantObjectCopy from './JS_UTIL_02_MinMaxRound.js';
import * as fs from 'fs';
import { DIR_EXPORT_TO_AE } from './JS_UTIL_paths.js';

const enableLogging = false;
/**
 * @param {object} updObj the full object containing other objects.
 * @param {string} objName string
 * @param {number|string} P1OrP2 number or string, ex: 1 or "P1" or "1"
 * @param {string} pMemAdr string, ex: "Health_Big", "X_Velocity"
 * @param {number|boolean} write flag to return array or write to file
 * @returns {Number[]} returns an array of numbers or writes a file for
 * the pMemAdr in the clip.
 * @description Finds the point character, and returns an array of numbers
 * for the pMemAdr in the clip. Can write.
*/
// eslint-disable-next-line consistent-return
export default function getPMem(updObj, objName, P1OrP2, pMemAdr, write) {
  // console.log(objectName);
  if (enableLogging) {
    console.log(objName, P1OrP2, pMemAdr, write);
  }
  const DIR_OUTPATH = `${DIR_EXPORT_TO_AE}${objName}`;
  const CLIP_LENGTH = updObj[objName].A_2D_Game_Timer.split(',').length;
  const resultsObject = {};
  const POINT_OBJ_P1 = {
    P1_A_: updObj[objName].P1_A_Is_Point.split(','),
    P1_B_: updObj[objName].P1_B_Is_Point.split(','),
    P1_C_: updObj[objName].P1_C_Is_Point.split(','),
  };
  const POINT_OBJ_P2 = {
    P2_A_: updObj[objName].P2_A_Is_Point.split(','),
    P2_B_: updObj[objName].P2_B_Is_Point.split(','),
    P2_C_: updObj[objName].P2_C_Is_Point.split(','),
  };

  const resArr = [[], [], []]; // 3 Arrays to hold all 3 player slots.

  /**
   * @description Switches between the Player1 and Player2 objects,
   * @example POINT_OBJ_P1 or POINT_OBJ_P2 which contain key value pairs of
   * P1_A... and P2_A... to
   * `updatedObject[tempDataObject]['P1_A_Is_Point'].split(',')`... etc
  */
  let p1P2Obj;// Switches between the Player1 and Player2 objects

  /** @description "P1" | "P2" */
  let playerSwitcher; // Switches between "P1" and "P2"

  if ((P1OrP2 === 1)
    || (P1OrP2 === 'P1')
    || (P1OrP2 === '1')) {
    p1P2Obj = POINT_OBJ_P1;
    playerSwitcher = 'P1';
  } else if ((P1OrP2 === 2)
    || (P1OrP2 === 'P2')
    || (P1OrP2 === '2')) {
    p1P2Obj = POINT_OBJ_P2;
    playerSwitcher = 'P2';
  }

  // Pushes the POINT_OBJ values (P1_A[n]) into the finalValuesArray
  for (let clpLn = 0; clpLn < CLIP_LENGTH; clpLn++) {
    // 3-Character Bug Logic
    if ((parseFloat(Object.values(p1P2Obj)[0][clpLn]) === 0)
      && (parseFloat(Object.values(p1P2Obj)[1][clpLn]) === 0)
      && (parseFloat(Object.values(p1P2Obj)[2][clpLn]) === 0)
    ) {
      if (enableLogging) {
        console.log(
          `${playerSwitcher}: 3-Character Bug Logic: A == 0 && B == 0 && C == 0    P1: ABC`,
        );
      }
      resArr[0].push(
        updObj[objName][`${Object.keys(p1P2Obj)[0]}${pMemAdr}`]
          .split(',')[clpLn],
      );
      resArr[1].push(
        updObj[objName][`${Object.keys(p1P2Obj)[1]}${pMemAdr}`]
          .split(',')[clpLn],
      );
      resArr[2].push(
        updObj[objName][`${Object.keys(p1P2Obj)[2]}${pMemAdr}`]
          .split(',')[clpLn],
      );
      /* 2-Character Bug Logic */
    } else if ((parseFloat(Object.values(p1P2Obj)[0][clpLn]) === 0)
      && (parseFloat(Object.values(p1P2Obj)[1][clpLn]) === 0)
      && (parseFloat(Object.values(p1P2Obj)[2][clpLn]) !== 0)
    ) {
      if (enableLogging) {
        console.log(
          `${playerSwitcher}: 2-Character Bug Logic: A == 0 && B == 0 && C != 0    P1: AB`,
        );
      }
      resArr[0].push(
        updObj[objName][`${Object.keys(p1P2Obj)[0]}${pMemAdr}`].split(',')[clpLn],
      );
      resArr[1].push(
        updObj[objName][`${Object.keys(p1P2Obj)[1]}${pMemAdr}`].split(',')[clpLn],
      );
    } else if ((parseFloat(Object.values(p1P2Obj)[0][clpLn]) === 0)
      && (parseFloat(Object.values(p1P2Obj)[1][clpLn]) !== 0)
      && (parseFloat(Object.values(p1P2Obj)[2][clpLn]) === 0)
    ) {
      if (enableLogging) {
        console.log(
          `${playerSwitcher}: 2-Character Bug Logic: A == 0 && B != 0 && C == 0    P1: AC`,
        );
      }
      resArr[0].push(
        updObj[objName][`${Object.keys(p1P2Obj)[0]}${pMemAdr}`].split(',')[clpLn],
      );
      resArr[1].push(
        updObj[objName][`${Object.keys(p1P2Obj)[2]}${pMemAdr}`].split(',')[clpLn],
      );
    } else if ((parseFloat(Object.values(p1P2Obj)[0][clpLn]) !== 0)
      && (parseFloat(Object.values(p1P2Obj)[1][clpLn]) === 0)
      && (parseFloat(Object.values(p1P2Obj)[2][clpLn]) === 0)
    ) {
      if (enableLogging) {
        console.log(
          `${playerSwitcher}: 2-Character Bug Logic: A != 0 && B == 0 && C == 0    P1: BC`,
        );
      }
      resArr[0].push(
        updObj[objName][`${Object.keys(p1P2Obj)[1]}${pMemAdr}`].split(',')[clpLn],
      );
      resArr[1].push(
        updObj[objName][`${Object.keys(p1P2Obj)[2]}${pMemAdr}`].split(',')[clpLn],
      );
      // 1-Character Logic
    } else if ((parseFloat(Object.values(p1P2Obj)[0][clpLn]) === 0)
      && (parseFloat(Object.values(p1P2Obj)[1][clpLn]) !== 0)
      && (parseFloat(Object.values(p1P2Obj)[2][clpLn]) !== 0)
    ) {
      if (enableLogging) {
        console.log(
          `${playerSwitcher}: 1-Character Logic: A == 0 && B != 0 && C != 0        P1: A`,
        );
      }
      resArr[0].push(
        updObj[objName][`${Object.keys(p1P2Obj)[0]}${pMemAdr}`].split(',')[clpLn],
      );                                  // P1|P2   P1_A Health_Big
    } else if ((parseFloat(Object.values(p1P2Obj)[0][clpLn]) !== 0)
      && (parseFloat(Object.values(p1P2Obj)[1][clpLn]) === 0)
      && (parseFloat(Object.values(p1P2Obj)[2][clpLn]) !== 0)
    ) {
      if (enableLogging) {
        console.log(
          `${playerSwitcher}: 1-Character Logic: A != 0 && B == 0 && C != 0        P1: B`,
        );
      }
      resArr[0].push(
        updObj[objName][`${Object.keys(p1P2Obj)[1]}${pMemAdr}`].split(',')[clpLn],
      );
    } else if ((parseFloat(Object.values(p1P2Obj)[0][clpLn]) !== 0)
      && (parseFloat(Object.values(p1P2Obj)[1][clpLn]) !== 0)
      && (parseFloat(Object.values(p1P2Obj)[2][clpLn]) === 0)
    ) {
      if (enableLogging) {
        console.log(
          `${playerSwitcher}: 1 - Character Logic: A != 0 && B != 0 && C == 0       P1: C`,
        );
      }
      resArr[0].push(
        updObj[objName][`${Object.keys(p1P2Obj)[2]}${pMemAdr}`].split(',')[clpLn],
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
    // add an object in the resultsObj with the name of the objName and the value of the resArr
    resultsObject[objName] = resArr;
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
      return true;
    }
  }
}
