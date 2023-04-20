/* eslint-disable no-console */
/* eslint-disable no-multi-spaces */
import * as fs from 'fs';
import { DIR_EXPORT_TO_AE } from './JS_UTIL_paths.js';
import giantObjectCopy from './JS_UTIL_02_MinMaxRound.js';

const updatedObj = giantObjectCopy;
const enableLogging = false;
const resObj = {};
/**
 * @param {object} updObj the full object containing other objects.
 * @returns Writes Files
 * @description Finds the point character and writes a file for each pMemAdr
*/
export default function writePMem(updObj) {
  const pMemResObj = {};
  for (const tempObjName in updObj) {
    let pMemArr = [];
    const playerMemoryRegex = /(P1_A_)/g;
    for (const key in updatedObj[tempObjName]) {
      if (key.toString().match(playerMemoryRegex)) {
        pMemArr.push(key);
      }
    }
    pMemArr = pMemArr.map((label) => label.replace(playerMemoryRegex, ''));
    const CLIP_LENGTH = updObj[tempObjName].P1_A_Is_Point.split(',').length;

    const POINT_OBJ_P1 = {
      P1_A_: updObj[tempObjName].P1_A_Is_Point.split(','),
      P1_B_: updObj[tempObjName].P1_B_Is_Point.split(','),
      P1_C_: updObj[tempObjName].P1_C_Is_Point.split(','),
    };
    const POINT_OBJ_P2 = {
      P2_A_: updObj[tempObjName].P2_A_Is_Point.split(','),
      P2_B_: updObj[tempObjName].P2_B_Is_Point.split(','),
      P2_C_: updObj[tempObjName].P2_C_Is_Point.split(','),
    };

    let p1P2Obj;// Switches between the Player1 and Player2 objects

    for (let player = 1; player <= 2; player++) {
      if (player === 1) {
        p1P2Obj = POINT_OBJ_P1;
      } else if (player === 2) {
        p1P2Obj = POINT_OBJ_P2;
      }
      const playerSwitcher = `Player${player}`;
      const resArr = [[], [], []]; // 3 Arrays to hold all 3 player slots.
      // console.log(`${playerSwitcher} - ${tempObjName}`);
      for (const adr of pMemArr) {
        console.log(adr);
        // for (let clpLn = 0; clpLn < CLIP_LENGTH; clpLn++) {
        //   // 3-Character Bug Logic
        //   if ((parseFloat(Object.values(p1P2Obj)[0][clpLn]) === 0)
        //     && (parseFloat(Object.values(p1P2Obj)[1][clpLn]) === 0)
        //     && (parseFloat(Object.values(p1P2Obj)[2][clpLn]) === 0)
        //   ) {
        //     if (enableLogging) {
        //       console.log(
        //         `${playerSwitcher}: 3-Character Bug Logic: A == 0 && B == 0 && C == 0    P1: ABC`,
        //       );
        //     }
        //     resArr[0].push(
        //       updObj[objName][`${Object.keys(p1P2Obj)[0]}${pMemOrArray}`]
        //         .split(',')[clpLn],
        //     );
        //     resArr[1].push(
        //       updObj[objName][`${Object.keys(p1P2Obj)[1]}${pMemOrArray}`]
        //         .split(',')[clpLn],
        //     );
        //     resArr[2].push(
        //       updObj[objName][`${Object.keys(p1P2Obj)[2]}${pMemOrArray}`]
        //         .split(',')[clpLn],
        //     );
        //     /* 2-Character Bug Logic */
        //   } else if ((parseFloat(Object.values(p1P2Obj)[0][clpLn]) === 0)
        //     && (parseFloat(Object.values(p1P2Obj)[1][clpLn]) === 0)
        //     && (parseFloat(Object.values(p1P2Obj)[2][clpLn]) !== 0)
        //   ) {
        //     if (enableLogging) {
        //       console.log(
        //         `${playerSwitcher}: 2-Character Bug Logic: A == 0 && B == 0 && C != 0    P1: AB`,
        //       );
        //     }
        //     resArr[0].push(
        //       updObj[objName][`${Object.keys(p1P2Obj)[0]}${pMemOrArray}`].split(',')[clpLn],
        //     );
        //     resArr[1].push(
        //       updObj[objName][`${Object.keys(p1P2Obj)[1]}${pMemOrArray}`].split(',')[clpLn],
        //     );
        //   } else if ((parseFloat(Object.values(p1P2Obj)[0][clpLn]) === 0)
        //     && (parseFloat(Object.values(p1P2Obj)[1][clpLn]) !== 0)
        //     && (parseFloat(Object.values(p1P2Obj)[2][clpLn]) === 0)
        //   ) {
        //     if (enableLogging) {
        //       console.log(
        //         `${playerSwitcher}: 2-Character Bug Logic: A == 0 && B != 0 && C == 0    P1: AC`,
        //       );
        //     }
        //     resArr[0].push(
        //       updObj[objName][`${Object.keys(p1P2Obj)[0]}${pMemOrArray}`].split(',')[clpLn],
        //     );
        //     resArr[1].push(
        //       updObj[objName][`${Object.keys(p1P2Obj)[2]}${pMemOrArray}`].split(',')[clpLn],
        //     );
        //   } else if ((parseFloat(Object.values(p1P2Obj)[0][clpLn]) !== 0)
        //     && (parseFloat(Object.values(p1P2Obj)[1][clpLn]) === 0)
        //     && (parseFloat(Object.values(p1P2Obj)[2][clpLn]) === 0)
        //   ) {
        //     if (enableLogging) {
        //       console.log(
        //         `${playerSwitcher}: 2-Character Bug Logic: A != 0 && B == 0 && C == 0    P1: BC`,
        //       );
        //     }
        //     resArr[0].push(
        //       updObj[objName][`${Object.keys(p1P2Obj)[1]}${pMemOrArray}`].split(',')[clpLn],
        //     );
        //     resArr[1].push(
        //       updObj[objName][`${Object.keys(p1P2Obj)[2]}${pMemOrArray}`].split(',')[clpLn],
        //     );
        //     // 1-Character Logic
        //   } else if ((parseFloat(Object.values(p1P2Obj)[0][clpLn]) === 0)
        //     && (parseFloat(Object.values(p1P2Obj)[1][clpLn]) !== 0)
        //     && (parseFloat(Object.values(p1P2Obj)[2][clpLn]) !== 0)
        //   ) {
        //     if (enableLogging) {
        //       console.log(
        //         `${playerSwitcher}: 1-Character Logic: A == 0 && B != 0 && C != 0        P1: A`,
        //       );
        //     }
        //     resArr[0].push(
        //       updObj[objName][`${Object.keys(p1P2Obj)[0]}${pMemOrArray}`].split(',')[clpLn],
        //     );                                  // P1|P2   P1_A Health_Big
        //   } else if ((parseFloat(Object.values(p1P2Obj)[0][clpLn]) !== 0)
        //     && (parseFloat(Object.values(p1P2Obj)[1][clpLn]) === 0)
        //     && (parseFloat(Object.values(p1P2Obj)[2][clpLn]) !== 0)
        //   ) {
        //     if (enableLogging) {
        //       console.log(
        //         `${playerSwitcher}: 1-Character Logic: A != 0 && B == 0 && C != 0        P1: B`,
        //       );
        //     }
        //     resArr[0].push(
        //       updObj[objName][`${Object.keys(p1P2Obj)[1]}${pMemOrArray}`].split(',')[clpLn],
        //     );
        //   } else if ((parseFloat(Object.values(p1P2Obj)[0][clpLn]) !== 0)
        //     && (parseFloat(Object.values(p1P2Obj)[1][clpLn]) !== 0)
        //     && (parseFloat(Object.values(p1P2Obj)[2][clpLn]) === 0)
        //   ) {
        //     if (enableLogging) {
        //       console.log(
        //         `${playerSwitcher}: 1 - Character Logic: A != 0 && B != 0 && C == 0       P1: C`,
        //       );
        //     }
        //     resArr[0].push(
        //       updObj[objName][`${Object.keys(p1P2Obj)[2]}${pMemOrArray}`].split(',')[clpLn],
        //     );
        //   } else {
        //     throw new Error('Error: No Logic Matched');
        //   }
      }
    }
  }
}
writePMem(giantObjectCopy);
