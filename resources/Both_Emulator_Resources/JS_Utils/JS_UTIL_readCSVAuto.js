import * as fs from 'fs';
import {DIR_CSVS, DIR_SORTED_JS, TAIL_TEXT} from './JS_UTIL_paths.js';
import {answer} from './JS_UTIL_getCSVName.js';

const FILENAME_NO_EXT = DIR_CSVS + answer; // prompt to rename'MvC2DataAll_Original';

const FILE = `${ FILENAME_NO_EXT }_Original.csv`;

var headersArray = [];
var allDataArray = [];
fs.readFileSync(FILE, 'utf8').split('\r\n').map((line, index) =>
{
  if (index === 0)
  {
    headersArray = line.split(',');
  }
  else
  {
    allDataArray.push(line.split(','));
  } return null;
});

// // Sorting by the first column's first value (Total_Frames)
allDataArray.sort((a, b) => a[0] - b[0]);

/**
 * @description Counts the amount of times a value appears in an array and returns the value that appears the most
 * @param {Number[]} arrayOfNumbers dynamic amount of numbers, depending on the csv file
 * @returns single number value as a string
 */
function countReplayData(arrayOfNumbers)
{
  // Count the values in the arrays and store them in an object
  let counterObject = {};
  for (let numbersIdx = 0; numbersIdx < arrayOfNumbers.length; numbersIdx++)
  {
    if (counterObject[arrayOfNumbers[numbersIdx]] == undefined)
    {
      counterObject[arrayOfNumbers[numbersIdx]] = 1;
    }
    else
    {
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
  for (let key in counterObject)
  {
    if (counterObject[key] > largestValue)
    {
      largestValue = counterObject[key];
      largestValueKey = key;
    }
  }
  // If the value is 0, return the next value that is not 0
  if (arrayOfNumbers.length == 2)
  {
    if ((arrayOfNumbers[0] == 0) && (arrayOfNumbers[1] != 0))
    {
      return arrayOfNumbers[1];
    }
    // Opposite
    else if ((arrayOfNumbers[1] == 0) && (arrayOfNumbers[0] != 0))
    {
      return arrayOfNumbers[0];
    }
  }
  return largestValueKey;
}
// Find true data
var tempDataArr = [];
for (let totalLines = 1; totalLines < allDataArray.length - 1; totalLines++)
{
  if (allDataArray[totalLines][0] == allDataArray[totalLines + 1][0]) // we are in a duplicate line entry based on total_frames
  {
    for (let headerValue = 0; headerValue < headersArray.length; headerValue++)
    {
      if (allDataArray[totalLines][headerValue] != allDataArray[totalLines + 1][headerValue])
      {
        tempDataArr[0] = (allDataArray[totalLines][headerValue]);
        tempDataArr[1] = (allDataArray[totalLines + 1][headerValue]);

        if (allDataArray[totalLines][0] == allDataArray[totalLines + 2][0])
        {
          tempDataArr[2] = (allDataArray[totalLines + 2][headerValue]);
          if (allDataArray[totalLines][0] == allDataArray[totalLines + 3][0])
          {
            tempDataArr[3] = (allDataArray[totalLines + 3][headerValue]);
            if (allDataArray[totalLines][0] == allDataArray[totalLines + 4][0])
            {
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
      else
      {
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

// // Transpose the array by columns
var allArrayStructure = [];
for (let headerIndex = 0; headerIndex < headersArray.length; headerIndex++)
{
  allArrayStructure.push([]);
}
// Fill the array of arrays with the data separated by column
for (let rowIdx = 1; rowIdx < allDataArray.length; ++rowIdx)
{
  for (let colIdx = 0; colIdx < headersArray.length; ++colIdx)
  {
    allArrayStructure[colIdx].push(allDataArray[rowIdx][colIdx]);
  }
}
// Make entire file buffer
var stringArray = [];
for (let header in headersArray)
{
  stringArray.push(`export const ${ headersArray[header] } = '${ allArrayStructure[header] }';`);
}

// Make Total_Frames info
var missingEntries = [];
for (let i = 0; i < allArrayStructure[0].length - 1; i++) // total frames
{
  if (allArrayStructure[0][i + 1] - allArrayStructure[0][i] !== 1)
  {
    missingEntries.push(`Missing data entry after Total_Frame Number: ${ allArrayStructure[0][i] }\n`);
  }
}
if (missingEntries.length > 0)
{
  fs.writeFileSync(`${ DIR_SORTED_JS }${ answer }${ TAIL_TEXT }`,
    (`/*\n${ missingEntries }\nFirst entry in Total_Frames: ${ allArrayStructure[0][0] }\nFinal entry in Total_Frames: ${ allArrayStructure[0][allArrayStructure[0].length - 1] }\nTotal_Frames in Clip: ${ allArrayStructure[0].length }\n*/\n`)
      .replace(/,/g, ''));
  console.log('Missing entries logged.');
}
else
{
  fs.writeFileSync(`${ DIR_SORTED_JS }${ answer }${ TAIL_TEXT }`,
    (`/*\nNo missing data entries\nFirst entry in Total_Frames: ${ allArrayStructure[0][0] }\nFinal entry in Total_Frames: ${ allArrayStructure[0][allArrayStructure[0].length - 1] }\nTotal_Frames in Clip: ${ allArrayStructure[0].length }\n*/\n`)
      .replace(/,/g, ''));
}
fs.appendFileSync(`${ DIR_SORTED_JS }${ answer }${ TAIL_TEXT }`,
  (`${ stringArray.join('\n') }`));

console.log('Done writing Sorted_JS file.');
// console.log(answer);

export const knownName = answer;