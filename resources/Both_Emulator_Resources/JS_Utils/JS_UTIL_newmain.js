/* eslint-disable */
import * as fs from 'fs';
import clipboardy from "clipboardy";

// Import the static data
import {
  AE_TO_CVS2_POSITION_OBJ,
  AE_TO_POSITION_OBJ,
  COMBO_CALLOUTS,
  DEC_NAME_TABLE_OBJ,
  FLOATING_POINT_ADDRESSES,
  INPUT_T1,
  INPUT_T2,
  IS_PROX_BLOCK_OBJ,
  KNOCKDOWN_STATE_OBJ,
  MIN_MAX_ADDRESSES,
  P1P2_ADDRESSES,
  PMEM_PREFIXES,
  PORTRAITS_TO_TIME_OBJ,
  STAGES_NAMES,
  STAGES_OBJ,
} from './JS_UTIL_staticData.js';

import {
  DIR_EXPORT_TO_AE,
  DIR_CSVS,
} from './JS_UTIL_paths.js';

console.time('⏱');
// Write exportToAE folder if it doesn't exist
if (!fs.existsSync(DIR_EXPORT_TO_AE)) {
  fs.mkdirSync(DIR_EXPORT_TO_AE);
}

/*
--------------------------------------------------
Step 1: Get the CSV file names from a directory
--------------------------------------------------
*/

let csvArr = [];
let csvNameArr = [];

fs.readdirSync(DIR_CSVS).forEach(function (file) {
  if (file.endsWith('.csv') || file.endsWith('.CSV')) {
    csvArr.push(file);
  }
});
// truncate the .csv from the file names
csvArr.forEach((name) => {
  let temp = '';
  temp = name.toString().replace('.csv', '')
    || name.toString().replace('.CSV', '')
  csvNameArr.push(temp);
});
// console.log(`Step 1: Found ${csvFilesArr.length} CSV files.`);
/*

--------------------------------------------------
Step 2: Process CSV
--------------------------------------------------
*/

// Main loop starts here
for (let csv = 0; csv < csvArr.length; csv++) {
  let headersArray = [];
  let allDataArray = [];
  /**
   * @description The path to the output folder for the AE files
   * @path `resources/Both_Emulator_Resources/JS_Utils/exportToAE/`
   */
  const DIR_OUTPATH = `${DIR_EXPORT_TO_AE}${csvNameArr[csv]}/`;
  // Make Output folder for AE files
  if (!fs.existsSync(`${DIR_OUTPATH}`)) {
    fs.mkdirSync(`${DIR_OUTPATH}`);
  }
  fs.readFileSync(DIR_CSVS + csvArr[csv], 'utf8')
    .split('\r\n').map((line, index) => {
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
   * @description Counts the amount of times a value appears in an array
   * and returns the value that appears the most
   * @param {Number[]} arrayOfNumbers dynamic amount of numbers,
   * depending on the csv file
   * @returns single number value
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
    // we are in a duplicate line entry based on total_frames
    if (allDataArray[totalLines][0] == allDataArray[totalLines + 1][0]) {
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
  var STRUCT = [];
  for (let headerIndex = 0; headerIndex < headersArray.length; headerIndex++) {
    STRUCT.push([]);
  }
  // Fill the array of arrays with the data separated by column
  for (let rowIdx = 1; rowIdx < allDataArray.length; ++rowIdx) {
    for (let colIdx = 0; colIdx < headersArray.length; ++colIdx) {
      STRUCT[colIdx].push(allDataArray[rowIdx][colIdx]);
    }
  }
  // Check for missing entries. Two strings, write once.
  let missingEntries = [`/*\n`];
  for (let i = 0; i < STRUCT[0].length - 1; i++) // total frames
  {
    if (STRUCT[0][i + 1] - STRUCT[0][i] !== 1) {
      missingEntries.push(`Missing data after Total_Frame #: ${STRUCT[0][i]}\n`);
    }
    else {
      continue
    }
  }
  // If MissingEntries is empty:
  const clipDataAE = '_clipDataAE'
  if (missingEntries.length == 0) {
    missingEntries.push('/*\nNo missing entries\n');
  }
  missingEntries.push(
    `\nFirst entry in Total_Frames: ${STRUCT[0][0]}\n`
    + `Final entry in Total_Frames: ${STRUCT[0][STRUCT[0].length - 1]}\n\n`
    + `Total_Frames in Clip: ${STRUCT[0].length}\n*/\n\n`
    + `var result = [];\n`
    + `result[0] = '${csvNameArr[csv]}';\n`
  );

  fs.writeFileSync(`${DIR_OUTPATH}${clipDataAE}.js`,
    missingEntries.toString().replace(/,/g, ''));

  // console.log(`Step 2: Wrote ${DIR_OUTPATH}_${csvSoloNameArr[csvFilesIDX]}.js`)
  /*
  --------------------------------------------------
  Step 3: Make dataObject & Start Core Functions
  --------------------------------------------------
  */
  let tempJS = `${DIR_EXPORT_TO_AE}${csvNameArr[csv]}.js`;

  let dataObject = {};
  for (let i = 0; i < headersArray.length; i++) {
    // the key is the header name[i], the value = numbers joined by a comma
    dataObject[headersArray[i]] = STRUCT[i].join(',');
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
      // Fetch the value by finding the key using its string name
      const VALUE = dataObject[MIN_MAX_ADDRESSES[adr]].split(',');
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
    var postFixes = ['', '_Min', '_Max']
    var toFixedDigits = [0]; // 7 is the default
    for (let playerPrefix in PMEM_PREFIXES) {
      for (let floatAdr in FLOATING_POINT_ADDRESSES) {
        for (let postFix in postFixes) {
          let fullAdr = FLOATING_POINT_ADDRESSES[floatAdr] + postFixes[postFix];
          for (let digit in toFixedDigits) {
            let floatAdr = dataObject[PMEM_PREFIXES[playerPrefix] + fullAdr].split(',');
            for (let i = 0; i < floatAdr.length; i++) {
              floatAdr[i] = parseFloat(floatAdr[i]).toFixed(toFixedDigits[digit]);
            }
            // Merge tempArray into the dataObject so that it is written later.
            dataObject[PMEM_PREFIXES[playerPrefix]
              + fullAdr + '_'
              + toFixedDigits[digit]] = floatAdr.join(',');
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
   * player-memory-functions.
  */
  function fetchPMemEntries() {
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
    clipboardy.writeSync(playerMemoryEntries.join('\n'));

    return playerMemoryEntries;
  }

  async function writeSortedJS() {
    let dataObjectExport = '';
    for (let key in dataObject) {
      if (dataObject[key]) {
        dataObjectExport += `export const ${key} = '${dataObject[key]}';\n`;
      }
    }
    if (!fs.existsSync(tempJS)) {
      fs.writeFileSync(tempJS, dataObjectExport);
    }
  }
  // console.log(`Step 3: Updated object with MIN&MAX and wrote tempJS file.`);

  let pMemObject = {};
  let pMemList = [];

  /**
   * @param {number|string} p1OrP2 number or string, ex: 1 or "P1"
   * @param {string} pMemAdr ex: "Health_Big"
   * @returns {Number[]} Returns an array of numbers
   * @description Finds the point character, and returns an array of numbers for the playerMemoryAddress in the clip.
  */
  async function getPlayerMemory(p1OrP2, pMemAdr) {
    let valArr = [[], [], []];
    let pObjSwitch;// Switches between the Player1 and Player2 objects
    let p1P2; // Switches between "P1" and "P2"

    if ((p1OrP2 == 1)
      || (p1OrP2 == "P1")
      || (p1OrP2 == "1")) {
      pObjSwitch = POINT_OBJ_P1;
      p1P2 = "P1";
    }
    else if ((p1OrP2 == 2)
      || (p1OrP2 == "P2")
      || (p1OrP2 == "2")) {
      pObjSwitch = POINT_OBJ_P2;
      p1P2 = "P2";
    }

    await writeSortedJS();
    await import(`file://${tempJS}`).then((pMemFile) => { // pMemFile is the JS object inside of tempJS
      for (let cLen = 0; cLen < CLIP_LENGTH; cLen++) {
        // 3-Character Bug
        if ((Object.values(pObjSwitch)[0][cLen] == 0)
          && (Object.values(pObjSwitch)[1][cLen] == 0)
          && (Object.values(pObjSwitch)[2][cLen] == 0)) {
          // console.log(`${p1P2}: 3 - Character Bug: A == 0 && B == 0 && C == 0    P1: ABC`);
          valArr[0].push(pMemFile[`${Object.keys(pObjSwitch)[0]}${pMemAdr}`].split(',')[cLen]);
          valArr[1].push(pMemFile[`${Object.keys(pObjSwitch)[1]}${pMemAdr}`].split(',')[cLen]);
          valArr[2].push(pMemFile[`${Object.keys(pObjSwitch)[2]}${pMemAdr}`].split(',')[cLen]);
        }
        // 2-Character Bug
        else if ((Object.values(pObjSwitch)[0][cLen] == 0)
          && (Object.values(pObjSwitch)[1][cLen] == 0)
          && (Object.values(pObjSwitch)[2][cLen] != 0)) {
          // console.log(`${p1P2}: 2 - Character Bug: A == 0 && B == 0 && C != 0    P1: AB`);
          valArr[0].push(pMemFile[`${Object.keys(pObjSwitch)[0]}${pMemAdr}`].split(',')[cLen]);
          valArr[1].push(pMemFile[`${Object.keys(pObjSwitch)[1]}${pMemAdr}`].split(',')[cLen]);
        }
        else if ((Object.values(pObjSwitch)[0][cLen] == 0)
          && (Object.values(pObjSwitch)[1][cLen] != 0)
          && (Object.values(pObjSwitch)[2][cLen] == 0)) {
          // console.log(`${p1P2}: 2 - Character Bug: A == 0 && B != 0 && C == 0    P1: AC`);
          valArr[0].push(pMemFile[`${Object.keys(pObjSwitch)[0]}${pMemAdr}`].split(',')[cLen]);
          valArr[1].push(pMemFile[`${Object.keys(pObjSwitch)[2]}${pMemAdr}`].split(',')[cLen]);
        }
        else if ((Object.values(pObjSwitch)[0][cLen] != 0)
          && (Object.values(pObjSwitch)[1][cLen] == 0)
          && (Object.values(pObjSwitch)[2][cLen] == 0)) {
          // console.log(`${p1P2}: 2 - Character Bug: A != 0 && B == 0 && C == 0    P1: BC`);
          valArr[0].push(pMemFile[`${Object.keys(pObjSwitch)[1]}${pMemAdr}`].split(',')[cLen]);
          valArr[1].push(pMemFile[`${Object.keys(pObjSwitch)[2]}${pMemAdr}`].split(',')[cLen]);
        }
        // 1-Character
        else if ((Object.values(pObjSwitch)[0][cLen] == 0)
          && (Object.values(pObjSwitch)[1][cLen] != 0)
          && (Object.values(pObjSwitch)[2][cLen] != 0)) {
          // console.log(`${p1P2}: 1 - Character: A == 0 && B != 0 && C != 0        P1: A`);
          valArr[0].push(pMemFile[`${Object.keys(pObjSwitch)[0]}${pMemAdr}`].split(',')[cLen]);
        }//          replayObject[               P1_A_            Health_Big.split(',')[i]
        else if ((Object.values(pObjSwitch)[0][cLen] != 0)
          && (Object.values(pObjSwitch)[1][cLen] == 0)
          && (Object.values(pObjSwitch)[2][cLen] != 0)) {
          // console.log(`${p1P2}: 1 - Character: A != 0 && B == 0 && C != 0        P1: B`);
          valArr[0].push(pMemFile[`${Object.keys(pObjSwitch)[1]}${pMemAdr}`].split(',')[cLen]);
        }//          replayObject[               P1_B_            Health_Big.split(',')[i]
        else if ((Object.values(pObjSwitch)[0][cLen] != 0)
          && (Object.values(pObjSwitch)[1][cLen] != 0)
          && (Object.values(pObjSwitch)[2][cLen] == 0)) {
          // console.log(`${p1P2}: 1 - Character: A != 0 && B != 0 && C == 0       P1: C`);
          valArr[0].push(pMemFile[`${Object.keys(pObjSwitch)[2]}${pMemAdr}`].split(',')[cLen]);
        }//          replayObject[               P1_C_            Health_Big.split(',')[i]
      }
    });
    // console.log(`valArr: ${valArr}`);
    return valArr;
  }

  fetchPMemEntries().forEach((label) => {
    pMemList.push('P1_' + label);
    pMemList.push('P2_' + label);
  });
  // console.log(`${pMemList}`); // ex: P2_Air_Recovery_Timer

  /**
   * @description Pushes all the player memory addresses into the pMemObject
   * @returns {Promise} Returns an object with the point-character memory results for PMemList
   * @async
   * @example await pushAllPMemPrommises();
  */
  async function pushAllPMemPrommises() {
    for (let i = 0; i < pMemList.length; i += 2) { // has P1 and P2 entries; skip every other entry
      let pMemEntry = pMemList[i]
        .toString()
        .replace('P1_', '')
        .replace('P2_', '');
      pMemObject[pMemList[i + 0]] = await new Promise((res, rej) => { // i is P1
        res(getPlayerMemory(1, pMemEntry))
      });
      pMemObject[pMemList[i + 1]] = await new Promise((res, rej) => { // i is P2
        res(getPlayerMemory(2, pMemEntry))
      });
      // console.log(`pMemObject: ${ Object.entries(pMemObject) }`);
    }
  }

  // Main function to write data to files
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
    let pointObj;
    /**
     * @param "P1" || "P2"
    */
    let p1P2;

    if ((p1OrP2 == 1)
      || (p1OrP2 == "1")
      || (p1OrP2 == "P1")
      || (p1OrP2 == "p1")) {
      pointObj = POINT_OBJ_P1;
      p1P2 = "P1";
    }
    else if ((p1OrP2 == 2)
      || (p1OrP2 == "2")
      || (p1OrP2 == "P2")
      || (p1OrP2 == "p2")) {
      pointObj = POINT_OBJ_P2;
      p1P2 = "P2";
    }

    import(`file://${tempJS}`).then((pMemFile) => {
      for (let clipLen = 0; clipLen < CLIP_LENGTH; clipLen++) {
        // 3-Character Bug Logic
        if ((Object.values(pointObj)[0][clipLen] == 0)
          && (Object.values(pointObj)[1][clipLen] == 0)
          && (Object.values(pointObj)[2][clipLen] == 0)) {
          // console.log(`${p1P2}: 3-Character Bug Logic: A == 0 && B == 0 && C == 0    P1: ABC`);
          pMemArr[0].push(pMemFile[`${Object.keys(pointObj)[0]}${pMemAdr}`].split(',')[clipLen]);
          pMemArr[1].push(pMemFile[`${Object.keys(pointObj)[1]}${pMemAdr}`].split(',')[clipLen]);
          pMemArr[2].push(pMemFile[`${Object.keys(pointObj)[2]}${pMemAdr}`].split(',')[clipLen]);
        }
        // 2-Character Bug Logic
        else if ((Object.values(pointObj)[0][clipLen] == 0)
          && (Object.values(pointObj)[1][clipLen] == 0)
          && (Object.values(pointObj)[2][clipLen] != 0)) {
          // console.log(`${p1P2}: 2-Character Bug Logic: A == 0 && B == 0 && C != 0    P1: AB`);
          pMemArr[0].push(pMemFile[`${Object.keys(pointObj)[0]}${pMemAdr}`].split(',')[clipLen]);
          pMemArr[1].push(pMemFile[`${Object.keys(pointObj)[1]}${pMemAdr}`].split(',')[clipLen]);
        }
        else if ((Object.values(pointObj)[0][clipLen] == 0)
          && (Object.values(pointObj)[1][clipLen] != 0)
          && (Object.values(pointObj)[2][clipLen] == 0)) {
          // console.log(`${p1P2}: 2-Character Bug Logic: A == 0 && B != 0 && C == 0    P1: AC`);
          pMemArr[0].push(pMemFile[`${Object.keys(pointObj)[0]}${pMemAdr}`].split(',')[clipLen]);
          pMemArr[1].push(pMemFile[`${Object.keys(pointObj)[2]}${pMemAdr}`].split(',')[clipLen]);
        }
        else if ((Object.values(pointObj)[0][clipLen] != 0)
          && (Object.values(pointObj)[1][clipLen] == 0)
          && (Object.values(pointObj)[2][clipLen] == 0)) {
          // console.log(`${p1P2}: 2-Character Bug Logic: A != 0 && B == 0 && C == 0    P1: BC`);
          pMemArr[0].push(pMemFile[`${Object.keys(pointObj)[1]}${pMemAdr}`].split(',')[clipLen]);
          pMemArr[1].push(pMemFile[`${Object.keys(pointObj)[2]}${pMemAdr}`].split(',')[clipLen]);
        }
        // 1-Character Logic
        else if ((Object.values(pointObj)[0][clipLen] == 0)
          && (Object.values(pointObj)[1][clipLen] != 0)
          && (Object.values(pointObj)[2][clipLen] != 0)) {
          // console.log(`${p1P2}: 1-Character Logic: A == 0 && B != 0 && C != 0        P1: A`);
          pMemArr[0].push(pMemFile[`${Object.keys(pointObj)[0]}${pMemAdr}`].split(',')[clipLen]);
        }//                       P1|P2        P1_A        Health_Big                        i
        else if ((Object.values(pointObj)[0][clipLen] != 0)
          && (Object.values(pointObj)[1][clipLen] == 0)
          && (Object.values(pointObj)[2][clipLen] != 0)) {
          // console.log(`${p1P2}: 1-Character Logic: A != 0 && B == 0 && C != 0        P1: B`);
          pMemArr[0].push(pMemFile[`${Object.keys(pointObj)[1]}${pMemAdr}`].split(',')[clipLen]);
        }
        else if ((Object.values(pointObj)[0][clipLen] != 0)
          && (Object.values(pointObj)[1][clipLen] != 0)
          && (Object.values(pointObj)[2][clipLen] == 0)) {
          // console.log(`${p1P2}: 1-Character Logic: A != 0 && B != 0 && C == 0       P1: C`);
          pMemArr[0].push(pMemFile[`${Object.keys(pointObj)[2]}${pMemAdr}`].split(',')[clipLen]);
        }
      }

      // Write the file if it doesn't exist yet.
      if (!fs.existsSync(`${DIR_OUTPATH}/${p1P2}_${pMemAdr.split(',')}.js`)) {
        fs.writeFileSync(
          `${DIR_OUTPATH}/${p1P2}_${pMemAdr.split(',')}.js`,
          `var result = []; ` + "\n",
          'utf8',
        )
        // Append main data
        for (let dataArrayPerCharacter in pMemArr) {
          fs.appendFileSync(
            `${DIR_OUTPATH}/${p1P2}_${pMemAdr.split(',')}.js`,
            `result[${dataArrayPerCharacter}] = [${pMemArr[dataArrayPerCharacter]}];\n`,
            'utf8',
          )
        }
      }
    });
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
    // Padded Zeroes for program pad comp
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

  function writeStageDataCNV() {
    let stageDataArr = [];
    let stageDataCNV = [];
    let stageNamesCNV = [];
    // Numbers
    dataObject['Stage_Selector'].split(',').forEach((frame) => {
      stageDataArr.push(frame)
    });
    // Color-Hexes
    dataObject['Stage_Selector'].split(',').forEach((frame) => {
      stageDataCNV.push(`'${Object.values(STAGES_OBJ)[frame]}'`)
    });
    // Stage Names
    dataObject['Stage_Selector'].split(',').forEach((frame) => {
      stageNamesCNV.push(`'${Object.values(STAGES_NAMES)[frame]}'`)
    });
    fs.writeFileSync(`${DIR_OUTPATH}Stage_Selector_CNV.js`,
      `var result = [];\n`
      + `result[0] = [${stageDataArr}];\n`
      + `result[1] = [${stageDataCNV}];\n`
      + `result[2] = [${stageNamesCNV}];\n`,
      'utf8'
    );
    fs.appendFileSync(`${DIR_OUTPATH}${clipDataAE}.js`,
      `result[3] = ${stageNamesCNV[0].toString()};`
    );

    stageDataArr = [];
    stageDataCNV = [];
    stageNamesCNV = [];
  };

  /**
   * @description Used for writeNewStates()
   * to check P1 and P2 inputs for state tracking.
   */
  let playerOneInputs = [];
  /**
  * @description Used for writeNewStates()
  * to check P1 and P2 inputs for state tracking.
  */
  let playerTwoInputs = [];
  /**
  * @description Converts and writes inputs to one file that
  * contains formatting for a custom-font and US FGC notation
  **/
  function writeInputCNV() {
    const P1_InputsDECSplit = dataObject['P1_Input_DEC'].split(',')
    const P2_InputsDECSplit = dataObject['P2_Input_DEC'].split(',')
    let InputStr = ''; // holds each result for P1 and P2
    let InputList = []; // contains transformed results for P1 and P2
    let p1P2 = ''; // changes to 'P1' or 'P2'

    for (let pLen = 1; pLen < 3; pLen++) {
      pLen == 1 ? p1P2 = P1_InputsDECSplit : p1P2 = P2_InputsDECSplit;
      // Input Conversion Type 1
      for (const input in p1P2) {
        for (const button in Object.entries(INPUT_T1)) {
          if ((p1P2[input] & Object.values(INPUT_T1)[button]) != 0) {
            InputStr += `${Object.keys(INPUT_T1)[button]}`;
          }
        }
        InputList.push(InputStr);
        InputStr = '';
      }
      fs.writeFileSync(`${DIR_OUTPATH}P${pLen}_Inputs_CNV.js`,
        `var result = [];\nresult[0] = ["` +
        `${InputList.toString()
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
      pLen == 1 ? playerOneInputs = InputList : playerTwoInputs = InputList;

      // console.log(playerOneInputs)
      // console.log(playerTwoInputs)
      InputList = [];

      // Input Conversion Type 2
      for (const input in p1P2) {
        for (const button in Object.entries(INPUT_T2)) {
          if ((p1P2[input] & Object.values(INPUT_T2)[button]) != 0) {
            InputStr += Object.keys(INPUT_T2)[button];
          }
        }
        InputList.push(InputStr);
        InputStr = '';
      }
      fs.appendFileSync(`${DIR_OUTPATH}P${pLen}_Inputs_CNV.js`,
        `result[1] = ["${InputList.toString()
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
      InputList = [];

      // Input Conversion Type 3
      for (const input in p1P2) {
        for (const button in Object.entries(INPUT_T2)) {
          if ((p1P2[input] & Object.values(INPUT_T2)[button]) != 0) {
            InputStr += Object.keys(INPUT_T2)[button];
          }
        }
        InputList.push(InputStr);
        InputStr = "";
      }
      fs.appendFileSync(`${DIR_OUTPATH}P${pLen}_Inputs_CNV.js`,
        `\nresult[2] = ["${InputList.toString()
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
          // Looking ahead for a button+ input
          .replace(/([1-9](?=\w+))/gm, "$1+")
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
      InputList = [];
    }
  } // end of InputCNV

  /**
   * @description Writes individual JS files for each address in MISC_ADDRESSES.
   */
  function writeP1P2Addresses() {
    /**
     * @example "P1_Meter_Big", "Camera_Field_of_View", "P2_Combo_Meter_Value"
     */
    const p1p2AddressesArray = [[]];
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
      `var result = [];\n`
      + `result[0] = [${dataObject['Is_Paused']}];\n`
      + `result[1] = [${State_Is_Paused.toString()}];`,
      'utf8'
    );
  }

  function writeTeamNames() {
    let playerOne = '';
    let playerTwo = '';
    const id = [];
    const name = [];
    const P1_A_ID_2 = dataObject.P1_A_ID_2.split(',');
    const P1_B_ID_2 = dataObject.P1_B_ID_2.split(',');
    const P1_C_ID_2 = dataObject.P1_C_ID_2.split(',');
    const P2_A_ID_2 = dataObject.P2_A_ID_2.split(',');
    const P2_B_ID_2 = dataObject.P2_B_ID_2.split(',');
    const P2_C_ID_2 = dataObject.P2_C_ID_2.split(',');
    const P1_A_Assist_Value = dataObject.P1_A_Assist_Value.split(',');
    const P1_B_Assist_Value = dataObject.P1_B_Assist_Value.split(',');
    const P1_C_Assist_Value = dataObject.P1_C_Assist_Value.split(',');
    const P2_A_Assist_Value = dataObject.P2_A_Assist_Value.split(',');
    const P2_B_Assist_Value = dataObject.P2_B_Assist_Value.split(',');
    const P2_C_Assist_Value = dataObject.P2_C_Assist_Value.split(',');

    // Find the first non-ryu-ryu-ryu ID
    let firstValidFrame = 0;
    for (let i = 0; i < P1_A_ID_2.length; i++) {
      if ((P1_A_ID_2[i] != 0)
        && (P1_B_ID_2[i] != 0)
        && (P1_C_ID_2[i] != 0)) {
        firstValidFrame = i;
        break;
      } else {
        continue;
      }
    }
    id.push(P1_A_ID_2[firstValidFrame]);
    id.push(P1_B_ID_2[firstValidFrame]);
    id.push(P1_C_ID_2[firstValidFrame]);
    id.push(P2_A_ID_2[firstValidFrame]);
    id.push(P2_B_ID_2[firstValidFrame]);
    id.push(P2_C_ID_2[firstValidFrame]);

    // look up ID name
    id.forEach((id) => {
      name.push(DEC_NAME_TABLE_OBJ[id]);
    });
    // Convert assist types to symbols.
    const assistType = [];
    const assistCNV = [];
    const assistSymbols = ['α', 'β', 'γ']
    // 0, 1, 2 = α, β, γ
    assistType.push(P1_A_Assist_Value[firstValidFrame]);
    assistType.push(P1_B_Assist_Value[firstValidFrame]);
    assistType.push(P1_C_Assist_Value[firstValidFrame]);
    assistType.push(P2_A_Assist_Value[firstValidFrame]);
    assistType.push(P2_B_Assist_Value[firstValidFrame]);
    assistType.push(P2_C_Assist_Value[firstValidFrame]);

    // Convert assist types to symbols.
    assistType.forEach((assist) => {
      assistCNV.push(assistSymbols[assist]);
    });

    playerOne += `P1: `
    playerOne += `${name[0]}-${assistCNV[0]}, `
    playerOne += `${name[1]}-${assistCNV[1]}, `
    playerOne += `${name[2]}-${assistCNV[2]}`

    playerTwo += `P2: `
    playerTwo += `${name[3]}-${assistCNV[3]}, `
    playerTwo += `${name[4]}-${assistCNV[4]}, `
    playerTwo += `${name[5]}-${assistCNV[5]}`;

    fs.appendFileSync(`${DIR_OUTPATH}${clipDataAE}.js`,
      `result[1] = '${playerOne}';\n`
      + `result[2] = '${playerTwo}';\n`,
    );
  }

  function writeDataObject() {
    for (let key in dataObject) {
      if ((key == undefined)
        || (key == null)
        || (key == '')) {
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
      tempP1OrP2Str.forEach((element, index) => {
        if (parseInt(element) <= 2) {
          resultsArr.push('');                      // ''
        } else if (parseInt(element) == 3) {
          resultsArr.push(`${COMBO_CALLOUTS[0]}`);  // Yes
        } else if ((parseInt(element) == 4) || (parseInt(element) == 5)) {
          resultsArr.push(`${COMBO_CALLOUTS[1]}`);  // Good
        } else if ((parseInt(element) == 6) || (parseInt(element) == 7)) {
          resultsArr.push(`${COMBO_CALLOUTS[2]}`);  // Great
        } else if ((parseInt(element) == 8) || (parseInt(element) == 9)) {
          resultsArr.push(`${COMBO_CALLOUTS[3]}`);  // Very Good
        } else if ((parseInt(element) >= 10) && (parseInt(element) <= 29)) {
          resultsArr.push(`${COMBO_CALLOUTS[4]}`);  // Wonderful
        } else if ((parseInt(element) >= 30) && (parseInt(element) <= 49)) {
          resultsArr.push(`${COMBO_CALLOUTS[5]}`);  // Fantastic
        } else if ((parseInt(element) >= 50) && (parseInt(element) <= 99)) {
          resultsArr.push(`${COMBO_CALLOUTS[6]}`);  // Monster
        } else if ((parseInt(element) >= 100)) {
          resultsArr.push(`${COMBO_CALLOUTS[7]}`);  // Marvelous
        } else {
          resultsArr.push('');
        }
      });
      //Write results array to a file and put qutoes around each element if it's not empty.
      fs.writeFile(`${DIR_OUTPATH}/P${p1OrP2}_Combo_Callouts.js`,
        `var result = [];\nresult[0] = [${resultsArr.map((element) => {
          // return (element == '') ? ' ' : `'${element}'`
          return `'${element}'`
        })}];`,
        'utf8', (err) => { if (err) throw err; }
      );
    }
  }

  // Write Static Data Conversion. Example ID_2: 01 turns into "Ryu"
  /**
   * @returns {Number[]} returns an array of numbers and
   * writes a file with _CNV appended to its name
   * @description Writes and converts the point character's values for
   * Knockdown State, Is_Prox_Block, ID_2 and _PortraitsToTime
   * Files are written and then appended as the function loops
   * over each player-memory-address & player.
  */
  async function writeStaticDataCNV() {
    const STATIC_DATA_OBJS = [
      KNOCKDOWN_STATE_OBJ,
      IS_PROX_BLOCK_OBJ,
      DEC_NAME_TABLE_OBJ,
      PORTRAITS_TO_TIME_OBJ,
      AE_TO_POSITION_OBJ,
      AE_TO_CVS2_POSITION_OBJ
    ]
    const STATIC_DATA_ADRS = [
      "Knockdown_State",
      "Is_Prox_Block",
      "ID_2",
      "ID_2"
    ]
    let lookUpArr = [[], [], []];
    for (let p1OrP2 = 1; p1OrP2 < 3; p1OrP2++) {
      for (let staticDataLen = 0; staticDataLen < STATIC_DATA_ADRS.length; staticDataLen++) {

        // Write base file
        if (STATIC_DATA_OBJS[staticDataLen] == PORTRAITS_TO_TIME_OBJ) // PortraitsToTime Condition
        {
          fs.writeFileSync(`${DIR_OUTPATH}P${p1OrP2}_PortraitsToTime.js`,
            `var result = [];` + '\n',
            'utf8'
          );
          fs.writeFileSync(`${DIR_OUTPATH}P${p1OrP2}_PortraitPosition.js`,
            `var result = [];` + '\n',
            'utf8'
          );
          fs.writeFileSync(`${DIR_OUTPATH}P${p1OrP2}_CVS2PortraitPosition.js`,
            `var result = [];` + '\n',
            'utf8'
          );
        }
        else {
          fs.writeFileSync(`${DIR_OUTPATH}P${p1OrP2}_${STATIC_DATA_ADRS[staticDataLen]}_CNV.js`,
            `var result = [];` + '\n',
            'utf8'
          );
        }
      }
      for (let statAdr = 0; statAdr < STATIC_DATA_ADRS.length; statAdr++) {
        const getStaticData = new Promise((resolve, reject) => {
          resolve(getPlayerMemory(`${p1OrP2}`, STATIC_DATA_ADRS[statAdr].toString(), 0));
          reject("Error");
        });
        const callPlayerMemoryFN = await getStaticData;
        for (let pABC = 0; pABC < callPlayerMemoryFN.length; pABC++) // [0][1][2]
        {
          for (let clipLen = 0; clipLen < callPlayerMemoryFN[pABC].length; clipLen++) {
            lookUpArr[pABC].push(`'${Object.values(STATIC_DATA_OBJS[statAdr])[callPlayerMemoryFN[pABC][clipLen]]}'`);
          }
          if (STATIC_DATA_OBJS[statAdr] == PORTRAITS_TO_TIME_OBJ) // PortraitsToTime Condition && Portraits to Position
          {
            fs.appendFileSync(`${DIR_OUTPATH}P${p1OrP2}_PortraitsToTime.js`,
              `result[${pABC}] = [${lookUpArr[pABC]}];\n`,
              'utf8'
            );
            // lookUpArr = [[], [], []];

            // AE_TO_NormalComposition_POS
            let posArray = lookUpArr[pABC].map((portrait) => {
              portrait = portrait.replace(/'/g, '');
              portrait = parseInt(portrait);
              portrait = AE_TO_POSITION_OBJ[portrait];
              portrait = [`[${portrait}]`]; /// wrap in brackets
              // console.log(portrait)
              return portrait;
            });

            fs.appendFileSync(`${DIR_OUTPATH}P${p1OrP2}_PortraitPosition.js`,
              `result[${pABC}] = [${posArray}];\n`,
              'utf8'
            );

            // AE_TO_CVS2Composition_POS
            let posArray2 = lookUpArr[pABC].map((portrait) => {
              portrait = portrait.replace(/'/g, '');
              portrait = AE_TO_CVS2_POSITION_OBJ[portrait];
              portrait = [`[${portrait}]`]; /// wrap in brackets
              return portrait;
            });

            fs.appendFileSync(`${DIR_OUTPATH}P${p1OrP2}_CVS2PortraitPosition.js`,
              `result[${pABC}] = [${posArray2}];\n`,
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

  /*
  --------------------------------------------------
  End of Core Functions
  --------------------------------------------------
  
  --------------------------------------------------
  Step 4: Begin Write-State Functions
  --------------------------------------------------
  */
  /**
   * @description Writes State-Files that count and
   * increment consecutive true values.
   * Search for "NEW_STATE_ADD_HERE" across the function
   * to append address fetches and new states.
   */
  async function writeNewStates() {
    let pI;
    let p1P2_;
    let tempROMCounter = 0;
    let tempROMSwitch = 0;
    let nStateObj =
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
      State_Undizzy: [[], [], []],
      // NEW_STATE_ADD_HERE ⏫
      // Magneto-Only
      State_Magneto_Moves: [[], [], []],
      State_Magneto_ROM_01_OpponentStateA: [[], [], []],
      State_Magneto_ROM_02_ChoiceA: [[], [], []],
      State_Magneto_ROM_03_InputA_LK: [[], [], []],
      State_Magneto_ROM_03_InputA_MK: [[], [], []],
      State_Magneto_ROM_04_ChoiceB: [[], [], []],
      State_Magneto_ROM_05_ChoiceC: [[], [], []],
      State_Magneto_ROM_05_ChoiceD: [[], [], []],
      State_Magneto_ROM_06_InputB_AirDash: [[], [], []],
      State_Magneto_ROM_07_ChoiceE: [[], [], []],
      State_Magneto_ROM_08_InputC_DLK: [[], [], []],
      State_Magneto_ROM_08_InputC_MK: [[], [], []],
      State_Magneto_ROM_09_ChoiceF: [[], [], []],
      // Storm-Only
      State_Storm_ModifiedAirDashNJ: [[], [], []],
      State_Storm_ModifiedAirDashSJ: [[], [], []],
      State_Storm_DI: [[], [], []],
      State_Storm_Float: [[], [], []],
    }
    for (pI = 1; pI < 3; pI++) {
      pI == 1 ? p1P2_ = 'P1_' : p1P2_ = 'P2_';
      for (let pABC = 0; pABC < 3; pABC++) {
        for (let cLen = 0; cLen < CLIP_LENGTH; cLen++) {
          // MAGNETO ONLY STATES:
          // 'ROM_01_OpponentStateA' (Where is the dummy?)
          if (nStateObj.State_Magneto_ROM_01_OpponentStateA != undefined) {
            if ((pMemObject[`${p1P2_}ID_2`][pABC][cLen] == 44)) {
              (pMemObject[`${p1P2_}Knockdown_State`])[pABC][cLen] == 4 // Magneto is landing from the air.
                ? nStateObj.State_Magneto_ROM_01_OpponentStateA[pABC].push(1)
                : nStateObj.State_Magneto_ROM_01_OpponentStateA[pABC].push(0);
            }
          }
          // 'ROM_02_ChoiceA' (Did Magneto wait before doing a SJ.LK?)
          if (nStateObj.State_Magneto_ROM_02_ChoiceA != undefined) {
            (((pMemObject[`${p1P2_}Knockdown_State`])[pABC][cLen] == 14)
              && ((pMemObject[`${p1P2_}Air_Dash_Count`])[pABC][cLen] == 0)
              && ((pMemObject[`${p1P2_}Y_Position_Arena`])[pABC][cLen] <= 160))
              ? nStateObj.State_Magneto_ROM_02_ChoiceA[pABC].push(1)
              : nStateObj.State_Magneto_ROM_02_ChoiceA[pABC].push(0);
          }
          // ROM_03_InputA
          if (nStateObj.State_Magneto_ROM_03_InputA_LK != undefined) {
            // 'ROM_03_InputA_LK'
            (((pMemObject[`${p1P2_}Normal_Strength`])[pABC][cLen] == 0)
              && ((pMemObject[`${p1P2_}Knockdown_State`])[pABC][cLen] == 20)
              && ((pMemObject[`${p1P2_}PunchKick`])[pABC][cLen] == 1))
              && (pMemObject[`${p1P2_}Attack_Number`])[pABC][cLen] == 15
              && ((pMemObject[`${p1P2_}Air_Dash_Count`])[pABC][cLen] == 0)
              ? nStateObj.State_Magneto_ROM_03_InputA_LK[pABC].push(1)
              : nStateObj.State_Magneto_ROM_03_InputA_LK[pABC].push(0);
          }
          // 'ROM_03_InputA_MK'
          if (nStateObj.State_Magneto_ROM_03_InputA_MK != undefined) {
            (((pMemObject[`${p1P2_}Normal_Strength`])[pABC][cLen] == 1)
              && ((pMemObject[`${p1P2_}Knockdown_State`])[pABC][cLen] == 20)
              && ((pMemObject[`${p1P2_}PunchKick`])[pABC][cLen] == 1))
              && ((pMemObject[`${p1P2_}Attack_Number`])[pABC][cLen] == 16)
              && (pMemObject[`${p1P2_}Air_Dash_Count`])[pABC][cLen] == 0
              ? nStateObj.State_Magneto_ROM_03_InputA_MK[pABC].push(1)
              : nStateObj.State_Magneto_ROM_03_InputA_MK[pABC].push(0);
          }
          // 'ROM_04_ChoiceB' (Did Magneto wait before doing a SJ.MK after a SJ.LK?)
          if (nStateObj.State_Magneto_ROM_04_ChoiceB != undefined) {
            (((pMemObject[`${p1P2_}Normal_Strength`])[pABC][cLen] == 0)
              && ((pMemObject[`${p1P2_}Knockdown_State`])[pABC][cLen] == 20)
              && ((pMemObject[`${p1P2_}PunchKick`])[pABC][cLen] == 1))
              && (pMemObject[`${p1P2_}Attack_Number`])[pABC][cLen] == 15
              && ((pMemObject[`${p1P2_}Air_Dash_Count`])[pABC][cLen] == 0)
              ? nStateObj.State_Magneto_ROM_04_ChoiceB[pABC].push(1)
              : nStateObj.State_Magneto_ROM_04_ChoiceB[pABC].push(0);
          }
          // 'ROM_05_ChoiceC' (Did Magneto wait before doing AirDashing after a SJ.LK?)
          if (nStateObj.State_Magneto_ROM_05_ChoiceC != undefined) {
            (((pMemObject[`${p1P2_}Normal_Strength`])[pABC][cLen] == 0)
              && ((pMemObject[`${p1P2_}Knockdown_State`])[pABC][cLen] == 20)
              && ((pMemObject[`${p1P2_}PunchKick`])[pABC][cLen] == 1))
              && (pMemObject[`${p1P2_}Attack_Number`])[pABC][cLen] == 15
              && ((pMemObject[`${p1P2_}Air_Dash_Count`])[pABC][cLen] == 0)
              ? nStateObj.State_Magneto_ROM_05_ChoiceC[pABC].push(1)
              : nStateObj.State_Magneto_ROM_05_ChoiceC[pABC].push(0);
          }
          // 'ROM_05_ChoiceD' (Did Magneto wait before doing AirDashing after a SJ.MK?)
          if (nStateObj.State_Magneto_ROM_05_ChoiceD != undefined) {
            (((pMemObject[`${p1P2_}Normal_Strength`])[pABC][cLen] == 1)
              && ((pMemObject[`${p1P2_}Knockdown_State`])[pABC][cLen] == 20)
              && ((pMemObject[`${p1P2_}PunchKick`])[pABC][cLen] == 1))
              && (pMemObject[`${p1P2_}Attack_Number`])[pABC][cLen] == 16
              && ((pMemObject[`${p1P2_}Air_Dash_Count`])[pABC][cLen] == 0)
              ? nStateObj.State_Magneto_ROM_05_ChoiceD[pABC].push(1)
              : nStateObj.State_Magneto_ROM_05_ChoiceD[pABC].push(0);
          }
          // 'ROM_06_InputB_AirDash'
          if (nStateObj.State_Magneto_ROM_06_InputB_AirDash != undefined) {
            ((pMemObject[`${p1P2_}Air_Dash_Count`])[pABC][cLen] == 1)
              ? nStateObj.State_Magneto_ROM_06_InputB_AirDash[pABC].push(1)
              : nStateObj.State_Magneto_ROM_06_InputB_AirDash[pABC].push(0);
          }
          // 'ROM_07_ChoiceE' (Did Magneto wait after AirDashing before doing a SJ.DLK?)
          if (nStateObj.State_Magneto_ROM_07_ChoiceE != undefined) {
            ((pMemObject[`${p1P2_}Knockdown_State`])[pABC][cLen] == 26) // Magneto is Air Dash
              ? nStateObj.State_Magneto_ROM_07_ChoiceE[pABC].push(1)
              : nStateObj.State_Magneto_ROM_07_ChoiceE[pABC].push(0);
          }
          // 'ROM_08_InputC_DLK'
          if (nStateObj.State_Magneto_ROM_08_InputC_DLK != undefined) {
            (((pMemObject[`${p1P2_}Normal_Strength`])[pABC][cLen] == 0)
              && ((pMemObject[`${p1P2_}Knockdown_State`])[pABC][cLen] == 20)
              && ((pMemObject[`${p1P2_}PunchKick`])[pABC][cLen] == 1))
              && ((pMemObject[`${p1P2_}Attack_Number`])[pABC][cLen] == 18)
              && (pMemObject[`${p1P2_}Air_Dash_Count`])[pABC][cLen] == 1
              ? nStateObj.State_Magneto_ROM_08_InputC_DLK[pABC].push(1)
              : nStateObj.State_Magneto_ROM_08_InputC_DLK[pABC].push(0);
          }
          // 'ROM_08_InputC_MK'
          if (nStateObj.State_Magneto_ROM_08_InputC_MK != undefined) {
            (((pMemObject[`${p1P2_}Normal_Strength`])[pABC][cLen] == 1)
              && ((pMemObject[`${p1P2_}Knockdown_State`])[pABC][cLen] == 20)
              && ((pMemObject[`${p1P2_}PunchKick`])[pABC][cLen] == 1))
              && ((pMemObject[`${p1P2_}Attack_Number`])[pABC][cLen] == 16)
              && (pMemObject[`${p1P2_}Air_Dash_Count`])[pABC][cLen] == 1
              ? nStateObj.State_Magneto_ROM_08_InputC_MK[pABC].push(1)
              : nStateObj.State_Magneto_ROM_08_InputC_MK[pABC].push(0);
          }
          // 'ROM_09_ChoiceF' (Did Magneto wait before doing a SJ.MK after a SJ.DLK?)
          if (nStateObj.State_Magneto_ROM_09_ChoiceF != undefined) {
            (((pMemObject[`${p1P2_}Normal_Strength`])[pABC][cLen] == 0) // Weak
              && ((pMemObject[`${p1P2_}Knockdown_State`])[pABC][cLen] == 20) // Normal Attacks
              && ((pMemObject[`${p1P2_}PunchKick`])[pABC][cLen] == 1))  // Medium
              && (pMemObject[`${p1P2_}Attack_Number`])[pABC][cLen] == 18 // DLK
              && ((pMemObject[`${p1P2_}Air_Dash_Count`])[pABC][cLen] == 1) // Air Dash = true
              ? nStateObj.State_Magneto_ROM_09_ChoiceF[pABC].push(1)
              : nStateObj.State_Magneto_ROM_09_ChoiceF[pABC].push(0);
          }

          // Magneto MoveList
          if (nStateObj.State_Magneto_Moves != undefined) {
            // Normals
            if (((pMemObject[`${p1P2_}Attack_Number`])[pABC][cLen] == 0)
              && ((pMemObject[`${p1P2_}Knockdown_State`])[pABC][cLen] == 20)) {
              nStateObj.State_Magneto_Moves[pABC].push('S.LP')
            } else if (((pMemObject[`${p1P2_}Attack_Number`])[pABC][cLen] == 1)
              && ((pMemObject[`${p1P2_}Knockdown_State`])[pABC][cLen] == 20)) {
              nStateObj.State_Magneto_Moves[pABC].push('S.MP')
            } else if (((pMemObject[`${p1P2_}Attack_Number`])[pABC][cLen] == 2)
              && ((pMemObject[`${p1P2_}Knockdown_State`])[pABC][cLen] == 20)) {
              nStateObj.State_Magneto_Moves[pABC].push('S.HP')
            } else if (((pMemObject[`${p1P2_}Attack_Number`])[pABC][cLen] == 3)
              && ((pMemObject[`${p1P2_}Knockdown_State`])[pABC][cLen] == 20)) {
              nStateObj.State_Magneto_Moves[pABC].push('S.LK')
            } else if (((pMemObject[`${p1P2_}Attack_Number`])[pABC][cLen] == 4)
              && ((pMemObject[`${p1P2_}Knockdown_State`])[pABC][cLen] == 20)) {
              nStateObj.State_Magneto_Moves[pABC].push('S.MK')
            } else if (((pMemObject[`${p1P2_}Attack_Number`])[pABC][cLen] == 5)
              && ((pMemObject[`${p1P2_}Knockdown_State`])[pABC][cLen] == 20)) {
              nStateObj.State_Magneto_Moves[pABC].push('S.HK(1)')
            } else if (((pMemObject[`${p1P2_}Attack_Number`])[pABC][cLen] == 25)
              && ((pMemObject[`${p1P2_}Knockdown_State`])[pABC][cLen] == 20)) {
              nStateObj.State_Magneto_Moves[pABC].push('S.HK (2)')
            } else if (((pMemObject[`${p1P2_}Attack_Number`])[pABC][cLen] == 6)
              && ((pMemObject[`${p1P2_}Knockdown_State`])[pABC][cLen] == 20)) {
              nStateObj.State_Magneto_Moves[pABC].push('C.LP')
            } else if (((pMemObject[`${p1P2_}Attack_Number`])[pABC][cLen] == 7)
              && ((pMemObject[`${p1P2_}Knockdown_State`])[pABC][cLen] == 20)) {
              nStateObj.State_Magneto_Moves[pABC].push('C.MP')
            } else if (((pMemObject[`${p1P2_}Attack_Number`])[pABC][cLen] == 8)
              && ((pMemObject[`${p1P2_}Knockdown_State`])[pABC][cLen] == 20)) {
              nStateObj.State_Magneto_Moves[pABC].push('C.HP')
            } else if (((pMemObject[`${p1P2_}Attack_Number`])[pABC][cLen] == 9)
              && ((pMemObject[`${p1P2_}Knockdown_State`])[pABC][cLen] == 20)) {
              nStateObj.State_Magneto_Moves[pABC].push('C.LK')
            } else if (((pMemObject[`${p1P2_}Attack_Number`])[pABC][cLen] == 10)
              && ((pMemObject[`${p1P2_}Knockdown_State`])[pABC][cLen] == 20)) {
              nStateObj.State_Magneto_Moves[pABC].push('C.MK')
            } else if (((pMemObject[`${p1P2_}Attack_Number`])[pABC][cLen] == 11)
              && ((pMemObject[`${p1P2_}Knockdown_State`])[pABC][cLen] == 20)) {
              nStateObj.State_Magneto_Moves[pABC].push('C.HK')
            } else if (((pMemObject[`${p1P2_}Attack_Number`])[pABC][cLen] == 12)
              && ((pMemObject[`${p1P2_}Knockdown_State`])[pABC][cLen] == 20)) {
              nStateObj.State_Magneto_Moves[pABC].push('J.LP')
            } else if (((pMemObject[`${p1P2_}Attack_Number`])[pABC][cLen] == 13)
              && ((pMemObject[`${p1P2_}Knockdown_State`])[pABC][cLen] == 20)) {
              nStateObj.State_Magneto_Moves[pABC].push('J.MP')
            } else if (((pMemObject[`${p1P2_}Attack_Number`])[pABC][cLen] == 14)
              && ((pMemObject[`${p1P2_}Knockdown_State`])[pABC][cLen] == 20)) {
              nStateObj.State_Magneto_Moves[pABC].push('J.HP')
            } else if (((pMemObject[`${p1P2_}Attack_Number`])[pABC][cLen] == 15)
              && ((pMemObject[`${p1P2_}Knockdown_State`])[pABC][cLen] == 20)) {
              nStateObj.State_Magneto_Moves[pABC].push('J.LK')
            } else if (((pMemObject[`${p1P2_}Attack_Number`])[pABC][cLen] == 16)
              && ((pMemObject[`${p1P2_}Knockdown_State`])[pABC][cLen] == 20)) {
              nStateObj.State_Magneto_Moves[pABC].push('J.MK')
            } else if (((pMemObject[`${p1P2_}Attack_Number`])[pABC][cLen] == 17)
              && ((pMemObject[`${p1P2_}Knockdown_State`])[pABC][cLen] == 20)) {
              nStateObj.State_Magneto_Moves[pABC].push('J.HK')
            } else if (((pMemObject[`${p1P2_}Attack_Number`])[pABC][cLen] == 18)
              && ((pMemObject[`${p1P2_}Knockdown_State`])[pABC][cLen] == 20)) {
              nStateObj.State_Magneto_Moves[pABC].push('J.D+LK')
            } else if (((pMemObject[`${p1P2_}Attack_Number`])[pABC][cLen] == 65)
              && ((pMemObject[`${p1P2_}Knockdown_State`])[pABC][cLen] == 34)) {
              nStateObj.State_Magneto_Moves[pABC].push('OC Launcher')
              // Throws
            } else if (((pMemObject[`${p1P2_}Airborne`])[pABC][cLen] == 0)
              && ((pMemObject[`${p1P2_}Knockdown_State`])[pABC][cLen] == 30)
              && ((pMemObject[`${p1P2_}Is_Prox_Block`])[pABC][cLen] == 15)
              && ((pMemObject[`${p1P2_}PunchKick`])[pABC][cLen] == 0)) {
              nStateObj.State_Magneto_Moves[pABC].push('Ground Throw (HP)')
            } else if (((pMemObject[`${p1P2_}Airborne`])[pABC][cLen] == 0)
              && ((pMemObject[`${p1P2_}Knockdown_State`])[pABC][cLen] == 30)
              && ((pMemObject[`${p1P2_}Is_Prox_Block`])[pABC][cLen] == 15)
              && ((pMemObject[`${p1P2_}PunchKick`])[pABC][cLen] == 1)) {
              nStateObj.State_Magneto_Moves[pABC].push('Ground Throw (HK)')
            } else if (((pMemObject[`${p1P2_}Airborne`])[pABC][cLen] == 2)
              && ((pMemObject[`${p1P2_}Knockdown_State`])[pABC][cLen] == 30)
              && ((pMemObject[`${p1P2_}Is_Prox_Block`])[pABC][cLen] == 15)
              && ((pMemObject[`${p1P2_}PunchKick`])[pABC][cLen] == 0)) {
              nStateObj.State_Magneto_Moves[pABC].push('Air Throw (HP)')
            } else if (((pMemObject[`${p1P2_}Airborne`])[pABC][cLen] == 2)
              && ((pMemObject[`${p1P2_}Knockdown_State`])[pABC][cLen] == 30)
              && ((pMemObject[`${p1P2_}Is_Prox_Block`])[pABC][cLen] == 15)
              && ((pMemObject[`${p1P2_}PunchKick`])[pABC][cLen] == 1)) {
              nStateObj.State_Magneto_Moves[pABC].push('Air Throw (HK)')
              // Specials
              // E.M. Disruptor
            } else if (((pMemObject[`${p1P2_}Attack_Number`])[pABC][cLen] == 48)
              && ((pMemObject[`${p1P2_}Knockdown_State`])[pABC][cLen] == 21)) {
              nStateObj.State_Magneto_Moves[pABC].push('E.M. Disruptor (LP)')
            } else if (((pMemObject[`${p1P2_}Attack_Number`])[pABC][cLen] == 50)
              && ((pMemObject[`${p1P2_}Knockdown_State`])[pABC][cLen] == 21)) {
              nStateObj.State_Magneto_Moves[pABC].push('E.M. Disruptor (HP)')
              // Magnetic Blast
            } else if (((pMemObject[`${p1P2_}Attack_Number`])[pABC][cLen] == 54)
              && ((pMemObject[`${p1P2_}Knockdown_State`])[pABC][cLen] == 21)
              && ((pMemObject[`${p1P2_}Special_Strength`])[pABC][cLen] == 0)
              && ((pMemObject[`${p1P2_}Special_Attack_ID`])[pABC][cLen] == 7)) {
              nStateObj.State_Magneto_Moves[pABC].push('Magnetic Blast (LP)')
            } else if (((pMemObject[`${p1P2_}Attack_Number`])[pABC][cLen] == 54)
              && ((pMemObject[`${p1P2_}Knockdown_State`])[pABC][cLen] == 21)
              && ((pMemObject[`${p1P2_}Special_Strength`])[pABC][cLen] == 1)
              && ((pMemObject[`${p1P2_}Special_Attack_ID`])[pABC][cLen] == 7)) {
              nStateObj.State_Magneto_Moves[pABC].push('Magnetic Blast (HP)')
              // Forcefield
            } else if (((pMemObject[`${p1P2_}Special_Attack_ID`])[pABC][cLen] == 8)
              && ((pMemObject[`${p1P2_}Knockdown_State`])[pABC][cLen] == 21)
              && ((pMemObject[`${p1P2_}Special_Strength`])[pABC][cLen] == 0)) {
              nStateObj.State_Magneto_Moves[pABC].push('Forcefield (LK)')
            } else if (((pMemObject[`${p1P2_}Special_Attack_ID`])[pABC][cLen] == 8)
              && ((pMemObject[`${p1P2_}Knockdown_State`])[pABC][cLen] == 21)
              && ((pMemObject[`${p1P2_}Special_Strength`])[pABC][cLen] == 1)) {
              nStateObj.State_Magneto_Moves[pABC].push('Forcefield (HK)')
              // Hyper-Grav
            } else if ((pMemObject[`${p1P2_}Attack_Number`][pABC][cLen] == 51)
              && ((pMemObject[`${p1P2_}Special_Attack_ID`])[pABC][cLen] == 1)
              && ((pMemObject[`${p1P2_}Knockdown_State`])[pABC][cLen] == 21)
              && ((pMemObject[`${p1P2_}Special_Strength`])[pABC][cLen] == 0)) {
              nStateObj.State_Magneto_Moves[pABC].push('Hyper-Grav (LK)')
            } else if ((pMemObject[`${p1P2_}Attack_Number`][pABC][cLen] == 51)
              && ((pMemObject[`${p1P2_}Special_Attack_ID`])[pABC][cLen] == 1)
              && ((pMemObject[`${p1P2_}Knockdown_State`])[pABC][cLen] == 21)
              && ((pMemObject[`${p1P2_}Special_Strength`])[pABC][cLen] == 1)) {
              nStateObj.State_Magneto_Moves[pABC].push('Hyper-Grav (HK)')
              // Tag-In
            } else if ((pMemObject[`${p1P2_}Attack_Number`][pABC][cLen] == 61)
              && ((pMemObject[`${p1P2_}Knockdown_State`])[pABC][cLen] == 21)) {
              nStateObj.State_Magneto_Moves[pABC].push('Tag-In')
              // Snapback
            } else if ((pMemObject[`${p1P2_}Attack_Number`][pABC][cLen] == 63)
              && ((pMemObject[`${p1P2_}Knockdown_State`])[pABC][cLen] == 29)) {
              nStateObj.State_Magneto_Moves[pABC].push('Snapback')
              // Flight-Startup
            } else if ((pMemObject[`${p1P2_}Special_Attack_ID`][pABC][cLen] == 4)
              && ((pMemObject[`${p1P2_}Flight_Flag`])[pABC][cLen] == 255)
              && ((pMemObject[`${p1P2_}Knockdown_State`])[pABC][cLen] == 21)) {
              nStateObj.State_Magneto_Moves[pABC].push('Flight-Start')
              // Flight_Active
              // } else if ((pMemObject[`${p1P2_}Flight_Flag`])[pABC][cLen] == 255) {
              //   nStateObj.State_Magneto_Moves[pABC].push('Flight_Active')
              // Taunt
            } else if ((pMemObject[`${p1P2_}Special_Attack_ID`][pABC][cLen] == 6)
              && ((pMemObject[`${p1P2_}Is_Prox_Block`])[pABC][cLen] == 19)
              && ((pMemObject[`${p1P2_}Knockdown_State`])[pABC][cLen] == 21)) {
              nStateObj.State_Magneto_Moves[pABC].push('Taunt')
              // Supers
              // Shockwave
            } else if ((pMemObject[`${p1P2_}Attack_Number`][pABC][cLen] == 52)
              && ((pMemObject[`${p1P2_}Knockdown_State`])[pABC][cLen] == 29)) {
              nStateObj.State_Magneto_Moves[pABC].push('Shockwave')
              // Tempest
            } else if ((pMemObject[`${p1P2_}Attack_Number`][pABC][cLen] == 53)
              && ((pMemObject[`${p1P2_}Knockdown_State`])[pABC][cLen] == 29)) {
              nStateObj.State_Magneto_Moves[pABC].push('Tempest')
              // ELSE NOTHING
            } else {
              nStateObj.State_Magneto_Moves[pABC].push('')
            }
          }

          // STORM ONLY STATES:
          if (pMemObject[`${p1P2_}ID_2`][pABC][cLen] == 42) {
            // StormMD; uses P1 and P2 sections
            if (pI == 1) {
              // "Storm_ModifiedAirDashNJ"
              if (nStateObj.State_Storm_ModifiedAirDashNJ != undefined) {
                (
                  ((pMemObject[`${p1P2_}ID_2`])[pABC][cLen] == 42) // Storm
                  && ((pMemObject[`${p1P2_}Hitstop2`])[pABC][cLen] == 0) // No Hitstop
                  && ((pMemObject[`${p1P2_}Unfly`])[pABC][cLen] == 16)
                  || ((pMemObject[`${p1P2_}Unfly`])[pABC][cLen] == 1)
                  && ((pMemObject[`${p1P2_}Normal_Location`])[pABC][cLen] == 1) //Normal was done in the air
                  && ((pMemObject[`${p1P2_}Air_Dash_Count`])[pABC][cLen] == 1) // Air Dash was done once
                  && ((pMemObject[`${p1P2_}Knockdown_State`])[pABC][cLen] == 20) // Normal Attacks
                  && (playerOneInputs[cLen].match(/7|8|9/g)) // Up dirs
                )
                  ? nStateObj.State_Storm_ModifiedAirDashNJ[pABC].push(1)
                  : nStateObj.State_Storm_ModifiedAirDashNJ[pABC].push(0);
              }
              // "Storm_ModifiedAirDashSJ"
              if (nStateObj.State_Storm_ModifiedAirDashSJ != undefined) {
                (
                  ((pMemObject[`${p1P2_}ID_2`])[pABC][cLen] == 42) // Storm
                  && ((pMemObject[`${p1P2_}Hitstop2`])[pABC][cLen] == 0) // No Hitstop
                  && ((pMemObject[`${p1P2_}SJ_Counter`])[pABC][cLen] > 0) // In SJ up or down
                  && ((pMemObject[`${p1P2_}Normal_Location`])[pABC][cLen] == 2) // Normal was done in the air
                  && ((pMemObject[`${p1P2_}Air_Dash_Count`])[pABC][cLen] == 1) // Air Dash was done once
                  && ((pMemObject[`${p1P2_}Knockdown_State`])[pABC][cLen] == 20) // Normal Attacks
                  && (playerOneInputs[cLen].match(/7|8|9/g)) // Up dirs
                )
                  ? nStateObj.State_Storm_ModifiedAirDashSJ[pABC].push(1)
                  : nStateObj.State_Storm_ModifiedAirDashSJ[pABC].push(0);
              }
              // "Storm_DI"
              if (nStateObj.State_Storm_DI != undefined) {
                (
                  ((pMemObject[`${p1P2_}ID_2`])[pABC][cLen] == 42) // Storm
                  && ((pMemObject[`${p1P2_}Hitstop2`])[pABC][cLen] == 0) // No Hitstop
                  && ((pMemObject[`${p1P2_}Airborne`])[pABC][cLen] == 2) // actually in the air
                  && ((pMemObject[`${p1P2_}Knockdown_State`])[pABC][cLen] != 32) // "Stunned"
                  && ((pMemObject[`${p1P2_}Knockdown_State`])[pABC][cLen] != 26) // "Air Dash"
                  && ((pMemObject[`${p1P2_}Knockdown_State`])[pABC][cLen] != 19) // "Air Blocking"
                  && ((pMemObject[`${p1P2_}Knockdown_State`])[pABC][cLen] != 21) // "Special Attacks"
                  && ((pMemObject[`${p1P2_}Knockdown_State`])[pABC][cLen] != 29) // "Freezes and Flash"
                  && (playerOneInputs[cLen].match(/1|4|7|9|6|3/g)) // L/R dirs
                )
                  ? nStateObj.State_Storm_DI[pABC].push(1)
                  : nStateObj.State_Storm_DI[pABC].push(0);
              }
              // "Storm_Float"
              if (nStateObj.State_Storm_Float != undefined) {
                (
                  ((pMemObject[`${p1P2_}ID_2`])[pABC][cLen] == 42) // Storm
                  && ((pMemObject[`${p1P2_}Hitstop2`])[pABC][cLen] == 0) // No Hitstop
                  && ((pMemObject[`${p1P2_}Airborne`])[pABC][cLen] == 2) // Actually in the air
                  && ((pMemObject[`${p1P2_}Knockdown_State`][pABC][cLen] != 32)) // "Stunned"
                  && ((pMemObject[`${p1P2_}Knockdown_State`])[pABC][cLen] != 26) // "Air Dash"
                  && ((pMemObject[`${p1P2_}Knockdown_State`])[pABC][cLen] != 19) // "Air Blocking"
                  && ((pMemObject[`${p1P2_}Knockdown_State`])[pABC][cLen] != 21) // "Special Attacks"
                  && ((pMemObject[`${p1P2_}Knockdown_State`])[pABC][cLen] != 29) // "Freezes and Flash"
                  && (playerOneInputs[cLen].match(/7|8|9/g)) // Up dirs
                )
                  ? nStateObj.State_Storm_Float[pABC].push(1)
                  : nStateObj.State_Storm_Float[pABC].push(0);
              }
            }
            else {
              // "Storm_ModifiedAirDashNJ"
              if (nStateObj.State_Storm_ModifiedAirDashNJ != undefined) {
                (
                  ((pMemObject[`${p1P2_}ID_2`])[pABC][cLen] == 42) // Storm
                  && ((pMemObject[`${p1P2_}Hitstop2`])[pABC][cLen] == 0) // No Hitstop
                  && ((pMemObject[`${p1P2_}Unfly`])[pABC][cLen] == 16)
                  || ((pMemObject[`${p1P2_}Unfly`])[pABC][cLen] == 1)
                  && ((pMemObject[`${p1P2_}Normal_Location`])[pABC][cLen] == 1)
                  && ((pMemObject[`${p1P2_}Air_Dash_Count`])[pABC][cLen] == 1)
                  && ((pMemObject[`${p1P2_}Knockdown_State`])[pABC][cLen] == 20)
                  && (playerTwoInputs[cLen].match(/7|8|9/g))
                )
                  ? nStateObj.State_Storm_ModifiedAirDashNJ[pABC].push(1)
                  : nStateObj.State_Storm_ModifiedAirDashNJ[pABC].push(0);
              }
              // "Storm_ModifiedAirDashSJ"
              if (nStateObj.State_Storm_ModifiedAirDashSJ != undefined) {
                (
                  ((pMemObject[`${p1P2_}ID_2`])[pABC][cLen] == 42) // Storm
                  && ((pMemObject[`${p1P2_}Hitstop2`])[pABC][cLen] == 0) // No Hitstop
                  && ((pMemObject[`${p1P2_}SJ_Counter`])[pABC][cLen] > 0)
                  && ((pMemObject[`${p1P2_}Normal_Location`])[pABC][cLen] == 2)
                  && ((pMemObject[`${p1P2_}Air_Dash_Count`])[pABC][cLen] == 1)
                  && ((pMemObject[`${p1P2_}Knockdown_State`])[pABC][cLen] == 20)
                  && (playerTwoInputs[cLen].match(/7|8|9/g))
                )
                  ? nStateObj.State_Storm_ModifiedAirDashSJ[pABC].push(1)
                  : nStateObj.State_Storm_ModifiedAirDashSJ[pABC].push(0);
              }
              // "Storm_DI"
              if (nStateObj.State_Storm_DI != undefined) {
                (
                  ((pMemObject[`${p1P2_}ID_2`])[pABC][cLen] == 42) // Storm
                  && ((pMemObject[`${p1P2_}Hitstop2`])[pABC][cLen] == 0) // No Hitstop
                  && ((pMemObject[`${p1P2_}Airborne`])[pABC][cLen] == 2) // actually in the air
                  && ((pMemObject[`${p1P2_}Knockdown_State`][pABC][cLen] != 32)) // "Stunned"
                  && ((pMemObject[`${p1P2_}Knockdown_State`])[pABC][cLen] != 26) // "Air Dash"
                  && ((pMemObject[`${p1P2_}Knockdown_State`])[pABC][cLen] != 19) // "Air Blocking"
                  && ((pMemObject[`${p1P2_}Knockdown_State`])[pABC][cLen] != 21) // "Special Attacks"
                  && ((pMemObject[`${p1P2_}Knockdown_State`])[pABC][cLen] != 29) // "Freezes and Flash"
                  && (playerTwoInputs[cLen].match(/1|4|7|9|6|3/g))
                )
                  ? nStateObj.State_Storm_DI[pABC].push(1)
                  : nStateObj.State_Storm_DI[pABC].push(0);
              }
              // "Storm_Float"
              if (nStateObj.State_Storm_Float != undefined) {
                (
                  ((pMemObject[`${p1P2_}ID_2`])[pABC][cLen] == 42) // Storm
                  && ((pMemObject[`${p1P2_}Hitstop2`])[pABC][cLen] == 0) // No Hitstop
                  && ((pMemObject[`${p1P2_}Airborne`])[pABC][cLen] == 2) // actually in the air
                  && ((pMemObject[`${p1P2_}Knockdown_State`])[pABC][cLen] != 32) // "Stunned"
                  && ((pMemObject[`${p1P2_}Knockdown_State`])[pABC][cLen] != 26) // "Air Dash"
                  && ((pMemObject[`${p1P2_}Knockdown_State`])[pABC][cLen] != 19) // "Air Blocking"
                  && ((pMemObject[`${p1P2_}Knockdown_State`])[pABC][cLen] != 21) // "Special Attacks"
                  && ((pMemObject[`${p1P2_}Knockdown_State`])[pABC][cLen] != 29) // "Freezes and Flash"
                  && (playerTwoInputs[cLen].match(/7|8|9/g))
                )
                  ? nStateObj.State_Storm_Float[pABC].push(1)
                  : nStateObj.State_Storm_Float[pABC].push(0);
              }
            }
          }

          // UNIVERSAL STATES:
          // Being Hit
          if (nStateObj.State_Being_Hit != undefined) {
            (
              ((pMemObject[`${p1P2_}Knockdown_State`])[pABC][cLen] == 32)
              && ((pMemObject[`${p1P2_}Hitstop2`])[pABC][cLen] > 0)
            )
              ? nStateObj.State_Being_Hit[pABC].push(1)
              : nStateObj.State_Being_Hit[pABC].push(0);
          }
          // "Flying_Screen_Air"
          if (nStateObj.State_Flying_Screen_Air != undefined) {
            (
              ((pMemObject[`${p1P2_}FlyingScreen`])[pABC][cLen] == 1)
              && ((pMemObject[`${p1P2_}Knockdown_State`])[pABC][cLen] == 32)
              && ((pMemObject[`${p1P2_}Airborne`])[pABC][cLen] == 2)
            )
              ? nStateObj.State_Flying_Screen_Air[pABC].push(1)
              : nStateObj.State_Flying_Screen_Air[pABC].push(0);
          }
          // "Flying_Screen_OTG"
          if (nStateObj.State_Flying_Screen_OTG) {
            (
              ((pMemObject[`${p1P2_}FlyingScreen`])[pABC][cLen] == 1)
              && ((pMemObject[`${p1P2_}Knockdown_State`])[pABC][cLen] == 32)
              && ((pMemObject[`${p1P2_}Airborne`])[pABC][cLen] == 3)
            )
              ? nStateObj.State_Flying_Screen_OTG[pABC].push(1)
              : nStateObj.State_Flying_Screen_OTG[pABC].push(0);
          }
          // "FS_Install_1"
          if (nStateObj.State_FS_Install_1) {
            (
              ((pMemObject[`${p1P2_}FSI_Points`])[pABC][cLen] == 8)
              || ((pMemObject[`${p1P2_}FSI_Points`])[pABC][cLen] == 9)
            )
              ? nStateObj.State_FS_Install_1[pABC].push(1)
              : nStateObj.State_FS_Install_1[pABC].push(0);
          }
          // "FS_Install_2"
          if (nStateObj.State_FS_Install_2) {
            (
              ((pMemObject[`${p1P2_}FSI_Points`])[pABC][cLen] > 9)
            )
              ? nStateObj.State_FS_Install_2[pABC].push(1)
              : nStateObj.State_FS_Install_2[pABC].push(0);
          }
          // "NJ_Air"
          if (nStateObj.State_NJ_Air) {
            (
              ((pMemObject[`${p1P2_}Airborne`])[pABC][cLen] == 2)
              && ((pMemObject[`${p1P2_}Knockdown_State`])[pABC][cLen] == 3)
              && ((pMemObject[`${p1P2_}SJ_Counter`])[pABC][cLen] == 0)
            )
              ? nStateObj.State_NJ_Air[pABC].push(1)
              : nStateObj.State_NJ_Air[pABC].push(0);
          }
          // "NJ_Rising
          if (nStateObj.State_NJ_Rising) {
            (
              ((pMemObject[`${p1P2_}Airborne`])[pABC][cLen] == 0)
              && ((pMemObject[`${p1P2_}Knockdown_State`])[pABC][cLen] == 2)
              && ((pMemObject[`${p1P2_}SJ_Counter`])[pABC][cLen] == 0)
            )
              ? nStateObj.State_NJ_Rising[pABC].push(1)
              : nStateObj.State_NJ_Rising[pABC].push(0);
          }
          // "OTG_Extra_Stun"
          if (nStateObj.State_OTG_Extra_Stun) {
            (
              ((pMemObject[`${p1P2_}Knockdown_State`])[pABC][cLen] == 23)
              && (((pMemObject[`${p1P2_}Airborne`])[pABC][cLen] == 3))
            )
              ? nStateObj.State_OTG_Extra_Stun[pABC].push(1)
              : nStateObj.State_OTG_Extra_Stun[pABC].push(0);

          }
          // "OTG_Forced_Stun"
          if (nStateObj.State_OTG_Forced_Stun) {
            (
              ((pMemObject[`${p1P2_}Knockdown_State`])[pABC][cLen] == 32)
              && (((pMemObject[`${p1P2_}Airborne`])[pABC][cLen] == 3))
            )
              ? nStateObj.State_OTG_Forced_Stun[pABC].push(1)
              : nStateObj.State_OTG_Forced_Stun[pABC].push(0);
          }
          // "OTG_Hit"
          if (nStateObj.State_OTG_Hit) {
            (
              ((pMemObject[`${p1P2_}Action_Flags`])[pABC][cLen] == 0)
              && ((pMemObject[`${p1P2_}Airborne`])[pABC][cLen] == 3)
              && (((pMemObject[`${p1P2_}Knockdown_State`])[pABC][cLen] == 32))
            )
              ? nStateObj.State_OTG_Hit[pABC].push(1)
              : nStateObj.State_OTG_Hit[pABC].push(0);
          }
          // "OTG_Roll_Invincible"
          if (nStateObj.State_OTG_Roll_Invincible) {
            (
              ((pMemObject[`${p1P2_}Action_Flags`])[pABC][cLen] == 2)
              && ((pMemObject[`${p1P2_}Airborne`])[pABC][cLen] == 1)
              && (((pMemObject[`${p1P2_}Attack_Immune`])[pABC][cLen] == 1)
                && ((pMemObject[`${p1P2_}Knockdown_State`])[pABC][cLen] == 17))
            )
              ? nStateObj.State_OTG_Roll_Invincible[pABC].push(1)
              : nStateObj.State_OTG_Roll_Invincible[pABC].push(0);

          }
          // "OTG_Roll_Stunned"
          if (nStateObj.State_OTG_Roll_Stunned) {
            (
              ((pMemObject[`${p1P2_}Action_Flags`])[pABC][cLen] == 1)
              && ((pMemObject[`${p1P2_}Airborne`])[pABC][cLen] == 3)
              && (((pMemObject[`${p1P2_}Knockdown_State`])[pABC][cLen] == 32))
            )
              ? nStateObj.State_OTG_Roll_Stunned[pABC].push(1)
              : nStateObj.State_OTG_Roll_Stunned[pABC].push(0);
            // "ProxBlock_Air"
            (
              ((pMemObject[`${p1P2_}Is_Prox_Block`])[pABC][cLen] == 6)
              && ((pMemObject[`${p1P2_}Knockdown_State`])[pABC][cLen] == 19)
            )
              ? nStateObj.State_ProxBlock_Air[pABC].push(1)
              : nStateObj.State_ProxBlock_Air[pABC].push(0);
          }
          // "ProxBlock_Ground"
          if (nStateObj.State_ProxBlock_Ground) {
            (
              ((pMemObject[`${p1P2_}Is_Prox_Block`])[pABC][cLen] == 5)
              && ((pMemObject[`${p1P2_}Knockdown_State`])[pABC][cLen] == 18)
            )
              ? nStateObj.State_ProxBlock_Ground[pABC].push(1)
              : nStateObj.State_ProxBlock_Ground[pABC].push(0);
          }
          // "Pushblock_Air"
          if (nStateObj.State_Pushblock_Air) {
            (
              ((pMemObject[`${p1P2_}Block_Meter`])[pABC][cLen] > 0)
              && ((pMemObject[`${p1P2_}Animation_Timer_Main`])[pABC][cLen] < 28)
              && ((pMemObject[`${p1P2_}Is_Prox_Block`])[pABC][cLen] == 6)
              && ((pMemObject[`${p1P2_}Action_Flags`])[pABC][cLen] == 2)
            )
              ? nStateObj.State_Pushblock_Air[pABC].push(1)
              : nStateObj.State_Pushblock_Air[pABC].push(0);
          }
          // "Pushblock_Ground"
          if (nStateObj.State_Pushblock_Ground) {
            (
              ((pMemObject[`${p1P2_}Block_Meter`])[pABC][cLen] > 0)
              && ((pMemObject[`${p1P2_}Animation_Timer_Main`])[pABC][cLen] < 28)
              && ((pMemObject[`${p1P2_}Is_Prox_Block`])[pABC][cLen] == 5)
              && (((pMemObject[`${p1P2_}Action_Flags`])[pABC][cLen] == 3))
            )
              ? nStateObj.State_Pushblock_Ground[pABC].push(1)
              : nStateObj.State_Pushblock_Ground[pABC].push(0);
          }
          // "Rising_Invincibility"
          if (nStateObj.State_Rising_Invincibility) {
            (
              ((pMemObject[`${p1P2_}Airborne`])[pABC][cLen] == 0)
              && ((pMemObject[`${p1P2_}Attack_Immune`])[pABC][cLen] == 1)
              && ((pMemObject[`${p1P2_}Knockdown_State`])[pABC][cLen] == 17)
            )
              ? nStateObj.State_Rising_Invincibility[pABC].push(1)
              : nStateObj.State_Rising_Invincibility[pABC].push(0);
          }
          // "SJ_Air"
          if (nStateObj.State_SJ_Air) {
            (
              ((pMemObject[`${p1P2_}Airborne`])[pABC][cLen] == 2)
              && ((pMemObject[`${p1P2_}Knockdown_State`])[pABC][cLen] == 14)
              && ((pMemObject[`${p1P2_}SJ_Counter`])[pABC][cLen] == 1)
            )
              ? nStateObj.State_SJ_Air[pABC].push(1)
              : nStateObj.State_SJ_Air[pABC].push(0);
          }
          // "SJ_Counter"
          if (nStateObj.State_SJ_Counter) {
            (
              ((pMemObject[`${p1P2_}SJ_Counter`])[pABC][cLen] == 2)
            )
              ? nStateObj.State_SJ_Counter[pABC].push(1)
              : nStateObj.State_SJ_Counter[pABC].push(0);
          }
          // "Stun"
          if (nStateObj.State_Stun) {
            (
              ((pMemObject[`${p1P2_}Knockdown_State`])[pABC][cLen] == 32)
              && ((pMemObject[`${p1P2_}Is_Prox_Block`])[pABC][cLen] == 13)
            )
              ? nStateObj.State_Stun[pABC].push(1)
              : nStateObj.State_Stun[pABC].push(0);
          }
          // "Tech_Hit"
          if (nStateObj.State_Tech_Hit) {
            (
              ((pMemObject[`${p1P2_}Knockdown_State`])[pABC][cLen] == 27)
            )
              ? nStateObj.State_Tech_Hit[pABC].push(1)
              : nStateObj.State_Tech_Hit[pABC].push(0);
          }
          // "Thrown_Air"
          if (nStateObj.State_Thrown_Air) {
            (
              ((pMemObject[`${p1P2_}Airborne`])[pABC][cLen] == 2)
              && ((pMemObject[`${p1P2_}Knockdown_State`])[pABC][cLen] == 31)
              && ((pMemObject[`${p1P2_}Is_Prox_Block`])[pABC][cLen] == 16)
            )
              ? nStateObj.State_Thrown_Air[pABC].push(1)
              : nStateObj.State_Thrown_Air[pABC].push(0);
          }
          // "Thrown_Ground"
          if (nStateObj.State_Thrown_Ground) {
            (
              ((pMemObject[`${p1P2_}Airborne`])[pABC][cLen] == 0)
              && ((pMemObject[`${p1P2_}Knockdown_State`])[pABC][cLen] == 31)
              && ((pMemObject[`${p1P2_}Is_Prox_Block`])[pABC][cLen] == 16)
            )
              ? nStateObj.State_Thrown_Ground[pABC].push(1)
              : nStateObj.State_Thrown_Ground[pABC].push(0);
          }
          // "Undizzy"
          if (nStateObj.State_Undizzy) {
            (
              ((pMemObject[`${p1P2_}Attack_Immune`])[pABC][cLen] == 2)
              && ((pMemObject[`${p1P2_}Knockdown_State`])[pABC][cLen] == 32)
              && ((pMemObject[`${p1P2_}Is_Prox_Block`])[pABC][cLen] == 13)
              && ((pMemObject[`${p1P2_}Dizzy`])[pABC][cLen] == 80)
              && ((pMemObject[`${p1P2_}Dizzy_Reset_Timer`])[pABC][cLen] == 60)
            )
              ? nStateObj.State_Undizzy[pABC].push(1)
              : nStateObj.State_Undizzy[pABC].push(0);
          }
          // "NEW_STATE_ADD_NAME_HERE" (its name in comments)
          // NEW_STATE_ADD_HERE
        } // cLen Scope


        // Increase each consecutive "1" by 1.
        // Ex: "1,1,1,1,1" becomes "1,2,3,4,5" until 0 reoccurs.
        var counter = 0;

        for (let newState in Object.entries(nStateObj)) {
          if (Object.keys(nStateObj)[newState] == "State_Magneto_Moves") {
            // console.log("Skipping State_Magneto_Moves");
            continue;
          }
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

        // Start ROM Stuff
        // 01_Opponent State A Setup. Set Loop point for 01_OpponentStateA (Magneto lands from his Super Jump)
        if (nStateObj.State_Magneto_ROM_01_OpponentStateA != undefined) {
          const ROM_OPPONENTSTATES =
            [
              Object.values(nStateObj.State_Magneto_ROM_01_OpponentStateA),
            ];
          // console.log(ROM_OPPONENTSTATES);
          for (let romFile in ROM_OPPONENTSTATES) {
            for (let cLen = 0; cLen < CLIP_LENGTH; cLen++) {
              if ((pMemObject[`${p1P2_}Airborne`])[pABC][cLen] == 0) {
                ROM_OPPONENTSTATES[romFile][pABC][cLen] = 65535;
              }
              else if ((pMemObject[`${p1P2_}Y_Velocity`])[pABC][cLen] == 0) {
                ROM_OPPONENTSTATES[romFile][pABC][cLen] = 65535;
              }
            }
            // for (let cLen = 0; cLen < CLIP_LENGTH; cLen++)
            // {
            //   if (ROM_OPPONENTSTATES[romFile][pABC][cLen] == 1)
            //   {
            //     ROM_OPPONENTSTATES[romFile][pABC][cLen] = 65535;
            //   }
            // }
          };

          for (let romFile in ROM_OPPONENTSTATES) {
            // Checking when we are Rising-To-SuperJump (before we wait or not wait)
            for (let cLen = 0; cLen < CLIP_LENGTH; cLen++) {
              ((pMemObject[`${p1P2_}Knockdown_State`])[pABC][cLen] == 13) // 13: "Rising to Super Jump",
                ? ROM_OPPONENTSTATES[romFile][pABC][cLen] = 255 // Set to 255 to indicate that we are Rising-To-SuperJump
                : ROM_OPPONENTSTATES[romFile][pABC][cLen] = ROM_OPPONENTSTATES[romFile][pABC][cLen];
            }
            // Checking when we are Rising-to-SuperJump AND the Enemy's distance being HIGHER to the ground
            for (let cLen = 0; cLen < CLIP_LENGTH; cLen++) {
              ((pMemObject[`${p1P2_}Knockdown_State`])[pABC][cLen] == 13) && ((pMemObject[`${p1P2_}Y_Position_From_Enemy`])[pABC][cLen] >= 140)
                ? ROM_OPPONENTSTATES[romFile][pABC][cLen] = 888 // Turns 255 to 888 (high)
                : ROM_OPPONENTSTATES[romFile][pABC][cLen] = ROM_OPPONENTSTATES[romFile][pABC][cLen];
            }
            // Checking when we are Rising-to-SuperJump AND the Enemy's distance being LOWER to the ground
            for (let cLen = 0; cLen < CLIP_LENGTH; cLen++) {
              ((pMemObject[`${p1P2_}Knockdown_State`])[pABC][cLen] == 13) && ((pMemObject[`${p1P2_}Y_Position_From_Enemy`])[pABC][cLen] <= 139)
                ? ROM_OPPONENTSTATES[romFile][pABC][cLen] = 777 // Turns 255 to 777 (low)
                : ROM_OPPONENTSTATES[romFile][pABC][cLen] = ROM_OPPONENTSTATES[romFile][pABC][cLen];
            }

            // Setting Booleans for ROM_OpponentStateA results per ROM cycle.
            // High Air
            let AirSwitch = 0;
            for (var cLen = 0; cLen < CLIP_LENGTH; cLen++) {
              if (ROM_OPPONENTSTATES[romFile][pABC][cLen] == 888) {
                AirSwitch = 1;
                ROM_OPPONENTSTATES[romFile][pABC][cLen] = "High"; // High
              }
              else if (AirSwitch == 1) {
                if (ROM_OPPONENTSTATES[romFile][pABC][cLen] != 65535) {
                  ROM_OPPONENTSTATES[romFile][pABC][cLen] = "High";
                }
                else if (ROM_OPPONENTSTATES[romFile][pABC][cLen] == 65535) {
                  AirSwitch = 0;
                }
              }
            }
            // Low Air
            AirSwitch = 0;
            for (var cLen = 0; cLen < CLIP_LENGTH; cLen++) {
              if (ROM_OPPONENTSTATES[romFile][pABC][cLen] == 777) {
                AirSwitch = 1;
                ROM_OPPONENTSTATES[romFile][pABC][cLen] = "Low";
              }
              else if (AirSwitch == 1) {
                if (ROM_OPPONENTSTATES[romFile][pABC][cLen] != 65535) {
                  ROM_OPPONENTSTATES[romFile][pABC][cLen] = "Low";
                }
                else if (ROM_OPPONENTSTATES[romFile][pABC][cLen] == 65535) {
                  AirSwitch = 0;
                }
              }
            }
          }

          // 03_InputsA , 06_InputsB , 09_InputsC Setup
          // All Inputs during ROM infinite
          const ROM_INPUTS = [
            Object.values(nStateObj.State_Magneto_ROM_03_InputA_LK),
            Object.values(nStateObj.State_Magneto_ROM_03_InputA_MK),
            Object.values(nStateObj.State_Magneto_ROM_06_InputB_AirDash),
            Object.values(nStateObj.State_Magneto_ROM_08_InputC_DLK),
            Object.values(nStateObj.State_Magneto_ROM_08_InputC_MK),
          ];
          // Setting the end-point of a ROM Cycle.
          for (const romFile in ROM_INPUTS) {
            for (var cLen = 0; cLen < CLIP_LENGTH; cLen++) {
              if ((pMemObject[`${p1P2_}Airborne`])[pABC][cLen] == 0) {
                ROM_INPUTS[romFile][pABC][cLen] = 65535;
              }
              else if ((pMemObject[`${p1P2_}Y_Velocity`])[pABC][cLen] == 0) {
                ROM_INPUTS[romFile][pABC][cLen] = 65535;
              }
            }
            // Sets the rest of the ROM cycle to active or inactive.
            var GroundSwitch = 0;
            for (var cLen = 0; cLen < CLIP_LENGTH; cLen++) {
              if (ROM_INPUTS[romFile][pABC][cLen] == 1) // Started an input (air)
              {
                GroundSwitch = 1;
                ROM_INPUTS[romFile][pABC][cLen] = 1;
              }
              else if (GroundSwitch == 1) {
                if (ROM_INPUTS[romFile][pABC][cLen] != 65535) // if NOT grounded
                {
                  ROM_INPUTS[romFile][pABC][cLen] = 1;
                }
                else if (ROM_INPUTS[romFile][pABC][cLen] == 65535) // On the ground; stop attacking
                {
                  GroundSwitch = 0;
                }
              }
            }
          }

          // 04_ChoiceB (time: LK -> MK)
          var ROM_CHOICEB = Object.values(nStateObj.State_Magneto_ROM_04_ChoiceB);
          for (var arrayWithROMData in ROM_CHOICEB)// 3 arrays
          {
            // Find Grounded state for ROM loops
            for (var cLen = 0; cLen < CLIP_LENGTH; cLen++) {
              if (((pMemObject[`${p1P2_}Airborne`])[arrayWithROMData][cLen] == 0)) {
                ROM_CHOICEB[arrayWithROMData][cLen] = 65535;
              }
            }
            var GroundSwitch = 0
            for (var cLen = 0; cLen < CLIP_LENGTH; cLen++) {
              if ((ROM_CHOICEB[arrayWithROMData][cLen] != 65535)
                && (ROM_CHOICEB[arrayWithROMData][cLen] != 0)) {
                GroundSwitch = 1;
                ROM_CHOICEB[arrayWithROMData][cLen] = 1;
              }
              else if (GroundSwitch == 1) {
                if (ROM_CHOICEB[arrayWithROMData][cLen] != 65535) // if NOT grounded
                {
                  ROM_CHOICEB[arrayWithROMData][cLen] = 1; // my ROM cycle is still going
                }
                else if (ROM_CHOICEB[arrayWithROMData][cLen] == 65535) // On the ground; stop attacking
                {
                  GroundSwitch = 0;
                }
              }
            }
            // Label the LKs & MKs
            for (var cLen = 0; cLen < CLIP_LENGTH; cLen++) {
              if (ROM_CHOICEB[arrayWithROMData][cLen] == 1) {
                // Am I MK?
                if (((pMemObject[`${p1P2_}Normal_Strength`])[arrayWithROMData][cLen] == 1)
                  && ((pMemObject[`${p1P2_}Air_Dash_Count`])[arrayWithROMData][cLen] == 0)) {
                  ROM_CHOICEB[arrayWithROMData][cLen] = `MK`;
                }
                else if (((pMemObject[`${p1P2_}Normal_Strength`])[arrayWithROMData][cLen] == 0)
                  && ((pMemObject[`${p1P2_}Air_Dash_Count`])[arrayWithROMData][cLen] == 0)) {
                  ROM_CHOICEB[arrayWithROMData][cLen] = `LK`;
                }
                else if (((pMemObject[`${p1P2_}Air_Dash_Count`])[arrayWithROMData][cLen] == 1)
                  && ((pMemObject[`${p1P2_}Knockdown_State`])[arrayWithROMData][cLen] != 20)) {
                  ROM_CHOICEB[arrayWithROMData][cLen] = 0;
                }
              }
            }
            // Count the frames of LKs using tempCounter
            for (var cLen = 0; cLen < CLIP_LENGTH; cLen++) {
              if (ROM_CHOICEB[arrayWithROMData][cLen] == `LK`) {
                tempROMCounter += 1;
              }
              // Stop on encountering a MK
              else if (ROM_CHOICEB[arrayWithROMData][cLen] == `MK`) // We hit a MK
              {
                // Lookahead
                for (let positiveI = 0; positiveI < CLIP_LENGTH; positiveI++) {
                  // Everything until 65535 is = tempCounter
                  if (ROM_CHOICEB[arrayWithROMData][cLen + positiveI] != 65535) {
                    tempROMSwitch = 1
                    ROM_CHOICEB[arrayWithROMData][cLen + positiveI] = tempROMCounter;
                  }
                  else if (tempROMSwitch == 1) {
                    ROM_CHOICEB[arrayWithROMData][cLen + positiveI] = tempROMCounter;
                    if (ROM_CHOICEB[arrayWithROMData][cLen + positiveI] == 65535) {
                      tempROMSwitch = 0;
                    }
                    break // lookahead is done, we hit 65535
                  }
                }
                // Lookbehind, expect the number of LKs to equal the tempCounter value
                for (let negativeI = 1; negativeI < tempROMCounter + 1; negativeI++) {
                  if (ROM_CHOICEB[arrayWithROMData][cLen - negativeI] == `LK`) {
                    ROM_CHOICEB[arrayWithROMData][cLen - negativeI] = tempROMCounter;
                  }
                }
              }
              else // Reset the counters
              {
                tempROMCounter = 0;
                tempROMSwitch = 0;
              }
            }
            // Clean up the values for AE Part1
            for (var cLen = 0; cLen < CLIP_LENGTH; cLen++) {
              if ((ROM_CHOICEB[arrayWithROMData][cLen] != 65535)
                && (ROM_CHOICEB[arrayWithROMData][cLen] >= 0)
                && (ROM_CHOICEB[arrayWithROMData][cLen] < 3)
                || (ROM_CHOICEB[arrayWithROMData][cLen] == `LK`)) {
                ROM_CHOICEB[arrayWithROMData][cLen] = 0;
              }
            }
            // Clean up the values for AE Part2
            for (var cLen = 0; cLen < CLIP_LENGTH; cLen++) {
              if ((ROM_CHOICEB[arrayWithROMData][cLen] != 65535)
                && (ROM_CHOICEB[arrayWithROMData][cLen] >= 10)) {
                ROM_CHOICEB[arrayWithROMData][cLen] = `Wait`
              }
              else if (((ROM_CHOICEB[arrayWithROMData][cLen] != 65535))
                && (ROM_CHOICEB[arrayWithROMData][cLen] < 10)
                && (ROM_CHOICEB[arrayWithROMData][cLen] > 0)) {
                ROM_CHOICEB[arrayWithROMData][cLen] = `No-Wait`
              }
            }
          }

          // 05_ChoiceC (time: LK -> AirDash)
          var ROM_CHOICEC = Object.values(nStateObj.State_Magneto_ROM_05_ChoiceC);
          for (let arrayWithROMData in ROM_CHOICEC) // 3 arrays
          {
            // Find Grounded state for ROM loops
            for (var cLen = 0; cLen < CLIP_LENGTH; cLen++) {
              if ((pMemObject[`${p1P2_}Airborne`])[arrayWithROMData][cLen] == 0) {
                ROM_CHOICEC[arrayWithROMData][cLen] = 65535;
              }
              else if ((pMemObject[`${p1P2_}Y_Velocity`])[arrayWithROMData][cLen] == 0) // if grounded
              {
                ROM_CHOICEC[arrayWithROMData][cLen] = 65535;
              }
            }
            // Find 1 ROM Cycle after establishing ground state
            var GroundSwitch = 0
            for (var cLen = 0; cLen < CLIP_LENGTH; cLen++) {
              if ((ROM_CHOICEC[arrayWithROMData][cLen] != 65535)
                && (ROM_CHOICEC[arrayWithROMData][cLen] != 0)) {
                GroundSwitch = 1;
                ROM_CHOICEC[arrayWithROMData][cLen] = 1;
              }
              else if (GroundSwitch == 1) {
                if (ROM_CHOICEC[arrayWithROMData][cLen] != 65535) // if NOT grounded
                {
                  ROM_CHOICEC[arrayWithROMData][cLen] = 1; // my ROM cycle is still going
                }
                else if (ROM_CHOICEC[arrayWithROMData][cLen] == 65535) // On the ground; stop attacking
                {
                  GroundSwitch = 0;
                }
              }
            }
            // Label the LKs & AirDashes
            for (var cLen = 0; cLen < CLIP_LENGTH; cLen++) {
              if (ROM_CHOICEC[arrayWithROMData][cLen] == 1) {
                // Am I AirDash
                if (((pMemObject[`${p1P2_}Normal_Strength`])[arrayWithROMData][cLen] == 0)
                  && ((pMemObject[`${p1P2_}Air_Dash_Count`])[arrayWithROMData][cLen] == 1)) {
                  ROM_CHOICEC[arrayWithROMData][cLen] = `AirDash`;
                }
                else if (((pMemObject[`${p1P2_}Normal_Strength`])[arrayWithROMData][cLen] == 0)
                  && ((pMemObject[`${p1P2_}Air_Dash_Count`])[arrayWithROMData][cLen] == 0)) {
                  ROM_CHOICEC[arrayWithROMData][cLen] = `LK`;
                }
                else if (((pMemObject[`${p1P2_}Normal_Strength`])[arrayWithROMData][cLen] == 1)
                  && ((pMemObject[`${p1P2_}Air_Dash_Count`])[arrayWithROMData][cLen] == 0)) {
                  ROM_CHOICEC[arrayWithROMData][cLen] = `MK`; // First MK
                }
                else if (((pMemObject[`${p1P2_}Normal_Strength`])[arrayWithROMData][cLen] == 1)
                  && ((pMemObject[`${p1P2_}Air_Dash_Count`])[arrayWithROMData][cLen] == 1)) {
                  ROM_CHOICEC[arrayWithROMData][cLen] = `AirDash`; // Second MK
                }
              }
            }
            // Count LKs before AirDash
            for (var cLen = 0; cLen < CLIP_LENGTH; cLen++) {
              if (ROM_CHOICEC[arrayWithROMData][cLen] == `LK`) {
                tempROMCounter += 1;
              }
              // Stop on encountering an AirDash
              else if (ROM_CHOICEC[arrayWithROMData][cLen] == `AirDash`) // We hit an AirDash
              {
                // Lookahead
                for (let positiveI = 0; positiveI < CLIP_LENGTH; positiveI++) {
                  // Everything until 65535 is = tempCounter
                  if (ROM_CHOICEC[arrayWithROMData][cLen + positiveI] != 65535) {
                    tempROMSwitch = 1
                    ROM_CHOICEC[arrayWithROMData][cLen + positiveI] = tempROMCounter;
                  }
                  else if (tempROMSwitch == 1) {
                    ROM_CHOICEC[arrayWithROMData][cLen + positiveI] = tempROMCounter;
                    if (ROM_CHOICEC[arrayWithROMData][cLen + positiveI] == 65535) {
                      tempROMSwitch = 0;
                    }
                    break // lookahead is done, we hit 65535
                  }
                }
                // Lookbehind, expect the number of LKs to equal the tempCounter value
                for (let negativeI = 1; negativeI < tempROMCounter + 1; negativeI++) {
                  if (ROM_CHOICEC[arrayWithROMData][cLen - negativeI] == `LK`) {
                    ROM_CHOICEC[arrayWithROMData][cLen - negativeI] = tempROMCounter;
                  }
                }
              }
              else // Reset the counters
              {
                tempROMCounter = 0;
                tempROMSwitch = 0;
              }
            }
            // Clean up the values for AE Part1
            for (var cLen = 0; cLen < CLIP_LENGTH; cLen++) {
              if ((ROM_CHOICEC[arrayWithROMData][cLen] != 65535)
                && (ROM_CHOICEC[arrayWithROMData][cLen] >= 18)) {
                ROM_CHOICEC[arrayWithROMData][cLen] = `Wait`
              }
              else if (((ROM_CHOICEC[arrayWithROMData][cLen] != 65535))
                && (ROM_CHOICEC[arrayWithROMData][cLen] < 18)
                && (ROM_CHOICEC[arrayWithROMData][cLen] > 1)) {
                ROM_CHOICEC[arrayWithROMData][cLen] = `No-Wait`
              }
            }
            // Clean up the values for AE Part2
            for (var cLen = 0; cLen < CLIP_LENGTH; cLen++) {
              if ((ROM_CHOICEC[arrayWithROMData][cLen] == `LK`)
                || (ROM_CHOICEC[arrayWithROMData][cLen] == `MK`)) {
                ROM_CHOICEC[arrayWithROMData][cLen] = 0;
              }
            }
          } // end of 05_ChoiceC

          // 05_ChoiceD (time: MK -> AirDash)
          var ROM_CHOICED = Object.values(nStateObj.State_Magneto_ROM_05_ChoiceD);
          for (let arrayWithROMData in ROM_CHOICED) // 3 arrays
          {
            // Find Grounded state for ROM loops
            for (var cLen = 0; cLen < CLIP_LENGTH; cLen++) {
              if ((pMemObject[`${p1P2_}Airborne`])[arrayWithROMData][cLen] == 0) {
                ROM_CHOICED[arrayWithROMData][cLen] = 65535;
              }
              else if ((pMemObject[`${p1P2_}Y_Velocity`])[arrayWithROMData][cLen] == 0) {
                ROM_CHOICED[arrayWithROMData][cLen] = 65535;
              }
            }
            // Find 1 ROM Cycle after establishing ground state
            var GroundSwitch = 0
            for (var cLen = 0; cLen < CLIP_LENGTH; cLen++) {
              if ((ROM_CHOICED[arrayWithROMData][cLen] != 65535)
                && (ROM_CHOICED[arrayWithROMData][cLen] != 0)) // we are doing a MK
              {
                GroundSwitch = 1;
                ROM_CHOICED[arrayWithROMData][cLen] = 1;
              }
              else if (GroundSwitch == 1) {
                if (ROM_CHOICED[arrayWithROMData][cLen] != 65535) // if NOT grounded
                {
                  ROM_CHOICED[arrayWithROMData][cLen] = 1; // my ROM cycle is still going
                }
                else if (ROM_CHOICED[arrayWithROMData][cLen] == 65535) // On the ground; stop attacking
                {
                  GroundSwitch = 0;
                }
              }
            }
            // Label the MKs & AirDashes
            for (var cLen = 0; cLen < CLIP_LENGTH; cLen++) {
              if (ROM_CHOICED[arrayWithROMData][cLen] == 1) {
                if (((pMemObject[`${p1P2_}Normal_Strength`])[arrayWithROMData][cLen] == 1)
                  && ((pMemObject[`${p1P2_}Air_Dash_Count`])[arrayWithROMData][cLen] == 1)) // AirDash during MK
                {
                  ROM_CHOICED[arrayWithROMData][cLen] = `AirDash`;
                }
                else if (((pMemObject[`${p1P2_}Normal_Strength`])[arrayWithROMData][cLen] == 0)
                  && ((pMemObject[`${p1P2_}Air_Dash_Count`])[arrayWithROMData][cLen] == 0)) {
                  ROM_CHOICED[arrayWithROMData][cLen] = `LK`; // First LK
                }
                else if (((pMemObject[`${p1P2_}Normal_Strength`])[arrayWithROMData][cLen] == 1)
                  && ((pMemObject[`${p1P2_}Air_Dash_Count`])[arrayWithROMData][cLen] == 0)) {
                  ROM_CHOICED[arrayWithROMData][cLen] = `MK`; // First MK
                }
                else if (((pMemObject[`${p1P2_}Normal_Strength`])[arrayWithROMData][cLen] == 1)
                  && ((pMemObject[`${p1P2_}Air_Dash_Count`])[arrayWithROMData][cLen] == 1)) {
                  ROM_CHOICED[arrayWithROMData][cLen] = `AirDash`; // Second MK
                }
              }
            }
            // Count MKs before AirDash
            for (var cLen = 0; cLen < CLIP_LENGTH; cLen++) {
              if (ROM_CHOICED[arrayWithROMData][cLen] == `MK`) {
                tempROMCounter += 1;
              }
              // Stop on encountering an AirDash
              else if (ROM_CHOICED[arrayWithROMData][cLen] == `AirDash`) // We hit an AirDash
              {
                // Lookahead
                for (let positiveI = 0; positiveI < CLIP_LENGTH; positiveI++) {
                  // Everything until 65535 is = tempCounter
                  if (ROM_CHOICED[arrayWithROMData][cLen + positiveI] != 65535) {
                    tempROMSwitch = 1
                    ROM_CHOICED[arrayWithROMData][cLen + positiveI] = tempROMCounter;
                  }
                  else if (tempROMSwitch == 1) {
                    ROM_CHOICED[arrayWithROMData][cLen + positiveI] = tempROMCounter;
                    if (ROM_CHOICED[arrayWithROMData][cLen + positiveI] == 65535) {
                      tempROMSwitch = 0;
                    }
                    break // lookahead is done, we hit 65535
                  }
                }
                // Look-behind, expect the number of MKs to equal the tempCounter value.
                // Wipe the values until we hit the ground.
                for (let negativeI = 1; negativeI < tempROMCounter + 1; negativeI++) {
                  if (ROM_CHOICED[arrayWithROMData][cLen - negativeI] == `MK`) {
                    ROM_CHOICED[arrayWithROMData][cLen - negativeI] = tempROMCounter;
                  }
                }
              }
              else // Reset the counters
              {
                tempROMCounter = 0;
                tempROMSwitch = 0;
              }
            }
            // Clean up the values for AE Part1
            for (var cLen = 0; cLen < CLIP_LENGTH; cLen++) {
              if ((ROM_CHOICED[arrayWithROMData][cLen] != 65535)
                && (ROM_CHOICED[arrayWithROMData][cLen] >= 18)) {
                ROM_CHOICED[arrayWithROMData][cLen] = `Wait`
              }
              else if (((ROM_CHOICED[arrayWithROMData][cLen] != 65535))
                && (ROM_CHOICED[arrayWithROMData][cLen] < 18)
                && (ROM_CHOICED[arrayWithROMData][cLen] > 1)) {
                ROM_CHOICED[arrayWithROMData][cLen] = `No-Wait`
              }
            }
            // Clean up the values for AE Part2
            for (var cLen = 0; cLen < CLIP_LENGTH; cLen++) {
              if ((ROM_CHOICED[arrayWithROMData][cLen] == `LK`)
                || (ROM_CHOICED[arrayWithROMData][cLen] == `MK`)) {
                ROM_CHOICED[arrayWithROMData][cLen] = 0;
              }
            }
          } // end of 05_ChoiceD

          // 07_ChoiceE(AirDash to DLK time)
          var ROM_CHOICEE = Object.values(nStateObj.State_Magneto_ROM_07_ChoiceE);
          for (let arrayWithROMData in ROM_CHOICEE) // 3 arrays
          {
            // Find Grounded state for ROM loops
            for (var cLen = 0; cLen < CLIP_LENGTH; cLen++) {
              if ((pMemObject[`${p1P2_}Airborne`])[arrayWithROMData][cLen] == 0) {
                ROM_CHOICEE[arrayWithROMData][cLen] = 65535;
              }
              else if ((pMemObject[`${p1P2_}Y_Velocity`])[arrayWithROMData][cLen] == 0) // if grounded
              {
                ROM_CHOICEE[arrayWithROMData][cLen] = 65535;
              }
            }
            //   // Find 1 ROM Cycle after establishing ground state
            var GroundSwitch = 0
            for (var cLen = 0; cLen < CLIP_LENGTH; cLen++) {
              if ((ROM_CHOICEE[arrayWithROMData][cLen] != 65535)
                && (ROM_CHOICEE[arrayWithROMData][cLen] != 0)) // we are air dashing
              {
                GroundSwitch = 1;
                ROM_CHOICEE[arrayWithROMData][cLen] = 1;
              }
              else if (GroundSwitch == 1) {
                if (ROM_CHOICEE[arrayWithROMData][cLen] != 65535) // if NOT grounded
                {
                  ROM_CHOICEE[arrayWithROMData][cLen] = 1; // my ROM cycle is still going
                }
                else if (ROM_CHOICEE[arrayWithROMData][cLen] == 65535) // On the ground; stop attacking
                {
                  GroundSwitch = 0;
                }
              }
            }
            //   for (var cLen = 0; cLen < CLIP_LENGTH; cLen++) {
            //     if (ROM_CHOICEE[arrayWithROMData][cLen] == 1) {
            //       if ((pMemObject[`${p1P2_}Knockdown_State`])[arrayWithROMData][cLen] == 26) {
            //         tempROMCounter += 1;
            //         ROM_CHOICEE[arrayWithROMData][cLen] = tempROMCounter;
            //       }
            //       else if (ROM_CHOICEE[arrayWithROMData][cLen] == 1) {
            //         // look behind and replace the values until 0 with tempCounter
            //         for (let negativeI = 1; negativeI < CLIP_LENGTH; negativeI++) // look behind until we hit 0
            //         {
            //           if (ROM_CHOICEE[arrayWithROMData][cLen - negativeI] != 0) {
            //             ROM_CHOICEE[arrayWithROMData][cLen - negativeI] = tempROMCounter;
            //           }
            //           else if (ROM_CHOICEE[arrayWithROMData][cLen - negativeI] == 0) {
            //             break
            //           }
            //         }
            //         // look ahead until we hit 65535
            //         for (let positiveI = 0; positiveI < CLIP_LENGTH; positiveI++) {
            //           if (ROM_CHOICEE[arrayWithROMData][cLen + positiveI] != 65535) {
            //             let newTempNumber = ROM_CHOICEE[arrayWithROMData][cLen - 1]
            //             ROM_CHOICEE[arrayWithROMData][cLen - 1] = newTempNumber;
            //             ROM_CHOICEE[arrayWithROMData][cLen + positiveI] = newTempNumber;
            //           }
            //           else if (ROM_CHOICEE[arrayWithROMData][cLen + positiveI] == 65535) {
            //             tempROMCounter = 1;
            //             break
            //           }
            //         }
            //       }
            //     }
            //   }
            //   // Clean up the values for AE Part1
            //   for (let cLen = 0; cLen < CLIP_LENGTH; cLen++) {
            //     if ((ROM_CHOICEE[arrayWithROMData][cLen] != 65535)
            //       && (ROM_CHOICEE[arrayWithROMData][cLen] > 0)
            //       && (ROM_CHOICEE[arrayWithROMData][cLen] <= 3)) {
            //       ROM_CHOICEE[arrayWithROMData][cLen] = `No-Wait`
            //     }
            //     else if (((ROM_CHOICEE[arrayWithROMData][cLen] != 65535))
            //       && (ROM_CHOICEE[arrayWithROMData][cLen] > 3)) {
            //       ROM_CHOICEE[arrayWithROMData][cLen] = `Wait`
            //     }
            //   }
          }
          // // // End of 07_ChoiceE

          // 09_ChoiceF (time: LK -> MK)
          var ROM_ChoiceF = Object.values(nStateObj.State_Magneto_ROM_09_ChoiceF);
          for (const arrayWithROMData in ROM_ChoiceF) // 3 arrays
          {
            for (var cLen = 0; cLen < CLIP_LENGTH; cLen++) {
              if ((pMemObject[`${p1P2_}Airborne`])[arrayWithROMData][cLen] == 0) {
                ROM_ChoiceF[arrayWithROMData][cLen] = 65535;
              }
              else if ((pMemObject[`${p1P2_}Y_Velocity`])[arrayWithROMData][cLen] == 0) // if grounded
              {
                ROM_ChoiceF[arrayWithROMData][cLen] = 65535;
              }
            }
            var GroundSwitch = 0
            for (var cLen = 0; cLen < CLIP_LENGTH; cLen++) {
              if ((ROM_ChoiceF[arrayWithROMData][cLen] != 65535)
                && (ROM_ChoiceF[arrayWithROMData][cLen] != 0)) {
                GroundSwitch = 1;
                ROM_ChoiceF[arrayWithROMData][cLen] = 1;
              }
              else if (GroundSwitch == 1) {
                if (ROM_ChoiceF[arrayWithROMData][cLen] != 65535) // if NOT grounded
                {
                  ROM_ChoiceF[arrayWithROMData][cLen] = 1; // my ROM cycle is still going
                }
                else if (ROM_ChoiceF[arrayWithROMData][cLen] == 65535) // On the ground; stop attacking
                {
                  GroundSwitch = 0;
                }
              }
            }

            // Label the LKs & MKs
            for (var cLen = 0; cLen < CLIP_LENGTH; cLen++) {
              if (ROM_ChoiceF[arrayWithROMData][cLen] == 1) {
                // Am I MK?
                if (((pMemObject[`${p1P2_}Normal_Strength`])[arrayWithROMData][cLen] == 1)
                  && ((pMemObject[`${p1P2_}Attack_Number`])[arrayWithROMData][cLen] == 16)
                  && ((pMemObject[`${p1P2_}Air_Dash_Count`])[arrayWithROMData][cLen] == 1)) // MK
                {
                  ROM_ChoiceF[arrayWithROMData][cLen] = `MK`;
                }
                else if (((pMemObject[`${p1P2_}Attack_Number`])[arrayWithROMData][cLen] == 18)
                  && ((pMemObject[`${p1P2_}Normal_Strength`])[arrayWithROMData][cLen] == 0)
                  && ((pMemObject[`${p1P2_}Air_Dash_Count`])[arrayWithROMData][cLen] == 1)) // DLK
                {
                  ROM_ChoiceF[arrayWithROMData][cLen] = `DLK`;
                }
              }
            }
            // Count the frames of LKs using tempCounter
            for (var cLen = 0; cLen < CLIP_LENGTH; cLen++) {
              if (ROM_ChoiceF[arrayWithROMData][cLen] == `DLK`) {
                tempROMCounter += 1;
              }
              // Stop on encountering a MK
              else if (ROM_ChoiceF[arrayWithROMData][cLen] == `MK`) // We hit a MK
              {
                // Lookahead
                for (let positiveI = 0; positiveI < CLIP_LENGTH; positiveI++) // CLIP_LENGTH is used, but we will break out of the loop before it is reached
                {
                  // Everything until 65535 is = tempCounter
                  if (ROM_ChoiceF[arrayWithROMData][cLen + positiveI] != 65535) {
                    tempROMSwitch = 1
                    ROM_ChoiceF[arrayWithROMData][cLen + positiveI] = tempROMCounter;
                  }
                  else if (tempROMSwitch == 1) {
                    ROM_ChoiceF[arrayWithROMData][cLen + positiveI] = tempROMCounter;
                    if (ROM_ChoiceF[arrayWithROMData][cLen + positiveI] == 65535) {
                      tempROMSwitch = 0;
                    }
                    break // lookahead is done, we hit 65535
                  }
                }
                // Lookbehind, expect the number of 2LKs to equal the tempCounter value
                for (let negativeI = 1; negativeI < tempROMCounter + 1; negativeI++) {
                  if (ROM_ChoiceF[arrayWithROMData][cLen - negativeI] == `DLK`) {
                    ROM_ChoiceF[arrayWithROMData][cLen - negativeI] = tempROMCounter;
                  }
                }
              }
              else // Reset the counters
              {
                tempROMCounter = 0;
                tempROMSwitch = 0;
              }
            }
            // Clean up the values for AE Part1
            for (var cLen = 0; cLen < CLIP_LENGTH; cLen++) {
              if ((ROM_ChoiceF[arrayWithROMData][cLen] != 65535)
                && (ROM_ChoiceF[arrayWithROMData][cLen] >= 0)
                && (ROM_ChoiceF[arrayWithROMData][cLen] < 3))
              // || (arrStateROM_09_ChoiceF[arrayWithROMData][cLen] == `DLK`))
              {
                ROM_ChoiceF[arrayWithROMData][cLen] = 0;
              }
            }
            // Clean up the values for AE Part2
            for (var cLen = 0; cLen < CLIP_LENGTH; cLen++) {
              if ((ROM_ChoiceF[arrayWithROMData][cLen] != 65535)
                && (ROM_ChoiceF[arrayWithROMData][cLen] >= 17)) {
                ROM_ChoiceF[arrayWithROMData][cLen] = `Wait`
              }
              else if (((ROM_ChoiceF[arrayWithROMData][cLen] != 65535))
                && (ROM_ChoiceF[arrayWithROMData][cLen] < 17)
                && (ROM_ChoiceF[arrayWithROMData][cLen] > 0)) {
                ROM_ChoiceF[arrayWithROMData][cLen] = `No-Wait`
              }
            }
          } // End of 09_ChoiceF Scope
        } // End ROMStuff End ROM Stuff

        // Write the files
        for (let state = 0; state < Object.entries(nStateObj).length; state++) {
          fs.writeFileSync(`${DIR_OUTPATH}P${pI}_${Object.keys(nStateObj)[state]}.js`,
            `var result = []; ` + '\n', 'utf8');
        }

        // Append data arrays into files
        for (let state = 0; state < Object.entries(nStateObj).length; state++) {
          fs.appendFileSync(`${DIR_OUTPATH}P${pI}_${Object.keys(nStateObj)[state]}.js`,
            JSON.stringify(Object.values(nStateObj)[state])
              .replace('[[', `result[0] = [`)
              .replace(',[', '\nresult[1] = [')
              .replace(',[', '\nresult[2] = [')
              .replace(']]', ']')
              .replace(/]$/gm, '];') // end of line close-bracket gets semi-colon
              .replace(/"/gm, '\'') // replace double-quotes with single-quotes
          );
        }
      }
    }
  }

  /*
  --------------------------------------------------
  Step 5: 📞 Call Functions
  --------------------------------------------------
  */
  writeTeamNames();
  appendMinMaxRound();
  await writeSortedJS();
  await pushAllPMemPrommises();
  fetchPMemEntries().forEach(async function (label) {
    await writePlayerMemory(1, label.toString());
    await writePlayerMemory(2, label.toString());
  });
  writeInputCNV();
  writeStageDataCNV();
  writeP1P2Addresses();
  countIsPausedCNV();
  writeComboCallouts();
  writeTotalFramesCNV();
  writeStaticDataCNV();
  await writeNewStates()
  writeDataObject();
}

// delete temp JS file
fs.readdirSync(DIR_EXPORT_TO_AE).forEach(file => {
  if (file.endsWith('.js')) {
    fs.unlinkSync(`${DIR_EXPORT_TO_AE}${file}`);
  }
});
console.timeEnd('⏱');
