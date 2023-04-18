import * as fs from 'fs';
import { DIR_EXPORT_TO_AE } from './JS_UTIL_paths.js';

/**
  * @description Converts and writes inputs
  * to one file that contains formatting for
  * a custom-font and US FGC notation
  * */
export default function writeInputCNV(giantObjectCopy) {
  for (const tempObj in giantObjectCopy) {
    const DIR_OUTPATH = `${DIR_EXPORT_TO_AE}${tempObj}/`;
    const p1InputsDECSplit = giantObjectCopy[tempObj].P1_Input_DEC.split(',');
    const p2InputsDECSplit = giantObjectCopy[tempObj].P2_Input_DEC.split(',');
    let playerInputResults = ''; // holds each result for P1 and P2
    let playerInputsCNVArray = []; // contains transformed results for P1 and P2
    let tempP1OrP2 = ''; // Changes to "P1" or "P2"

    /**
    * @description Uses custom font in After Effects to display the inputs.
    * */
    const buttonConversionVersion1 = {
      6: 1024, // 6 = right
      4: 2048, // 4 = left
      2: 4096, // 2 = down
      8: 8192, // 8 = up
      u: 512, // LP = u
      j: 64, // LK = j
      i: 256, // HP = i
      k: 32, // HK = k
      o: 128, // A1 = o
      l: 16, // A2 = l
      '(': 32768, // START = (
      ')': 2, // SELECT = )
    };
    /**
    * @description Readable FGC Notation.
    * */
    const btnCNV2 = {
      6: 1024,
      4: 2048,
      2: 4096,
      8: 8192,
      LP: 512,
      LK: 64,
      HP: 256,
      HK: 32,
      AA: 128,
      AB: 16,
      START: 32768,
      SELECT: 2,
    };

    for (let playersLen = 1; playersLen < 3; playersLen++) {
      if (playersLen === 1) {
        tempP1OrP2 = p1InputsDECSplit;
      } else {
        tempP1OrP2 = p2InputsDECSplit;
      }
      // Input Conversion Type 1
      for (const input in tempP1OrP2) {
        for (const button in Object.entries(buttonConversionVersion1)) {
          if (
            parseInt((tempP1OrP2[input]) & Object.values(buttonConversionVersion1)[button]) !== 0) {
            playerInputResults += `${Object.keys(buttonConversionVersion1)[button]}`;
          }
        }
        playerInputsCNVArray.push(playerInputResults);
        playerInputResults = '';
      }
      fs.writeFileSync(
        `${DIR_OUTPATH}P${playersLen}_Inputs_CNV.js`,
        'var result = [];\nresult[0] = ["'
        + `${playerInputsCNVArray.toString()
          .replace(/24/gi, '1')
          .replace(/42/gi, '1')
          .replace(/26/gi, '3')
          .replace(/62/gi, '3')
          .replace(/48/gi, '7')
          .replace(/84/gi, '7')
          .replace(/86/gi, '9')
          .replace(/68/gi, '9')
        }"];\n`,
        'utf8',
      );
      playerInputsCNVArray = [];

      // Input Conversion Type 2
      for (const input in tempP1OrP2) {
        for (const button in Object.entries(btnCNV2)) {
          if (
            (parseInt(tempP1OrP2[input]) & Object.values(btnCNV2)[button]) !== 0) {
            playerInputResults += Object.keys(btnCNV2)[button];
          }
        }
        playerInputsCNVArray.push(playerInputResults);
        playerInputResults = '';
      }
      fs.appendFileSync(
        `${DIR_OUTPATH}P${playersLen}_Inputs_CNV.js`,
        `result[1] = ["${playerInputsCNVArray.toString()
          // Fix diagonals
          .replace(/24/gi, '1')
          .replace(/42/gi, '1')
          .replace(/26/gi, '3')
          .replace(/62/gi, '3')
          .replace(/48/gi, '7')
          .replace(/84/gi, '7')
          .replace(/86/gi, '9')
          .replace(/68/gi, '9')
          // Add "+" to each button
          .replace(/LP/gi, 'LP+')
          .replace(/LK/gi, 'LK+')
          .replace(/HP/gi, 'HP+')
          .replace(/HK/gi, 'HK+')
          .replace(/AA/gi, 'AA+')
          .replace(/AB/gi, 'AB+')
          .replace(/START/gi, 'START+')
          .replace(/SELECT/gi, 'SELECT+')
          // Add "+" to multiple button inputs
          .replace(/([1-9](?=\w+))/gm, '$1+') // Looking ahead for a button+ input
          // Replace numbers with Letter-notation
          .replace(/2|2\+/gm, 'D+')
          .replace(/6|6\+/gm, 'R+')
          .replace(/8|8\+/gm, 'U+')
          .replace(/4|4\+/gm, 'L+')
          .replace(/1|1\+/gm, 'DL+')
          .replace(/3|3\+/gm, 'DR+')
          .replace(/9|9\+/gm, 'UR+')
          .replace(/7|7\+/gm, 'UL+')
          // Re-write assists" notation
          .replace(/AA/gi, 'A1')
          .replace(/AB/gi, 'A2')
          // Remove trailing "+" if a comma follows
          .replace(/\+(?=,)/gm, '')
          // Replace "++" with "+"
          .replace(/\+\+/gm, '+')
        }"];`,
        'utf8',
      );
      playerInputsCNVArray = [];

      // Input Conversion Type 3
      for (const input in tempP1OrP2) {
        for (const button in Object.entries(btnCNV2)) {
          // If the &'ed value is not 0, the value is converted
          if (
            parseFloat((tempP1OrP2[input]) & Object.values(btnCNV2)[button]) !== 0) {
            playerInputResults += Object.keys(btnCNV2)[button];
          }
        }
        playerInputsCNVArray.push(playerInputResults);
        playerInputResults = '';
      }
      fs.appendFileSync(
        `${DIR_OUTPATH}P${playersLen}_Inputs_CNV.js`,
        `\nresult[2] = ["${playerInputsCNVArray.toString()
          // Fix diagonals
          .replace(/24/gi, '1')
          .replace(/42/gi, '1')
          .replace(/26/gi, '3')
          .replace(/62/gi, '3')
          .replace(/48/gi, '7')
          .replace(/84/gi, '7')
          .replace(/86/gi, '9')
          .replace(/68/gi, '9')
          // Add "+" to each button
          .replace(/LP/gi, 'LP+')
          .replace(/LK/gi, 'LK+')
          .replace(/HP/gi, 'HP+')
          .replace(/HK/gi, 'HK+')
          .replace(/AA/gi, 'AA+')
          .replace(/AB/gi, 'AB+')
          .replace(/START/gi, 'START+')
          .replace(/SELECT/gi, 'SELECT+')
          // Add "+" to multiple button inputs
          .replace(/([1-9](?=\w+))/gm, '$1+') // Looking ahead for a button+ input
          // Replace numbers with Letter-notation
          .replace(/2|2\+/gm, 'Down+')
          .replace(/6|6\+/gm, 'Right+')
          .replace(/8|8\+/gm, 'Up+')
          .replace(/4|4\+/gm, 'Left+')
          .replace(/1|1\+/gm, 'Downleft+')
          .replace(/3|3\+/gm, 'Downright+')
          .replace(/9|9\+/gm, 'Upright+')
          .replace(/7|7\+/gm, 'Upleft+')
          // Re-write assists" notation
          .replace(/AA/gi, 'A1')
          .replace(/AB/gi, 'A2')
          // Remove trailing "+" if a comma follows
          .replace(/\+(?=,)/gm, '')
          // Replace "++" with "+"
          .replace(/\+\+/gm, '+')
        }"];`,
        'utf8',
      );
      playerInputsCNVArray = [];
    }
  } // end of InputCNV
}
// writeInputCNV();
