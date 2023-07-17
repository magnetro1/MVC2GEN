import {
  DIR_OUTPATH,
  dataObject,
} from './00_DataObject.js';

import {
  INPUT_CONVERSION_1,
  INPUT_CONVERSION_2,
} from './JS_UTIL_staticData.js';

import * as fs from 'fs';

/**
 * @description Used for writeNewStates()
 * to check P1 and P2 inputs for state tracking.
 */

let playerOneInputs = [];
let playerTwoInputs = [];

function writeInputCNV() {
  const P1_InputsDECSplit = dataObject['P1_Input_DEC'].split(',')
  const P2_InputsDECSplit = dataObject['P2_Input_DEC'].split(',')
  let playerInputResults = ''; // holds each result for P1 and P2
  let playerInputsCNVArray = []; // contains transformed results for P1 and P2
  let tempP1OrP2 = ''; // Changes to 'P1' or 'P2'

  for (let playersLen = 1; playersLen < 3; playersLen++) {
    playersLen == 1 ? tempP1OrP2 = P1_InputsDECSplit : tempP1OrP2 = P2_InputsDECSplit;
    // Input Conversion Type 1
    for (const input in tempP1OrP2) {
      for (const button in Object.entries(INPUT_CONVERSION_1)) {
        if ((tempP1OrP2[input] & Object.values(INPUT_CONVERSION_1)[button]) != 0) {
          playerInputResults += `${Object.keys(INPUT_CONVERSION_1)[button]}`;
        }
      }
      playerInputsCNVArray.push(playerInputResults);
      playerInputResults = '';
    }
    fs.writeFileSync(`${DIR_OUTPATH}P${playersLen}_Inputs_CNV.js`,
      `var result = [];\nresult[0] = ["` +
      `${playerInputsCNVArray.toString()
        .replace(/24/gi, "1")
        .replace(/42/gi, "1")
        .replace(/26/gi, "3")
        .replace(/62/gi, "3")
        .replace(/48/gi, "7")
        .replace(/84/gi, "7")
        .replace(/86/gi, "9")
        .replace(/68/gi, "9")
      }"];\n`,
      'utf8'
    );
    // console.log(playersLen)
    playersLen == 1 ? playerOneInputs = playerInputsCNVArray : playerTwoInputs = playerInputsCNVArray;

    // console.log(playerOneInputs)
    // console.log(playerTwoInputs)
    playerInputsCNVArray = [];

    // Input Conversion Type 2
    for (const input in tempP1OrP2) {
      for (const button in Object.entries(INPUT_CONVERSION_2)) {
        if ((tempP1OrP2[input] & Object.values(INPUT_CONVERSION_2)[button]) != 0) {
          playerInputResults += Object.keys(INPUT_CONVERSION_2)[button];
        }
      }
      playerInputsCNVArray.push(playerInputResults);
      playerInputResults = '';
    }
    fs.appendFileSync(`${DIR_OUTPATH}P${playersLen}_Inputs_CNV.js`,
      `result[1] = ["${playerInputsCNVArray.toString()
        // Fix diagonals
        .replace(/24/gi, "1")
        .replace(/42/gi, "1")
        .replace(/26/gi, "3")
        .replace(/62/gi, "3")
        .replace(/48/gi, "7")
        .replace(/84/gi, "7")
        .replace(/86/gi, "9")
        .replace(/68/gi, "9")
        // Add "+" to each button
        .replace(/LP/gi, "LP+")
        .replace(/LK/gi, "LK+")
        .replace(/HP/gi, "HP+")
        .replace(/HK/gi, "HK+")
        .replace(/AA/gi, "AA+")
        .replace(/AB/gi, "AB+")
        .replace(/START/gi, "START+")
        .replace(/SELECT/gi, "SELECT+")
        // Add "+" to multiple button inputs
        .replace(/([1-9](?=\w+))/gm, "$1+") // Looking ahead for a button+ input
        // Replace numbers with Letter-notation
        .replace(/2|2\+/gm, "D+")
        .replace(/6|6\+/gm, "R+")
        .replace(/8|8\+/gm, "U+")
        .replace(/4|4\+/gm, "L+")
        .replace(/1|1\+/gm, "DL+")
        .replace(/3|3\+/gm, "DR+")
        .replace(/9|9\+/gm, "UR+")
        .replace(/7|7\+/gm, "UL+")
        // Re-write assists" notation
        .replace(/AA/gi, "A1")
        .replace(/AB/gi, "A2")
        // Remove trailing "+" if a comma follows
        .replace(/\+(?=,)/gm, "")
        // Replace "++" with "+"
        .replace(/\+\+/gm, "+")
      }"];`,
      'utf8'
    );
    playerInputsCNVArray = [];

    // Input Conversion Type 3
    for (const input in tempP1OrP2) {
      for (const button in Object.entries(INPUT_CONVERSION_2)) {
        if ((tempP1OrP2[input] & Object.values(INPUT_CONVERSION_2)[button]) != 0) {
          playerInputResults += Object.keys(INPUT_CONVERSION_2)[button];
        }
      }
      playerInputsCNVArray.push(playerInputResults);
      playerInputResults = "";
    }
    fs.appendFileSync(`${DIR_OUTPATH}P${playersLen}_Inputs_CNV.js`,
      `\nresult[2] = ["${playerInputsCNVArray.toString()
        // Fix diagonals
        .replace(/24/gi, "1")
        .replace(/42/gi, "1")
        .replace(/26/gi, "3")
        .replace(/62/gi, "3")
        .replace(/48/gi, "7")
        .replace(/84/gi, "7")
        .replace(/86/gi, "9")
        .replace(/68/gi, "9")
        // Add "+" to each button
        .replace(/LP/gi, "LP+")
        .replace(/LK/gi, "LK+")
        .replace(/HP/gi, "HP+")
        .replace(/HK/gi, "HK+")
        .replace(/AA/gi, "AA+")
        .replace(/AB/gi, "AB+")
        .replace(/START/gi, "START+")
        .replace(/SELECT/gi, "SELECT+")
        // Add "+" to multiple button inputs
        .replace(/([1-9](?=\w+))/gm, "$1+") // Looking ahead for a button+ input
        // Replace numbers with Letter-notation
        .replace(/2|2\+/gm, "Down+")
        .replace(/6|6\+/gm, "Right+")
        .replace(/8|8\+/gm, "Up+")
        .replace(/4|4\+/gm, "Left+")
        .replace(/1|1\+/gm, "Downleft+")
        .replace(/3|3\+/gm, "Downright+")
        .replace(/9|9\+/gm, "Upright+")
        .replace(/7|7\+/gm, "Upleft+")
        // Re-write assist notation
        .replace(/AA/gi, "A1")
        .replace(/AB/gi, "A2")
        // Remove trailing "+" if a comma follows
        .replace(/\+(?=,)/gm, "")
        // Replace "++" with "+"
        .replace(/\+\+/gm, "+")
      }"];`,
      'utf8'
    );
    playerInputsCNVArray = [];
  }
}

writeInputCNV();

export { playerOneInputs, playerTwoInputs, }

// console.log(playerOneInputs, '\n\n' + playerTwoInputs);
