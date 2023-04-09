import * as fs from 'fs';
import clipboard from "clipboardy";
import
{
  FLOATING_POINT_ADDRESSES,
  KNOCKDOWN_STATE_OBJ,
  MIN_MAX_ADDRESSES,
  MISC_ADDRESSES,
  NAME_TABLE_OBJ,
  PORTRAITS_TO_TIME_OBJ,
  PROX_BLOCK_OBJ,
  STAGES_OBJ
} from './JS_UTIL_staticData.js';

import
{
  DIR_SORTED_JS,
  DIR_EXPORT_TO_AE,
  TAIL_TEXT,
  DIR_CSVS
} from './JS_UTIL_paths.js';

const SLEEP_AMOUNT = 700;
function sleep(ms)
{
  return new Promise(function (resolve)
  {
    return setTimeout(resolve, ms);
  });
}

var csvArray = [];
fs.readdirSync(DIR_CSVS).forEach(function (file)
{
  if (file.endsWith('.csv') || file.endsWith('.CSV'))
  {
    csvArray.push(file);
  }
});

var knownName = [];
csvArray.forEach((name) =>
{
  let temp = '';
  temp = name.toString().replace('.csv', '')
  knownName.push(temp);
});

for (let mainCSVListIDX = 0; mainCSVListIDX < csvArray.length; mainCSVListIDX++)
{
  var FILENAME_NO_EXT = DIR_CSVS + csvArray[mainCSVListIDX];
  var headersArray = [];
  var allDataArray = [];

  fs.readFileSync(FILENAME_NO_EXT, 'utf8').split('\r\n').map((line, index) =>
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
    // stringArray.push(`export const ${ headersArray[header] } = '${ allArrayStructure[header] }';`);
    stringArray.push(`${ headersArray[header] }=${ allArrayStructure[header] }`);
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
  // Write Stuff

  if (fs.existsSync(`${ DIR_SORTED_JS }${ csvArray[mainCSVListIDX].replace(`.csv`, ``) }${ TAIL_TEXT }`)) // if the file exists
  {
    // delete the file
    fs.unlinkSync(`${ DIR_SORTED_JS }${ csvArray[mainCSVListIDX].replace(`.csv`, ``) }${ TAIL_TEXT }`);
  }
  // if (fs.existsSync(`${ DIR_SORTED_JS }${ csvArray[mainCSVListIDX].replace(`.csv`, ``) }${ TAIL_TEXT }`)) // if the file exists
  // {
  //   console.log(`File ${ csvArray[mainCSVListIDX] } already exists!`);
  // }
  // else #######################################################
  if (!(fs.existsSync(`${ DIR_SORTED_JS }${ csvArray[mainCSVListIDX].replace(`.csv`, ``) }${ TAIL_TEXT }`))) // if the file doesn't exist
  {
    // if (missingEntries.length > 0)
    // {
    var writeInitSorted = fs.promises.writeFile(`${ DIR_SORTED_JS }${ csvArray[mainCSVListIDX].replace(`.csv`, ``) }${ TAIL_TEXT }`,
      (`/*\n${ missingEntries }\nFirst entry in Total_Frames: ${ allArrayStructure[0][0] }\nFinal entry in Total_Frames: ${ allArrayStructure[0][allArrayStructure[0].length - 1] }\nTotal_Frames in Clip: ${ allArrayStructure[0].length }\n*/\n`)
        .replace(/,/g, '')).then(function ()
        {
          console.log(`File ${ csvArray[mainCSVListIDX].replace('.csv', '') }${ TAIL_TEXT } created!`);
        });
    // await writeInitSorted;
    // console.log('Missing entries logged.');
    // }
    // else
    // {
    //   fs.promises.writeFile(`${ DIR_SORTED_JS }${ csvArray[mainCSVListIDX].replace(`.csv`, ``) }${ TAIL_TEXT }`,
    //     (`/*\nNo missing data entries\nFirst entry in Total_Frames: ${ allArrayStructure[0][0] }\nFinal entry in Total_Frames: ${ allArrayStructure[0][allArrayStructure[0].length - 1] }\nTotal_Frames in Clip: ${ allArrayStructure[0].length }\n*/\n`)
    //       .replace(/,/g, ''));
    // }

    var finishSortedMissing = fs.promises.appendFile(`${ DIR_SORTED_JS }${ csvArray[mainCSVListIDX].replace(`.csv`, ``) }${ TAIL_TEXT }`,
      (`${ stringArray.join('\n') }`))
      .then(function ()
      {
        console.log(`File ${ csvArray[mainCSVListIDX].replace('.csv', '') }${ TAIL_TEXT } was saved!`);
      });
    // await finishSortedMissing;

  } // if sorted-js doesn't exist

  await writeInitSorted;
  await finishSortedMissing;
  // Main Logic

  var FILE_NAME_NO_EXT = knownName[mainCSVListIDX];
  var DIR_OUTPATH = `${ DIR_EXPORT_TO_AE }${ FILE_NAME_NO_EXT }/`;
  var ORG_JS_FILE = `${ DIR_SORTED_JS }${ FILE_NAME_NO_EXT }${ TAIL_TEXT }`;
  var NEW_JS_FILE = `${ DIR_SORTED_JS }New_${ FILE_NAME_NO_EXT }${ TAIL_TEXT }`;

  // Make Output folder for AE files
  if (!fs.existsSync(`${ DIR_OUTPATH }`))
  {
    fs.mkdirSync(`${ DIR_OUTPATH }`);
  }

  let tempMinMaxBuffer = '\n';
  // read the file with promises
  var readSortedJS = fs.promises.readFile(ORG_JS_FILE, 'utf8').then((data) =>
  {
    // separate the file by line, then convert the data into objects
    var dataSplit = data.split('\n');
    var dataObject = {};
    for (let line in dataSplit)
    {
      var lineSplit = dataSplit[line].split('=');
      dataObject[lineSplit[0]] = lineSplit[1]; // [0] is the key, [1] is the value
    }
    // console.log(dataObject);

    var CLIP_LENGTH = dataObject['A_2D_Game_Timer'].split(',').length;
    // console.log(CLIP_LENGTH);

    for (let adr in MIN_MAX_ADDRESSES)
    {
      const KEY = MIN_MAX_ADDRESSES[adr];

      const VALUE = dataObject[MIN_MAX_ADDRESSES[adr]].split(','); // Fetch the value by finding the key using its string name
      const MIN = Math.min(...VALUE);
      const MAX = Math.max(...VALUE);
      let tempMin = [];
      let tempMax = [];
      for (let clipLen = 0; clipLen < CLIP_LENGTH; clipLen++)
      {
        tempMax[clipLen] = MAX;
        tempMin[clipLen] = MIN;
      }
      tempMinMaxBuffer += `${ KEY }_Max=${ tempMax }\n`;
      tempMinMaxBuffer += `${ KEY }_Min=${ tempMin }\n`;
    } // for adr in MIN_MAX_ADDRESSES

    // split tempMinMaxBuffer by line, then merge into the dataObject
    var tempMinMaxBufferSplit = tempMinMaxBuffer.split('\n');
    for (let line in tempMinMaxBufferSplit)
    {
      var lineSplit = tempMinMaxBufferSplit[line].split('=');
      dataObject[lineSplit[0]] = lineSplit[1]; // [0] is the key, [1] is the value
    }
    // write the new dataObject to a new file
    // var writeNewSortedJS = fs.promises.writeFile(NEW_JS_FILE, `var myOBJ =\n` + JSON.stringify(dataObject, null, 2)).then(function ()
    // {
    //   console.log(`File ${ NEW_JS_FILE } created!`);
    // });
  })
  await sleep(1000);
  await readSortedJS;
}