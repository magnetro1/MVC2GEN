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
// Get the csv file names
var csvFilesArrayList = [];
fs.readdirSync(DIR_CSVS).forEach(function (file)
{
  if (file.endsWith('.csv') || file.endsWith('.CSV'))
  {
    csvFilesArrayList.push(file);
  }
});
// truncate the .csv from the file names
var csvSoloName = [];
csvFilesArrayList.forEach((name) =>
{
  let temp = '';
  temp = name.toString().replace('.csv', '')
  csvSoloName.push(temp);
});
// main loop for each csv file
for (let csv_list_idx = 0; csv_list_idx < csvFilesArrayList.length; csv_list_idx++)
{
  var FILENAME_NO_EXT = DIR_CSVS + csvFilesArrayList[csv_list_idx];
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
  // Make entire file buffer v1
  let dataObject = {};
  // make the values of each key into a string
  for (let i = 0; i < headersArray.length; i++)
  {
    dataObject[headersArray[i]] = allArrayStructure[i].join(','); // the key is the header name[i], the value are the numbers joined by a comma
  }
  // Make Total_Frames info. Write into the beginning of the file
  let missingEntries = [];
  for (let i = 0; i < allArrayStructure[0].length - 1; i++) // total frames
  {
    if (allArrayStructure[0][i + 1] - allArrayStructure[0][i] !== 1)
    {
      missingEntries.push(`Missing data entry after Total_Frame Number: ${ allArrayStructure[0][i] }\n`);
    }
  }
  let fileNameNoExt = csvSoloName[csv_list_idx];
  const DIR_OUTPATH = `${ DIR_EXPORT_TO_AE }${ fileNameNoExt }/`;
  // Make Output folder for AE files
  if (!fs.existsSync(`${ DIR_OUTPATH }`))
  {
    fs.mkdirSync(`${ DIR_OUTPATH }`);
  }

  //Append MIN&MAX value to buffer
  let tempMinMaxBuffer = '\n';
  let CLIP_LENGTH = dataObject['A_2D_Game_Timer'].split(',').length;

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
  }

  // Merge tempMinMaxBuffer into the dataObject
  var tempMinMaxBufferSplit = tempMinMaxBuffer.split('\n');
  for (let line in tempMinMaxBufferSplit)
  {
    var lineSplit = tempMinMaxBufferSplit[line].split('=');
    dataObject[lineSplit[0]] = lineSplit[1]; // [0] is the key, [1] is the value
  }

  // Round off floating point addresses using FLOATING_POINT_ADDRESSES
  var prefixes = ['P1_A_', 'P2_A_', 'P1_B_', 'P2_B_', 'P1_C_', 'P2_C_']
  var toFixedDigits = [0, 2, 4]; // 7 is the default
  for (let playerPrefix in prefixes)
  {
    for (let floatAdr in FLOATING_POINT_ADDRESSES)
    {
      // check if the floatAdr exist in this player prefix
      if (dataObject[prefixes[playerPrefix] + FLOATING_POINT_ADDRESSES[floatAdr]] !== undefined)
      {
        // console.log(`Rounding off ${ prefixes[playerPrefix] + FLOATING_POINT_ADDRESSES[floatAdr] }`);
        // round off each address by each number inside of toFixedDigits
        for (let digit in toFixedDigits)
        {
          let tempArray = dataObject[prefixes[playerPrefix] + FLOATING_POINT_ADDRESSES[floatAdr]].split(',');
          for (let i = 0; i < tempArray.length; i++)
          {
            tempArray[i] = parseFloat(tempArray[i]).toFixed(toFixedDigits[digit]);
          }
          dataObject[prefixes[playerPrefix] + FLOATING_POINT_ADDRESSES[floatAdr] + '_' + toFixedDigits[digit]] = tempArray.join(',');
        }
      }
    }
  }

  // /*
  // Write the dataObject into a file
  let dataObjectString = `var ${ csvSoloName[csv_list_idx] }_Object = \n` + JSON.stringify(dataObject);
  dataObjectString = dataObjectString.replace(/{"/g, '{\n\t"');
  dataObjectString = dataObjectString.replace(/"}/g, '"\n}');
  dataObjectString = dataObjectString.replace(/","/g, '",\n\t"');

  fs.writeFileSync(`${ DIR_SORTED_JS }${ csvSoloName[csv_list_idx] }Object.js`, dataObjectString);
  // */

  await sleep(1000);

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
  // Main function to write data to files OR return finalValues array
  /**
   * @param {number|string} PlayerOneOrPlayerTwo number or string, ex: 1 or "P1"
   * @param {string} playerMemoryAddress string, ex: "Health_Big"
   * @param {number|boolean} write flag to return array or write to file
   * @returns {Number[]} returns an array of numbers or writes a file for the playerMemoryAddress in the clip.
   * @description Finds the point character, and returns an array of numbers for the playerMemoryAddress in the clip.
   */
  function writePlayerMemory(PlayerOneOrPlayerTwo, playerMemoryAddress, write) 
  {
    let finalValuesArray = [[], [], []]; // 3 Arrays to hold all 3 player slots.
    let playerObjectSwitcher;// Switches between the Player1 and Player2 objects
    /**@description P1 | P2 */
    let playerSwitcher; // Switches between "P1" and "P2"

    if ((PlayerOneOrPlayerTwo == 1) || (PlayerOneOrPlayerTwo == "P1"))
    {
      playerObjectSwitcher = POINT_OBJ_P1;
      playerSwitcher = "P1";
    }
    else if ((PlayerOneOrPlayerTwo == 2) || (PlayerOneOrPlayerTwo == "P2"))
    {
      playerObjectSwitcher = POINT_OBJ_P2;
      playerSwitcher = "P2";
    }
    // Push all player memory addresses to finalValuesArray depending on the if-statement-logic
    for (let clipLen = 0; clipLen < CLIP_LENGTH; clipLen++) // length of clip
    {
      // 3-Character Bug Logic
      if ((Object.values(playerObjectSwitcher)[0][clipLen] == 0)
        && (Object.values(playerObjectSwitcher)[1][clipLen] == 0)
        && (Object.values(playerObjectSwitcher)[2][clipLen] == 0))
      {
        // console.log( `${ playerSwitcher}: 3-Character Bug Logic: A == 0 && B == 0 && C == 0    P1: ABC` );
        finalValuesArray[0].push(dataObject[`${ Object.keys(playerObjectSwitcher)[0] }${ playerMemoryAddress }`].split(',')[clipLen]);
        finalValuesArray[1].push(dataObject[`${ Object.keys(playerObjectSwitcher)[1] }${ playerMemoryAddress }`].split(',')[clipLen]);
        finalValuesArray[2].push(dataObject[`${ Object.keys(playerObjectSwitcher)[2] }${ playerMemoryAddress }`].split(',')[clipLen]);
      }
      // 2-Character Bug Logic
      else if ((Object.values(playerObjectSwitcher)[0][clipLen] == 0)
        && (Object.values(playerObjectSwitcher)[1][clipLen] == 0)
        && (Object.values(playerObjectSwitcher)[2][clipLen] != 0))
      {
        // console.log( `${ playerSwitcher}: 2-Character Bug Logic: A == 0 && B == 0 && C != 0    P1: AB` );
        finalValuesArray[0].push(dataObject[`${ Object.keys(playerObjectSwitcher)[0] }${ playerMemoryAddress }`].split(',')[clipLen]);
        finalValuesArray[1].push(dataObject[`${ Object.keys(playerObjectSwitcher)[1] }${ playerMemoryAddress }`].split(',')[clipLen]);
      }
      else if ((Object.values(playerObjectSwitcher)[0][clipLen] == 0)
        && (Object.values(playerObjectSwitcher)[1][clipLen] != 0)
        && (Object.values(playerObjectSwitcher)[2][clipLen] == 0))
      {
        // console.log( `${ playerSwitcher}: 2-Character Bug Logic: A == 0 && B != 0 && C == 0    P1: AC` );
        finalValuesArray[0].push(dataObject[`${ Object.keys(playerObjectSwitcher)[0] }${ playerMemoryAddress }`].split(',')[clipLen]);
        finalValuesArray[1].push(dataObject[`${ Object.keys(playerObjectSwitcher)[2] }${ playerMemoryAddress }`].split(',')[clipLen]);
      }
      else if ((Object.values(playerObjectSwitcher)[0][clipLen] != 0)
        && (Object.values(playerObjectSwitcher)[1][clipLen] == 0)
        && (Object.values(playerObjectSwitcher)[2][clipLen] == 0))
      {
        // console.log( `${ playerSwitcher}: 2-Character Bug Logic: A != 0 && B == 0 && C == 0    P1: BC` );
        finalValuesArray[0].push(dataObject[`${ Object.keys(playerObjectSwitcher)[1] }${ playerMemoryAddress }`].split(',')[clipLen]);
        finalValuesArray[1].push(dataObject[`${ Object.keys(playerObjectSwitcher)[2] }${ playerMemoryAddress }`].split(',')[clipLen]);
      }
      // 1-Character Logic
      else if ((Object.values(playerObjectSwitcher)[0][clipLen] == 0)
        && (Object.values(playerObjectSwitcher)[1][clipLen] != 0)
        && (Object.values(playerObjectSwitcher)[2][clipLen] != 0))
      {
        // console.log(`${ playerSwitcher }: 1-Character Logic: A == 0 && B != 0 && C != 0        P1: A`);
        finalValuesArray[0].push(dataObject[`${ Object.keys(playerObjectSwitcher)[0] }${ playerMemoryAddress }`].split(',')[clipLen]);
      }//                                                           P1|P2        P1_A        Health_Big                        i     
      else if ((Object.values(playerObjectSwitcher)[0][clipLen] != 0)
        && (Object.values(playerObjectSwitcher)[1][clipLen] == 0)
        && (Object.values(playerObjectSwitcher)[2][clipLen] != 0))
      {
        // console.log(`${ playerSwitcher }: 1-Character Logic: A != 0 && B == 0 && C != 0        P1: B`);
        finalValuesArray[0].push(dataObject[`${ Object.keys(playerObjectSwitcher)[1] }${ playerMemoryAddress }`].split(',')[clipLen]);
      }
      else if ((Object.values(playerObjectSwitcher)[0][clipLen] != 0)
        && (Object.values(playerObjectSwitcher)[1][clipLen] != 0)
        && (Object.values(playerObjectSwitcher)[2][clipLen] == 0))
      {
        // console.log(`${ playerSwitcher }: 1 - Character Logic: A != 0 && B != 0 && C == 0       P1: C`);
        finalValuesArray[0].push(dataObject[`${ Object.keys(playerObjectSwitcher)[2] }${ playerMemoryAddress }`].split(',')[clipLen]);
      }
    } // loop end

    // Return if not writing files
    if ((write == 0) || (write == false))
    {
      return finalValuesArray
    }
    else if ((write == 1) || (write == true))
    {
      (!fs.existsSync(`${ DIR_OUTPATH }/${ playerSwitcher }_${ playerMemoryAddress.split(',') }.js`))
      {
        fs.writeFileSync(`${ DIR_OUTPATH }/${ playerSwitcher }_${ playerMemoryAddress.split(',') }.js`,
          `var result = [];` + "\n",
          {flag: "a+", encoding: 'utf8'});

        // Append main data
        for (let dataArrayPerCharacter in finalValuesArray)
        {
          fs.appendFileSync(`${ DIR_OUTPATH }/${ playerSwitcher }_${ playerMemoryAddress.split(',') }.js`,
            `result[${ dataArrayPerCharacter }] = [${ finalValuesArray[dataArrayPerCharacter] }];\n`,
            {encoding: 'utf8'});
        }
      }
    }
  }// end of find-point-player-memory-function

  // Function to getPlayerMemoryEntries from the dataObject
  function getPlayerMemoryEntries()
  {
    let playerMemoryEntries = [];
    let playerMemoryRegex = /(P[1-2]_[A-C]_)/g; //[1] = P1_A
    for (let key in dataObject)
    {
      if (key.toString().match(playerMemoryRegex))
      {
        playerMemoryEntries.push(key);
      }
    }
    // Remove the playerMemoryRegex from the array using replace()
    playerMemoryEntries = playerMemoryEntries.map((label) =>
    {
      return label.replace(playerMemoryRegex, '');
    });

    // // Remove duplicates
    playerMemoryEntries = [...new Set(playerMemoryEntries)];
    // console.log(...playerMemoryEntries);
    return playerMemoryEntries;
  }

  // getPlayerMemoryEntries().forEach((label, index) =>
  // {
  //   // console.log(`${ index }: ${ label }`);
  //   writePlayerMemory(1, label.toString(), 1);
  //   writePlayerMemory(2, label.toString(), 1);
  // });

  // // break apart the dataObject and write eaach value into its own file using the key of the object as the filename
  // for (let key in dataObject)
  // {
  //   fs.writeFileSync(`${ DIR_OUTPATH }/${ key }.js`, `var result = [${ dataObject[key] }];`, {encoding: 'utf8'});
  // }
}