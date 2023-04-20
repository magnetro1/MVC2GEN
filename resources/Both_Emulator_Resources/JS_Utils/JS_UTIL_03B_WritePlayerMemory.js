/* eslint-disable no-console */
/* eslint-disable no-multi-spaces */
import * as fs from 'fs';
import { DIR_EXPORT_TO_AE } from './JS_UTIL_paths.js';
import giantObjectCopy from './JS_UTIL_02_MinMaxRound.js';

const updatedObj = giantObjectCopy;
const enableLogging = true;
/**
 * @param {object} updObj the full object containing other objects.
 * @returns Writes Files
 * @description Finds the point character and writes a file for each pMemAdr
*/
export default function writePMem(updObj) {
  const pMemResObj = {};
  // Find pMemAdrs using Regex
  for (const objName in updObj) {
    // push the objName into pMemResObj
    pMemResObj[objName] = {};
    let pMemArr = [];
    const playerMemoryRegex = /(P1_A_)/g;
    for (const key in updatedObj[objName]) {
      if (key.toString().match(playerMemoryRegex)) {
        pMemArr.push(key);
      }
    }
    pMemArr = pMemArr.map((label) => label.replace(playerMemoryRegex, ''));
    const CLIP_LENGTH = updObj[objName].P1_A_Is_Point.split(',').length;
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
    // Switches between the Player1 and Player2 objects
    let p1P2Obj;
    for (let P1OrP2 = 1; P1OrP2 <= 2; P1OrP2++) {
      if (P1OrP2 === 1) {
        p1P2Obj = POINT_OBJ_P1;
      } else if (P1OrP2 === 2) {
        p1P2Obj = POINT_OBJ_P2;
      }
      const playerSwitcher = `P${P1OrP2}_`;
      // console.log(`${playerSwitcher} - ${tempObjName}`);
      for (const adr of pMemArr) {
        const resArr = [[], [], []]; // 3 Arrays to hold all 3 player slots.
        for (let clpLn = 0; clpLn < CLIP_LENGTH; clpLn++) {
          if ((parseFloat(Object.values(p1P2Obj)[0][clpLn]) === 0)
            && (parseFloat(Object.values(p1P2Obj)[1][clpLn]) !== 0)
            && (parseFloat(Object.values(p1P2Obj)[2][clpLn]) !== 0)
          ) {
            // push into resArr[0] the value of the key that matches the current adr
            resArr[0].push(
              updObj[objName][`${Object.keys(p1P2Obj)[0]}${adr}`].split(',')[clpLn],
            );
          }
        }
        pMemResObj[objName][`${playerSwitcher}${adr}`] = resArr;
      } // End of for (const adr of pMemArr)
    } // End of for (let P1OrP2 = 1; P1OrP2 <= 2; P1OrP2++)
  } // End of for (const objName in updObj)
  // Write each objName's key/value pairs to a file in the AE folder.
  for (const objName in pMemResObj) {
    for (const entry in pMemResObj[objName]) {
      const FILE_OUTPATH = `${DIR_EXPORT_TO_AE}${objName}/${entry}.js`;
      // console.log(FILE_OUTPATH);
      const data = `var result = ${JSON.stringify(pMemResObj[objName][entry])}`;
      fs.writeFile(FILE_OUTPATH, data, (err) => console.log(err));
    }
  } // End of writePMem()
}
// End of writePMem()
console.time('Time to run the function');
writePMem(giantObjectCopy);
console.timeEnd('Time to run the function');

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
//       updObj[objName][`${Object.keys(p1P2Obj)[0]}${pMemArr[adr]}`]
//         .split(',')[clpLn],
//     );
//     resArr[1].push(
//       updObj[objName][`${Object.keys(p1P2Obj)[1]}${pMemArr[adr]}`]
//         .split(',')[clpLn],
//     );
//     resArr[2].push(
//       updObj[objName][`${Object.keys(p1P2Obj)[2]}${pMemArr[adr]}`]
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
//       updObj[objName][`${Object.keys(p1P2Obj)[0]}${pMemArr[adr]}`].split(',')[clpLn],
//     );
//     resArr[1].push(
//       updObj[objName][`${Object.keys(p1P2Obj)[1]}${pMemArr[adr]}`].split(',')[clpLn],
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
//       updObj[objName][`${Object.keys(p1P2Obj)[0]}${pMemArr[adr]}`].split(',')[clpLn],
//     );
//     resArr[1].push(
//       updObj[objName][`${Object.keys(p1P2Obj)[2]}${pMemArr[adr]}`].split(',')[clpLn],
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
//       updObj[objName][`${Object.keys(p1P2Obj)[1]}${pMemArr[adr]}`].split(',')[clpLn],
//     );
//     resArr[1].push(
//       updObj[objName][`${Object.keys(p1P2Obj)[2]}${pMemArr[adr]}`].split(',')[clpLn],
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
//     console.log(updObj[objName][`${Object.keys(p1P2Obj)[0][pMemArr[adr]]} `]);
//     //            {}  [Opener1][          P1_A_Is_Point[0]  ]
//     // resArr[0].push(
//   //! Figure out how to push and merge the values into the object
//     // updObj[objName][`${ Object.keys(p1P2Obj)[0] }${ pMemArr[adr] } `].split(',')[clpLn],
//     // );                                  // P1|P2   P1_A Health_Big
//   } else if ((parseFloat(Object.values(p1P2Obj)[0][clpLn]) !== 0)
//     && (parseFloat(Object.values(p1P2Obj)[1][clpLn]) === 0)
//     && (parseFloat(Object.values(p1P2Obj)[2][clpLn]) !== 0)
//   ) {
//     if (enableLogging) {
//       console.log(
//         `${playerSwitcher}: 1 - Character Logic: A != 0 && B == 0 && C != 0        P1: B`,
//       );
//     }
//     resArr[0].push(
//       updObj[objName][`${Object.keys(p1P2Obj)[1]}${pMemArr[adr]} `].split(',')[clpLn],
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
//       updObj[objName][`${Object.keys(p1P2Obj)[2]}${pMemArr[adr]} `].split(',')[clpLn],
//     );
//   } else {
//     throw new Error('Error: No Logic Matched');
//   }
