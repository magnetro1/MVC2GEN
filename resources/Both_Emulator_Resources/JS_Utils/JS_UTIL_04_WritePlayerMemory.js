import * as fs from 'fs';
import giantObject from './JS_UTIL_01_SortCSV.js';
import findMinMaxRound from './JS_UTIL_02_MinMaxRound.js';
import playerMemoryEntries from './JS_UTIL_03_PlayerMemoryEntries.js';
import { DIR_EXPORT_TO_AE } from './JS_UTIL_paths.js';
// console.log(giantObject);
const updatedObj = findMinMaxRound(giantObject);

// Main function to write data to files OR return finalValues array
/**
 * @param {number|string} PlayerOneOrPlayerTwo number or string, ex: 1 or "P1"
 * @param {string} playerMemoryAddress string, ex: "Health_Big"
 * @param {number|boolean} write flag to return array or write to file
 * @returns {Number[]} returns an array of numbers or writes a file for
 * the playerMemoryAddress in the clip.
 * @description Finds the point character, and returns an array of numbers
 * for the playerMemoryAddress in the clip.
*/
// eslint-disable-next-line consistent-return
function writePlayerMemory(PlayerOneOrPlayerTwo, playerMemoryAddress, write) {
  for (const tempObj in updatedObj) {
    const DIR_OUTPATH = `${DIR_EXPORT_TO_AE}${tempObj}`;
    const CLIP_LENGTH = updatedObj[tempObj].A_2D_Game_Timer.split(',').length;
    console.log(CLIP_LENGTH);

    const POINT_OBJ_P1 = {
      P1_A_: updatedObj[tempObj].P1_A_Is_Point.split(','),
      P1_B_: updatedObj[tempObj].P1_B_Is_Point.split(','),
      P1_C_: updatedObj[tempObj].P1_C_Is_Point.split(','),
    };
    const POINT_OBJ_P2 = {
      P2_A_: updatedObj[tempObj].P2_A_Is_Point.split(','),
      P2_B_: updatedObj[tempObj].P2_B_Is_Point.split(','),
      P2_C_: updatedObj[tempObj].P2_C_Is_Point.split(','),
    };

    const finalValArr = [[], [], []]; // 3 Arrays to hold all 3 player slots.

    /**
     * @description Switches between the Player1 and Player2 objects,
     * @example POINT_OBJ_P1 or POINT_OBJ_P2 which contain key value pairs of
     * P1_A... and P2_A... to
     * `updatedObject[tempDataObject]['P1_A_Is_Point'].split(',')`... etc
     */
    let p1OrP2Obj;// Switches between the Player1 and Player2 objects

    /** @description "P1" | "P2" */
    let playerSwitcher; // Switches between "P1" and "P2"

    if ((PlayerOneOrPlayerTwo === 1) || (PlayerOneOrPlayerTwo === 'P1')) {
      p1OrP2Obj = POINT_OBJ_P1;
      playerSwitcher = 'P1';
    } else if ((PlayerOneOrPlayerTwo === 2) || (PlayerOneOrPlayerTwo === 'P2')) {
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
        // console.log(`${playerSwitcher}: 3-Character Bug Logic: A == 0 && B == 0 && C == 0    P1: ABC`);
        finalValArr[0].push(updatedObj[tempObj][`${Object.keys(p1OrP2Obj)[0]}${playerMemoryAddress}`].split(',')[clipLen]);
        finalValArr[1].push(updatedObj[tempObj][`${Object.keys(p1OrP2Obj)[1]}${playerMemoryAddress}`].split(',')[clipLen]);
        finalValArr[2].push(updatedObj[tempObj][`${Object.keys(p1OrP2Obj)[2]}${playerMemoryAddress}`].split(',')[clipLen]);
        /* 2-Character Bug Logic */
      } else if ((parseFloat(Object.values(p1OrP2Obj)[0][clipLen]) === 0)
        && (parseFloat(Object.values(p1OrP2Obj)[1][clipLen]) === 0)
        && (parseFloat(Object.values(p1OrP2Obj)[2][clipLen]) !== 0)
      ) {
        // console.log(`${playerSwitcher}: 2-Character Bug Logic: A == 0 && B == 0 && C != 0    P1: AB`);
        finalValArr[0].push(updatedObj[tempObj][`${Object.keys(p1OrP2Obj)[0]}${playerMemoryAddress}`].split(',')[clipLen]);
        finalValArr[1].push(updatedObj[tempObj][`${Object.keys(p1OrP2Obj)[1]}${playerMemoryAddress}`].split(',')[clipLen]);
      } else if ((parseFloat(Object.values(p1OrP2Obj)[0][clipLen]) === 0)
        && (parseFloat(Object.values(p1OrP2Obj)[1][clipLen]) !== 0)
        && (parseFloat(Object.values(p1OrP2Obj)[2][clipLen]) === 0)
      ) {
        // console.log(`${playerSwitcher}: 2-Character Bug Logic: A == 0 && B != 0 && C == 0    P1: AC`);
        finalValArr[0].push(updatedObj[tempObj][`${Object.keys(p1OrP2Obj)[0]}${playerMemoryAddress}`].split(',')[clipLen]);
        finalValArr[1].push(updatedObj[tempObj][`${Object.keys(p1OrP2Obj)[2]}${playerMemoryAddress}`].split(',')[clipLen]);
      } else if ((parseFloat(Object.values(p1OrP2Obj)[0][clipLen]) !== 0)
        && (parseFloat(Object.values(p1OrP2Obj)[1][clipLen]) === 0)
        && (parseFloat(Object.values(p1OrP2Obj)[2][clipLen]) === 0)
      ) {
        // console.log(`${playerSwitcher}: 2-Character Bug Logic: A != 0 && B == 0 && C == 0    P1: BC`);
        finalValArr[0].push(updatedObj[tempObj][`${Object.keys(p1OrP2Obj)[1]}${playerMemoryAddress}`].split(',')[clipLen]);
        finalValArr[1].push(updatedObj[tempObj][`${Object.keys(p1OrP2Obj)[2]}${playerMemoryAddress}`].split(',')[clipLen]);
        // 1-Character Logic
      } else if ((parseFloat(Object.values(p1OrP2Obj)[0][clipLen]) === 0)
        && (parseFloat(Object.values(p1OrP2Obj)[1][clipLen]) !== 0)
        && (parseFloat(Object.values(p1OrP2Obj)[2][clipLen]) !== 0)
      ) {
        // console.log(`${playerSwitcher}: 1-Character Logic: A == 0 && B != 0 && C != 0        P1: A`);
        finalValArr[0].push(updatedObj[tempObj][`${Object.keys(p1OrP2Obj)[0]}${playerMemoryAddress}`].split(',')[clipLen]);
        //                                                       P1|P2   P1_A        Health_Big                     i
      } else if ((parseFloat(Object.values(p1OrP2Obj)[0][clipLen]) !== 0)
        && (parseFloat(Object.values(p1OrP2Obj)[1][clipLen]) === 0)
        && (parseFloat(Object.values(p1OrP2Obj)[2][clipLen]) !== 0)
      ) {
        // console.log(`${playerSwitcher}: 1-Character Logic: A != 0 && B == 0 && C != 0        P1: B`);
        finalValArr[0].push(updatedObj[tempObj][`${Object.keys(p1OrP2Obj)[1]}${playerMemoryAddress}`].split(',')[clipLen]);
      } else if ((parseFloat(Object.values(p1OrP2Obj)[0][clipLen]) !== 0)
        && (parseFloat(Object.values(p1OrP2Obj)[1][clipLen]) !== 0)
        && (parseFloat(Object.values(p1OrP2Obj)[2][clipLen]) === 0)
      ) {
        // console.log(`${playerSwitcher}: 1 - Character Logic: A != 0 && B != 0 && C == 0       P1: C`);
        finalValArr[0].push(updatedObj[tempObj][`${Object.keys(p1OrP2Obj)[2]}${playerMemoryAddress}`].split(',')[clipLen]);
      } else {
        console.log('Didn\'t match any logic.');
      }
    }

    // Return if not writing files
    if ((write === 0) || (write === false)) {
      return finalValArr;
    }
    if ((write === 1) || (write === true)) {
      // (!fs.existsSync(`${ DIR_OUTPATH }/${ playerSwitcher }_${ playerMemoryAddress.split(',') }.js`))
      // {
      fs.writeFileSync(
        `${DIR_OUTPATH}/${playerSwitcher}_${playerMemoryAddress.split(',')}.js`,
        'var result = [];\n',
        'utf8',
      );

      // Append main data
      for (const dataArrayPerCharacter in finalValArr) {
        fs.appendFileSync(
          `${DIR_OUTPATH}/${playerSwitcher}_${playerMemoryAddress.split(',')}.js`,
          `result[${dataArrayPerCharacter}] = [${finalValArr[dataArrayPerCharacter]}];\n`,
          'utf8',
        );
      }
    }
  }
}
playerMemoryEntries.forEach((playerMemoryAddress) => {
  writePlayerMemory(1, playerMemoryAddress.toString(), 0);
  // console.log(playerMemoryAddress.toString());
  // writePlayerMemory(1, playerMemoryAddress.toString(), 1);
});
