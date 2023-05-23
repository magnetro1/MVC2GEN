/* eslint-disable */

/*
--------------------------------------------------
Step 0: Import the necessary modules
--------------------------------------------------
*/

import * as fs from 'fs';
import clipboard from "clipboardy";

// Import the static data
import {
  FLOATING_POINT_ADDRESSES,
  KNOCKDOWN_STATE_OBJ,
  MIN_MAX_ADDRESSES,
  P1P2_ADDRESSES,
  NAME_TABLE_OBJ,
  PORTRAITS_TO_TIME_OBJ,
  PROX_BLOCK_OBJ,
  STAGES_OBJ,
  COMBO_CALLOUTS,
  AE_TO_POSITION_OBJ,
} from './JS_UTIL_staticData.js';

// Import directories; Order matters!
import {
  DIR_EXPORT_TO_AE,
  DIR_CSVS,
  DIR_SORTED_JS
} from './JS_UTIL_paths.js';

// Write Sorted_JS folder if it doesn't exist
if (!fs.existsSync(DIR_SORTED_JS)) {
  fs.mkdirSync(DIR_SORTED_JS);
}
// Write exportToAE folder if it doesn't exist
if (!fs.existsSync(DIR_EXPORT_TO_AE)) {
  fs.mkdirSync(DIR_EXPORT_TO_AE);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

console.time('⏱');
/*
--------------------------------------------------
Step 1: Get the CSV file names from a directory
--------------------------------------------------
*/
let csvFilesArr = [];
let csvSoloNameArr = [];

fs.readdirSync(DIR_CSVS).forEach(function (file) {
  if (file.endsWith('.csv') || file.endsWith('.CSV')) {
    csvFilesArr.push(file);
  }
});
// truncate the .csv from the file names
csvFilesArr.forEach((name) => {
  let temp = '';
  temp = name.toString().replace('.csv', '') || name.toString().replace('.CSV', '')
  csvSoloNameArr.push(temp);
});
// console.log(`Step 1: Found ${csvFilesArr.length} CSV files.`);
/*
--------------------------------------------------
Step 2: Process CSV
--------------------------------------------------
*/
// Main loop starts here
for (let csvFilesIDX = 0; csvFilesIDX < csvFilesArr.length; csvFilesIDX++) {
  let headersArray = [];
  let allDataArray = [];
  const DIR_OUTPATH = `${DIR_EXPORT_TO_AE}${csvSoloNameArr[csvFilesIDX]}/`;
  // Make Output folder for AE files
  if (!fs.existsSync(`${DIR_OUTPATH}`)) {
    fs.mkdirSync(`${DIR_OUTPATH}`);
  }
  fs.readFileSync(DIR_CSVS + csvFilesArr[csvFilesIDX], 'utf8').split('\r\n').map((line, index) => {
    if (index === 0) {
      headersArray = line.split(',');
    }
    else {
      allDataArray.push(line.split(','));
    } return null;
  });

  // Sorting by the first column's first value (Total_Frames)
  allDataArray.sort((a, b) => a[0] - b[0]);

  /**
   * @description Counts the amount of times a value appears in an array and returns the value that appears the most
   * @param {Number[]} arrayOfNumbers dynamic amount of numbers, depending on the csv file
   * @returns single number value as a string
   */
  function countReplayData(arrayOfNumbers) {
    // Count the values in the arrays and store them in an object
    let counterObject = {};
    for (let numbersIdx = 0; numbersIdx < arrayOfNumbers.length; numbersIdx++) {
      if (counterObject[arrayOfNumbers[numbersIdx]] == undefined) {
        counterObject[arrayOfNumbers[numbersIdx]] = 1;
      }
      else {
        counterObject[arrayOfNumbers[numbersIdx]]++;
      }
    }
    // Return the value that appears the most in the object
    /**
     * @description number of times the data value appears. Ex: 4
     */
    let largestValue = 0;
    /**
     * @description Will store the data value that appears the most. Ex: 255
     */
    let largestValueKey = 0;
    for (let key in counterObject) {
      if (counterObject[key] > largestValue) {
        largestValue = counterObject[key];
        largestValueKey = key;
      }
    }
    // If the value is 0, return the next value that is not 0
    if (arrayOfNumbers.length == 2) {
      if ((arrayOfNumbers[0] == 0) && (arrayOfNumbers[1] != 0)) {
        return arrayOfNumbers[1];
      }
      // Opposite
      else if ((arrayOfNumbers[1] == 0) && (arrayOfNumbers[0] != 0)) {
        return arrayOfNumbers[0];
      }
    }
    return largestValueKey;
  }
  // ! Find true data
  // TODO Update the logic for this function
  let tempDataArr = [];
  for (let totalLines = 1; totalLines < allDataArray.length - 1; totalLines++) {
    if (allDataArray[totalLines][0] == allDataArray[totalLines + 1][0]) // we are in a duplicate line entry based on total_frames
    {
      for (let headerValue = 0; headerValue < headersArray.length; headerValue++) {
        if (allDataArray[totalLines][headerValue] != allDataArray[totalLines + 1][headerValue]) {
          tempDataArr[0] = (allDataArray[totalLines][headerValue]);
          tempDataArr[1] = (allDataArray[totalLines + 1][headerValue]);

          if (allDataArray[totalLines][0] == allDataArray[totalLines + 2][0]) {
            tempDataArr[2] = (allDataArray[totalLines + 2][headerValue]);
            if (allDataArray[totalLines][0] == allDataArray[totalLines + 3][0]) {
              tempDataArr[3] = (allDataArray[totalLines + 3][headerValue]);
              if (allDataArray[totalLines][0] == allDataArray[totalLines + 4][0]) {
                tempDataArr[4] = (allDataArray[totalLines + 4][headerValue]);

                allDataArray[totalLines][headerValue] = countReplayData(tempDataArr);
                tempDataArr = [];
                continue
              }
              allDataArray[totalLines][headerValue] = countReplayData(tempDataArr);
              tempDataArr = [];
              continue
            }
            allDataArray[totalLines][headerValue] = countReplayData(tempDataArr);
            tempDataArr = [];
            continue
          }
          allDataArray[totalLines][headerValue] = countReplayData(tempDataArr);
          // console.log(countReplayData(tempDataArr));
          // console.log(allDataArray[totalLines][headerValue]);
          tempDataArr = [];
          continue
        }
        else {
          tempDataArr[0] = (allDataArray[totalLines][headerValue]);
          tempDataArr[1] = (allDataArray[totalLines + 1][headerValue]);
          allDataArray[totalLines][headerValue] = countReplayData(tempDataArr);
          // console.log(tempDataArr[0])
          // console.log(tempDataArr[1])
          tempDataArr = [];
          break
        }
      }
    }
  }

  // Removing duplicates using the first column's value (Total_Frames)
  for (let check = 0; check < allDataArray.length - 1; check++) // length-1 because we're checking the next element
  {
    if ((allDataArray[check + 1][0] === allDataArray[check][0])) // line number is the same
    {
      allDataArray.splice(check + 1, 1); // remove the next line
      check--; // go back to original line in order to check the next line again
    }
  }
  // Transpose the array by columns
  var allArrayStructure = [];
  for (let headerIndex = 0; headerIndex < headersArray.length; headerIndex++) {
    allArrayStructure.push([]);
  }
  // Fill the array of arrays with the data separated by column
  for (let rowIdx = 1; rowIdx < allDataArray.length; ++rowIdx) {
    for (let colIdx = 0; colIdx < headersArray.length; ++colIdx) {
      allArrayStructure[colIdx].push(allDataArray[rowIdx][colIdx]);
    }
  }
  // Check for missing entries & Write to file
  let missingEntries = [`/*\n`];
  for (let i = 0; i < allArrayStructure[0].length - 1; i++) // total frames
  {
    if (allArrayStructure[0][i + 1] - allArrayStructure[0][i] !== 1) {
      missingEntries.push(`Missing data entry after Total_Frame Number: ${allArrayStructure[0][i]}\n`);
    }
    else {
      continue
    }
  }
  // If MissingEntries is empty, then there are no missing entries. Push a comment to the array.
  if (missingEntries.length == 0) {
    missingEntries.push('/*\nNo missing entries\n');
  }
  missingEntries.push(`\nFirst entry in Total_Frames: ${allArrayStructure[0][0]}\nFinal entry in Total_Frames: ${allArrayStructure[0][allArrayStructure[0].length - 1]}\nTotal_Frames in Clip: ${allArrayStructure[0].length}\n*/\n`)


  fs.writeFileSync(`${DIR_OUTPATH}_${csvSoloNameArr[csvFilesIDX]}.js`, missingEntries.toString().replace(/,/g, ''));

  // console.log(`Step 2: Wrote ${DIR_OUTPATH}_${csvSoloNameArr[csvFilesIDX]}.js`)
  /*
  --------------------------------------------------
  Step 3: Make dataObject & Start Core Functions
  --------------------------------------------------
  */

  let dataObject = {};
  // object keys are headers and the values converted into a string
  // Ex: 'A_2D_Game_Timer' : '99,99,99,...'
  for (let i = 0; i < headersArray.length; i++) {
    dataObject[headersArray[i]] = allArrayStructure[i].join(','); // the key is the header name[i], the value are the numbers joined by a comma
  }

  const CLIP_LENGTH = dataObject['A_2D_Game_Timer'].split(',').length;
  const POINT_OBJ_P1 =
  {
    P1_A_: dataObject['P1_A_Is_Point'].split(','),
    P1_B_: dataObject['P1_B_Is_Point'].split(','),
    P1_C_: dataObject['P1_C_Is_Point'].split(',')
  };
  const POINT_OBJ_P2 =
  {
    P2_A_: dataObject['P2_A_Is_Point'].split(','),
    P2_B_: dataObject['P2_B_Is_Point'].split(','),
    P2_C_: dataObject['P2_C_Is_Point'].split(',')
  };


  //Append MIN&MAX value to dataObject
  function appendMinMaxRound() {
    let tempMinMaxBuffer = '';

    for (let adr in MIN_MAX_ADDRESSES) {
      const KEY = MIN_MAX_ADDRESSES[adr];

      const VALUE = dataObject[MIN_MAX_ADDRESSES[adr]].split(','); // Fetch the value by finding the key using its string name
      const MIN = Math.min(...VALUE);
      const MAX = Math.max(...VALUE);
      let tempMin = [];
      let tempMax = [];
      for (let clipLen = 0; clipLen < CLIP_LENGTH; clipLen++) {
        tempMax[clipLen] = MAX;
        tempMin[clipLen] = MIN;
      }
      tempMinMaxBuffer += `${KEY}_Max=${tempMax}\n`;
      tempMinMaxBuffer += `${KEY}_Min=${tempMin}\n`;
    }

    // Push tempMinMaxBuffer into the dataObject
    var tempMinMaxBufferSplit = tempMinMaxBuffer.split('\n');
    for (let line in tempMinMaxBufferSplit) {
      var lineSplit = tempMinMaxBufferSplit[line].split('=');
      dataObject[lineSplit[0]] = lineSplit[1]; // [0] is the key, [1] is the value
    }

    // Round off floating point addresses using FLOATING_POINT_ADDRESSES
    var preFixes = ['P1_A_', 'P2_A_', 'P1_B_', 'P2_B_', 'P1_C_', 'P2_C_']
    var postFixes = ['', '_Min', '_Max']
    var toFixedDigits = [0, 2]; // 7 is the default
    for (let playerPrefix in preFixes) {
      for (let floatAdr in FLOATING_POINT_ADDRESSES) {
        for (let postFix in postFixes) {
          let fullAdr = FLOATING_POINT_ADDRESSES[floatAdr] + postFixes[postFix];
          // round off each address by each number inside of toFixedDigits
          for (let digit in toFixedDigits) {
            let tempArray = dataObject[preFixes[playerPrefix] + fullAdr].split(',');
            for (let i = 0; i < tempArray.length; i++) {
              tempArray[i] = parseFloat(tempArray[i]).toFixed(toFixedDigits[digit]);
            }
            // Merge tempArray into the dataObject so that it is written later. Includes combo_meter min and maxes
            dataObject[preFixes[playerPrefix] + fullAdr + '_' + toFixedDigits[digit]] = tempArray.join(',');
          }
        }
      }
    }
  }
  /**
   * @description Finds the player memory addresses inside of the dataObject
   * and returns an array of the unique items. The other core functions will
   * push more entries into the dataObject before it gets processed by this
   * function.
   * 
   * @returns {String[]} returns an array of strings to be processed by the
   * main player-memory-function.
  */
  function getPlayerMemoryEntries() {
    let playerMemoryEntries = [];
    let playerMemoryRegex = /(P[1-2]_[A-C]_)/g; //[1] = P1_A
    for (let key in dataObject) {
      if (key.toString().match(playerMemoryRegex)) {
        playerMemoryEntries.push(key);
      }
    }
    // Remove the playerMemoryRegex from the array using replace()
    playerMemoryEntries = playerMemoryEntries.map((label) => {
      return label.replace(playerMemoryRegex, '');
    });
    // Remove duplicates
    playerMemoryEntries = [...new Set(playerMemoryEntries)];
    return playerMemoryEntries;
  }
  let tempJS = `${DIR_EXPORT_TO_AE}${csvSoloNameArr[csvFilesIDX]}.js`;

  async function exportDataObject() {
    let dataObjectExport = '';
    for (let key in dataObject) {
      // if key is not undefined
      if (dataObject[key]) {
        dataObjectExport += `export const ${key} = '${dataObject[key]}';\n`;
      }
    }
    fs.writeFileSync(`${DIR_EXPORT_TO_AE}${csvSoloNameArr[csvFilesIDX]}.js`, dataObjectExport);
  }
  // console.log(`Step 3: Updated object with MIN&MAX and wrote tempJS file.`);

  // Main function to write data to files OR return finalValues array
  /**
   * @param {number|string} p1OrP2 number or string, ex: 1 or "P1"
   * @param {string} pMemAdr string, ex: "Health_Big"
   * @param {number|boolean} write flag to return array or write to file
   * @returns {void} Writes files to disk.
   * @description Finds the point character, and returns an array of numbers for the playerMemoryAddress in the clip.
   */
  function writePlayerMemory(p1OrP2, pMemAdr) {
    let valArr = [[], [], []];
    /** 
     * @description Switches between the Player1 and Player2 objects,
     * ex: POINT_OBJ_P1 or POINT_OBJ_P2 which contain key value pairs of
     * P1_A... and P2_A... to `dataObject['P1_A_Is_Point'].split(',')`... etc
     */
    let pObjSwitch;// Switches between the Player1 and Player2 objects
    /**
     * @description "P1" | "P2"
    */
    let playerSwitcher; // Switches between "P1" and "P2"

    if ((p1OrP2 == 1) || (p1OrP2 == "P1") || (p1OrP2 == "1")) {
      pObjSwitch = POINT_OBJ_P1;
      playerSwitcher = "P1";
    }
    else if ((p1OrP2 == 2) || (p1OrP2 == "P2") || (p1OrP2 == "2")) {
      pObjSwitch = POINT_OBJ_P2;
      playerSwitcher = "P2";
    }

    import(`file://${tempJS}`).then((pMemFile) => {
      for (let clipLen = 0; clipLen < CLIP_LENGTH; clipLen++) {
        // 3-Character Bug Logic
        if ((Object.values(pObjSwitch)[0][clipLen] == 0)
          && (Object.values(pObjSwitch)[1][clipLen] == 0)
          && (Object.values(pObjSwitch)[2][clipLen] == 0)) {
          // console.log( `${ playerSwitcher }: 3 - Character Bug Logic: A == 0 && B == 0 && C == 0    P1: ABC` );
          valArr[0].push(pMemFile[`${Object.keys(pObjSwitch)[0]}${pMemAdr}`].split(',')[clipLen]);
          valArr[1].push(pMemFile[`${Object.keys(pObjSwitch)[1]}${pMemAdr}`].split(',')[clipLen]);
          valArr[2].push(pMemFile[`${Object.keys(pObjSwitch)[2]}${pMemAdr}`].split(',')[clipLen]);
        }
        // 2-Character Bug Logic
        else if ((Object.values(pObjSwitch)[0][clipLen] == 0)
          && (Object.values(pObjSwitch)[1][clipLen] == 0)
          && (Object.values(pObjSwitch)[2][clipLen] != 0)) {
          // console.log( `${ playerSwitcher }: 2 - Character Bug Logic: A == 0 && B == 0 && C != 0    P1: AB` );
          valArr[0].push(pMemFile[`${Object.keys(pObjSwitch)[0]}${pMemAdr}`].split(',')[clipLen]);
          valArr[1].push(pMemFile[`${Object.keys(pObjSwitch)[1]}${pMemAdr}`].split(',')[clipLen]);
        }
        else if ((Object.values(pObjSwitch)[0][clipLen] == 0)
          && (Object.values(pObjSwitch)[1][clipLen] != 0)
          && (Object.values(pObjSwitch)[2][clipLen] == 0)) {
          // console.log( `${ playerSwitcher }: 2 - Character Bug Logic: A == 0 && B != 0 && C == 0    P1: AC` );
          valArr[0].push(pMemFile[`${Object.keys(pObjSwitch)[0]}${pMemAdr}`].split(',')[clipLen]);
          valArr[1].push(pMemFile[`${Object.keys(pObjSwitch)[2]}${pMemAdr}`].split(',')[clipLen]);
        }
        else if ((Object.values(pObjSwitch)[0][clipLen] != 0)
          && (Object.values(pObjSwitch)[1][clipLen] == 0)
          && (Object.values(pObjSwitch)[2][clipLen] == 0)) {
          // console.log( `${ playerSwitcher }: 2 - Character Bug Logic: A != 0 && B == 0 && C == 0    P1: BC` );
          valArr[0].push(pMemFile[`${Object.keys(pObjSwitch)[1]}${pMemAdr}`].split(',')[clipLen]);
          valArr[1].push(pMemFile[`${Object.keys(pObjSwitch)[2]}${pMemAdr}`].split(',')[clipLen]);
        }
        // 1-Character Logic
        else if ((Object.values(pObjSwitch)[0][clipLen] == 0)
          && (Object.values(pObjSwitch)[1][clipLen] != 0)
          && (Object.values(pObjSwitch)[2][clipLen] != 0)) {
          // console.log(`${ playerSwitcher }: 1 - Character Logic: A == 0 && B != 0 && C != 0        P1: A`);
          valArr[0].push(pMemFile[`${Object.keys(pObjSwitch)[0]}${pMemAdr}`].split(',')[clipLen]);
        }//                       P1|P2        P1_A        Health_Big                        i     
        else if ((Object.values(pObjSwitch)[0][clipLen] != 0)
          && (Object.values(pObjSwitch)[1][clipLen] == 0)
          && (Object.values(pObjSwitch)[2][clipLen] != 0)) {
          // console.log(`${ playerSwitcher }: 1 - Character Logic: A != 0 && B == 0 && C != 0        P1: B`);
          valArr[0].push(pMemFile[`${Object.keys(pObjSwitch)[1]}${pMemAdr}`].split(',')[clipLen]);
        }
        else if ((Object.values(pObjSwitch)[0][clipLen] != 0)
          && (Object.values(pObjSwitch)[1][clipLen] != 0)
          && (Object.values(pObjSwitch)[2][clipLen] == 0)) {
          // console.log(`${ playerSwitcher }: 1 - Character Logic: A != 0 && B != 0 && C == 0       P1: C`);
          valArr[0].push(pMemFile[`${Object.keys(pObjSwitch)[2]}${pMemAdr}`].split(',')[clipLen]);
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
        for (let dataArrayPerCharacter in valArr) {
          fs.appendFileSync(
            `${DIR_OUTPATH}/${playerSwitcher}_${pMemAdr.split(',')}.js`,
            `result[${dataArrayPerCharacter}] = [${valArr[dataArrayPerCharacter]}];\n`,
            'utf8',
          )
        }
      }
    });
  }

  // Main function to write data to files OR return finalValues array
  /**
   * @param {number|string} p1OrP2 number or string, ex: 1 or "P1"
   * @param {string} pMemAdr ex: "Health_Big"
  //  * @param {number|boolean} write is always 0
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

    await import(`file://${tempJS}`).then((pMemFile) => {
      for (let clipLen = 0; clipLen < CLIP_LENGTH; clipLen++) {
        // 3-Character Bug Logic
        if ((Object.values(pObjSwitch)[0][clipLen] == 0)
          && (Object.values(pObjSwitch)[1][clipLen] == 0)
          && (Object.values(pObjSwitch)[2][clipLen] == 0)) {
          // console.log( `${ playerSwitcher }: 3 - Character Bug Logic: A == 0 && B == 0 && C == 0    P1: ABC` );
          valArr[0].push(pMemFile[`${Object.keys(pObjSwitch)[0]}${pMemAdr}`].split(',')[clipLen]);
          valArr[1].push(pMemFile[`${Object.keys(pObjSwitch)[1]}${pMemAdr}`].split(',')[clipLen]);
          valArr[2].push(pMemFile[`${Object.keys(pObjSwitch)[2]}${pMemAdr}`].split(',')[clipLen]);
        }
        // 2-Character Bug Logic
        else if ((Object.values(pObjSwitch)[0][clipLen] == 0)
          && (Object.values(pObjSwitch)[1][clipLen] == 0)
          && (Object.values(pObjSwitch)[2][clipLen] != 0)) {
          // console.log( `${ playerSwitcher }: 2 - Character Bug Logic: A == 0 && B == 0 && C != 0    P1: AB` );
          valArr[0].push(pMemFile[`${Object.keys(pObjSwitch)[0]}${pMemAdr}`].split(',')[clipLen]);
          valArr[1].push(pMemFile[`${Object.keys(pObjSwitch)[1]}${pMemAdr}`].split(',')[clipLen]);
        }
        else if ((Object.values(pObjSwitch)[0][clipLen] == 0)
          && (Object.values(pObjSwitch)[1][clipLen] != 0)
          && (Object.values(pObjSwitch)[2][clipLen] == 0)) {
          // console.log( `${ playerSwitcher }: 2 - Character Bug Logic: A == 0 && B != 0 && C == 0    P1: AC` );
          valArr[0].push(pMemFile[`${Object.keys(pObjSwitch)[0]}${pMemAdr}`].split(',')[clipLen]);
          valArr[1].push(pMemFile[`${Object.keys(pObjSwitch)[2]}${pMemAdr}`].split(',')[clipLen]);
        }
        else if ((Object.values(pObjSwitch)[0][clipLen] != 0)
          && (Object.values(pObjSwitch)[1][clipLen] == 0)
          && (Object.values(pObjSwitch)[2][clipLen] == 0)) {
          // console.log( `${ playerSwitcher }: 2 - Character Bug Logic: A != 0 && B == 0 && C == 0    P1: BC` );
          valArr[0].push(pMemFile[`${Object.keys(pObjSwitch)[1]}${pMemAdr}`].split(',')[clipLen]);
          valArr[1].push(pMemFile[`${Object.keys(pObjSwitch)[2]}${pMemAdr}`].split(',')[clipLen]);
        }
        // 1-Character Logic
        else if ((Object.values(pObjSwitch)[0][clipLen] == 0)
          && (Object.values(pObjSwitch)[1][clipLen] != 0)
          && (Object.values(pObjSwitch)[2][clipLen] != 0)) {
          // console.log(`${playerSwitcher}: 1 - Character Logic: A == 0 && B != 0 && C != 0        P1: A`);
          valArr[0].push(pMemFile[`${Object.keys(pObjSwitch)[0]}${pMemAdr}`].split(',')[clipLen]);
        }//          replayObject[               P1_A_            Health_Big.split(',')[i]
        else if ((Object.values(pObjSwitch)[0][clipLen] != 0)
          && (Object.values(pObjSwitch)[1][clipLen] == 0)
          && (Object.values(pObjSwitch)[2][clipLen] != 0)) {
          // console.log(`${ playerSwitcher }: 1 - Character Logic: A != 0 && B == 0 && C != 0        P1: B`);
          valArr[0].push(pMemFile[`${Object.keys(pObjSwitch)[1]}${pMemAdr}`].split(',')[clipLen]);
        }//          replayObject[               P1_B_            Health_Big.split(',')[i]
        else if ((Object.values(pObjSwitch)[0][clipLen] != 0)
          && (Object.values(pObjSwitch)[1][clipLen] != 0)
          && (Object.values(pObjSwitch)[2][clipLen] == 0)) {
          // console.log(`${ playerSwitcher }: 1 - Character Logic: A != 0 && B != 0 && C == 0       P1: C`);
          valArr[0].push(pMemFile[`${Object.keys(pObjSwitch)[2]}${pMemAdr}`].split(',')[clipLen]);
        }//          replayObject[               P1_C_            Health_Big.split(',')[i]
      }
    });
    return valArr;
  }


  /**
   * @description outputs arrays containing Total_Frames in ascending and 
   * descending order, and Max number in clip. The first three arrays are
   * arrays of numbers, the remaining are arrays of strings
   */
  function writeTotalFramesCNV() {
    let totalFrameArrT1 = [];
    let totalFrameArrT2 = [];

    (dataObject['Total_Frames']).split(',').forEach((frame, indexT1) => {
      totalFrameArrT1.push(indexT1);
    });

    // // Padded Zeroes for program pad comp
    (dataObject['Total_Frames']).split(',').forEach((frame, indexT2) => {
      if (indexT2 == 0) {
        indexT2++
      }
      else if (indexT2 < 10) {
        indexT2.toString()
        indexT2 = '000' + indexT2
      }
      else if (indexT2 < 100) {
        indexT2.toString()
        indexT2 = '00' + indexT2
      }
      else if (indexT2 < 1000) {
        indexT2.toString()
        indexT2 = '0' + indexT2
      }
      else {
        indexT2
      }
      totalFrameArrT2.push(`'${indexT2}'`);
    });

    // T1 for Normal Compositions
    fs.writeFileSync(`${DIR_OUTPATH}Total_Frames_CNV.js`,
      `var result = [];\nresult[0] = [${totalFrameArrT1}];\n`,
      'utf8'
    );
    totalFrameArrT1.reverse()
    fs.appendFileSync(`${DIR_OUTPATH}Total_Frames_CNV.js`,
      `result[1] = [${totalFrameArrT1}];\n`,
      'utf8'
    );
    for (let idx in totalFrameArrT1) {
      totalFrameArrT1[idx] = totalFrameArrT1[0]
    }
    fs.appendFileSync(`${DIR_OUTPATH}Total_Frames_CNV.js`,
      `result[2] = [${totalFrameArrT1}];\n`,
      'utf8'
    );

    // T2 for ASCII Pad Composition. 
    //Uses an array of Strings since the numbers are padded with zeroes
    totalFrameArrT2.splice(0, 1)
    fs.appendFileSync(`${DIR_OUTPATH}Total_Frames_CNV.js`,
      // replace two '' with one '
      `result[3] = [${totalFrameArrT2.toString()}];\n`,
      'utf8'
    )
      ;
    totalFrameArrT2.reverse()
    fs.appendFileSync(`${DIR_OUTPATH}Total_Frames_CNV.js`,
      `result[4] = [${totalFrameArrT2}];\n`,
      'utf8'
    );
    for (let idx in totalFrameArrT2) {
      totalFrameArrT2[idx] = totalFrameArrT2[0]
    }
    fs.appendFileSync(`${DIR_OUTPATH}Total_Frames_CNV.js`,
      `result[5] = [${totalFrameArrT2}];\n`,
      'utf8'
    );
  }
  // };
  function writeStageDataCNV() // Fills out color data for stages in Hex in result[1]
  {
    let stageData = [];
    let stageDataCNV = [];
    // Numbers
    dataObject['Stage_Selector'].split(',').forEach((frame) => {
      stageData.push(frame)
    });
    // Hex
    dataObject['Stage_Selector'].split(',').forEach((frame) => {
      stageDataCNV.push(`'${Object.values(STAGES_OBJ)[frame]}'`)
    });
    // Merge the stageDataCNV into the dataObject
    // dataObject['Stage_Selector_CNV'] = stageDataCNV;
    fs.writeFileSync(`${DIR_OUTPATH}Stage_Selector_CNV.js`,
      `var result = [];\nresult[0] = [${stageData}];\nresult[1] = [${stageDataCNV}];\n`,
      'utf8'
    );
    stageData = [];
    stageDataCNV = [];
  };
  /**
  * @description Converts and writes inputs to one file that contains formatting for a custom-font and US FGC notation
  **/
  function writeInputCNV() {
    const P1_InputsDECSplit = dataObject['P1_Input_DEC'].split(',')
    const P2_InputsDECSplit = dataObject['P2_Input_DEC'].split(',')
    let playerInputResults = ""; // holds each result for P1 and P2
    let playerInputsCNVArray = []; // contains transformed results for P1 and P2
    let tempP1OrP2 = ""; // Changes to "P1" or "P2"

    /**
    * @description Uses custom font in After Effects to display the inputs.
    **/
    const buttonConversionVersion1 =
    {
      "6": 1024,  // 6 = right
      "4": 2048,  // 4 = left
      "2": 4096,  // 2 = down
      "8": 8192,  // 8 = up
      "u": 512,   // LP = u
      "j": 64,    // LK = j
      "i": 256,   // HP = i
      "k": 32,    // HK = k
      "o": 128,   // A1 = o
      "l": 16,    // A2 = l
      "(": 32768, // START = (
      ")": 2,     // SELECT = )
    };
    /**
    * @description Readable FGC Notation.
    **/
    const buttonConversionVersion2 =
    {
      "6": 1024,
      "4": 2048,
      "2": 4096,
      "8": 8192,
      "LP": 512,
      "LK": 64,
      "HP": 256,
      "HK": 32,
      "AA": 128,
      "AB": 16,
      "START": 32768,
      "SELECT": 2,
    };

    for (let playersLen = 1; playersLen < 3; playersLen++) {
      playersLen == 1 ? tempP1OrP2 = P1_InputsDECSplit : tempP1OrP2 = P2_InputsDECSplit;
      // Input Conversion Type 1
      for (const input in tempP1OrP2) {
        for (const button in Object.entries(buttonConversionVersion1)) {
          if ((tempP1OrP2[input] & Object.values(buttonConversionVersion1)[button]) != 0) {
            playerInputResults += `${Object.keys(buttonConversionVersion1)[button]}`;
          }
        }
        playerInputsCNVArray.push(playerInputResults);
        playerInputResults = "";
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
      playerInputsCNVArray = [];

      // Input Conversion Type 2
      for (const input in tempP1OrP2) {
        for (const button in Object.entries(buttonConversionVersion2)) {
          if ((tempP1OrP2[input] & Object.values(buttonConversionVersion2)[button]) != 0) // If the &'ed value is not 0, the value is converted
          {
            playerInputResults += Object.keys(buttonConversionVersion2)[button];
          }
        }
        playerInputsCNVArray.push(playerInputResults);
        playerInputResults = "";
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
        for (const button in Object.entries(buttonConversionVersion2)) {
          if ((tempP1OrP2[input] & Object.values(buttonConversionVersion2)[button]) != 0) // If the &'ed value is not 0, the value is converted
          {
            playerInputResults += Object.keys(buttonConversionVersion2)[button];
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
    }
  } // end of InputCNV
  /**
   * @description Writes individual JS files for each address in MISC_ADDRESSES.
   * 
   */
  function writeP1P2Addresses() {
    const p1p2AddressesArray = [[]]; // Example: "P1_Meter_Big", "Camera_Field_of_View"
    for (const p1p2AdrIDX in P1P2_ADDRESSES) {
      dataObject[P1P2_ADDRESSES[p1p2AdrIDX]].split(',').forEach((address) => {
        p1p2AddressesArray[0].push(address);
      });
      fs.writeFileSync(`${DIR_OUTPATH}${P1P2_ADDRESSES[p1p2AdrIDX]}.js`,
        `var result = [];\nresult[0] = [${p1p2AddressesArray}];`,
        'utf8'
      );
      p1p2AddressesArray[0] = []; // clear the array for the next player iteration.
    }
  };

  function countIsPausedCNV() {
    let State_Is_Paused = [];
    let counter = 0;
    dataObject.Is_Paused.split(',').forEach((element, index) => {
      if (element == 0) {
        counter = 0
        State_Is_Paused[index] = 0
      }
      else {
        State_Is_Paused[index] = (counter + 1)
        counter++
      }
    });
    fs.writeFileSync(`${DIR_OUTPATH}Is_Paused_CNV.js`,
      `var result = [];\nresult[0] = [${dataObject['Is_Paused']}];\nresult[1] = ["${State_Is_Paused.toString()}];`,
      'utf8'
    );
  }

  /*
  --------------------------------------------------
  End of Core Functions
  --------------------------------------------------
    
  --------------------------------------------------
  Step 4: Begin Write-State Functions
  --------------------------------------------------
  */
  /**
   * @description Writes State-Files that count and increment consecutive true values. 
   * Search for "NEW_STATE_ADD_HERE" across the function to append address fetches and new states.
   */
  async function writeNewStates() {
    let pI;
    let p1OrP2;
    for (pI = 1; pI < 3; pI++) {
      pI == 1 ? p1OrP2 = 'P1' : p1OrP2 = 'P2';
      // Fetches relevant SINGLE addresses for State-Logic-Checking
      const Action_Flags = await new Promise((resolve, reject) => { resolve(getPlayerMemory(p1OrP2, 'Action_Flags', 0)); reject("Error"); });
      const Air_Dash_Count = await new Promise((resolve, reject) => { resolve(getPlayerMemory(p1OrP2, 'Air_Dash_Count', 0)); reject("Error"); });
      const Airborne = await new Promise((resolve, reject) => { resolve(getPlayerMemory(p1OrP2, 'Airborne', 0)); reject("Error"); });
      const Animation_Timer_Main = await new Promise((resolve, reject) => { resolve(getPlayerMemory(p1OrP2, 'Animation_Timer_Main', 0)); reject("Error"); });
      const Attack_Immune = await new Promise((resolve, reject) => { resolve(getPlayerMemory(p1OrP2, 'Attack_Immune', 0)); reject("Error"); });
      const Attack_Number = await new Promise((resolve, reject) => { resolve(getPlayerMemory(p1OrP2, 'Attack_Number', 0)); reject("Error"); });
      const Block_Meter = await new Promise((resolve, reject) => { resolve(getPlayerMemory(p1OrP2, 'Block_Meter', 0)); reject("Error"); });
      const Dizzy = await new Promise((resolve, reject) => { resolve(getPlayerMemory(p1OrP2, 'Dizzy', 0)); reject("Error"); });
      const Dizzy_Reset_Timer = await new Promise((resolve, reject) => { resolve(getPlayerMemory(p1OrP2, 'Dizzy_Reset_Timer', 0)); reject("Error"); });
      const Flight_Flag = await new Promise((resolve, reject) => { resolve(getPlayerMemory(p1OrP2, 'Flight_Flag', 0)); reject("Error"); });
      const FlyingScreen = await new Promise((resolve, reject) => { resolve(getPlayerMemory(p1OrP2, 'FlyingScreen', 0)); reject("Error"); });
      const FSI_Points = await new Promise((resolve, reject) => { resolve(getPlayerMemory(p1OrP2, 'FlyingScreen', 0)); reject("Error"); });
      const HitStop = await new Promise((resolve, reject) => { resolve(getPlayerMemory(p1OrP2, 'Hitstop2', 0)); reject("Error"); });
      const Is_Prox_Block = await new Promise((resolve, reject) => { resolve(getPlayerMemory(p1OrP2, 'Is_Prox_Block', 0)); reject("Error"); });
      const Knockdown_State = await new Promise((resolve, reject) => { resolve(getPlayerMemory(p1OrP2, 'Knockdown_State', 0)); reject("Error"); });
      const Normal_Strength = await new Promise((resolve, reject) => { resolve(getPlayerMemory(p1OrP2, 'Normal_Strength', 0)); reject("Error"); });
      const PunchKick = await new Promise((resolve, reject) => { resolve(getPlayerMemory(p1OrP2, 'PunchKick', 0)); reject("Error"); });
      const Special_Attack_ID = await new Promise((resolve, reject) => { resolve(getPlayerMemory(p1OrP2, 'Special_Attack_ID', 0)); reject("Error"); });
      const Special_Strength = await new Promise((resolve, reject) => { resolve(getPlayerMemory(p1OrP2, 'Special_Strength', 0)); reject("Error"); });
      const SJ_Counter = await new Promise((resolve, reject) => { resolve(getPlayerMemory(p1OrP2, 'SJ_Counter', 0)); reject("Error"); });
      const Y_Position_Arena = await new Promise((resolve, reject) => { resolve(getPlayerMemory(p1OrP2, 'Y_Position_Arena', 0)); reject("Error"); });
      const Y_Position_From_Enemy = await new Promise((resolve, reject) => { resolve(getPlayerMemory(p1OrP2, 'Y_Position_From_Enemy', 0)); reject("Error"); });
      const Y_Velocity = await new Promise((resolve, reject) => { resolve(getPlayerMemory(p1OrP2, 'Y_Velocity', 0)); reject("Error"); });

      // NEW_STATE_ADD_HERE : Define your SINGLE get-Address here if you need something that isn't on the list.

      // List of files to be written. Will have prefix of P1_ or P2_
      var nStateObj =
      {
        State_Being_Hit: [[], [], []],
        State_Flying_Screen_Air: [[], [], []],
        State_Flying_Screen_OTG: [[], [], []],
        State_FS_Install_1: [[], [], []],
        State_FS_Install_2: [[], [], []],
        State_NJ_Air: [[], [], []],
        State_NJ_Rising: [[], [], []],
        State_OTG_Extra_Stun: [[], [], []],
        State_OTG_Forced_Stun: [[], [], []],
        State_OTG_Hit: [[], [], []],
        State_OTG_Roll_Invincible: [[], [], []],
        State_OTG_Roll_Stunned: [[], [], []],
        State_ProxBlock_Air: [[], [], []],
        State_ProxBlock_Ground: [[], [], []],
        State_Pushblock_Air: [[], [], []],
        State_Pushblock_Ground: [[], [], []],
        State_Rising_Invincibility: [[], [], []],
        State_SJ_Air: [[], [], []],
        State_SJ_Counter: [[], [], []],
        State_Stun: [[], [], []],
        State_Tech_Hit: [[], [], []],
        State_Thrown_Air: [[], [], []],
        State_Thrown_Ground: [[], [], []],
        State_UnDizzy: [[], [], []],
        // State_Magneto_Moves: [[], [], []],
        // NEW_STATE_ADD_HERE ⏫
      }

      // for each slot (abc) in a Player's side
      for (let pABC = 0; pABC < 3; pABC++) {
        for (let cLen = 0; cLen < CLIP_LENGTH; cLen++) {
          // Magneto MoveList
          // Normals
          // if (((Attack_Number)[pSlot][cLen] == 0) && ((Knockdown_State)[pSlot][cLen] == 20)) {
          //   nStateObj.State_Magneto_Moves[pSlot].push("S.LP")
          // } else if (((Attack_Number)[pSlot][cLen] == 1) && ((Knockdown_State)[pSlot][cLen] == 20)) {
          //   nStateObj.State_Magneto_Moves[pSlot].push("S.MP")
          // } else if (((Attack_Number)[pSlot][cLen] == 2) && ((Knockdown_State)[pSlot][cLen] == 20)) {
          //   nStateObj.State_Magneto_Moves[pSlot].push("S.HP")
          // } else if (((Attack_Number)[pSlot][cLen] == 3) && ((Knockdown_State)[pSlot][cLen] == 20)) {
          //   nStateObj.State_Magneto_Moves[pSlot].push("S.LK")
          // } else if (((Attack_Number)[pSlot][cLen] == 4) && ((Knockdown_State)[pSlot][cLen] == 20)) {
          //   nStateObj.State_Magneto_Moves[pSlot].push("S.MK")
          // } else if (((Attack_Number)[pSlot][cLen] == 5) && ((Knockdown_State)[pSlot][cLen] == 20)) {
          //   nStateObj.State_Magneto_Moves[pSlot].push("S.HK(1)")
          // } else if (((Attack_Number)[pSlot][cLen] == 25) && ((Knockdown_State)[pSlot][cLen] == 20)) {
          //   nStateObj.State_Magneto_Moves[pSlot].push("S.HK (2)")
          // } else if (((Attack_Number)[pSlot][cLen] == 6) && ((Knockdown_State)[pSlot][cLen] == 20)) {
          //   nStateObj.State_Magneto_Moves[pSlot].push("C.LP")
          // } else if (((Attack_Number)[pSlot][cLen] == 7) && ((Knockdown_State)[pSlot][cLen] == 20)) {
          //   nStateObj.State_Magneto_Moves[pSlot].push("C.MP")
          // } else if (((Attack_Number)[pSlot][cLen] == 8) && ((Knockdown_State)[pSlot][cLen] == 20)) {
          //   nStateObj.State_Magneto_Moves[pSlot].push("C.HP")
          // } else if (((Attack_Number)[pSlot][cLen] == 9) && ((Knockdown_State)[pSlot][cLen] == 20)) {
          //   nStateObj.State_Magneto_Moves[pSlot].push("C.LK")
          // } else if (((Attack_Number)[pSlot][cLen] == 10) && ((Knockdown_State)[pSlot][cLen] == 20)) {
          //   nStateObj.State_Magneto_Moves[pSlot].push("C.MK")
          // } else if (((Attack_Number)[pSlot][cLen] == 11) && ((Knockdown_State)[pSlot][cLen] == 20)) {
          //   nStateObj.State_Magneto_Moves[pSlot].push("C.HK")
          // } else if (((Attack_Number)[pSlot][cLen] == 12) && ((Knockdown_State)[pSlot][cLen] == 20)) {
          //   nStateObj.State_Magneto_Moves[pSlot].push("J.LP")
          // } else if (((Attack_Number)[pSlot][cLen] == 13) && ((Knockdown_State)[pSlot][cLen] == 20)) {
          //   nStateObj.State_Magneto_Moves[pSlot].push("J.MP")
          // } else if (((Attack_Number)[pSlot][cLen] == 14) && ((Knockdown_State)[pSlot][cLen] == 20)) {
          //   nStateObj.State_Magneto_Moves[pSlot].push("J.HP")
          // } else if (((Attack_Number)[pSlot][cLen] == 15) && ((Knockdown_State)[pSlot][cLen] == 20)) {
          //   nStateObj.State_Magneto_Moves[pSlot].push("J.LK")
          // } else if (((Attack_Number)[pSlot][cLen] == 16) && ((Knockdown_State)[pSlot][cLen] == 20)) {
          //   nStateObj.State_Magneto_Moves[pSlot].push("J.MK")
          // } else if (((Attack_Number)[pSlot][cLen] == 17) && ((Knockdown_State)[pSlot][cLen] == 20)) {
          //   nStateObj.State_Magneto_Moves[pSlot].push("J.HK")
          // } else if (((Attack_Number)[pSlot][cLen] == 18) && ((Knockdown_State)[pSlot][cLen] == 20)) {
          //   nStateObj.State_Magneto_Moves[pSlot].push("J.D+LK")
          // } else if (((Attack_Number)[pSlot][cLen] == 65) && ((Knockdown_State)[pSlot][cLen] == 34)) {
          //   nStateObj.State_Magneto_Moves[pSlot].push("OC Launcher")
          //   // Throws
          // } else if (((Airborne)[pSlot][cLen] == 0) && ((Knockdown_State)[pSlot][cLen] == 30) && ((Is_Prox_Block)[pSlot][cLen] == 15) && ((PunchKick)[pSlot][cLen] == 0)) {
          //   nStateObj.State_Magneto_Moves[pSlot].push("Ground Throw (HP)")
          // } else if (((Airborne)[pSlot][cLen] == 0) && ((Knockdown_State)[pSlot][cLen] == 30) && ((Is_Prox_Block)[pSlot][cLen] == 15) && ((PunchKick)[pSlot][cLen] == 1)) {
          //   nStateObj.State_Magneto_Moves[pSlot].push("Ground Throw (HK)")
          // } else if (((Airborne)[pSlot][cLen] == 2) && ((Knockdown_State)[pSlot][cLen] == 30) && ((Is_Prox_Block)[pSlot][cLen] == 15) && ((PunchKick)[pSlot][cLen] == 0)) {
          //   nStateObj.State_Magneto_Moves[pSlot].push("Air Throw (HP)")
          // } else if (((Airborne)[pSlot][cLen] == 2) && ((Knockdown_State)[pSlot][cLen] == 30) && ((Is_Prox_Block)[pSlot][cLen] == 15) && ((PunchKick)[pSlot][cLen] == 1)) {
          //   nStateObj.State_Magneto_Moves[pSlot].push("Air Throw (HK)")
          //   // Specials
          //   // E.M. Disruptor
          // } else if (((Attack_Number)[pSlot][cLen] == 48) && ((Knockdown_State)[pSlot][cLen] == 21)) {
          //   nStateObj.State_Magneto_Moves[pSlot].push("E.M. Disruptor (LP)")
          // } else if (((Attack_Number)[pSlot][cLen] == 50) && ((Knockdown_State)[pSlot][cLen] == 21)) {
          //   nStateObj.State_Magneto_Moves[pSlot].push("E.M. Disruptor (HP)")
          //   // Magnetic Blast
          // } else if (((Attack_Number)[pSlot][cLen] == 54) && ((Knockdown_State)[pSlot][cLen] == 21) && ((Special_Strength)[pSlot][cLen] == 0) && ((Special_Attack_ID)[pSlot][cLen] == 7)) {
          //   nStateObj.State_Magneto_Moves[pSlot].push("Magnetic Blast (LP)")
          // } else if (((Attack_Number)[pSlot][cLen] == 54) && ((Knockdown_State)[pSlot][cLen] == 21) && ((Special_Strength)[pSlot][cLen] == 1) && ((Special_Attack_ID)[pSlot][cLen] == 7)) {
          //   nStateObj.State_Magneto_Moves[pSlot].push("Magnetic Blast (HP)")
          //   // Forcefield
          // } else if (((Special_Attack_ID)[pSlot][cLen] == 8) && ((Knockdown_State)[pSlot][cLen] == 21) && ((Special_Strength)[pSlot][cLen] == 0)) {
          //   nStateObj.State_Magneto_Moves[pSlot].push("Forcefield (LK)")
          // } else if (((Special_Attack_ID)[pSlot][cLen] == 8) && ((Knockdown_State)[pSlot][cLen] == 21) && ((Special_Strength)[pSlot][cLen] == 1)) {
          //   nStateObj.State_Magneto_Moves[pSlot].push("Forcefield (HK)")
          //   // Hyper-Grav
          // } else if ((Attack_Number[pSlot][cLen] == 51) && ((Special_Attack_ID)[pSlot][cLen] == 1) && ((Knockdown_State)[pSlot][cLen] == 21) && ((Special_Strength)[pSlot][cLen] == 0)) {
          //   nStateObj.State_Magneto_Moves[pSlot].push("Hyper-Grav (LK)")
          // } else if ((Attack_Number[pSlot][cLen] == 51) && ((Special_Attack_ID)[pSlot][cLen] == 1) && ((Knockdown_State)[pSlot][cLen] == 21) && ((Special_Strength)[pSlot][cLen] == 1)) {
          //   nStateObj.State_Magneto_Moves[pSlot].push("Hyper-Grav (HK)")
          //   // Tag-In
          // } else if ((Attack_Number[pSlot][cLen] == 61) && ((Knockdown_State)[pSlot][cLen] == 21)) {
          //   nStateObj.State_Magneto_Moves[pSlot].push("Tag-In")
          //   // Snapback
          // } else if ((Attack_Number[pSlot][cLen] == 63) && ((Knockdown_State)[pSlot][cLen] == 29)) {
          //   nStateObj.State_Magneto_Moves[pSlot].push("Snapback")
          //   // Flight-Startup
          // } else if ((Special_Attack_ID[pSlot][cLen] == 4) && ((Flight_Flag)[pSlot][cLen] == 255) && ((Knockdown_State)[pSlot][cLen] == 21)) {
          //   nStateObj.State_Magneto_Moves[pSlot].push("Flight-Start")
          //   // Flight_Active
          //   // } else if ((Flight_Flag)[pSlot][cLen] == 255) {
          //   //   nStateObj.State_Magneto_Moves[pSlot].push("Flight_Active")
          //   // Taunt
          // } else if ((Special_Attack_ID[pSlot][cLen] == 6) && ((Is_Prox_Block)[pSlot][cLen] == 19) && ((Knockdown_State)[pSlot][cLen] == 21)) {
          //   nStateObj.State_Magneto_Moves[pSlot].push("Taunt")
          //   // Supers
          //   // Shockwave
          // } else if ((Attack_Number[pSlot][cLen] == 52) && ((Knockdown_State)[pSlot][cLen] == 29)) {
          //   nStateObj.State_Magneto_Moves[pSlot].push("Shockwave")
          //   // Tempest
          // } else if ((Attack_Number[pSlot][cLen] == 53) && ((Knockdown_State)[pSlot][cLen] == 29)) {
          //   nStateObj.State_Magneto_Moves[pSlot].push("Tempest")
          //   // ELSE NOTHING
          // } else {
          //   nStateObj.State_Magneto_Moves[pSlot].push(",")
          // }

          // Being_Hit
          (
            ((Knockdown_State)[pABC][cLen] == 32)
            && ((HitStop)[pABC][cLen] > 0)
          )
            ? nStateObj.State_Being_Hit[pABC].push(1)
            : nStateObj.State_Being_Hit[pABC].push(0);
          // "Flying_Screen_Air"
          (
            ((FlyingScreen)[pABC][cLen] == 1)
            && ((Knockdown_State)[pABC][cLen] == 32)
            && ((Airborne)[pABC][cLen] == 2)
          )
            ? nStateObj.State_Flying_Screen_Air[pABC].push(1)
            : nStateObj.State_Flying_Screen_Air[pABC].push(0);
          // "Flying_Screen_OTG"
          (
            ((FlyingScreen)[pABC][cLen] == 1)
            && ((Knockdown_State)[pABC][cLen] == 32)
            && ((Airborne)[pABC][cLen] == 3)
          )
            ? nStateObj.State_Flying_Screen_OTG[pABC].push(1)
            : nStateObj.State_Flying_Screen_OTG[pABC].push(0);
          // "FS_Install_1"
          (
            ((FSI_Points)[pABC][cLen] == 8)
            || ((FSI_Points)[pABC][cLen] == 9)
          )
            ? nStateObj.State_FS_Install_1[pABC].push(1)
            : nStateObj.State_FS_Install_1[pABC].push(0);
          // "FS_Install_2"
          (
            ((FSI_Points)[pABC][cLen] > 9)
          )
            ? nStateObj.State_FS_Install_2[pABC].push(1)
            : nStateObj.State_FS_Install_2[pABC].push(0);
          // "NJ_Air"
          (
            ((Airborne)[pABC][cLen] == 2)
            && ((Knockdown_State)[pABC][cLen] == 3)
            && ((SJ_Counter)[pABC][cLen] == 0)
          )
            ? nStateObj.State_NJ_Air[pABC].push(1)
            : nStateObj.State_NJ_Air[pABC].push(0);
          // "NJ_Rising
          (
            ((Airborne)[pABC][cLen] == 0)
            && ((Knockdown_State)[pABC][cLen] == 2)
            && ((SJ_Counter)[pABC][cLen] == 0)
          )
            ? nStateObj.State_NJ_Rising[pABC].push(1)
            : nStateObj.State_NJ_Rising[pABC].push(0);
          // "OTG_Extra_Stun"
          (
            ((Knockdown_State)[pABC][cLen] == 23)
            && (((Airborne)[pABC][cLen] == 3))
          )
            ? nStateObj.State_OTG_Extra_Stun[pABC].push(1)
            : nStateObj.State_OTG_Extra_Stun[pABC].push(0);

          // "OTG_Forced_Stun"
          (
            ((Knockdown_State)[pABC][cLen] == 32)
            && (((Airborne)[pABC][cLen] == 3))
          )
            ? nStateObj.State_OTG_Forced_Stun[pABC].push(1)
            : nStateObj.State_OTG_Forced_Stun[pABC].push(0);
          // "OTG_Hit"
          (
            ((Action_Flags)[pABC][cLen] == 0)
            && ((Airborne)[pABC][cLen] == 3)
            && (((Knockdown_State)[pABC][cLen] == 32))
          )
            ? nStateObj.State_OTG_Hit[pABC].push(1)
            : nStateObj.State_OTG_Hit[pABC].push(0);
          // "OTG_Roll_Invincible"
          (
            ((Action_Flags)[pABC][cLen] == 2)
            && ((Airborne)[pABC][cLen] == 1)
            && (((Attack_Immune)[pABC][cLen] == 1)
              && ((Knockdown_State)[pABC][cLen] == 17))
          )
            ? nStateObj.State_OTG_Roll_Invincible[pABC].push(1)
            : nStateObj.State_OTG_Roll_Invincible[pABC].push(0);

          // "OTG_Roll_Stunned"
          (
            ((Action_Flags)[pABC][cLen] == 1)
            && ((Airborne)[pABC][cLen] == 3)
            && (((Knockdown_State)[pABC][cLen] == 32))
          )
            ? nStateObj.State_OTG_Roll_Stunned[pABC].push(1)
            : nStateObj.State_OTG_Roll_Stunned[pABC].push(0);
          // "ProxBlock_Air"
          (
            ((Is_Prox_Block)[pABC][cLen] == 6)
            && ((Knockdown_State)[pABC][cLen] == 19)
          )
            ? nStateObj.State_ProxBlock_Air[pABC].push(1)
            : nStateObj.State_ProxBlock_Air[pABC].push(0);
          // "ProxBlock_Ground"
          (
            ((Is_Prox_Block)[pABC][cLen] == 5)
            && ((Knockdown_State)[pABC][cLen] == 18)
          )
            ? nStateObj.State_ProxBlock_Ground[pABC].push(1)
            : nStateObj.State_ProxBlock_Ground[pABC].push(0);
          // "Pushblock_Air"
          (
            ((Block_Meter)[pABC][cLen] > 0)
            && ((Animation_Timer_Main)[pABC][cLen] < 28)
            && ((Is_Prox_Block)[pABC][cLen] == 6)
            && ((Action_Flags)[pABC][cLen] == 2)
          )
            ? nStateObj.State_Pushblock_Air[pABC].push(1)
            : nStateObj.State_Pushblock_Air[pABC].push(0);
          // "Pushblock_Ground"
          (
            ((Block_Meter)[pABC][cLen] > 0)
            && ((Animation_Timer_Main)[pABC][cLen] < 28)
            && ((Is_Prox_Block)[pABC][cLen] == 5)
            && (((Action_Flags)[pABC][cLen] == 3))
          )
            ? nStateObj.State_Pushblock_Ground[pABC].push(1)
            : nStateObj.State_Pushblock_Ground[pABC].push(0);
          // "Rising_Invincibility"
          (
            ((Airborne)[pABC][cLen] == 0)
            && ((Attack_Immune)[pABC][cLen] == 1)
            && ((Knockdown_State)[pABC][cLen] == 17)
          )
            ? nStateObj.State_Rising_Invincibility[pABC].push(1)
            : nStateObj.State_Rising_Invincibility[pABC].push(0);
          // "SJ_Air"
          (
            ((Airborne)[pABC][cLen] == 2)
            && ((Knockdown_State)[pABC][cLen] == 14)
            && ((SJ_Counter)[pABC][cLen] == 1)
          )
            ? nStateObj.State_SJ_Air[pABC].push(1)
            : nStateObj.State_SJ_Air[pABC].push(0);
          // "SJ_Counter"
          (
            ((SJ_Counter)[pABC][cLen] == 2)
          )
            ? nStateObj.State_SJ_Counter[pABC].push(1)
            : nStateObj.State_SJ_Counter[pABC].push(0);
          // "Stun"
          (
            ((Knockdown_State)[pABC][cLen] == 32)
            && ((Is_Prox_Block)[pABC][cLen] == 13)
          )
            ? nStateObj.State_Stun[pABC].push(1)
            : nStateObj.State_Stun[pABC].push(0);
          // "Tech_Hit"
          (
            ((Knockdown_State)[pABC][cLen] == 27)
          )
            ? nStateObj.State_Tech_Hit[pABC].push(1)
            : nStateObj.State_Tech_Hit[pABC].push(0);
          // "Thrown_Air"
          (
            ((Airborne)[pABC][cLen] == 2)
            && ((Knockdown_State)[pABC][cLen] == 31)
            && ((Is_Prox_Block)[pABC][cLen] == 16)
          )
            ? nStateObj.State_Thrown_Air[pABC].push(1)
            : nStateObj.State_Thrown_Air[pABC].push(0);
          // "Thrown_Ground"
          (
            ((Airborne)[pABC][cLen] == 0)
            && ((Knockdown_State)[pABC][cLen] == 31)
            && ((Is_Prox_Block)[pABC][cLen] == 16)
          )
            ? nStateObj.State_Thrown_Ground[pABC].push(1)
            : nStateObj.State_Thrown_Ground[pABC].push(0);
          // "Undizzy"
          (
            ((Attack_Immune)[pABC][cLen] == 2)
            && ((Knockdown_State)[pABC][cLen] == 32)
            && ((Is_Prox_Block)[pABC][cLen] == 13)
            && ((Dizzy)[pABC][cLen] == 80)
            && ((Dizzy_Reset_Timer)[pABC][cLen] == 60)
          )
            ? nStateObj.State_UnDizzy[pABC].push(1)
            : nStateObj.State_UnDizzy[pABC].push(0);

          // "NEW_STATE_ADD_NAME_HERE" (its name in comments)
          // NEW_STATE_ADD_HERE
        } // cLen Scope

        // Increase each consecutive "1" by 1. Ex: "1,1,1,1,1" becomes "1,2,3,4,5" until 0 reoccurs.
        var counter = 0;

        for (let newState in Object.entries(nStateObj)) {
          Object.values(nStateObj)[newState][pABC].forEach((element, index) => {
            if (element == 0) {
              counter = 0
              return 0;
            }
            else {
              Object.values(nStateObj)[newState][pABC][index] = (element + counter);
              counter++
              return Object.values(nStateObj)[newState][pABC][index + counter]
            }
          });
        }

        // Write the files
        for (let stateFileIndex = 0; stateFileIndex < Object.entries(nStateObj).length; stateFileIndex++) {
          fs.writeFileSync(`${DIR_OUTPATH}${p1OrP2}_${Object.keys(nStateObj)[stateFileIndex]}.js`,
            `var result = []; ` + '\n', 'utf8');
        }

        // Append data arrays into files
        for (let stateFileDataIndex = 0; stateFileDataIndex < Object.entries(nStateObj).length; stateFileDataIndex++) {
          fs.appendFileSync(`${DIR_OUTPATH}${p1OrP2}_${Object.keys(nStateObj)[stateFileDataIndex]}.js`,
            JSON.stringify(Object.values(nStateObj)[stateFileDataIndex])
              .replace('[[', `result[0] = [`)
              .replace(',[', '\nresult[1] = [')
              .replace(',[', '\nresult[2] = [')
              .replace(']]', ']')
              .replace(/]$/gm, '];') // end of line close-bracket gets semi-colon
              .replace(/"/gm, '\'') // replace double-quotes with single-quotes
          );
        }
      }
      // console.log(nStateObj.State_Magneto_Moves);
    }
  }

  function writeDataObject() {
    for (let key in dataObject) {
      if ((key == undefined) || (key == null) || (key == '')) {
        continue;
      }
      // Don't write PMem or Camera data
      const playerMemoryRegex = /(P[1-2]_[A-C]_)|Camera\w+/g;
      if (playerMemoryRegex.test(key)) {
        continue;
      }
      fs.writeFile(`${DIR_OUTPATH}/${key}.js`,
        `var result = [];\nresult[0] = [${dataObject[key]}];`,
        'utf8', (err) => { if (err) throw err; }
      );
    }
  }

  function writeComboCallouts() {
    for (let p1OrP2 = 1; p1OrP2 <= 2; p1OrP2++) {
      let tempP1OrP2Str = dataObject[`P${p1OrP2}_Combo_Meter_Value`].split(',');
      let resultsArr = [];
      // console.log(...tempP1OrP2Str);
      tempP1OrP2Str.forEach((element, index) => {
        if (parseInt(element) <= 2) {
          resultsArr.push(''); // ''
        } else if (parseInt(element) == 3) {
          resultsArr.push(`${COMBO_CALLOUTS[0]}`); // Yes
        } else if ((parseInt(element) == 4) || (parseInt(element) == 5)) {
          resultsArr.push(`${COMBO_CALLOUTS[1]}`); // Good
        } else if ((parseInt(element) == 6) || (parseInt(element) == 7)) {
          resultsArr.push(`${COMBO_CALLOUTS[2]}`); // Great
        } else if ((parseInt(element) == 8) || (parseInt(element) == 9)) {
          resultsArr.push(`${COMBO_CALLOUTS[3]}`); // Very Good
        } else if ((parseInt(element) >= 10) && (parseInt(element) <= 29)) {
          resultsArr.push(`${COMBO_CALLOUTS[4]}`); // Wonderful
        } else if ((parseInt(element) >= 30) && (parseInt(element) <= 49)) {
          resultsArr.push(`${COMBO_CALLOUTS[5]}`); // Fantastic
        } else if ((parseInt(element) >= 50) && (parseInt(element) <= 99)) {
          resultsArr.push(`${COMBO_CALLOUTS[6]}`); // Monster
        } else if ((parseInt(element) >= 100)) {
          resultsArr.push(`${COMBO_CALLOUTS[7]}`); // Marvelous
        } else {
          resultsArr.push('');
        }
      });
      //Write results array to a file and put qutoes around each element if it's not empty.
      fs.writeFile(`${DIR_OUTPATH}/P${p1OrP2}_Combo_Callouts.js`,
        `var result = [];\nresult[0] = [${resultsArr.map((element) => {
          // return (element == '') ? ' ' : `'${element}'`
          return `"${element}"`
        })}];`,
        'utf8', (err) => { if (err) throw err; }
      );
    }
  }

  // Write Static Data Conversion. Example ID_2: 01 turns into "Ryu"
  /**
   * @returns {Number[]} returns an array of numbers and writes a file with _CNV appended to its name
   * @description Writes and converts the point character's values for Knockdown State, Is_Prox_Block, ID_2 and _PortraitsToTime
   * Files are written and then appended as the function loops over each player-memory-address & player.
  */
  async function writeStaticDataCNV() {
    const STATIC_DATA_OBJS = [KNOCKDOWN_STATE_OBJ, PROX_BLOCK_OBJ, NAME_TABLE_OBJ, PORTRAITS_TO_TIME_OBJ]
    const STATIC_DATA_ADRS = ["Knockdown_State", "Is_Prox_Block", "ID_2", "ID_2"]
    let lookUpArr = [[], [], []];
    for (let p1OrP2 = 1; p1OrP2 < 3; p1OrP2++) {
      for (let staticDataLen = 0; staticDataLen < STATIC_DATA_ADRS.length; staticDataLen++) {

        // Write base file
        if (STATIC_DATA_OBJS[staticDataLen] == PORTRAITS_TO_TIME_OBJ) // PortraitsToTime Condition
        {
          fs.writeFileSync(`${DIR_OUTPATH}P${p1OrP2}_PortraitsToTime.js`,
            `var result = [];` + "\n",
            'utf8'
          );
          fs.writeFileSync(`${DIR_OUTPATH}P${p1OrP2}_PortraitPosition.js`,
            `var result = [];` + "\n",
            'utf8'
          );
        }
        else {
          fs.writeFileSync(`${DIR_OUTPATH}P${p1OrP2}_${STATIC_DATA_ADRS[staticDataLen]}_CNV.js`,
            `var result = [];` + "\n",
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
            lookUpArr[pABC].push(`"${Object.values(STATIC_DATA_OBJS[statAdr])[callPlayerMemoryFN[pABC][clipLen]]}"`);
          }
          if (STATIC_DATA_OBJS[statAdr] == PORTRAITS_TO_TIME_OBJ) // PortraitsToTime Condition && Portraits to Position
          {
            fs.appendFileSync(`${DIR_OUTPATH}P${p1OrP2}_PortraitsToTime.js`,
              `result[${pABC}] = [${lookUpArr[pABC]}];\n`,
              'utf8'
            );

            // AE_TO_POSITION_OBJ full of arrays with Position values
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
  // const grabStuff = async () => {
  //   const results = {};
  //   const names = [
  //     'Action_Flags',
  //     'Air_Dash_Count',
  //     'Airborne',
  //     'Animation_Timer_Main',
  //     'Attack_Immune',
  //     'Attack_Number',
  //     'Block_Meter',
  //     'Dizzy',
  //     'Dizzy_Reset_Timer',
  //     'Flight_Flag',
  //     'FlyingScreen',
  //     'FlyingScreen',
  //     'Hitstop2',
  //     'Is_Prox_Block',
  //     'Knockdown_State',
  //     'Normal_Strength',
  //     'PunchKick',
  //     'Special_Attack_ID',
  //     'Special_Strength',
  //     'SJ_Counter',
  //     'Y_Position_Arena',
  //     'Y_Position_From_Enemy',
  //     'Y_Velocity',
  //   ];
  //   await Promise.all(
  //     names.map(async (name) => {
  //       results[name] = new Promise((resolve, reject) => {
  //         resolve(getPlayerMemory(1, name, 0)); reject("Error");
  //       })
  //     }));
  //   return results;
  // };

  // const Y_Velocity = await new Promise((resolve, reject) => { resolve(getPlayerMemory(p1OrP2, 'Y_Velocity', 0)); reject("Error"); });

  /*
  --------------------------------------------------
  Step 5: 📞 Call Functions that Write Data to Files
  --------------------------------------------------
  */
  // Base Functions (Steps 1-3)
  appendMinMaxRound();
  await exportDataObject();
  // --------------Main Functions---------------------
  getPlayerMemoryEntries().forEach((label) => {
    writePlayerMemory(1, label.toString());
    writePlayerMemory(2, label.toString());
  });
  // console.log(`Starting Core Functions for ${csvFilesArr[csvFilesIDX]}`);
  // console.log(`Wrote pMem() for ${csvFilesArr[csvFilesIDX]}`);

  writeInputCNV();
  // console.log(`Wrote InputCNV() for ${csvFilesArr[csvFilesIDX]}`);

  writeStageDataCNV();
  // console.log(`Wrote StageDataCNV() for ${csvFilesArr[csvFilesIDX]}`);

  writeP1P2Addresses();
  // console.log(`Wrote P1P2Addresses() for ${csvFilesArr[csvFilesIDX]}`);

  writeComboCallouts();
  // console.log(`Wrote ComboCallouts() for ${csvFilesArr[csvFilesIDX]}`);

  countIsPausedCNV();
  // console.log(`Wrote CountIsPausedCNV() for ${csvFilesArr[csvFilesIDX]}`);

  writeTotalFramesCNV();
  // console.log(`Wrote TotalFramesCNV() for ${csvFilesArr[csvFilesIDX]}`);

  writeStaticDataCNV();
  // console.log(`Wrote StaticDataCNV() for ${csvFilesArr[csvFilesIDX]}`);

  writeDataObject();
  // console.log(`Wrote DataObject() for ${csvFilesArr[csvFilesIDX]}`);

  writeNewStates()
  // console.log(`Step 4: Wrote NewStates() for ${csvFilesArr[csvFilesIDX]}`);

  // await grabStuff();
}



// const fList = [];
// fs.readdirSync(DIR_EXPORT_TO_AE).forEach(file => {
//   if (file.endsWith('.js')) {
//     if (fs.existsSync(`${DIR_EXPORT_TO_AE}${file}`)) {
//       fList.push(file);
//     }
//   }
// });
console.timeEnd('⏱');
// await sleep(10000);
// // move all the .JS files in the AE folder up a path, and into the SortedJS folder inside of JS_Utils
// // make a list with all the js files in the AE folder
// fs.readdirSync(DIR_EXPORT_TO_AE).forEach(file => {
//   if (file.endsWith('.js')) {
//     fs.renameSync(`${DIR_EXPORT_TO_AE}${file}`, `${DIR_SORTED_JS}${file}`);
//   }
// });

//TODO Fix CSV 'real-data' finder function.
//TODO Make Tests for each of the functions!
