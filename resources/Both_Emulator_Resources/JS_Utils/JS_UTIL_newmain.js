/* eslint-disable */

/*
--------------------------------------------------
Step 0: Import the necessary modules
--------------------------------------------------
*/

import * as fs from 'fs';
// import clipboard from "clipboardy";

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
  COMBO_CALLOUTS
} from './JS_UTIL_staticData.js';

// Import directories; Order matters!
import {
  DIR_EXPORT_TO_AE,
  DIR_CSVS
} from './JS_UTIL_paths.js';

console.time('writeAllData');
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


  //Append MIN&MAX value to dataObject
  function appendMinMaxRound() {
    let tempMinMaxBuffer = '\n';

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

  // Main function to write data to files OR return finalValues array
  /**
   * @param {number|string} p1OrP2 number or string, ex: 1 or "P1"
   * @param {string} pMemAdr string, ex: "Health_Big"
   * @param {number|boolean} write flag to return array or write to file
   * @returns {Number[]} returns an array of numbers or writes a file for the playerMemoryAddress in the clip.
   * @description Finds the point character, and returns an array of numbers for the playerMemoryAddress in the clip.
   */
  function writePlayerMemory(p1OrP2, pMemAdr, write) {
    let POINT_OBJ_P1 =
    {
      P1_A_: dataObject['P1_A_Is_Point'].split(','),
      P1_B_: dataObject['P1_B_Is_Point'].split(','),
      P1_C_: dataObject['P1_C_Is_Point'].split(',')
    };
    let POINT_OBJ_P2 =
    {
      P2_A_: dataObject['P2_A_Is_Point'].split(','),
      P2_B_: dataObject['P2_B_Is_Point'].split(','),
      P2_C_: dataObject['P2_C_Is_Point'].split(',')
    };

    let valArr = [[], [], []]; // 3 Arrays to hold all 3 player slots.
    /**@description Switches between the Player1 and Player2 objects,
     * ex: POINT_OBJ_P1 or POINT_OBJ_P2 which contain key value pairs of
     * P1_A... and P2_A... to `dataObject['P1_A_Is_Point'].split(',')`... etc
     */
    let pObjSwitch;// Switches between the Player1 and Player2 objects

    /**@description "P1" | "P2" */
    let playerSwitcher; // Switches between "P1" and "P2"

    if ((p1OrP2 == 1) || (p1OrP2 == "P1")) {
      pObjSwitch = POINT_OBJ_P1;
      playerSwitcher = "P1";
    }
    else if ((p1OrP2 == 2) || (p1OrP2 == "P2")) {
      pObjSwitch = POINT_OBJ_P2;
      playerSwitcher = "P2";
    }

    // Pushes the POINT_OBJ values (P1_A[n]) into the finalValuesArray
    for (let clipLen = 0; clipLen < CLIP_LENGTH; clipLen++) // length of clip
    {
      // 3-Character Bug Logic
      if ((Object.values(pObjSwitch)[0][clipLen] == 0)
        && (Object.values(pObjSwitch)[1][clipLen] == 0)
        && (Object.values(pObjSwitch)[2][clipLen] == 0)) {
        // console.log( `${ playerSwitcher}: 3-Character Bug Logic: A == 0 && B == 0 && C == 0    P1: ABC` );
        valArr[0].push(dataObject[`${Object.keys(pObjSwitch)[0]}${pMemAdr}`].split(',')[clipLen]);
        valArr[1].push(dataObject[`${Object.keys(pObjSwitch)[1]}${pMemAdr}`].split(',')[clipLen]);
        valArr[2].push(dataObject[`${Object.keys(pObjSwitch)[2]}${pMemAdr}`].split(',')[clipLen]);
      }
      // 2-Character Bug Logic
      else if ((Object.values(pObjSwitch)[0][clipLen] == 0)
        && (Object.values(pObjSwitch)[1][clipLen] == 0)
        && (Object.values(pObjSwitch)[2][clipLen] != 0)) {
        // console.log( `${ playerSwitcher}: 2-Character Bug Logic: A == 0 && B == 0 && C != 0    P1: AB` );
        valArr[0].push(dataObject[`${Object.keys(pObjSwitch)[0]}${pMemAdr}`].split(',')[clipLen]);
        valArr[1].push(dataObject[`${Object.keys(pObjSwitch)[1]}${pMemAdr}`].split(',')[clipLen]);
      }
      else if ((Object.values(pObjSwitch)[0][clipLen] == 0)
        && (Object.values(pObjSwitch)[1][clipLen] != 0)
        && (Object.values(pObjSwitch)[2][clipLen] == 0)) {
        // console.log( `${ playerSwitcher}: 2-Character Bug Logic: A == 0 && B != 0 && C == 0    P1: AC` );
        valArr[0].push(dataObject[`${Object.keys(pObjSwitch)[0]}${pMemAdr}`].split(',')[clipLen]);
        valArr[1].push(dataObject[`${Object.keys(pObjSwitch)[2]}${pMemAdr}`].split(',')[clipLen]);
      }
      else if ((Object.values(pObjSwitch)[0][clipLen] != 0)
        && (Object.values(pObjSwitch)[1][clipLen] == 0)
        && (Object.values(pObjSwitch)[2][clipLen] == 0)) {
        // console.log( `${ playerSwitcher}: 2-Character Bug Logic: A != 0 && B == 0 && C == 0    P1: BC` );
        valArr[0].push(dataObject[`${Object.keys(pObjSwitch)[1]}${pMemAdr}`].split(',')[clipLen]);
        valArr[1].push(dataObject[`${Object.keys(pObjSwitch)[2]}${pMemAdr}`].split(',')[clipLen]);
      }
      // 1-Character Logic
      else if ((Object.values(pObjSwitch)[0][clipLen] == 0)
        && (Object.values(pObjSwitch)[1][clipLen] != 0)
        && (Object.values(pObjSwitch)[2][clipLen] != 0)) {
        // console.log(`${ playerSwitcher }: 1-Character Logic: A == 0 && B != 0 && C != 0        P1: A`);
        valArr[0].push(dataObject[`${Object.keys(pObjSwitch)[0]}${pMemAdr}`].split(',')[clipLen]);
      }//                       P1|P2        P1_A        Health_Big                        i     
      else if ((Object.values(pObjSwitch)[0][clipLen] != 0)
        && (Object.values(pObjSwitch)[1][clipLen] == 0)
        && (Object.values(pObjSwitch)[2][clipLen] != 0)) {
        // console.log(`${ playerSwitcher }: 1-Character Logic: A != 0 && B == 0 && C != 0        P1: B`);
        valArr[0].push(dataObject[`${Object.keys(pObjSwitch)[1]}${pMemAdr}`].split(',')[clipLen]);
      }
      else if ((Object.values(pObjSwitch)[0][clipLen] != 0)
        && (Object.values(pObjSwitch)[1][clipLen] != 0)
        && (Object.values(pObjSwitch)[2][clipLen] == 0)) {
        // console.log(`${ playerSwitcher }: 1 - Character Logic: A != 0 && B != 0 && C == 0       P1: C`);
        valArr[0].push(dataObject[`${Object.keys(pObjSwitch)[2]}${pMemAdr}`].split(',')[clipLen]);
      }
    } // loop end

    // Return if not writing files
    if ((write == 0) || (write == false)) {
      return valArr
    }
    else if ((write == 1) || (write == true)) {
      // (!fs.existsSync(`${ DIR_OUTPATH }/${ playerSwitcher }_${ playerMemoryAddress.split(',') }.js`))
      // {
      fs.writeFileSync(`${DIR_OUTPATH}/${playerSwitcher}_${pMemAdr.split(',')}.js`,
        `var result = [];` + "\n",
        { flag: "a+", encoding: 'utf8' });

      // Append main data
      for (let dataArrayPerCharacter in valArr) {
        fs.appendFileSync(`${DIR_OUTPATH}/${playerSwitcher}_${pMemAdr.split(',')}.js`,
          `result[${dataArrayPerCharacter}] = [${valArr[dataArrayPerCharacter]}];\n`,
          'utf8'
        );
      }
      // Merge the finalValuesArray into the dataObject
      // dataObject[`${ playerSwitcher }_${ playerMemoryAddress.split(',') }`] = finalValuesArray;
      // }
    }
  }// end of find-point-player-memory-function

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
    // console.log(...playerMemoryEntries);
    return playerMemoryEntries;
  }

  // Write Static Data Conversion. Example ID_2: 01 turns into "Ryu"
  /**
   * @returns {Number[]} returns an array of numbers and writes a file with _CNV appended to its name
   * @description Writes and converts the point character's values for Knockdown State, Is_Prox_Block, ID_2 and _PortraitsToTime
   * Files are written and then appended as the function loops over each player-memory-address & player.
  */
  function writeStaticDataCNV() {
    const STATIC_DATA_OBJS = [KNOCKDOWN_STATE_OBJ, PROX_BLOCK_OBJ, NAME_TABLE_OBJ, PORTRAITS_TO_TIME_OBJ]
    const STATIC_DATA_ADRS = ["Knockdown_State", "Is_Prox_Block", "ID_2", "ID_2"]
    let staticLookupResultsArray = [[], [], []];

    for (let playersLen = 1; playersLen < 3; playersLen++) {
      for (let staticDataLen = 0; staticDataLen < STATIC_DATA_ADRS.length; staticDataLen++) {

        // Write base file
        if (STATIC_DATA_OBJS[staticDataLen] == PORTRAITS_TO_TIME_OBJ) // PortraitsToTime Condition
        {
          fs.writeFileSync(`${DIR_OUTPATH}P${playersLen}_PortraitsToTime.js`,
            `var result = [];` + "\n",
            'utf8'
          );
        }
        else {
          fs.writeFileSync(`${DIR_OUTPATH}P${playersLen}_${STATIC_DATA_ADRS[staticDataLen]}_CNV.js`,
            `var result = [];` + "\n",
            'utf8'
          );
        }
      }
      for (let staticDataEntry = 0; staticDataEntry < STATIC_DATA_ADRS.length; staticDataEntry++) {
        const callPlayerMemoryFN = writePlayerMemory(`${playersLen}`, STATIC_DATA_ADRS[staticDataEntry], 0);
        for (let characterSlotI = 0; characterSlotI < callPlayerMemoryFN.length; characterSlotI++) // [0][1][2]
        {
          // Push and convert all three arrays' values
          for (let clipLen = 0; clipLen < callPlayerMemoryFN[characterSlotI].length; clipLen++) // CLIPLENGTH
          {
            staticLookupResultsArray[characterSlotI].push(`"${Object.values(STATIC_DATA_OBJS[staticDataEntry])[callPlayerMemoryFN[characterSlotI][clipLen]]}"`);
          }
          // TODO hook into this entry to write the portrait's position for AE
          // TODO in arrays depending on the character.
          // TODO `var result = [[\d,\d],...]
          // TODO bring in the static data for the key value pairs and use that
          if (STATIC_DATA_OBJS[staticDataEntry] == PORTRAITS_TO_TIME_OBJ) // PortraitsToTime Condition
          {
            fs.appendFileSync(`${DIR_OUTPATH}P${playersLen}_PortraitsToTime.js`,
              `result[${characterSlotI}] = [${staticLookupResultsArray[characterSlotI]}];\n`,
              'utf8'
            );
            staticLookupResultsArray = [[], [], []];
          }
          else {
            fs.appendFileSync(`${DIR_OUTPATH}P${playersLen}_${STATIC_DATA_ADRS[staticDataEntry]}_CNV.js`,
              `result[${characterSlotI}] = [${staticLookupResultsArray[characterSlotI]}];\n`,
              'utf8'
            );
            staticLookupResultsArray = [[], [], []];
          }
        }
      }
    }
  };
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

      // if (!fs.existsSync(`${ DIR_OUTPATH }${ P1P2_ADDRESSES[p1p2AdrIDX] }.js`))
      // {
      fs.writeFileSync(`${DIR_OUTPATH}${P1P2_ADDRESSES[p1p2AdrIDX]}.js`,
        `var result = [];\nresult[0] = [${p1p2AddressesArray}];`,
        'utf8'
      );
      p1p2AddressesArray[0] = []; // clear the array for the next player iteration.
      // }
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
  function writeNewStates() {
    // Temps for switching P1 and P2
    let tempPlayerValue, tempPlayerString;
    // P1 and P2
    for (tempPlayerValue = 1; tempPlayerValue < 3; tempPlayerValue++) {
      tempPlayerValue == 1 ? tempPlayerString = 'P1' : tempPlayerString = 'P2';

      // Fetches relevant SINGLE addresses for State-Logic-Checking
      var getAction_Flags = writePlayerMemory(tempPlayerString, 'Action_Flags', 0);
      var getAir_Dash_Count = writePlayerMemory(tempPlayerString, 'Air_Dash_Count', 0);
      var getAirborne = writePlayerMemory(tempPlayerString, 'Airborne', 0);
      var getAnimation_Timer_Main = writePlayerMemory(tempPlayerString, 'Animation_Timer_Main', 0);
      var getAttack_Immune = writePlayerMemory(tempPlayerString, 'Attack_Immune', 0);
      var getAttack_Number = writePlayerMemory(tempPlayerString, 'Attack_Number', 0);
      var getBlock_Meter = writePlayerMemory(tempPlayerString, 'Block_Meter', 0);
      var getDizzy = writePlayerMemory(tempPlayerString, 'Dizzy', 0);
      var getDizzy_Reset_Timer = writePlayerMemory(tempPlayerString, 'Dizzy_Reset_Timer', 0);
      var getHitStop = writePlayerMemory(tempPlayerString, 'Hitstop2', 0);
      var getKnockdown_State = writePlayerMemory(tempPlayerString, 'Knockdown_State', 0);
      var getFlyingScreen = writePlayerMemory(tempPlayerString, 'FlyingScreen', 0);
      var getFSI_Points = writePlayerMemory(tempPlayerString, 'FlyingScreen', 0);
      var getIs_Prox_Block = writePlayerMemory(tempPlayerString, 'Is_Prox_Block', 0);
      var getNormal_Strength = writePlayerMemory(tempPlayerString, 'Normal_Strength', 0);
      var getPunchKick = writePlayerMemory(tempPlayerString, 'PunchKick', 0);
      var getSJ_Counter = writePlayerMemory(tempPlayerString, 'SJ_Counter', 0);
      var getY_Position_Arena = writePlayerMemory(tempPlayerString, 'Y_Position_Arena', 0);
      var getY_Position_From_Enemy = writePlayerMemory(tempPlayerString, 'Y_Position_From_Enemy', 0);
      var getY_VELOCITY = writePlayerMemory(tempPlayerString, 'Y_Velocity', 0);
      // NEW_STATE_ADD_HERE : Define your SINGLE get-Address here if you need something that isn't on the list.

      // List of files to be written. Will have prefix of P1_ or P2_
      var allNewStateObject =
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
        // NEW_STATE_ADD_HERE ⏫
      }

      // for each slot (abc) in a Player's side
      for (let playerSlotI = 0; playerSlotI < 3; playerSlotI++) {
        // for each frame in a clip
        for (let clipLen = 0; clipLen < CLIP_LENGTH; clipLen++) {
          // Pushing the boolean-results for each State. Example BeingHit result = [ 0,0,0,1,1,1,1,1... ]

          // Being_Hit
          (
            ((getKnockdown_State)[playerSlotI][clipLen] == 32)
            && ((getHitStop)[playerSlotI][clipLen] > 0)
          )
            ? allNewStateObject.State_Being_Hit[playerSlotI].push(1)
            : allNewStateObject.State_Being_Hit[playerSlotI].push(0);
          // "Flying_Screen_Air"
          (
            ((getFlyingScreen)[playerSlotI][clipLen] == 1)
            && ((getKnockdown_State)[playerSlotI][clipLen] == 32)
            && ((getAirborne)[playerSlotI][clipLen] == 2)
          )
            ? allNewStateObject.State_Flying_Screen_Air[playerSlotI].push(1)
            : allNewStateObject.State_Flying_Screen_Air[playerSlotI].push(0);
          // "Flying_Screen_OTG"
          (
            ((getFlyingScreen)[playerSlotI][clipLen] == 1)
            && ((getKnockdown_State)[playerSlotI][clipLen] == 32)
            && ((getAirborne)[playerSlotI][clipLen] == 3)
          )
            ? allNewStateObject.State_Flying_Screen_OTG[playerSlotI].push(1)
            : allNewStateObject.State_Flying_Screen_OTG[playerSlotI].push(0);
          // "FS_Install_1"
          (
            ((getFSI_Points)[playerSlotI][clipLen] == 8)
            || ((getFSI_Points)[playerSlotI][clipLen] == 9)
          )
            ? allNewStateObject.State_FS_Install_1[playerSlotI].push(1)
            : allNewStateObject.State_FS_Install_1[playerSlotI].push(0);
          // "FS_Install_2"
          (
            ((getFSI_Points)[playerSlotI][clipLen] > 9)
          )
            ? allNewStateObject.State_FS_Install_2[playerSlotI].push(1)
            : allNewStateObject.State_FS_Install_2[playerSlotI].push(0);
          // "NJ_Air"
          (
            ((getAirborne)[playerSlotI][clipLen] == 2)
            && ((getKnockdown_State)[playerSlotI][clipLen] == 3)
            && ((getSJ_Counter)[playerSlotI][clipLen] == 0)
          )
            ? allNewStateObject.State_NJ_Air[playerSlotI].push(1)
            : allNewStateObject.State_NJ_Air[playerSlotI].push(0);
          // "NJ_Rising
          (
            ((getAirborne)[playerSlotI][clipLen] == 0)
            && ((getKnockdown_State)[playerSlotI][clipLen] == 2)
            && ((getSJ_Counter)[playerSlotI][clipLen] == 0)
          )
            ? allNewStateObject.State_NJ_Rising[playerSlotI].push(1)
            : allNewStateObject.State_NJ_Rising[playerSlotI].push(0);
          // "OTG_Extra_Stun"
          (
            ((getKnockdown_State)[playerSlotI][clipLen] == 23)
            && (((getAirborne)[playerSlotI][clipLen] == 3))
          )
            ? allNewStateObject.State_OTG_Extra_Stun[playerSlotI].push(1)
            : allNewStateObject.State_OTG_Extra_Stun[playerSlotI].push(0);

          // "OTG_Forced_Stun"
          (
            ((getKnockdown_State)[playerSlotI][clipLen] == 32)
            && (((getAirborne)[playerSlotI][clipLen] == 3))
          )
            ? allNewStateObject.State_OTG_Forced_Stun[playerSlotI].push(1)
            : allNewStateObject.State_OTG_Forced_Stun[playerSlotI].push(0);
          // "OTG_Hit"
          (
            ((getAction_Flags)[playerSlotI][clipLen] == 0)
            && ((getAirborne)[playerSlotI][clipLen] == 3)
            && (((getKnockdown_State)[playerSlotI][clipLen] == 32))
          )
            ? allNewStateObject.State_OTG_Hit[playerSlotI].push(1)
            : allNewStateObject.State_OTG_Hit[playerSlotI].push(0);
          // "OTG_Roll_Invincible"
          (
            ((getAction_Flags)[playerSlotI][clipLen] == 2)
            && ((getAirborne)[playerSlotI][clipLen] == 1)
            && (((getAttack_Immune)[playerSlotI][clipLen] == 1)
              && ((getKnockdown_State)[playerSlotI][clipLen] == 17))
          )
            ? allNewStateObject.State_OTG_Roll_Invincible[playerSlotI].push(1)
            : allNewStateObject.State_OTG_Roll_Invincible[playerSlotI].push(0);

          // "OTG_Roll_Stunned"
          (
            ((getAction_Flags)[playerSlotI][clipLen] == 1)
            && ((getAirborne)[playerSlotI][clipLen] == 3)
            && (((getKnockdown_State)[playerSlotI][clipLen] == 32))
          )
            ? allNewStateObject.State_OTG_Roll_Stunned[playerSlotI].push(1)
            : allNewStateObject.State_OTG_Roll_Stunned[playerSlotI].push(0);
          // "ProxBlock_Air"
          (
            ((getIs_Prox_Block)[playerSlotI][clipLen] == 6)
            && ((getKnockdown_State)[playerSlotI][clipLen] == 19)
          )
            ? allNewStateObject.State_ProxBlock_Air[playerSlotI].push(1)
            : allNewStateObject.State_ProxBlock_Air[playerSlotI].push(0);
          // "ProxBlock_Ground"
          (
            ((getIs_Prox_Block)[playerSlotI][clipLen] == 5)
            && ((getKnockdown_State)[playerSlotI][clipLen] == 18)
          )
            ? allNewStateObject.State_ProxBlock_Ground[playerSlotI].push(1)
            : allNewStateObject.State_ProxBlock_Ground[playerSlotI].push(0);
          // "Pushblock_Air"
          (
            ((getBlock_Meter)[playerSlotI][clipLen] > 0)
            && ((getAnimation_Timer_Main)[playerSlotI][clipLen] < 28)
            && ((getIs_Prox_Block)[playerSlotI][clipLen] == 6)
            && ((getAction_Flags)[playerSlotI][clipLen] == 2)
          )
            ? allNewStateObject.State_Pushblock_Air[playerSlotI].push(1)
            : allNewStateObject.State_Pushblock_Air[playerSlotI].push(0);
          // "Pushblock_Ground"
          (
            ((getBlock_Meter)[playerSlotI][clipLen] > 0)
            && ((getAnimation_Timer_Main)[playerSlotI][clipLen] < 28)
            && ((getIs_Prox_Block)[playerSlotI][clipLen] == 5)
            && (((getAction_Flags)[playerSlotI][clipLen] == 3))
          )
            ? allNewStateObject.State_Pushblock_Ground[playerSlotI].push(1)
            : allNewStateObject.State_Pushblock_Ground[playerSlotI].push(0);
          // "Rising_Invincibility"
          (
            ((getAirborne)[playerSlotI][clipLen] == 0)
            && ((getAttack_Immune)[playerSlotI][clipLen] == 1)
            && ((getKnockdown_State)[playerSlotI][clipLen] == 17)
          )
            ? allNewStateObject.State_Rising_Invincibility[playerSlotI].push(1)
            : allNewStateObject.State_Rising_Invincibility[playerSlotI].push(0);
          // "SJ_Air"
          (
            ((getAirborne)[playerSlotI][clipLen] == 2)
            && ((getKnockdown_State)[playerSlotI][clipLen] == 14)
            && ((getSJ_Counter)[playerSlotI][clipLen] == 1)
          )
            ? allNewStateObject.State_SJ_Air[playerSlotI].push(1)
            : allNewStateObject.State_SJ_Air[playerSlotI].push(0);
          // "SJ_Counter"
          (
            ((getSJ_Counter)[playerSlotI][clipLen] == 2)
          )
            ? allNewStateObject.State_SJ_Counter[playerSlotI].push(1)
            : allNewStateObject.State_SJ_Counter[playerSlotI].push(0);
          // "Stun"
          (
            ((getKnockdown_State)[playerSlotI][clipLen] == 32)
            && ((getIs_Prox_Block)[playerSlotI][clipLen] == 13)
          )
            ? allNewStateObject.State_Stun[playerSlotI].push(1)
            : allNewStateObject.State_Stun[playerSlotI].push(0);
          // "Tech_Hit"
          (
            ((getKnockdown_State)[playerSlotI][clipLen] == 27)
          )
            ? allNewStateObject.State_Tech_Hit[playerSlotI].push(1)
            : allNewStateObject.State_Tech_Hit[playerSlotI].push(0);
          // "Thrown_Air"
          (
            ((getAirborne)[playerSlotI][clipLen] == 2)
            && ((getKnockdown_State)[playerSlotI][clipLen] == 31)
            && ((getIs_Prox_Block)[playerSlotI][clipLen] == 16)
          )
            ? allNewStateObject.State_Thrown_Air[playerSlotI].push(1)
            : allNewStateObject.State_Thrown_Air[playerSlotI].push(0);
          // "Thrown_Ground"
          (
            ((getAirborne)[playerSlotI][clipLen] == 0)
            && ((getKnockdown_State)[playerSlotI][clipLen] == 31)
            && ((getIs_Prox_Block)[playerSlotI][clipLen] == 16)
          )
            ? allNewStateObject.State_Thrown_Ground[playerSlotI].push(1)
            : allNewStateObject.State_Thrown_Ground[playerSlotI].push(0);
          // "Undizzy"
          (
            ((getAttack_Immune)[playerSlotI][clipLen] == 2)
            && ((getKnockdown_State)[playerSlotI][clipLen] == 32)
            && ((getIs_Prox_Block)[playerSlotI][clipLen] == 13)
            && ((getDizzy)[playerSlotI][clipLen] == 80)
            && ((getDizzy_Reset_Timer)[playerSlotI][clipLen] == 60)
          )
            ? allNewStateObject.State_UnDizzy[playerSlotI].push(1)
            : allNewStateObject.State_UnDizzy[playerSlotI].push(0);

          // "NEW_STATE_ADD_NAME_HERE" (its name in comments)
          // NEW_STATE_ADD_HERE
        } // clipLen Scope

        // Count | Increase each consecutive "1" by 1. Ex: "1,1,1,1,1" becomes "1,2,3,4,5" until they hit 0.
        var counter = 0;

        for (let stateDataEntryI in Object.entries(allNewStateObject)) {
          Object.values(allNewStateObject)[stateDataEntryI][playerSlotI].forEach((element, index) => {
            if (element == 0) {
              counter = 0
              return 0;
              // return Object.values(allDataObject)[stateDataEntryI][playerSlotI][index];
            }
            else {
              Object.values(allNewStateObject)[stateDataEntryI][playerSlotI][index] = (element + counter);
              counter++
              return Object.values(allNewStateObject)[stateDataEntryI][playerSlotI][index + counter]
            }
          });
        }

        // Write the files
        for (let stateFileIndex = 0; stateFileIndex < Object.entries(allNewStateObject).length; stateFileIndex++) {
          fs.writeFileSync(`${DIR_OUTPATH}${tempPlayerString}_${Object.keys(allNewStateObject)[stateFileIndex]}.js`,
            `var result = []; ` + '\n', { encoding: 'utf8' });
        }

        // Append data arrays into files
        for (let stateFileDataIndex = 0; stateFileDataIndex < Object.entries(allNewStateObject).length; stateFileDataIndex++) {
          fs.appendFileSync(`${DIR_OUTPATH}${tempPlayerString}_${Object.keys(allNewStateObject)[stateFileDataIndex]}.js`,
            JSON.stringify(Object.values(allNewStateObject)[stateFileDataIndex])
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
        `var result = [${dataObject[key]}];`,
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
        `var result = [${resultsArr.map((element) => {
          return (element == '') ? '' : `'${element}'`
        })}];`,
        'utf8', (err) => { if (err) throw err; }
      );
    }
  }

  /*
  --------------------------------------------------
  Step 5: 📞 Call Functions that Write Data to Files
  --------------------------------------------------
  */
  writeComboCallouts();
  appendMinMaxRound();
  writeP1P2Addresses();
  countIsPausedCNV();
  writeInputCNV();
  writeStageDataCNV();
  writeStaticDataCNV();
  writeTotalFramesCNV();

  getPlayerMemoryEntries().forEach((label) => {
    writePlayerMemory(1, label.toString(), 1);
    writePlayerMemory(2, label.toString(), 1);
  });
  writeNewStates()
  writeDataObject();

} // End of main forloop
console.timeEnd('writeAllData');

//TODO Fix CSV 'real-data' finder function.
//TODO Make Tests for each of the functions!
//TODO AE Position create a file for it to read from. // import static data
