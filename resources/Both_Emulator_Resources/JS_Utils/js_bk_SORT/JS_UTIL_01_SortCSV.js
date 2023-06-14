/* eslint-disable no-continue */
import * as fs from 'fs';
import {
  DIR_EXPORT_TO_AE,
  DIR_CSVS,
} from './JS_UTIL_paths.js';

import CSV_FILES_ARRAY from './JS_UTIL_00_GetCSVs.js';

const giantObject = {};
/**
 * @description Counts the amount of times a value appears in an array and returns the value
 * that appears the most
 * @param {Number[]} arrayOfNumbers dynamic amount of numbers, depending on the csv file
 * @returns single number value as a string
*/
function countReplayData(arrayOfNumbers) {
  // Count the values in the arrays and store them in an object
  const counterObject = {};
  for (let numbersIdx = 0; numbersIdx < arrayOfNumbers.length; numbersIdx++) {
    // If the value doesn't exist (undefined),
    // add it into the counter object,
    // else add 1 to it
    if (counterObject[arrayOfNumbers[numbersIdx]] === undefined) {
      counterObject[arrayOfNumbers[numbersIdx]] = 1;
    } else {
      counterObject[arrayOfNumbers[numbersIdx]] += 1;
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
  for (const key in counterObject) {
    if (counterObject[key] > largestValue) {
      largestValue = counterObject[key];
      largestValueKey = key;
    }
  }
  // If the value is 0, return the next value that is not 0
  if (arrayOfNumbers.length === 2) {
    if ((arrayOfNumbers[0] === 0) && (arrayOfNumbers[1] !== 0)) {
      return arrayOfNumbers[1];
    }
    // Opposite
    if ((arrayOfNumbers[1] === 0) && (arrayOfNumbers[0] !== 0)) {
      return arrayOfNumbers[0];
    }
  }
  // console.log(`largestValueKey: ${largestValueKey}`);
  return largestValueKey;
}
/**
 * @description Processes array of CSV files and pushes their content into dataObject.
 * Also writes a folder with an info file in the exportToAE folder.
 * @param {String[]} arrayOfCSVs Array of CSV files used as directory location pointers
 * @returns {Object} giantArrayObject
*/

export function processCSV(arrayOfCSVs) {
  for (let csvFilesIDX = 0; csvFilesIDX < arrayOfCSVs.length; csvFilesIDX++) {
    let headersArray = [];
    const allDataArray = [];
    const DIR_OUTPATH = `${DIR_EXPORT_TO_AE}${arrayOfCSVs[csvFilesIDX]}/`;
    // Make Output folder for AE files
    if (!fs.existsSync(`${DIR_OUTPATH}`)) {
      fs.mkdirSync(`${DIR_OUTPATH}`);
    }
    fs.readFileSync(
      `${DIR_CSVS + arrayOfCSVs[csvFilesIDX]}.csv`,
      'utf8',
    ).split('\r\n')
      .map((line, index) => {
        if (index === 0) {
          // Get the headers
          headersArray = line.split(',');
        } else {
          // Get the data
          allDataArray.push(line.split(','));
        } return null;
      });

    // Sorting by the first column's first value (Total_Frames)
    allDataArray.sort((a, b) => a[0] - b[0]);

    // TODO Update the logic for this function
    let tempDataArr = [];
    for (let totalLines = 1; totalLines < allDataArray.length - 1; totalLines++) {
      // we are in a duplicate line entry based on total_frames
      if (allDataArray[totalLines][0] === allDataArray[totalLines + 1][0]) {
        for (let headerValue = 0; headerValue < headersArray.length; headerValue++) {
          if (allDataArray[totalLines][headerValue] !== allDataArray[totalLines + 1][headerValue]) {
            tempDataArr[0] = (allDataArray[totalLines][headerValue]);
            tempDataArr[1] = (allDataArray[totalLines + 1][headerValue]);

            if (allDataArray[totalLines][0] === allDataArray[totalLines + 2][0]) {
              tempDataArr[2] = (allDataArray[totalLines + 2][headerValue]);
              if (allDataArray[totalLines][0] === allDataArray[totalLines + 3][0]) {
                tempDataArr[3] = (allDataArray[totalLines + 3][headerValue]);
                if (allDataArray[totalLines][0] === allDataArray[totalLines + 4][0]) {
                  tempDataArr[4] = (allDataArray[totalLines + 4][headerValue]);

                  allDataArray[totalLines][headerValue] = countReplayData(tempDataArr);
                  tempDataArr = [];
                  continue;
                }
                allDataArray[totalLines][headerValue] = countReplayData(tempDataArr);
                tempDataArr = [];
                continue;
              }
              allDataArray[totalLines][headerValue] = countReplayData(tempDataArr);
              tempDataArr = [];
              continue;
            }
            allDataArray[totalLines][headerValue] = countReplayData(tempDataArr);
            // console.log(countReplayData(tempDataArr));
            // console.log(allDataArray[totalLines][headerValue]);
            tempDataArr = [];
            continue;
          } else {
            tempDataArr[0] = (allDataArray[totalLines][headerValue]);
            tempDataArr[1] = (allDataArray[totalLines + 1][headerValue]);
            allDataArray[totalLines][headerValue] = countReplayData(tempDataArr);
            // console.log(tempDataArr[0])
            // console.log(tempDataArr[1])
            tempDataArr = [];
            break;
          }
        }
      }
    }

    // Removing duplicates using the first column's value (Total_Frames)
    // length-1 because we're checking the next element
    for (let check = 0; check < allDataArray.length - 1; check++) {
      // line number is the same as the next line
      if ((allDataArray[check + 1][0] === allDataArray[check][0])) {
        allDataArray.splice(check + 1, 1); // remove the next line
        check -= 1; // go back to original line in order to check the next line again
      }
    }
    // Transpose the array by columns
    const allArrayStructure = [];
    for (let headerIndex = 0; headerIndex < headersArray.length; headerIndex++) {
      allArrayStructure.push([]);
    }
    // Fill the array of arrays with the data separated by column
    for (let rowIdx = 1; rowIdx < allDataArray.length; ++rowIdx) {
      for (let colIdx = 0; colIdx < headersArray.length; ++colIdx) {
        allArrayStructure[colIdx].push(allDataArray[rowIdx][colIdx]);
      }
    }
    // Check for missing entries
    const missingEntries = ['/*\n'];
    for (let i = 0; i < allArrayStructure[0].length - 1; i++) {
      if (allArrayStructure[0][i + 1] - allArrayStructure[0][i] !== 1) {
        missingEntries.push(
          `Missing data entry after Total_Frame Number: ${allArrayStructure[0][i]}\n`,
        );
      }
    }
    // If MissingEntries is empty, then there are no missing entries. Push a comment to the array.
    // console.log(missingEntries);
    if (missingEntries.length === 1) {
      missingEntries.push(
        'No missing entries\n',
        `\nFirst entry in Total_Frames: ${allArrayStructure[0][0]}\n`
        + `Final entry in Total_Frames: ${allArrayStructure[0][allArrayStructure[0].length - 1]}\n`
        + `Total_Frames in Clip: ${allArrayStructure[0].length}\n*/\n`,
      );
    } else {
      missingEntries.push(
        `\nFirst entry in Total_Frames: ${allArrayStructure[0][0]}\n`
        + `Final entry in Total_Frames: ${allArrayStructure[0][allArrayStructure[0].length - 1]}\n`
        + `Total_Frames in Clip: ${allArrayStructure[0].length}\n*/\n`,
      );
    }
    // Write an info-file if the file doesn't exist
    if (!fs.existsSync(`${DIR_OUTPATH}_${arrayOfCSVs[csvFilesIDX]}.js`)) {
      fs.writeFileSync(
        `${DIR_OUTPATH}_${arrayOfCSVs[csvFilesIDX]}.js`,
        missingEntries.toString().replace(/,/g, ''),
      );
    }
    // Make an object inside of giantObject for each set of data from the csv
    giantObject[arrayOfCSVs[csvFilesIDX]] = {};
    // Fill the object with the data from the csv
    for (let i = 0; i < headersArray.length; i++) {
      giantObject[arrayOfCSVs[csvFilesIDX]][headersArray[i]] = allArrayStructure[i].join(',');
    }
    // if a value in the object is an array, convert it to a string.
    // for (const key in giantObject[arrayOfCSVs[csvFilesIDX]]) {
    for (const key of Object.keys(giantObject[arrayOfCSVs[csvFilesIDX]])) {
      // Target the values that are arrays
      if (Array.isArray(giantObject[arrayOfCSVs[csvFilesIDX]][key])) {
        // Turn the array into a string
        let tmpStr = giantObject[arrayOfCSVs[csvFilesIDX]][key];
        tmpStr = tmpStr.join(',');
      }
    }
  }
  // console.time('UTIL_01');
  // Write each entry from each object into a JS File.
  for (const tempObj in giantObject) {
    const DIR_OUTPATH = `${DIR_EXPORT_TO_AE}${tempObj}/`;
    for (const item in giantObject[tempObj]) {
      // if the item in the object matches this regex, skip it.
      const playerMemoryRegex = /(P[1-2]_[A-C]_)|Camera\w+/g; // [1] = P1_A
      if (playerMemoryRegex.test(item)) {
        continue;
      }
      const tempString = `var result = ['${giantObject[tempObj][item]}'];`;
      // Check if the file doesn't exist already before wrting it.
      if (!fs.existsSync(`${DIR_OUTPATH}${item}.js`)) {
        fs.writeFile(`${DIR_OUTPATH}${item}.js`, tempString, (err) => { if (err) throw err; });
      }
    }
  }
  // console.timeEnd('UTIL_01');
}
processCSV(CSV_FILES_ARRAY);

export default giantObject;
