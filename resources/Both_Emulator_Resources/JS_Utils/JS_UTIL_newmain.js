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
  TAIL_TEXT
} from './JS_UTIL_paths.js';

import {knownName} from './JS_UTIL_readCSVAuto.js'; //Calls getCSVName => readCSVAuto

const SLEEP_AMOUNT = 2500;
function sleep(ms)
{
  return new Promise(resolve => setTimeout(resolve, ms));
}

const DO_ROM_FILES = false; // Do or Skip ROM logic files

const FILE_NAME_NO_EXT = knownName; // ⭐ File name without extension
const DIR_OUTPATH = `${ DIR_EXPORT_TO_AE }${ FILE_NAME_NO_EXT }/`;

const ORG_JS_FILE = `${ DIR_SORTED_JS }${ FILE_NAME_NO_EXT }${ TAIL_TEXT }`;
console.log(ORG_JS_FILE);
const NEW_JS_FILE = `${ DIR_SORTED_JS }New_${ FILE_NAME_NO_EXT }${ TAIL_TEXT }`;

if (!fs.existsSync(`${ DIR_OUTPATH }`))
{
  fs.mkdirSync(`${ DIR_OUTPATH }`);
}
// Copy & Write Temp File ( that will be deleted )
var tempMinMaxBuffer = '\n';
import(`file://${ ORG_JS_FILE }`)
  .then((pMemZero) => // Imports SortedJS file as Object with key-value pairs
  {
    const CLIP_LENGTH = pMemZero.A_2D_Game_Timer.split(',').length;
    for (let adr in MIN_MAX_ADDRESSES)
    {
      const KEY = MIN_MAX_ADDRESSES[adr];
      const VALUE = pMemZero[MIN_MAX_ADDRESSES[adr]].split(','); // Fetch the value by finding the key using its string name
      const MIN = Math.min(...VALUE);
      const MAX = Math.max(...VALUE);
      let tempMin = [];
      let tempMax = [];

      for (let clipLen = 0; clipLen < CLIP_LENGTH; clipLen++)
      {
        tempMax[clipLen] = MAX;
        tempMin[clipLen] = MIN;
      }
      tempMinMaxBuffer += `export const ${ KEY }_Max = '${ tempMax }';\n`;
      tempMinMaxBuffer += `export const ${ KEY }_Min = '${ tempMin }';\n`;

      fs.promises.writeFile(`${ DIR_OUTPATH }${ MIN_MAX_ADDRESSES[adr] }_Max.js`,
        `export const ${ KEY }_Max = '${ tempMax }';\n`,
        {encoding: 'utf8'});

      fs.promises.writeFile(`${ DIR_OUTPATH }${ MIN_MAX_ADDRESSES[adr] }_Min.js`,
        `export const ${ KEY }_Min = '${ tempMin }';\n`,
        {encoding: 'utf8'});
    }
  })
  // Copy, append, write JS files, then bring back in
  .then(() => fs.promises.copyFile(`${ ORG_JS_FILE }`, NEW_JS_FILE).then(() => fs.promises.appendFile(NEW_JS_FILE, tempMinMaxBuffer))
    .then(() =>
    {
      fs.promises.readFile(NEW_JS_FILE, 'utf8')
        .then((newFile) => // Write all JS files
        {
          let allVariablesREGEX = /export const (\w+) = "(.*)";\n/gmi; // ALL variable regex
          let tempRegExVar;
          while (tempRegExVar = allVariablesREGEX.exec(newFile))
          {
            // console.log(tempRegExVar[1]);
            fs.promises.writeFile(`${ DIR_OUTPATH }${ tempRegExVar[1] }.js`,
              `var result = [];\n result[0] = [${ tempRegExVar[2] }];\n`,
              {encoding: 'utf8'});
          }
        })
    })
  )
  .then(() =>
    import(`file://${ NEW_JS_FILE }`)
      .then((pMem) =>
      {
        const CLIP_LENGTH = pMem.A_2D_Game_Timer.split(',').length; // Used as clip-length frame tracker; address doesn't matter
        const POINT_OBJ_P1 =
        {
          P1_A_: pMem.P1_A_Is_Point.split(','),
          P1_B_: pMem.P1_B_Is_Point.split(','),
          P1_C_: pMem.P1_C_Is_Point.split(',')
        };
        const POINT_OBJ_P2 =
        {
          P2_A_: pMem.P2_A_Is_Point.split(','),
          P2_B_: pMem.P2_B_Is_Point.split(','),
          P2_C_: pMem.P2_C_Is_Point.split(',')
        };

        /**
         * @description Dynamic player-memory variable list as each JS file is not guaranteed to be the same
         * @returns {Array} Array of all unique Cheat Table entries from the replay in the JS file.
         **/
        function getPlayerMemoryEntries()
        {
          let playerDataAll = []
          let playerMemoryRegex = /(P[1-2]_[A-C]_)(\w+)\s/g; //[1] = P1_A, [2] = cheat entry description
          let tempRegExVar;
          let newFile = fs.readFileSync(NEW_JS_FILE, 'utf8');
          while (tempRegExVar = playerMemoryRegex.exec(newFile)) // Finds P1_A_X_Gravity_Max.
          {
            playerDataAll.push(tempRegExVar[2]); // regex.exec returns array of all matches; item[2] has many duplicates
          };
          var removedDuplicatesArray = [...new Set(playerDataAll)];
          return removedDuplicatesArray
        }

        // Main function to write data to files OR return finalValues array
        /**
         * @param {number|string} PlayerOneOrPlayerTwo number or string, ex: 1 or "P1"
         * @param {string} playerMemoryAddress string, ex: "P1_A_Health_Big"
         * @param {number} write flag to return array or write to file
         * @returns {Number[]} returns an array of numbers or writes a file for the playerMemoryAddress in the clip.
         * @description Finds the point character, and returns an array of numbers for the playerMemoryAddress in the clip.
         */
        function writePlayerMemory(PlayerOneOrPlayerTwo, playerMemoryAddress, write) // "P1"/"P2", address from data-object, 1/0
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
              // console.log( `${ playerString}: 3-Character Bug Logic: A == 0 && B == 0 && C == 0    P1: ABC` );
              finalValuesArray[0].push(pMem[`${ Object.keys(playerObjectSwitcher)[0] }${ playerMemoryAddress }`].split(',')[clipLen]);
              finalValuesArray[1].push(pMem[`${ Object.keys(playerObjectSwitcher)[1] }${ playerMemoryAddress }`].split(',')[clipLen]);
              finalValuesArray[2].push(pMem[`${ Object.keys(playerObjectSwitcher)[2] }${ playerMemoryAddress }`].split(',')[clipLen]);
            }
            // 2-Character Bug Logic
            else if ((Object.values(playerObjectSwitcher)[0][clipLen] == 0)
              && (Object.values(playerObjectSwitcher)[1][clipLen] == 0)
              && (Object.values(playerObjectSwitcher)[2][clipLen] != 0))
            {
              // console.log( `${ playerString}: 2-Character Bug Logic: A == 0 && B == 0 && C != 0    P1: AB` );
              finalValuesArray[0].push(pMem[`${ Object.keys(playerObjectSwitcher)[0] }${ playerMemoryAddress }`].split(',')[clipLen]);
              finalValuesArray[1].push(pMem[`${ Object.keys(playerObjectSwitcher)[1] }${ playerMemoryAddress }`].split(',')[clipLen]);
            }
            else if ((Object.values(playerObjectSwitcher)[0][clipLen] == 0)
              && (Object.values(playerObjectSwitcher)[1][clipLen] != 0)
              && (Object.values(playerObjectSwitcher)[2][clipLen] == 0))
            {
              // console.log( `${ playerString}: 2-Character Bug Logic: A == 0 && B != 0 && C == 0    P1: AC` );
              finalValuesArray[0].push(pMem[`${ Object.keys(playerObjectSwitcher)[0] }${ playerMemoryAddress }`].split(',')[clipLen]);
              finalValuesArray[1].push(pMem[`${ Object.keys(playerObjectSwitcher)[2] }${ playerMemoryAddress }`].split(',')[clipLen]);
            }
            else if ((Object.values(playerObjectSwitcher)[0][clipLen] != 0)
              && (Object.values(playerObjectSwitcher)[1][clipLen] == 0)
              && (Object.values(playerObjectSwitcher)[2][clipLen] == 0))
            {
              // console.log( `${ playerString}: 2-Character Bug Logic: A != 0 && B == 0 && C == 0    P1: BC` );
              finalValuesArray[0].push(pMem[`${ Object.keys(playerObjectSwitcher)[1] }${ playerMemoryAddress }`].split(',')[clipLen]);
              finalValuesArray[1].push(pMem[`${ Object.keys(playerObjectSwitcher)[2] }${ playerMemoryAddress }`].split(',')[clipLen]);
            }
            // 1-Character Logic
            else if ((Object.values(playerObjectSwitcher)[0][clipLen] == 0)
              && (Object.values(playerObjectSwitcher)[1][clipLen] != 0)
              && (Object.values(playerObjectSwitcher)[2][clipLen] != 0))
            {
              // console.log( `${ playerString}: 1-Character Logic: A == 0 && B != 0 && C != 0        P1: A` );
              finalValuesArray[0].push(pMem[`${ Object.keys(playerObjectSwitcher)[0] }${ playerMemoryAddress }`].split(',')[clipLen]);
            }
            else if ((Object.values(playerObjectSwitcher)[0][clipLen] != 0)
              && (Object.values(playerObjectSwitcher)[1][clipLen] == 0)
              && (Object.values(playerObjectSwitcher)[2][clipLen] != 0))
            {
              // console.log( `${ playerString}: 1-Character Logic: A != 0 && B == 0 && C != 0        P1: B` );
              finalValuesArray[0].push(pMem[`${ Object.keys(playerObjectSwitcher)[1] }${ playerMemoryAddress }`].split(',')[clipLen]);
            }
            else if ((Object.values(playerObjectSwitcher)[0][clipLen] != 0)
              && (Object.values(playerObjectSwitcher)[1][clipLen] != 0)
              && (Object.values(playerObjectSwitcher)[2][clipLen] == 0))
            {
              // console.log( `${ playerString}: 1 - Character Logic: A != 0 && B != 0 && C == 0       P1: C` );
              finalValuesArray[0].push(pMem[`${ Object.keys(playerObjectSwitcher)[2] }${ playerMemoryAddress }`].split(',')[clipLen]);
            }
          }
          // Return if not writing files
          if (write == 0)
          {
            return finalValuesArray
          }
          // Write files - Check if directory exists
          if (!fs.existsSync(DIR_OUTPATH))
          {
            fs.mkdirSync(DIR_OUTPATH);
          }
          // Check for Floating Point Addresses so they can have their trailing digits cut off
          for (const floatAddress in FLOATING_POINT_ADDRESSES)
          {
            const toFixedDigitNumberZero = [0, 2, 4]; // 7 by default
            if (`${ playerSwitcher }_${ playerMemoryAddress.toString() }` == `${ playerSwitcher }_${ FLOATING_POINT_ADDRESSES[floatAddress] }`)
            {
              for (let fixedDigitType in toFixedDigitNumberZero)
              {
                var floatArrayFixed = [[], [], []];
                if (!fs.existsSync(`${ DIR_OUTPATH }/${ playerSwitcher }_${ FLOATING_POINT_ADDRESSES[floatAddress] }_ToFixed_${ toFixedDigitNumberZero[fixedDigitType] }.js`))
                {
                  fs.writeFileSync(`${ DIR_OUTPATH }/${ playerSwitcher }_${ FLOATING_POINT_ADDRESSES[floatAddress] }_ToFixed_${ toFixedDigitNumberZero[fixedDigitType] }.js`,
                    `result = [];` + "\n", {encoding: 'utf8'});
                  for (let playerSlotI = 0; playerSlotI < 3; playerSlotI++)
                  {
                    finalValuesArray[playerSlotI].forEach((value) =>
                    {
                      value = parseFloat(value)
                      floatArrayFixed[playerSlotI].push(value.toFixed(toFixedDigitNumberZero[fixedDigitType]))
                    });
                  }
                  fs.appendFileSync(`${ DIR_OUTPATH }/${ playerSwitcher }_${ FLOATING_POINT_ADDRESSES[floatAddress] }_ToFixed_${ toFixedDigitNumberZero[fixedDigitType] }.js`,
                    `result[0]=[${ floatArrayFixed[0].toString() }];\nresult[1]=[${ floatArrayFixed[1].toString() }];\nresult[2]=[${ floatArrayFixed[2].toString() }];`,
                    {encoding: 'utf8'});
                }
              }
            }
          }
          // Writing AE JS File
          if (!fs.existsSync(`${ DIR_OUTPATH }/${ playerSwitcher }_${ playerMemoryAddress.split(',') }.js`))
          {
            fs.writeFileSync(`${ DIR_OUTPATH }/${ playerSwitcher }_${ playerMemoryAddress.split(',') }.js`,
              `var result = [];` + "\n",
              {flag: "a+", encoding: 'utf8'});

            // Append main data
            for (const dataArrayPerCharacter in finalValuesArray)
            {
              fs.appendFileSync(`${ DIR_OUTPATH }/${ playerSwitcher }_${ playerMemoryAddress.split(',') }.js`,
                `result[${ dataArrayPerCharacter }] = [${ finalValuesArray[dataArrayPerCharacter] }];\n`,
                {encoding: 'utf8'});
            }
          }
        }; // End of writePlayerMemory() function

        getPlayerMemoryEntries().forEach((label, index) => // its regex will find addresses like P1_X_Gravity_Max
        {
          // console.log(`${ index }: ${ label }`);
          writePlayerMemory(1, label.toString(), 1);
          writePlayerMemory(2, label.toString(), 1);
        });

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
        writeStaticDataCNV();

        /**
         * @description Writes P1 & P2 addresses to their own JS files. Ex: P1_Combo_Meter_Value.js. One array per entry.
         */
        function writeP1P2Addresses() 
        {
          const miscAdrArray = [[]]; // Example: "P1_Meter_Big", "Camera_Field_of_View", "Timer_Secondary"
          for (const miscAdrI in MISC_ADDRESSES)
          {
            pMem[MISC_ADDRESSES[miscAdrI]].split(',').forEach((clipLenEntry) => // accessing pMem object key by string, splitting its content, and pushing each frame's value
            {
              miscAdrArray[0].push(clipLenEntry);
            });

            if (!fs.existsSync(`${ DIR_OUTPATH }${ MISC_ADDRESSES[miscAdrI] }.js`))
            {
              fs.writeFileSync(`${ DIR_OUTPATH }${ MISC_ADDRESSES[miscAdrI] }.js`,
                `var result = [];\nresult[0] = [${ miscAdrArray }];`,
                {encoding: 'utf8'});
              miscAdrArray[0] = []; // clear the array for the next player iteration.
            }
          }
        };
        writeP1P2Addresses();

        /**
         * @description outputs 3 arrays containing Total_Frames in ascending and then descending order, and Max number in clip.
         */
        function writeTotalFrameCountCNV()
        {
          let totalFrameArrT1 = [];
          let totalFrameArrT2 = [];

          pMem.Total_Frames.split(',').forEach((frame, indexT1) =>
          {
            totalFrameArrT1.push(indexT1);
          });

          pMem.Total_Frames.split(',').forEach((frame, indexT2) =>
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
          // if (!fs.existsSync(`${ DIR_OUTPATH }Total_Frames_CNV.js`))
          // {

          // T1 for Normal Compositions
          fs.writeFileSync(`${ DIR_OUTPATH }Total_Frames_CNV.js`,
            `var result = [];\nresult[0] = ['${ totalFrameArrT1 }'];\n`,
            {encoding: 'utf8'});
          totalFrameArrT1.reverse()
          fs.appendFileSync(`${ DIR_OUTPATH }Total_Frames_CNV.js`,
            `result[1] = ['${ totalFrameArrT1 }'];\n`,
            {encoding: 'utf8'});
          for (let idx in totalFrameArrT1)
          {
            totalFrameArrT1[idx] = totalFrameArrT1[0]
          }
          fs.appendFileSync(`${ DIR_OUTPATH }Total_Frames_CNV.js`,
            `result[2] = ['${ totalFrameArrT1 }'];\n`,
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
        writeTotalFrameCountCNV();

        function writeStageDataCNV() // Fills out color data for stages in Hex in result[1]
        {
          let stageData = [];
          pMem.Stage_Selector.split(',').forEach((frame) =>
          {
            stageData.push(frame)
          });

          if (!fs.existsSync(`${ DIR_OUTPATH }Stage_Selector_CNV.js`))
          {
            fs.writeFileSync(`${ DIR_OUTPATH }Stage_Selector_CNV.js`,
              `var result = [];\nresult[0] = [${ stageData }];\n`,
              {encoding: 'utf8'});
            stageData = [];

            pMem.Stage_Selector.split(',').forEach((frame) =>
            {
              stageData.push(`"${ Object.values(STAGES_OBJ)[frame] }"`)
            });
            fs.appendFileSync(`${ DIR_OUTPATH }Stage_Selector_CNV.js`,
              `result[1] = [${ stageData }];\n`,
              {encoding: 'utf8'});
            stageData = [];
          }
        };
        writeStageDataCNV()

        /**
        * @description Converts and writes inputs to one file that contains formatting for a custom-font and US FGC notation
        **/
        function writeInputCNV()
        {
          const P1_InputsDECSplit = pMem.P1_Input_DEC.split(',');
          const P2_InputsDECSplit = pMem.P2_Input_DEC.split(',');
          let playerInputResults = ""; // holds each result for P1 and P2
          let playerInputsCNVArray = []; // contains transformed results for P1 and P2
          let tempP1OrP2 = ""; // Changes to "P1" or "P2"

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
        }
        writeInputCNV()


        /**
         * @description Writes State-Files that count and increment consecutive true values. 
         * Search for "NEW_STATE_ADD_HERE" across the function to append address fetches and new states.
         */
        function writeNewStates()
        {
          // Temps for switching P1 and P2
          let tempPlayerValue;
          let tempPlayerString;
          // Temps for ROM data
          let tempROMCounter = 0;
          let tempROMSwitch = 0;
          // P1 and P2
          for (tempPlayerValue = 1; tempPlayerValue < 3; tempPlayerValue++)
          {
            tempPlayerValue == 1 ? tempPlayerString = 'P1' : tempPlayerString = 'P2';

            // Fetches relevant SINGLE addresses for State-Logic-Checking
            var getAction_Flags = writePlayerMemory(tempPlayerString, 'Action_Flags', 0);
            var getAirborne = writePlayerMemory(tempPlayerString, 'Airborne', 0);
            var getAnimation_Timer_Main = writePlayerMemory(tempPlayerString, 'Animation_Timer_Main', 0);
            var getAttack_Immune = writePlayerMemory(tempPlayerString, 'Attack_Immune', 0);
            var getBlock_Meter = writePlayerMemory(tempPlayerString, 'Block_Meter', 0);
            var getHitStop = writePlayerMemory(tempPlayerString, 'Hitstop2', 0);
            var getKnockdown_State = writePlayerMemory(tempPlayerString, 'Knockdown_State', 0);
            var getFlyingScreen = writePlayerMemory(tempPlayerString, 'FlyingScreen', 0);
            var getFSI_Points = writePlayerMemory(tempPlayerString, 'FlyingScreen', 0);
            var getIs_Prox_Block = writePlayerMemory(tempPlayerString, 'Is_Prox_Block', 0);
            var getSJ_Counter = writePlayerMemory(tempPlayerString, 'SJ_Counter', 0);
            var getNormal_Strength = writePlayerMemory(tempPlayerString, 'Normal_Strength', 0);
            var getPunchKick = writePlayerMemory(tempPlayerString, 'PunchKick', 0);
            var getAttack_Number = writePlayerMemory(tempPlayerString, 'Attack_Number', 0);
            var getAir_Dash_Count = writePlayerMemory(tempPlayerString, 'Air_Dash_Count', 0);
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
              // NEW_STATE_ADD_HERE ⏫

              // ROM-Specific States | Will write if DO_ROM_FILES == true
              State_ROM_01_OpponentStateA: [[], [], []],
              State_ROM_02_ChoiceA: [[], [], []],
              State_ROM_03_InputA_LK: [[], [], []],
              State_ROM_03_InputA_MK: [[], [], []],
              State_ROM_04_ChoiceB: [[], [], []],
              State_ROM_05_ChoiceC: [[], [], []],
              State_ROM_05_ChoiceD: [[], [], []],
              State_ROM_06_InputB_AirDash: [[], [], []],
              State_ROM_07_ChoiceE: [[], [], []],
              State_ROM_08_InputC_DLK: [[], [], []],
              State_ROM_08_InputC_MK: [[], [], []],
              State_ROM_09_ChoiceF: [[], [], []],
            }

            // for each slot (abc) in a Player's side
            for (let playerSlotI = 0; playerSlotI < 3; playerSlotI++)
            {
              // for each frame in a clip
              for (let clipLen = 0; clipLen < CLIP_LENGTH; clipLen++)
              {
                // Pushing the boolean-results for each State. Example BeingHit result = [ 0,0,0,1,1,1,1,1... ]
                // Being_Hit
                ((getKnockdown_State)[playerSlotI][clipLen] == 32)
                  && ((getHitStop)[playerSlotI][clipLen] > 0)
                  ? allNewStateObject.State_Being_Hit[playerSlotI].push(1)
                  : allNewStateObject.State_Being_Hit[playerSlotI].push(0);
                // "Flying_Screen_Air"
                ((getFlyingScreen)[playerSlotI][clipLen] == 1)
                  && ((getKnockdown_State)[playerSlotI][clipLen] == 32)
                  && ((getAirborne)[playerSlotI][clipLen] == 2)
                  ? allNewStateObject.State_Flying_Screen_Air[playerSlotI].push(1)
                  : allNewStateObject.State_Flying_Screen_Air[playerSlotI].push(0);
                // "Flying_Screen_OTG"
                ((getFlyingScreen)[playerSlotI][clipLen] == 1)
                  && ((getKnockdown_State)[playerSlotI][clipLen] == 32)
                  && ((getAirborne)[playerSlotI][clipLen] == 3)
                  ? allNewStateObject.State_Flying_Screen_OTG[playerSlotI].push(1)
                  : allNewStateObject.State_Flying_Screen_OTG[playerSlotI].push(0);
                // "FS_Install_1"
                ((getFSI_Points)[playerSlotI][clipLen] == 8)
                  || ((getFSI_Points)[playerSlotI][clipLen] == 9)
                  ? allNewStateObject.State_FS_Install_1[playerSlotI].push(1)
                  : allNewStateObject.State_FS_Install_1[playerSlotI].push(0);
                // "FS_Install_2"
                ((getFSI_Points)[playerSlotI][clipLen] > 9)
                  ? allNewStateObject.State_FS_Install_2[playerSlotI].push(1)
                  : allNewStateObject.State_FS_Install_2[playerSlotI].push(0);
                // "NJ_Air"
                ((getAirborne)[playerSlotI][clipLen] == 2)
                  && ((getKnockdown_State)[playerSlotI][clipLen] == 3)
                  && ((getSJ_Counter)[playerSlotI][clipLen] == 0)
                  ? allNewStateObject.State_NJ_Air[playerSlotI].push(1)
                  : allNewStateObject.State_NJ_Air[playerSlotI].push(0);
                // "NJ_Rising
                ((getAirborne)[playerSlotI][clipLen] == 0)
                  && ((getKnockdown_State)[playerSlotI][clipLen] == 2)
                  && ((getSJ_Counter)[playerSlotI][clipLen] == 0)
                  ? allNewStateObject.State_NJ_Rising[playerSlotI].push(1)
                  : allNewStateObject.State_NJ_Rising[playerSlotI].push(0);
                // "OTG_Extra_Stun"
                ((getKnockdown_State)[playerSlotI][clipLen] == 23)
                  && (((getAirborne)[playerSlotI][clipLen] == 3))
                  ? allNewStateObject.State_OTG_Extra_Stun[playerSlotI].push(1)
                  : allNewStateObject.State_OTG_Extra_Stun[playerSlotI].push(0);

                // "OTG_Forced_Stun"
                ((getKnockdown_State)[playerSlotI][clipLen] == 32)
                  && (((getAirborne)[playerSlotI][clipLen] == 3))
                  ? allNewStateObject.State_OTG_Forced_Stun[playerSlotI].push(1)
                  : allNewStateObject.State_OTG_Forced_Stun[playerSlotI].push(0);
                // "OTG_Hit"
                ((getAction_Flags)[playerSlotI][clipLen] == 0)
                  && ((getAirborne)[playerSlotI][clipLen] == 3)
                  && (((getKnockdown_State)[playerSlotI][clipLen] == 32))
                  ? allNewStateObject.State_OTG_Hit[playerSlotI].push(1)
                  : allNewStateObject.State_OTG_Hit[playerSlotI].push(0);
                // "OTG_Roll_Invincible"
                ((getAction_Flags)[playerSlotI][clipLen] == 2)
                  && ((getAirborne)[playerSlotI][clipLen] == 1)
                  && (((getAttack_Immune)[playerSlotI][clipLen] == 1)
                    && ((getKnockdown_State)[playerSlotI][clipLen] == 17))
                  ? allNewStateObject.State_OTG_Roll_Invincible[playerSlotI].push(1)
                  : allNewStateObject.State_OTG_Roll_Invincible[playerSlotI].push(0);

                // "OTG_Roll_Stunned"
                ((getAction_Flags)[playerSlotI][clipLen] == 1)
                  && ((getAirborne)[playerSlotI][clipLen] == 3)
                  && (((getKnockdown_State)[playerSlotI][clipLen] == 32))
                  ? allNewStateObject.State_OTG_Roll_Stunned[playerSlotI].push(1)
                  : allNewStateObject.State_OTG_Roll_Stunned[playerSlotI].push(0);
                // "ProxBlock_Air"
                (((getIs_Prox_Block)[playerSlotI][clipLen] == 6)
                  && ((getKnockdown_State)[playerSlotI][clipLen] == 19))
                  ? allNewStateObject.State_ProxBlock_Air[playerSlotI].push(1)
                  : allNewStateObject.State_ProxBlock_Air[playerSlotI].push(0);
                // "ProxBlock_Ground"
                (((getIs_Prox_Block)[playerSlotI][clipLen] == 5)
                  && ((getKnockdown_State)[playerSlotI][clipLen] == 18))
                  ? allNewStateObject.State_ProxBlock_Ground[playerSlotI].push(1)
                  : allNewStateObject.State_ProxBlock_Ground[playerSlotI].push(0);
                // "Pushblock_Air"
                (((getBlock_Meter)[playerSlotI][clipLen] > 0)
                  && ((getAnimation_Timer_Main)[playerSlotI][clipLen] < 28)
                  && ((getIs_Prox_Block)[playerSlotI][clipLen] == 6)
                  && ((getAction_Flags)[playerSlotI][clipLen] == 2))
                  ? allNewStateObject.State_Pushblock_Air[playerSlotI].push(1)
                  : allNewStateObject.State_Pushblock_Air[playerSlotI].push(0);
                // "Pushblock_Ground"
                ((getBlock_Meter)[playerSlotI][clipLen] > 0)
                  && ((getAnimation_Timer_Main)[playerSlotI][clipLen] < 28)
                  && ((getIs_Prox_Block)[playerSlotI][clipLen] == 5)
                  && (((getAction_Flags)[playerSlotI][clipLen] == 3))
                  ? allNewStateObject.State_Pushblock_Ground[playerSlotI].push(1)
                  : allNewStateObject.State_Pushblock_Ground[playerSlotI].push(0);
                // "Rising_Invincibility"
                (((getAirborne)[playerSlotI][clipLen] == 0)
                  && ((getAttack_Immune)[playerSlotI][clipLen] == 1)
                  && ((getKnockdown_State)[playerSlotI][clipLen] == 17))
                  ? allNewStateObject.State_Rising_Invincibility[playerSlotI].push(1)
                  : allNewStateObject.State_Rising_Invincibility[playerSlotI].push(0);
                // "SJ_Air"
                (((getAirborne)[playerSlotI][clipLen] == 2)
                  && ((getKnockdown_State)[playerSlotI][clipLen] == 14)
                  && ((getSJ_Counter)[playerSlotI][clipLen] == 1))
                  ? allNewStateObject.State_SJ_Air[playerSlotI].push(1)
                  : allNewStateObject.State_SJ_Air[playerSlotI].push(0);
                // "SJ_Counter"
                ((getSJ_Counter)[playerSlotI][clipLen] == 2)
                  ? allNewStateObject.State_SJ_Counter[playerSlotI].push(1)
                  : allNewStateObject.State_SJ_Counter[playerSlotI].push(0);
                // "Stun"
                (((getKnockdown_State)[playerSlotI][clipLen] == 32)
                  && ((getIs_Prox_Block)[playerSlotI][clipLen] == 13))
                  ? allNewStateObject.State_Stun[playerSlotI].push(1)
                  : allNewStateObject.State_Stun[playerSlotI].push(0);
                // "Tech_Hit"
                (((getKnockdown_State)[playerSlotI][clipLen] == 27))
                  ? allNewStateObject.State_Tech_Hit[playerSlotI].push(1)
                  : allNewStateObject.State_Tech_Hit[playerSlotI].push(0);
                // "Thrown_Air"
                (((getAirborne)[playerSlotI][clipLen] == 2)
                  && ((getKnockdown_State)[playerSlotI][clipLen] == 31)
                  && ((getIs_Prox_Block)[playerSlotI][clipLen] == 16))
                  ? allNewStateObject.State_Thrown_Air[playerSlotI].push(1)
                  : allNewStateObject.State_Thrown_Air[playerSlotI].push(0);
                // "Thrown_Ground"
                (((getAirborne)[playerSlotI][clipLen] == 0)
                  && ((getKnockdown_State)[playerSlotI][clipLen] == 31)
                  && ((getIs_Prox_Block)[playerSlotI][clipLen] == 16))
                  ? allNewStateObject.State_Thrown_Ground[playerSlotI].push(1)
                  : allNewStateObject.State_Thrown_Ground[playerSlotI].push(0);
                // // "NEW_STATE_ADD_NAME_HERE" (its name in comments)
                // NEW_STATE_ADD_HERE

                // // ROM-Specific State Checks

                // ROM_01_OpponentA. Goal is to find if dummy is high or low. Starting wth setting the end-point of a ROM Cycle.
                (getKnockdown_State)[playerSlotI][clipLen] == 4 // Magneto is landing from the air.
                  ? allNewStateObject.State_ROM_01_OpponentStateA[playerSlotI].push(1)
                  : allNewStateObject.State_ROM_01_OpponentStateA[playerSlotI].push(0);
                // "ROM_02_ChoiceA" (Did Magneto wait before doing a SJ.LK?)
                (((getKnockdown_State)[playerSlotI][clipLen] == 14)
                  && ((getAir_Dash_Count)[playerSlotI][clipLen] == 0)
                  && ((getY_Position_Arena)[playerSlotI][clipLen] <= 160))
                  ? allNewStateObject.State_ROM_02_ChoiceA[playerSlotI].push(1)
                  : allNewStateObject.State_ROM_02_ChoiceA[playerSlotI].push(0);
                // ROM_03_InputA
                // "ROM_03_InputA_LK"
                (((getNormal_Strength)[playerSlotI][clipLen] == 0)
                  && ((getKnockdown_State)[playerSlotI][clipLen] == 20)
                  && ((getPunchKick)[playerSlotI][clipLen] == 1))
                  && (getAttack_Number)[playerSlotI][clipLen] == 15
                  && ((getAir_Dash_Count)[playerSlotI][clipLen] == 0)
                  ? allNewStateObject.State_ROM_03_InputA_LK[playerSlotI].push(1)
                  : allNewStateObject.State_ROM_03_InputA_LK[playerSlotI].push(0);
                // "ROM_03_InputA_MK"
                (((getNormal_Strength)[playerSlotI][clipLen] == 1)
                  && ((getKnockdown_State)[playerSlotI][clipLen] == 20)
                  && ((getPunchKick)[playerSlotI][clipLen] == 1))
                  && ((getAttack_Number)[playerSlotI][clipLen] == 16)
                  && (getAir_Dash_Count)[playerSlotI][clipLen] == 0
                  ? allNewStateObject.State_ROM_03_InputA_MK[playerSlotI].push(1)
                  : allNewStateObject.State_ROM_03_InputA_MK[playerSlotI].push(0);
                // "ROM_04_ChoiceB" (Did Magneto wait before doing a SJ.MK after a SJ.LK?)
                (((getNormal_Strength)[playerSlotI][clipLen] == 0)
                  && ((getKnockdown_State)[playerSlotI][clipLen] == 20)
                  && ((getPunchKick)[playerSlotI][clipLen] == 1))
                  && (getAttack_Number)[playerSlotI][clipLen] == 15
                  && ((getAir_Dash_Count)[playerSlotI][clipLen] == 0)
                  ? allNewStateObject.State_ROM_04_ChoiceB[playerSlotI].push(1)
                  : allNewStateObject.State_ROM_04_ChoiceB[playerSlotI].push(0);
                // "ROM_05_ChoiceC" (Did Magneto wait before doing AirDashing after a SJ.LK?)
                (((getNormal_Strength)[playerSlotI][clipLen] == 0)
                  && ((getKnockdown_State)[playerSlotI][clipLen] == 20)
                  && ((getPunchKick)[playerSlotI][clipLen] == 1))
                  && (getAttack_Number)[playerSlotI][clipLen] == 15
                  && ((getAir_Dash_Count)[playerSlotI][clipLen] == 0)
                  ? allNewStateObject.State_ROM_05_ChoiceC[playerSlotI].push(1)
                  : allNewStateObject.State_ROM_05_ChoiceC[playerSlotI].push(0);
                // "ROM_05_ChoiceD" (Did Magneto wait before doing AirDashing after a SJ.MK?)
                (((getNormal_Strength)[playerSlotI][clipLen] == 1)
                  && ((getKnockdown_State)[playerSlotI][clipLen] == 20)
                  && ((getPunchKick)[playerSlotI][clipLen] == 1))
                  && (getAttack_Number)[playerSlotI][clipLen] == 16
                  && ((getAir_Dash_Count)[playerSlotI][clipLen] == 0)
                  ? allNewStateObject.State_ROM_05_ChoiceD[playerSlotI].push(1)
                  : allNewStateObject.State_ROM_05_ChoiceD[playerSlotI].push(0);
                // "ROM_06_InputB_AirDash"
                ((getAir_Dash_Count)[playerSlotI][clipLen] == 1)
                  ? allNewStateObject.State_ROM_06_InputB_AirDash[playerSlotI].push(1)
                  : allNewStateObject.State_ROM_06_InputB_AirDash[playerSlotI].push(0);
                // // "ROM_07_ChoiceE" (Did Magneto wait after AirDashing before doing a SJ.DLK?)
                ((getKnockdown_State)[playerSlotI][clipLen] == 26) // Magneto is Air Dash
                  ? allNewStateObject.State_ROM_07_ChoiceE[playerSlotI].push(1)
                  : allNewStateObject.State_ROM_07_ChoiceE[playerSlotI].push(0);
                // // "ROM_08_InputC_DLK"
                (((getNormal_Strength)[playerSlotI][clipLen] == 0)
                  && ((getKnockdown_State)[playerSlotI][clipLen] == 20)
                  && ((getPunchKick)[playerSlotI][clipLen] == 1))
                  && ((getAttack_Number)[playerSlotI][clipLen] == 18)
                  && (getAir_Dash_Count)[playerSlotI][clipLen] == 1
                  ? allNewStateObject.State_ROM_08_InputC_DLK[playerSlotI].push(1)
                  : allNewStateObject.State_ROM_08_InputC_DLK[playerSlotI].push(0);
                // // "ROM_08_InputC_MK"
                (((getNormal_Strength)[playerSlotI][clipLen] == 1)
                  && ((getKnockdown_State)[playerSlotI][clipLen] == 20)
                  && ((getPunchKick)[playerSlotI][clipLen] == 1))
                  && ((getAttack_Number)[playerSlotI][clipLen] == 16)
                  && (getAir_Dash_Count)[playerSlotI][clipLen] == 1
                  ? allNewStateObject.State_ROM_08_InputC_MK[playerSlotI].push(1)
                  : allNewStateObject.State_ROM_08_InputC_MK[playerSlotI].push(0);
                // // "ROM_09_ChoiceF" (Did Magneto wait before doing a SJ.MK after a SJ.DLK?)
                (((getNormal_Strength)[playerSlotI][clipLen] == 0) // Weak
                  && ((getKnockdown_State)[playerSlotI][clipLen] == 20) // Normal Attacks
                  && ((getPunchKick)[playerSlotI][clipLen] == 1))  // Medium
                  && (getAttack_Number)[playerSlotI][clipLen] == 18 // DLK
                  && ((getAir_Dash_Count)[playerSlotI][clipLen] == 1) // Air Dash = true
                  ? allNewStateObject.State_ROM_09_ChoiceF[playerSlotI].push(1)
                  : allNewStateObject.State_ROM_09_ChoiceF[playerSlotI].push(0);
              } // clipLen Scope

              // Count | Increase each consecutive "1" by 1. Ex: "1,1,1,1,1" becomes "1,2,3,4,5" until they hit 0.
              // Applies to ROM cases as well!
              var counter = 0;

              for (let stateDataEntryI in Object.entries(allNewStateObject))
              {
                Object.values(allNewStateObject)[stateDataEntryI][playerSlotI].forEach((element, index) =>
                {
                  if (element == 0)
                  {
                    counter = 0
                    return 0;
                    // return Object.values(allDataObject)[stateDataEntryI][playerSlotI][index];
                  }
                  else
                  {
                    Object.values(allNewStateObject)[stateDataEntryI][playerSlotI][index] = (element + counter);
                    counter++
                    return Object.values(allNewStateObject)[stateDataEntryI][playerSlotI][index + counter]
                  }
                });
              }

              // StartROMStuff
              /*AttackNumber
                12: j.LP
                13: j.MP
                14: j.HP
                15: j.LK
                16: j.MK
                17: j.HK
                18: J.DLK
              */
              // 01_Opponent State A Setup. Set Loop point for 01_OpponentStateA (Magneto lands from his Super Jump)
              const ROM_OPPONENTSTATES =
                [
                  Object.values(allNewStateObject.State_ROM_01_OpponentStateA),
                ];
              // console.log(ROM_OPPONENTSTATES);
              for (let romFile in ROM_OPPONENTSTATES)
              {
                for (let clipLen = 0; clipLen < CLIP_LENGTH; clipLen++)
                {
                  if ((getAirborne)[playerSlotI][clipLen] == 0)
                  {
                    ROM_OPPONENTSTATES[romFile][playerSlotI][clipLen] = 65535;
                  }
                  else if ((getY_VELOCITY)[playerSlotI][clipLen] == 0)
                  {
                    ROM_OPPONENTSTATES[romFile][playerSlotI][clipLen] = 65535;
                  }
                }
                // for (let clipLen = 0; clipLen < CLIP_LENGTH; clipLen++)
                // {
                //   if (ROM_OPPONENTSTATES[romFile][playerSlotI][clipLen] == 1)
                //   {
                //     ROM_OPPONENTSTATES[romFile][playerSlotI][clipLen] = 65535;
                //   }
                // }
              };

              for (let romFile in ROM_OPPONENTSTATES)
              {
                // Checking when we are Rising-To-SuperJump (before we wait or not wait)
                for (let clipLen = 0; clipLen < CLIP_LENGTH; clipLen++)
                {
                  ((getKnockdown_State)[playerSlotI][clipLen] == 13) // 13: "Rising to Super Jump",
                    ? ROM_OPPONENTSTATES[romFile][playerSlotI][clipLen] = 255 // Set to 255 to indicate that we are Rising-To-SuperJump
                    : ROM_OPPONENTSTATES[romFile][playerSlotI][clipLen] = ROM_OPPONENTSTATES[romFile][playerSlotI][clipLen];
                }
                // Checking when we are Rising-to-SuperJump AND the Enemy's distance being HIGHER to the ground
                for (let clipLen = 0; clipLen < CLIP_LENGTH; clipLen++)
                {
                  ((getKnockdown_State)[playerSlotI][clipLen] == 13) && ((getY_Position_From_Enemy)[playerSlotI][clipLen] >= 140)
                    ? ROM_OPPONENTSTATES[romFile][playerSlotI][clipLen] = 888 // Turns 255 to 888 (high)
                    : ROM_OPPONENTSTATES[romFile][playerSlotI][clipLen] = ROM_OPPONENTSTATES[romFile][playerSlotI][clipLen];
                }
                // Checking when we are Rising-to-SuperJump AND the Enemy's distance being LOWER to the ground
                for (let clipLen = 0; clipLen < CLIP_LENGTH; clipLen++)
                {
                  ((getKnockdown_State)[playerSlotI][clipLen] == 13) && ((getY_Position_From_Enemy)[playerSlotI][clipLen] <= 139)
                    ? ROM_OPPONENTSTATES[romFile][playerSlotI][clipLen] = 777 // Turns 255 to 777 (low)
                    : ROM_OPPONENTSTATES[romFile][playerSlotI][clipLen] = ROM_OPPONENTSTATES[romFile][playerSlotI][clipLen];
                }

                // Setting Booleans for ROM_OpponentStateA results per ROM cycle.
                // High Air
                let AirSwitch = 0;
                for (var clipLen = 0; clipLen < CLIP_LENGTH; clipLen++)
                {
                  if (ROM_OPPONENTSTATES[romFile][playerSlotI][clipLen] == 888)
                  {
                    AirSwitch = 1;
                    ROM_OPPONENTSTATES[romFile][playerSlotI][clipLen] = "High"; // High
                  }
                  else if (AirSwitch == 1)
                  {
                    if (ROM_OPPONENTSTATES[romFile][playerSlotI][clipLen] != 65535)
                    {
                      ROM_OPPONENTSTATES[romFile][playerSlotI][clipLen] = "High";
                    }
                    else if (ROM_OPPONENTSTATES[romFile][playerSlotI][clipLen] == 65535)
                    {
                      AirSwitch = 0;
                    }
                  }
                }
                // Low Air
                AirSwitch = 0;
                for (var clipLen = 0; clipLen < CLIP_LENGTH; clipLen++)
                {
                  if (ROM_OPPONENTSTATES[romFile][playerSlotI][clipLen] == 777)
                  {
                    AirSwitch = 1;
                    ROM_OPPONENTSTATES[romFile][playerSlotI][clipLen] = "Low";
                  }
                  else if (AirSwitch == 1)
                  {
                    if (ROM_OPPONENTSTATES[romFile][playerSlotI][clipLen] != 65535)
                    {
                      ROM_OPPONENTSTATES[romFile][playerSlotI][clipLen] = "Low";
                    }
                    else if (ROM_OPPONENTSTATES[romFile][playerSlotI][clipLen] == 65535)
                    {
                      AirSwitch = 0;
                    }
                  }
                }
              }

              // 03_InputsA , 06_InputsB , 09_InputsC Setup
              // All Inputs during ROM infinite
              const ROM_INPUTS = [
                Object.values(allNewStateObject.State_ROM_03_InputA_LK),
                Object.values(allNewStateObject.State_ROM_03_InputA_MK),
                Object.values(allNewStateObject.State_ROM_06_InputB_AirDash),
                Object.values(allNewStateObject.State_ROM_08_InputC_DLK),
                Object.values(allNewStateObject.State_ROM_08_InputC_MK),
              ];
              // Setting the end-point of a ROM Cycle.
              for (const romFile in ROM_INPUTS)
              {
                for (var clipLen = 0; clipLen < CLIP_LENGTH; clipLen++)
                {
                  if ((getAirborne)[playerSlotI][clipLen] == 0)
                  {
                    ROM_INPUTS[romFile][playerSlotI][clipLen] = 65535;
                  }
                  else if ((getY_VELOCITY)[playerSlotI][clipLen] == 0)
                  {
                    ROM_INPUTS[romFile][playerSlotI][clipLen] = 65535;
                  }
                }
                // Sets the rest of the ROM cycle to active or inactive.
                var GroundSwitch = 0;
                for (var clipLen = 0; clipLen < CLIP_LENGTH; clipLen++)
                {
                  if (ROM_INPUTS[romFile][playerSlotI][clipLen] == 1) // Started an input (air)
                  {
                    GroundSwitch = 1;
                    ROM_INPUTS[romFile][playerSlotI][clipLen] = 1;
                  }
                  else if (GroundSwitch == 1)
                  {
                    if (ROM_INPUTS[romFile][playerSlotI][clipLen] != 65535) // if NOT grounded
                    {
                      ROM_INPUTS[romFile][playerSlotI][clipLen] = 1;
                    }
                    else if (ROM_INPUTS[romFile][playerSlotI][clipLen] == 65535) // On the ground; stop attacking
                    {
                      GroundSwitch = 0;
                    }
                  }
                }
              }

              // 04_ChoiceB (time: LK -> MK)
              var ROM_CHOICEB = Object.values(allNewStateObject.State_ROM_04_ChoiceB);
              for (var arrayWithROMData in ROM_CHOICEB)// 3 arrays
              {
                // Find Grounded state for ROM loops
                for (var clipLen = 0; clipLen < CLIP_LENGTH; clipLen++)
                {
                  if (((getAirborne)[arrayWithROMData][clipLen] == 0)) 
                  {
                    ROM_CHOICEB[arrayWithROMData][clipLen] = 65535;
                  }
                }
                var GroundSwitch = 0
                for (var clipLen = 0; clipLen < CLIP_LENGTH; clipLen++)
                {
                  if ((ROM_CHOICEB[arrayWithROMData][clipLen] != 65535) && (ROM_CHOICEB[arrayWithROMData][clipLen] != 0))
                  {
                    GroundSwitch = 1;
                    ROM_CHOICEB[arrayWithROMData][clipLen] = 1;
                  }
                  else if (GroundSwitch == 1)
                  {
                    if (ROM_CHOICEB[arrayWithROMData][clipLen] != 65535) // if NOT grounded
                    {
                      ROM_CHOICEB[arrayWithROMData][clipLen] = 1; // my ROM cycle is still going
                    }
                    else if (ROM_CHOICEB[arrayWithROMData][clipLen] == 65535) // On the ground; stop attacking
                    {
                      GroundSwitch = 0;
                    }
                  }
                }
                // Label the LKs & MKs
                for (var clipLen = 0; clipLen < CLIP_LENGTH; clipLen++)
                {
                  if (ROM_CHOICEB[arrayWithROMData][clipLen] == 1)
                  {
                    // Am I MK?
                    if (((getNormal_Strength)[arrayWithROMData][clipLen] == 1) && ((getAir_Dash_Count)[arrayWithROMData][clipLen] == 0))
                    {
                      ROM_CHOICEB[arrayWithROMData][clipLen] = `MK`;
                    }
                    else if (((getNormal_Strength)[arrayWithROMData][clipLen] == 0) && ((getAir_Dash_Count)[arrayWithROMData][clipLen] == 0))
                    {
                      ROM_CHOICEB[arrayWithROMData][clipLen] = `LK`;
                    }
                    else if (((getAir_Dash_Count)[arrayWithROMData][clipLen] == 1) && ((getKnockdown_State)[arrayWithROMData][clipLen] != 20))
                    {
                      ROM_CHOICEB[arrayWithROMData][clipLen] = 0;
                    }
                  }
                }
                // Count the frames of LKs using tempCounter
                for (var clipLen = 0; clipLen < CLIP_LENGTH; clipLen++)
                {
                  if (ROM_CHOICEB[arrayWithROMData][clipLen] == `LK`)
                  {
                    tempROMCounter += 1;
                  }
                  // Stop on encountering a MK
                  else if (ROM_CHOICEB[arrayWithROMData][clipLen] == `MK`) // We hit a MK
                  {
                    // Lookahead
                    for (let positiveI = 0; positiveI < CLIP_LENGTH; positiveI++)
                    {
                      // Everything until 65535 is = tempCounter
                      if (ROM_CHOICEB[arrayWithROMData][clipLen + positiveI] != 65535)
                      {
                        tempROMSwitch = 1
                        ROM_CHOICEB[arrayWithROMData][clipLen + positiveI] = tempROMCounter;
                      }
                      else if (tempROMSwitch == 1)
                      {
                        ROM_CHOICEB[arrayWithROMData][clipLen + positiveI] = tempROMCounter;
                        if (ROM_CHOICEB[arrayWithROMData][clipLen + positiveI] == 65535)
                        {
                          tempROMSwitch = 0;
                        }
                        break // lookahead is done, we hit 65535
                      }
                    }
                    // Lookbehind, expect the number of LKs to equal the tempCounter value
                    for (let negativeI = 1; negativeI < tempROMCounter + 1; negativeI++)
                    {
                      if (ROM_CHOICEB[arrayWithROMData][clipLen - negativeI] == `LK`)
                      {
                        ROM_CHOICEB[arrayWithROMData][clipLen - negativeI] = tempROMCounter;
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
                for (var clipLen = 0; clipLen < CLIP_LENGTH; clipLen++)
                {
                  if ((ROM_CHOICEB[arrayWithROMData][clipLen] != 65535)
                    && (ROM_CHOICEB[arrayWithROMData][clipLen] >= 0)
                    && (ROM_CHOICEB[arrayWithROMData][clipLen] < 3)
                    || (ROM_CHOICEB[arrayWithROMData][clipLen] == `LK`))
                  {
                    ROM_CHOICEB[arrayWithROMData][clipLen] = 0;
                  }
                }
                // Clean up the values for AE Part2
                for (var clipLen = 0; clipLen < CLIP_LENGTH; clipLen++)
                {
                  if ((ROM_CHOICEB[arrayWithROMData][clipLen] != 65535)
                    && (ROM_CHOICEB[arrayWithROMData][clipLen] >= 10))
                  {
                    ROM_CHOICEB[arrayWithROMData][clipLen] = `Wait`
                  }
                  else if (((ROM_CHOICEB[arrayWithROMData][clipLen] != 65535))
                    && (ROM_CHOICEB[arrayWithROMData][clipLen] < 10)
                    && (ROM_CHOICEB[arrayWithROMData][clipLen] > 0))
                  {
                    ROM_CHOICEB[arrayWithROMData][clipLen] = `No-Wait`
                  }
                }
              }

              // 05_ChoiceC (time: LK -> AirDash)
              var ROM_CHOICEC = Object.values(allNewStateObject.State_ROM_05_ChoiceC);
              for (let arrayWithROMData in ROM_CHOICEC) // 3 arrays
              {
                // Find Grounded state for ROM loops
                for (var clipLen = 0; clipLen < CLIP_LENGTH; clipLen++)
                {
                  if ((getAirborne)[arrayWithROMData][clipLen] == 0)
                  {
                    ROM_CHOICEC[arrayWithROMData][clipLen] = 65535;
                  }
                  else if ((getY_VELOCITY)[arrayWithROMData][clipLen] == 0) // if grounded
                  {
                    ROM_CHOICEC[arrayWithROMData][clipLen] = 65535;
                  }
                }
                // Find 1 ROM Cycle after establishing ground state
                var GroundSwitch = 0
                for (var clipLen = 0; clipLen < CLIP_LENGTH; clipLen++)
                {
                  if ((ROM_CHOICEC[arrayWithROMData][clipLen] != 65535) && (ROM_CHOICEC[arrayWithROMData][clipLen] != 0))
                  {
                    GroundSwitch = 1;
                    ROM_CHOICEC[arrayWithROMData][clipLen] = 1;
                  }
                  else if (GroundSwitch == 1)
                  {
                    if (ROM_CHOICEC[arrayWithROMData][clipLen] != 65535) // if NOT grounded
                    {
                      ROM_CHOICEC[arrayWithROMData][clipLen] = 1; // my ROM cycle is still going
                    }
                    else if (ROM_CHOICEC[arrayWithROMData][clipLen] == 65535) // On the ground; stop attacking
                    {
                      GroundSwitch = 0;
                    }
                  }
                }
                // Label the LKs & AirDashes
                for (var clipLen = 0; clipLen < CLIP_LENGTH; clipLen++)
                {
                  if (ROM_CHOICEC[arrayWithROMData][clipLen] == 1)
                  {
                    // Am I AirDash
                    if (((getNormal_Strength)[arrayWithROMData][clipLen] == 0) && ((getAir_Dash_Count)[arrayWithROMData][clipLen] == 1))
                    {
                      ROM_CHOICEC[arrayWithROMData][clipLen] = `AirDash`;
                    }
                    else if (((getNormal_Strength)[arrayWithROMData][clipLen] == 0) && ((getAir_Dash_Count)[arrayWithROMData][clipLen] == 0))
                    {
                      ROM_CHOICEC[arrayWithROMData][clipLen] = `LK`;
                    }
                    else if (((getNormal_Strength)[arrayWithROMData][clipLen] == 1) && ((getAir_Dash_Count)[arrayWithROMData][clipLen] == 0))
                    {
                      ROM_CHOICEC[arrayWithROMData][clipLen] = `MK`; // First MK
                    }
                    else if (((getNormal_Strength)[arrayWithROMData][clipLen] == 1) && ((getAir_Dash_Count)[arrayWithROMData][clipLen] == 1))
                    {
                      ROM_CHOICEC[arrayWithROMData][clipLen] = `AirDash`; // Second MK
                    }
                  }
                }
                // Count LKs before AirDash
                for (var clipLen = 0; clipLen < CLIP_LENGTH; clipLen++)
                {
                  if (ROM_CHOICEC[arrayWithROMData][clipLen] == `LK`)
                  {
                    tempROMCounter += 1;
                  }
                  // Stop on encountering an AirDash
                  else if (ROM_CHOICEC[arrayWithROMData][clipLen] == `AirDash`) // We hit an AirDash
                  {
                    // Lookahead
                    for (let positiveI = 0; positiveI < CLIP_LENGTH; positiveI++)
                    {
                      // Everything until 65535 is = tempCounter
                      if (ROM_CHOICEC[arrayWithROMData][clipLen + positiveI] != 65535)
                      {
                        tempROMSwitch = 1
                        ROM_CHOICEC[arrayWithROMData][clipLen + positiveI] = tempROMCounter;
                      }
                      else if (tempROMSwitch == 1)
                      {
                        ROM_CHOICEC[arrayWithROMData][clipLen + positiveI] = tempROMCounter;
                        if (ROM_CHOICEC[arrayWithROMData][clipLen + positiveI] == 65535)
                        {
                          tempROMSwitch = 0;
                        }
                        break // lookahead is done, we hit 65535
                      }
                    }
                    // Lookbehind, expect the number of LKs to equal the tempCounter value
                    for (let negativeI = 1; negativeI < tempROMCounter + 1; negativeI++)
                    {
                      if (ROM_CHOICEC[arrayWithROMData][clipLen - negativeI] == `LK`)
                      {
                        ROM_CHOICEC[arrayWithROMData][clipLen - negativeI] = tempROMCounter;
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
                for (var clipLen = 0; clipLen < CLIP_LENGTH; clipLen++)
                {
                  if ((ROM_CHOICEC[arrayWithROMData][clipLen] != 65535)
                    && (ROM_CHOICEC[arrayWithROMData][clipLen] >= 18))
                  {
                    ROM_CHOICEC[arrayWithROMData][clipLen] = `Wait`
                  }
                  else if (((ROM_CHOICEC[arrayWithROMData][clipLen] != 65535))
                    && (ROM_CHOICEC[arrayWithROMData][clipLen] < 18)
                    && (ROM_CHOICEC[arrayWithROMData][clipLen] > 1))
                  {
                    ROM_CHOICEC[arrayWithROMData][clipLen] = `No-Wait`
                  }
                }
                // Clean up the values for AE Part2
                for (var clipLen = 0; clipLen < CLIP_LENGTH; clipLen++)
                {
                  if ((ROM_CHOICEC[arrayWithROMData][clipLen] == `LK`) || (ROM_CHOICEC[arrayWithROMData][clipLen] == `MK`))
                  {
                    ROM_CHOICEC[arrayWithROMData][clipLen] = 0;
                  }
                }
              } // end of 05_ChoiceC

              // 05_ChoiceD (time: MK -> AirDash)
              var ROM_CHOICED = Object.values(allNewStateObject.State_ROM_05_ChoiceD);
              for (let arrayWithROMData in ROM_CHOICED) // 3 arrays
              {
                // Find Grounded state for ROM loops
                for (var clipLen = 0; clipLen < CLIP_LENGTH; clipLen++)
                {
                  if ((getAirborne)[arrayWithROMData][clipLen] == 0)
                  {
                    ROM_CHOICED[arrayWithROMData][clipLen] = 65535;
                  }
                  else if ((getY_VELOCITY)[arrayWithROMData][clipLen] == 0)
                  {
                    ROM_CHOICED[arrayWithROMData][clipLen] = 65535;
                  }
                }
                // Find 1 ROM Cycle after establishing ground state
                var GroundSwitch = 0
                for (var clipLen = 0; clipLen < CLIP_LENGTH; clipLen++)
                {
                  if ((ROM_CHOICED[arrayWithROMData][clipLen] != 65535) && (ROM_CHOICED[arrayWithROMData][clipLen] != 0)) // we are doing a MK
                  {
                    GroundSwitch = 1;
                    ROM_CHOICED[arrayWithROMData][clipLen] = 1;
                  }
                  else if (GroundSwitch == 1)
                  {
                    if (ROM_CHOICED[arrayWithROMData][clipLen] != 65535) // if NOT grounded
                    {
                      ROM_CHOICED[arrayWithROMData][clipLen] = 1; // my ROM cycle is still going
                    }
                    else if (ROM_CHOICED[arrayWithROMData][clipLen] == 65535) // On the ground; stop attacking
                    {
                      GroundSwitch = 0;
                    }
                  }
                }
                // Label the MKs & AirDashes
                for (var clipLen = 0; clipLen < CLIP_LENGTH; clipLen++)
                {
                  if (ROM_CHOICED[arrayWithROMData][clipLen] == 1)
                  {
                    if (((getNormal_Strength)[arrayWithROMData][clipLen] == 1) && ((getAir_Dash_Count)[arrayWithROMData][clipLen] == 1)) // AirDash during MK
                    {
                      ROM_CHOICED[arrayWithROMData][clipLen] = `AirDash`;
                    }
                    else if (((getNormal_Strength)[arrayWithROMData][clipLen] == 0) && ((getAir_Dash_Count)[arrayWithROMData][clipLen] == 0))
                    {
                      ROM_CHOICED[arrayWithROMData][clipLen] = `LK`; // First LK
                    }
                    else if (((getNormal_Strength)[arrayWithROMData][clipLen] == 1) && ((getAir_Dash_Count)[arrayWithROMData][clipLen] == 0))
                    {
                      ROM_CHOICED[arrayWithROMData][clipLen] = `MK`; // First MK
                    }
                    else if (((getNormal_Strength)[arrayWithROMData][clipLen] == 1) && ((getAir_Dash_Count)[arrayWithROMData][clipLen] == 1))
                    {
                      ROM_CHOICED[arrayWithROMData][clipLen] = `AirDash`; // Second MK
                    }
                  }
                }
                // Count MKs before AirDash
                for (var clipLen = 0; clipLen < CLIP_LENGTH; clipLen++)
                {
                  if (ROM_CHOICED[arrayWithROMData][clipLen] == `MK`)
                  {
                    tempROMCounter += 1;
                  }
                  // Stop on encountering an AirDash
                  else if (ROM_CHOICED[arrayWithROMData][clipLen] == `AirDash`) // We hit an AirDash
                  {
                    // Lookahead
                    for (let positiveI = 0; positiveI < CLIP_LENGTH; positiveI++)
                    {
                      // Everything until 65535 is = tempCounter
                      if (ROM_CHOICED[arrayWithROMData][clipLen + positiveI] != 65535)
                      {
                        tempROMSwitch = 1
                        ROM_CHOICED[arrayWithROMData][clipLen + positiveI] = tempROMCounter;
                      }
                      else if (tempROMSwitch == 1)
                      {
                        ROM_CHOICED[arrayWithROMData][clipLen + positiveI] = tempROMCounter;
                        if (ROM_CHOICED[arrayWithROMData][clipLen + positiveI] == 65535)
                        {
                          tempROMSwitch = 0;
                        }
                        break // lookahead is done, we hit 65535
                      }
                    }
                    // Lookbehind, expect the number of MKs to equal the tempCounter value. Wipe the values until we hit the ground.
                    for (let negativeI = 1; negativeI < tempROMCounter + 1; negativeI++)
                    {
                      if (ROM_CHOICED[arrayWithROMData][clipLen - negativeI] == `MK`)
                      {
                        ROM_CHOICED[arrayWithROMData][clipLen - negativeI] = tempROMCounter;
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
                for (var clipLen = 0; clipLen < CLIP_LENGTH; clipLen++)
                {
                  if ((ROM_CHOICED[arrayWithROMData][clipLen] != 65535)
                    && (ROM_CHOICED[arrayWithROMData][clipLen] >= 18))
                  {
                    ROM_CHOICED[arrayWithROMData][clipLen] = `Wait`
                  }
                  else if (((ROM_CHOICED[arrayWithROMData][clipLen] != 65535))
                    && (ROM_CHOICED[arrayWithROMData][clipLen] < 18)
                    && (ROM_CHOICED[arrayWithROMData][clipLen] > 1))
                  {
                    ROM_CHOICED[arrayWithROMData][clipLen] = `No-Wait`
                  }
                }
                // Clean up the values for AE Part2
                for (var clipLen = 0; clipLen < CLIP_LENGTH; clipLen++)
                {
                  if ((ROM_CHOICED[arrayWithROMData][clipLen] == `LK`) || (ROM_CHOICED[arrayWithROMData][clipLen] == `MK`))
                  {
                    ROM_CHOICED[arrayWithROMData][clipLen] = 0;
                  }
                }
              } // end of 05_ChoiceD

              // 07_ChoiceE (AirDash to DLK time)
              var ROM_CHOICEE = Object.values(allNewStateObject.State_ROM_07_ChoiceE);
              for (let arrayWithROMData in ROM_CHOICEE) // 3 arrays
              {
                // Find Grounded state for ROM loops
                for (var clipLen = 0; clipLen < CLIP_LENGTH; clipLen++)
                {
                  if ((getAirborne)[arrayWithROMData][clipLen] == 0)
                  {
                    ROM_CHOICEE[arrayWithROMData][clipLen] = 65535;
                  }
                  else if ((getY_VELOCITY)[arrayWithROMData][clipLen] == 0) // if grounded
                  {
                    ROM_CHOICEE[arrayWithROMData][clipLen] = 65535;
                  }
                }
                // Find 1 ROM Cycle after establishing ground state
                var GroundSwitch = 0
                for (var clipLen = 0; clipLen < CLIP_LENGTH; clipLen++)
                {
                  if ((ROM_CHOICEE[arrayWithROMData][clipLen] != 65535) && (ROM_CHOICEE[arrayWithROMData][clipLen] != 0)) // we are air dashing
                  {
                    GroundSwitch = 1;
                    ROM_CHOICEE[arrayWithROMData][clipLen] = 1;
                  }
                  else if (GroundSwitch == 1)
                  {
                    if (ROM_CHOICEE[arrayWithROMData][clipLen] != 65535) // if NOT grounded
                    {
                      ROM_CHOICEE[arrayWithROMData][clipLen] = 1; // my ROM cycle is still going
                    }
                    else if (ROM_CHOICEE[arrayWithROMData][clipLen] == 65535) // On the ground; stop attacking
                    {
                      GroundSwitch = 0;
                    }
                  }
                }
                for (var clipLen = 0; clipLen < CLIP_LENGTH; clipLen++)
                {
                  if (ROM_CHOICEE[arrayWithROMData][clipLen] == 1)
                  {
                    if ((getKnockdown_State)[arrayWithROMData][clipLen] == 26)
                    {
                      tempROMCounter += 1;
                      ROM_CHOICEE[arrayWithROMData][clipLen] = tempROMCounter;
                    }
                    else if (ROM_CHOICEE[arrayWithROMData][clipLen] == 1)
                    {
                      // look behind and replace the values until 0 with tempCounter
                      for (let negativeI = 1; negativeI < CLIP_LENGTH; negativeI++) // look behind until we hit 0
                      {
                        if (ROM_CHOICEE[arrayWithROMData][clipLen - negativeI] != 0)
                        {
                          ROM_CHOICEE[arrayWithROMData][clipLen - negativeI] = tempROMCounter;
                        }
                        else if (ROM_CHOICEE[arrayWithROMData][clipLen - negativeI] == 0)
                        {
                          break
                        }
                      }
                      // look ahead until we hit 65535
                      for (let positiveI = 0; positiveI < CLIP_LENGTH; positiveI++)
                      {
                        if (ROM_CHOICEE[arrayWithROMData][clipLen + positiveI] != 65535)
                        {
                          let newTempNumber = ROM_CHOICEE[arrayWithROMData][clipLen - 1]
                          ROM_CHOICEE[arrayWithROMData][clipLen - 1] = newTempNumber;
                          ROM_CHOICEE[arrayWithROMData][clipLen + positiveI] = newTempNumber;
                        }
                        else if (ROM_CHOICEE[arrayWithROMData][clipLen + positiveI] == 65535)
                        {
                          tempROMCounter = 1;
                          break
                        }
                      }
                    }
                  }
                }
                // Clean up the values for AE Part1
                for (let clipLen = 0; clipLen < CLIP_LENGTH; clipLen++)
                {
                  if ((ROM_CHOICEE[arrayWithROMData][clipLen] != 65535)
                    && (ROM_CHOICEE[arrayWithROMData][clipLen] > 0)
                    && (ROM_CHOICEE[arrayWithROMData][clipLen] <= 3))
                  {
                    ROM_CHOICEE[arrayWithROMData][clipLen] = `No-Wait`
                  }
                  else if (((ROM_CHOICEE[arrayWithROMData][clipLen] != 65535))
                    && (ROM_CHOICEE[arrayWithROMData][clipLen] > 3))
                  {
                    ROM_CHOICEE[arrayWithROMData][clipLen] = `Wait`
                  }
                }
              }
              // End of 07_ChoiceE

              // 09_ChoiceF (time: LK -> MK)
              var ROM_ChoiceF = Object.values(allNewStateObject.State_ROM_09_ChoiceF);
              for (const arrayWithROMData in ROM_ChoiceF) // 3 arrays
              {
                for (var clipLen = 0; clipLen < CLIP_LENGTH; clipLen++)
                {
                  if ((getAirborne)[arrayWithROMData][clipLen] == 0)
                  {
                    ROM_ChoiceF[arrayWithROMData][clipLen] = 65535;
                  }
                  else if ((getY_VELOCITY)[arrayWithROMData][clipLen] == 0) // if grounded
                  {
                    ROM_ChoiceF[arrayWithROMData][clipLen] = 65535;
                  }
                }
                var GroundSwitch = 0
                for (var clipLen = 0; clipLen < CLIP_LENGTH; clipLen++)
                {
                  if ((ROM_ChoiceF[arrayWithROMData][clipLen] != 65535) && (ROM_ChoiceF[arrayWithROMData][clipLen] != 0))
                  {
                    GroundSwitch = 1;
                    ROM_ChoiceF[arrayWithROMData][clipLen] = 1;
                  }
                  else if (GroundSwitch == 1)
                  {
                    if (ROM_ChoiceF[arrayWithROMData][clipLen] != 65535) // if NOT grounded
                    {
                      ROM_ChoiceF[arrayWithROMData][clipLen] = 1; // my ROM cycle is still going
                    }
                    else if (ROM_ChoiceF[arrayWithROMData][clipLen] == 65535) // On the ground; stop attacking
                    {
                      GroundSwitch = 0;
                    }
                  }
                }

                // Label the LKs & MKs
                for (var clipLen = 0; clipLen < CLIP_LENGTH; clipLen++)
                {
                  if (ROM_ChoiceF[arrayWithROMData][clipLen] == 1)
                  {
                    // Am I MK?
                    if (((getNormal_Strength)[arrayWithROMData][clipLen] == 1)
                      && ((getAttack_Number)[arrayWithROMData][clipLen] == 16)
                      && ((getAir_Dash_Count)[arrayWithROMData][clipLen] == 1)) // MK
                    {
                      ROM_ChoiceF[arrayWithROMData][clipLen] = `MK`;
                    }
                    else if (((getAttack_Number)[arrayWithROMData][clipLen] == 18) && ((getNormal_Strength)[arrayWithROMData][clipLen] == 0) && ((getAir_Dash_Count)[arrayWithROMData][clipLen] == 1)) // DLK
                    {
                      ROM_ChoiceF[arrayWithROMData][clipLen] = `DLK`;
                    }
                  }
                }
                // Count the frames of LKs using tempCounter
                for (var clipLen = 0; clipLen < CLIP_LENGTH; clipLen++)
                {
                  if (ROM_ChoiceF[arrayWithROMData][clipLen] == `DLK`)
                  {
                    tempROMCounter += 1;
                  }
                  // Stop on encountering a MK
                  else if (ROM_ChoiceF[arrayWithROMData][clipLen] == `MK`) // We hit a MK
                  {
                    // Lookahead
                    for (let positiveI = 0; positiveI < CLIP_LENGTH; positiveI++) // CLIP_LENGTH is used, but we will break out of the loop before it is reached
                    {
                      // Everything until 65535 is = tempCounter
                      if (ROM_ChoiceF[arrayWithROMData][clipLen + positiveI] != 65535)
                      {
                        tempROMSwitch = 1
                        ROM_ChoiceF[arrayWithROMData][clipLen + positiveI] = tempROMCounter;
                      }
                      else if (tempROMSwitch == 1)
                      {
                        ROM_ChoiceF[arrayWithROMData][clipLen + positiveI] = tempROMCounter;
                        if (ROM_ChoiceF[arrayWithROMData][clipLen + positiveI] == 65535)
                        {
                          tempROMSwitch = 0;
                        }
                        break // lookahead is done, we hit 65535
                      }
                    }
                    // Lookbehind, expect the number of 2LKs to equal the tempCounter value
                    for (let negativeI = 1; negativeI < tempROMCounter + 1; negativeI++)
                    {
                      if (ROM_ChoiceF[arrayWithROMData][clipLen - negativeI] == `DLK`)
                      {
                        ROM_ChoiceF[arrayWithROMData][clipLen - negativeI] = tempROMCounter;
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
                for (var clipLen = 0; clipLen < CLIP_LENGTH; clipLen++)
                {
                  if ((ROM_ChoiceF[arrayWithROMData][clipLen] != 65535)
                    && (ROM_ChoiceF[arrayWithROMData][clipLen] >= 0)
                    && (ROM_ChoiceF[arrayWithROMData][clipLen] < 3))
                  // || (arrStateROM_09_ChoiceF[arrayWithROMData][clipLen] == `DLK`))
                  {
                    ROM_ChoiceF[arrayWithROMData][clipLen] = 0;
                  }
                }
                // Clean up the values for AE Part2
                for (var clipLen = 0; clipLen < CLIP_LENGTH; clipLen++)
                {
                  if ((ROM_ChoiceF[arrayWithROMData][clipLen] != 65535)
                    && (ROM_ChoiceF[arrayWithROMData][clipLen] >= 17))
                  {
                    ROM_ChoiceF[arrayWithROMData][clipLen] = `Wait`
                  }
                  else if (((ROM_ChoiceF[arrayWithROMData][clipLen] != 65535))
                    && (ROM_ChoiceF[arrayWithROMData][clipLen] < 17)
                    && (ROM_ChoiceF[arrayWithROMData][clipLen] > 0))
                  {
                    ROM_ChoiceF[arrayWithROMData][clipLen] = `No-Wait`
                  }
                }
              } // End of 09_ChoiceF Scope

              // End ROMStuff End ROM Stuff

              // Write the files
              for (let stateFileIndex = 0; stateFileIndex < Object.entries(allNewStateObject).length; stateFileIndex++)
              {
                if (DO_ROM_FILES == false)
                {
                  if (Object.keys(allNewStateObject)[stateFileIndex].toString().match('ROM'))
                  {
                    continue;
                  }
                }
                fs.writeFileSync(`${ DIR_OUTPATH }${ tempPlayerString }_${ Object.keys(allNewStateObject)[stateFileIndex] }.js`,
                  `var result = []; ` + '\n', {encoding: 'utf8'});
              }

              // Append data arrays into files
              for (let stateFileDataIndex = 0; stateFileDataIndex < Object.entries(allNewStateObject).length; stateFileDataIndex++)
              {
                if (DO_ROM_FILES == false)
                {
                  if (Object.keys(allNewStateObject)[stateFileDataIndex].toString().match('ROM'))
                  {
                    continue;
                  }
                }

                fs.appendFileSync(`${ DIR_OUTPATH }${ tempPlayerString }_${ Object.keys(allNewStateObject)[stateFileDataIndex] }.js`,
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
        writeNewStates()

        function writeP1P2Addresses() 
        {
          const miscAdrArray = [[]]; // Example: "P1_Meter_Big", "Camera_Field_of_View"
          for (const miscAdrIterator in MISC_ADDRESSES)
          {
            pMem[MISC_ADDRESSES[miscAdrIterator]].split(',').forEach((address) => // accessing pMem object key by string, splitting its content, and pushing each array element
            {
              miscAdrArray[0].push(address);
            });

            if (!fs.existsSync(`${ DIR_OUTPATH }${ MISC_ADDRESSES[miscAdrIterator] }.js`))
            {
              fs.writeFileSync(`${ DIR_OUTPATH }${ MISC_ADDRESSES[miscAdrIterator] }.js`,
                `var result = [];\nresult[0] = [${ miscAdrArray }];`,
                {encoding: 'utf8'});
              miscAdrArray[0] = []; // clear the array for the next player iteration.
            }
          }
        };
        function countIsPaused()
        {
          let State_Is_Paused = [];
          var counter = 0;
          pMem.Is_Paused.split(',').forEach((element, index) =>
          {
            if (element == 0)
            {
              counter = 0
              State_Is_Paused[index] = 0
            }
            else
            {
              State_Is_Paused[index] = (counter + 1)
              counter++
            }
          });
          fs.writeFileSync(`${ DIR_OUTPATH }State_Is_Paused.js`,
            `var result = [];\nresult[0] = [${ State_Is_Paused }];`,
            {encoding: 'utf8'});
        }
        countIsPaused()
        fs.closeSync(0);
        fs.unlinkSync(NEW_JS_FILE);
      })
  );
clipboard.writeSync(DIR_OUTPATH);
console.log('AE Path Copied to Clipboard' || ``);
await sleep(SLEEP_AMOUNT);
