import {
  FLOATING_POINT_ADDRESSES,
  MIN_MAX_ADDRESSES,
  PMEM_PREFIXES,
} from './JS_UTIL_staticData.js';

import {
  DIR_EXPORT_TO_AE,
  DIR_CSVS,
  DIR_SORTED_JS
} from './JS_UTIL_paths.js';

import * as fs from 'fs';

// Write Sorted_JS folder if it doesn't exist
if (!fs.existsSync(DIR_SORTED_JS)) {
  fs.mkdirSync(DIR_SORTED_JS);
}
// Write exportToAE folder if it doesn't exist
if (!fs.existsSync(DIR_EXPORT_TO_AE)) {
  fs.mkdirSync(DIR_EXPORT_TO_AE);
}

/*
--------------------------------------------------
Step 1: Get the CSV file names from a directory
--------------------------------------------------
*/
const clipDataAE = '_clipDataAE'
let csvFilesArr = [];
let csvSoloNameArr = [];
let dataObject = {};
let tempJS = '';
let DIR_OUTPATH = '';

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
  tempJS = `${DIR_EXPORT_TO_AE}${csvSoloNameArr[csvFilesIDX]}.js`;
  /**
   * @description The path to the output folder for the AE files
   * @path `resources/Both_Emulator_Resources/JS_Utils/exportToAE/`
   */
  DIR_OUTPATH = `${DIR_EXPORT_TO_AE}${csvSoloNameArr[csvFilesIDX]}/`;
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
  // Check for missing entries. Two strings, write once.
  let missingEntries = [`/*\n`];
  for (let i = 0; i < allArrayStructure[0].length - 1; i++) // total frames
  {
    if (allArrayStructure[0][i + 1] - allArrayStructure[0][i] !== 1) {
      missingEntries.push(`Missing data after Total_Frame #: ${allArrayStructure[0][i]}\n`);
    }
    else {
      continue
    }
  }
  // If MissingEntries is empty:

  if (missingEntries.length == 0) {
    missingEntries.push('/*\nNo missing entries\n');
  }
  missingEntries.push(`\nFirst entry in Total_Frames: ${allArrayStructure[0][0]}\n`
    + `Final entry in Total_Frames: ${allArrayStructure[0][allArrayStructure[0].length - 1]}\n\n`
    + `Total_Frames in Clip: ${allArrayStructure[0].length}\n*/\n\n`
    + `var result = [];\n`
    + `result[0] = '${csvSoloNameArr[csvFilesIDX]}';\n`
  );
  // if the file doesn't exist, write it
  if (!fs.existsSync(`${DIR_OUTPATH}${clipDataAE}.js`)) {
    fs.writeFileSync(`${DIR_OUTPATH}${clipDataAE}.js`,
      missingEntries.toString().replace(/,/g, ''));
  }

  for (let i = 0; i < headersArray.length; i++) {
    // the key is the header name[i], the value = numbers joined by a comma
    dataObject[headersArray[i]] = allArrayStructure[i].join(',');
  }
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
  const postFixes = ['', '_Min', '_Max']
  const toFixedDigits = [0]; // 7 is the default
  for (let playerPrefix in PMEM_PREFIXES) {
    for (let floatAdr in FLOATING_POINT_ADDRESSES) {
      for (let postFix in postFixes) {
        let fullAdr = FLOATING_POINT_ADDRESSES[floatAdr] + postFixes[postFix];
        for (let digit in toFixedDigits) {
          let tempArray = dataObject[PMEM_PREFIXES[playerPrefix] + fullAdr].split(',');
          for (let i = 0; i < tempArray.length; i++) {
            tempArray[i] = parseFloat(tempArray[i]).toFixed(toFixedDigits[digit]);
          }
          // Merge tempArray into the dataObject so that it is written later.
          // Includes combo_meter min and maxes
          dataObject[PMEM_PREFIXES[playerPrefix]
            + fullAdr + '_'
            + toFixedDigits[digit]] = tempArray.join(',');
        }
      }
    }
  }
}
appendMinMaxRound();

export { tempJS, dataObject, CLIP_LENGTH, POINT_OBJ_P1, POINT_OBJ_P2, DIR_OUTPATH, clipDataAE, }
