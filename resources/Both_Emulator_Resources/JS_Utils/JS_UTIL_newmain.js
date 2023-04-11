/*
--------------------------------------------------
Step 0: Import the necessary modules
--------------------------------------------------
*/

import * as fs from 'fs';
// import clipboard from "clipboardy";
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

/*
--------------------------------------------------
Step 1: Get the CSV file names from a directory
--------------------------------------------------
*/

var csvFilesArrayList = [];
fs.readdirSync(DIR_CSVS).forEach(function (file)
{
  if (file.endsWith('.csv') || file.endsWith('.CSV'))
  {
    csvFilesArrayList.push(file);
  }
});
// truncate the .csv from the file names
var csvSoloNameArr = [];
csvFilesArrayList.forEach((name) =>
{
  let temp = '';
  temp = name.toString().replace('.csv', '')
  csvSoloNameArr.push(temp);
});

/*
--------------------------------------------------
Step 2: Process the array of CSVs
--------------------------------------------------
*/

// Main loop starts here
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

  // Sorting by the first column's first value (Total_Frames)
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
  // ! Find true data
  // TODO Update the logic for this function
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
  // Transpose the array by columns
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

  /*
  --------------------------------------------------
  Step 3: Make dataObject & Start Functions
  --------------------------------------------------
  */
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
  let fileNameNoExt = csvSoloNameArr[csv_list_idx];
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
          //Merge tempArray into the dataObject
          dataObject[prefixes[playerPrefix] + FLOATING_POINT_ADDRESSES[floatAdr] + '_' + toFixedDigits[digit]] = tempArray.join(',');
        }
      }
    }
  }

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

  // Write Static Data Conversion. Example ID_2: 01 turns into "Ryu"
  /**
   * @returns {Number[]} returns an array of numbers and writes a file with _CNV appended to its name
   * @description Writes and converts the point character's values for Knockdown State, Is_Prox_Block, ID_2 and _PortraitsToTime
  */
  function writeStaticDataCNV()
  {
    const STATIC_DATA_OBJS = [KNOCKDOWN_STATE_OBJ, PROX_BLOCK_OBJ, NAME_TABLE_OBJ, PORTRAITS_TO_TIME_OBJ]
    const STATIC_DATA_ADRS = ["Knockdown_State", "Is_Prox_Block", "ID_2", "ID_2"]
    let staticLookupResultsArray = [[], [], []];

    for (let playersLen = 1; playersLen < 3; playersLen++)
    {
      for (let staticDataLen = 0; staticDataLen < STATIC_DATA_ADRS.length; staticDataLen++)
      {
        // Make directories if they don't exist
        if (!fs.existsSync(DIR_OUTPATH))
          fs.mkdirSync(DIR_OUTPATH);
        // Write base file
        if (STATIC_DATA_OBJS[staticDataLen] == PORTRAITS_TO_TIME_OBJ) // PortraitsToTime Condition
        {
          fs.writeFileSync(`${ DIR_OUTPATH }P${ playersLen }_PortraitsToTime.js`,
            `var result = [];` + "\n",
            {encoding: 'utf8'});
        }
        else
        {
          fs.writeFileSync(`${ DIR_OUTPATH }P${ playersLen }_${ STATIC_DATA_ADRS[staticDataLen] }_CNV.js`,
            `var result = [];` + "\n",
            {encoding: 'utf8'});
        }
      }
      for (let staticDataEntry = 0; staticDataEntry < STATIC_DATA_ADRS.length; staticDataEntry++)
      {
        const callPlayerMemoryFN = writePlayerMemory(`${ playersLen }`, STATIC_DATA_ADRS[staticDataEntry], 0);
        for (let characterSlotI = 0; characterSlotI < callPlayerMemoryFN.length; characterSlotI++) // [0][1][2]
        {
          // Push and convert all three arrays' values
          for (let clipLen = 0; clipLen < callPlayerMemoryFN[characterSlotI].length; clipLen++) // CLIPLENGTH
          {
            staticLookupResultsArray[characterSlotI].push(`"${ Object.values(STATIC_DATA_OBJS[staticDataEntry])[callPlayerMemoryFN[characterSlotI][clipLen]] }"`);
          }

          if (STATIC_DATA_OBJS[staticDataEntry] == PORTRAITS_TO_TIME_OBJ) // PortraitsToTime Condition
          {
            fs.appendFileSync(`${ DIR_OUTPATH }P${ playersLen }_PortraitsToTime.js`, `result[${ characterSlotI }] = [${ staticLookupResultsArray[characterSlotI] }];\n`,
              {encoding: 'utf8'});
            staticLookupResultsArray = [[], [], []];
          }
          else
          {
            fs.appendFileSync(`${ DIR_OUTPATH }P${ playersLen }_${ STATIC_DATA_ADRS[staticDataEntry] }_CNV.js`, `result[${ characterSlotI }] = [${ staticLookupResultsArray[characterSlotI] }];\n`,
              {encoding: 'utf8'});
            staticLookupResultsArray = [[], [], []];
          }
        }
      }
    }
  };
  /**
 * @description outputs 3 arrays containing Total_Frames in ascending and then descending order, and Max number in clip.
 */
  function writeTotalFramesCNV()
  {
    let totalFrameArrT1 = [];
    let totalFrameArrT2 = [];

    Object.values(dataObject['Total_Frames']).forEach((frame, indexT1) =>
    {
      totalFrameArrT1.push(indexT1);
    });
    // Padded Zeroes for program pad comp
    Object.values(dataObject['Total_Frames']).forEach((frame, indexT2) =>
    {
      if (indexT2 == 0)
      {
        indexT2++
      }
      else if (indexT2 < 10)
      {
        indexT2.toString()
        indexT2 = '000' + indexT2
      }
      else if (indexT2 < 100)
      {
        indexT2.toString()
        indexT2 = '00' + indexT2
      }
      else if (indexT2 < 1000)
      {
        indexT2.toString()
        indexT2 = '0' + indexT2
      }
      else
      {
        indexT2
      }
      totalFrameArrT2.push(indexT2);
    });

    // T1 for Normal Compositions
    fs.writeFileSync(`${ DIR_OUTPATH }Total_Frames_CNV.js`,
      `var result = [];\nresult[0] = [${ totalFrameArrT1 }];\n`,
      {encoding: 'utf8'});
    totalFrameArrT1.reverse()
    fs.appendFileSync(`${ DIR_OUTPATH }Total_Frames_CNV.js`,
      `result[1] = [${ totalFrameArrT1 }];\n`,
      {encoding: 'utf8'});
    for (let idx in totalFrameArrT1)
    {
      totalFrameArrT1[idx] = totalFrameArrT1[0]
    }
    fs.appendFileSync(`${ DIR_OUTPATH }Total_Frames_CNV.js`,
      `result[2] = [${ totalFrameArrT1 }];\n`,
      {encoding: 'utf8'});

    // T2 for ASCII Pad Composition
    totalFrameArrT2.splice(0, 1)
    fs.appendFileSync(`${ DIR_OUTPATH }Total_Frames_CNV.js`,
      `result[3] = ['${ totalFrameArrT2 }'];\n`,
      {encoding: 'utf8'});
    totalFrameArrT2.reverse()
    fs.appendFileSync(`${ DIR_OUTPATH }Total_Frames_CNV.js`,
      `result[4] = ['${ totalFrameArrT2 }'];\n`,
      {encoding: 'utf8'});
    for (let idx in totalFrameArrT2)
    {
      totalFrameArrT2[idx] = totalFrameArrT2[0]
    }
    fs.appendFileSync(`${ DIR_OUTPATH }Total_Frames_CNV.js`,
      `result[5] = ['${ totalFrameArrT2 }'];\n`,
      {encoding: 'utf8'});
    // }
  };

  function writeStageDataCNV() // Fills out color data for stages in Hex in result[1]
  {
    let stageData = [];
    let stageDataCNV = [];
    // Numbers
    dataObject['Stage_Selector'].split(',').forEach((frame) =>
    {
      stageData.push(frame)
    });
    // console.log(stageData);
    // Hex
    dataObject['Stage_Selector'].split(',').forEach((frame) =>
    {
      stageDataCNV.push(`"${ Object.values(STAGES_OBJ)[frame] }"`)
    });
    fs.writeFileSync(`${ DIR_OUTPATH }Stage_Selector_CNV.js`,
      `var result = [];\nresult[0] = [${ stageData }];\n`,
      {encoding: 'utf8'});
    fs.appendFileSync(`${ DIR_OUTPATH }Stage_Selector_CNV.js`,
      `result[1] = [${ stageDataCNV }];\n`,
      {encoding: 'utf8'});
    // console.log(stageDataCNV);
    stageData = [];
    stageDataCNV = [];
    // }
  };
  /**
  * @description Converts and writes inputs to one file that contains formatting for a custom-font and US FGC notation
  **/
  function writeInputCNV()
  {
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

    for (let playersLen = 1; playersLen < 3; playersLen++)
    {
      playersLen == 1 ? tempP1OrP2 = P1_InputsDECSplit : tempP1OrP2 = P2_InputsDECSplit;
      // Input Conversion Type 1
      for (const input in tempP1OrP2)
      {
        for (const button in Object.entries(buttonConversionVersion1))
        {
          if ((tempP1OrP2[input] & Object.values(buttonConversionVersion1)[button]) != 0)
          {
            playerInputResults += `${ Object.keys(buttonConversionVersion1)[button] }`;
          }
        }
        playerInputsCNVArray.push(playerInputResults);
        playerInputResults = "";
      }
      fs.writeFileSync(`${ DIR_OUTPATH }P${ playersLen }_Inputs_CNV.js`,
        `var result = [];\nresult[0] = ["` +
        `${ playerInputsCNVArray.toString()
          .replace(/24/gi, "1")
          .replace(/42/gi, "1")
          .replace(/26/gi, "3")
          .replace(/62/gi, "3")
          .replace(/48/gi, "7")
          .replace(/84/gi, "7")
          .replace(/86/gi, "9")
          .replace(/68/gi, "9")
        }"];\n`,
        {encoding: 'utf8'});
      playerInputsCNVArray = [];

      // Input Conversion Type 2
      for (const input in tempP1OrP2)
      {
        for (const button in Object.entries(buttonConversionVersion2))
        {
          if ((tempP1OrP2[input] & Object.values(buttonConversionVersion2)[button]) != 0) // If the &'ed value is not 0, the value is converted
          {
            playerInputResults += Object.keys(buttonConversionVersion2)[button];
          }
        }
        playerInputsCNVArray.push(playerInputResults);
        playerInputResults = "";
      }
      fs.appendFileSync(`${ DIR_OUTPATH }P${ playersLen }_Inputs_CNV.js`,
        `result[1] = ["${ playerInputsCNVArray.toString()
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
        {encoding: 'utf8'}
      );
      playerInputsCNVArray = [];

      // Input Conversion Type 3
      for (const input in tempP1OrP2)
      {
        for (const button in Object.entries(buttonConversionVersion2))
        {
          if ((tempP1OrP2[input] & Object.values(buttonConversionVersion2)[button]) != 0) // If the &'ed value is not 0, the value is converted
          {
            playerInputResults += Object.keys(buttonConversionVersion2)[button];
          }
        }
        playerInputsCNVArray.push(playerInputResults);
        playerInputResults = "";
      }
      fs.appendFileSync(`${ DIR_OUTPATH }P${ playersLen }_Inputs_CNV.js`,
        `\nresult[2] = ["${ playerInputsCNVArray.toString()
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
        {encoding: 'utf8'}
      );
      playerInputsCNVArray = [];
    }
  } // end of InputCNV

  /*
  --------------------------------------------------
  Step 4: Call Functions that Write Data to Files
  --------------------------------------------------
  */
  // 📞 Functions
  // writeInputCNV() //TODO push this data into the main dataObject
  // writeStageDataCNV() //TODO push this data into the main dataObject
  // writeStaticDataCNV() //TODO push this data into the main dataObject
  // writeTotalFramesCNV();//TODO push this data into the main dataObject
  // // Parse csv for player-memory entries
  // getPlayerMemoryEntries().forEach((label, index) =>
  // {
  //   // console.log(`${ index }: ${ label }`);
  //   writePlayerMemory(1, label.toString(), 1);
  //   writePlayerMemory(2, label.toString(), 1);
  // });
  // dataObject to JS files
  // for (let key in dataObject)
  // {
  //   fs.writeFileSync(`${ DIR_OUTPATH }/${ key }.js`, `var result = [${ dataObject[key] }];`, {encoding: 'utf8'});
  //   if (key == undefined) {continue;}
  // }
  // Write the dataObject into a file
  // let dataObjectString = `var ${ csvSoloName[csv_list_idx] }_Object = \n` + JSON.stringify(dataObject);
  // dataObjectString = dataObjectString.replace(/{"/g, '{\n\t"');
  // dataObjectString = dataObjectString.replace(/"}/g, '"\n}');
  // dataObjectString = dataObjectString.replace(/","/g, '",\n\t"');
  // dataObjectString = dataObjectString.replace(/"/g, `'`);
  // dataObjectString = dataObjectString.replace(/'(\w*)'/g, `$1`);

  // fs.writeFileSync(`${ DIR_SORTED_JS }${ csvSoloName[csv_list_idx] }Object.js`, dataObjectString);
  // console.log(missingEntries);
} // End of main forloop

/*
General goals:
- [x] Parse CSV
- [x] Track missing entries and write them into _SortedJS.js
- [x] Write CSV data to JS files
- [ ] module-export the functions
- [ ] make unit tests for each function (?)
*/