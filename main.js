import * as fs from "fs"
import * as path from "path"
import * as pMem from "./main_files/Magneto_ROM100_node.js"
import {KNOCKDOWN_STATE_OBJ, PROX_BLOCK_OBJ, NAME_TABLE_OBJ, FLOATING_POINT_ADRS, MIN_MAX_ADRS, MISC_ADRS, STAGES_OBJ, PORTRAITS_TO_TIME_OBJ} from "./main_files/staticData.js"

const DIR_MAIN_FILES = path.join(process.cwd(), `/main_files/`);
const DIR_EXPORT_TO_AE = path.join(process.cwd(), `exportToAE/`);
const DIR_OUTPATH = `${ DIR_EXPORT_TO_AE }Magneto_ROM100/`;
const FILE_NAME_NO_EXT = DIR_OUTPATH.toString().match(/(\w+).$/)[1];
const NODE_JS_FILE = `${ DIR_MAIN_FILES }${ FILE_NAME_NO_EXT }_node.js`; // Current-Active-Working-File
const CLIP_LENGTH = pMem.A_2D_Game_Timer.split(",").length; // Used as clip-length frame tracker; address doesn't matter
const POINT_OBJ_P1 =
{
  P1_A_: pMem.P1_A_Is_Point.split(","),
  P1_B_: pMem.P1_B_Is_Point.split(","),
  P1_C_: pMem.P1_C_Is_Point.split(",")
};
const POINT_OBJ_P2 =
{
  P2_A_: pMem.P2_A_Is_Point.split(","),
  P2_B_: pMem.P2_B_Is_Point.split(","),
  P2_C_: pMem.P2_C_Is_Point.split(","),
};
// Appending to Node JS File
function writeMinMaxToNodeJSFile()//✅
{
  for (var minMaxAddress in MIN_MAX_ADRS)
  {
    var tempAddress = eval(`pMem.${ MIN_MAX_ADRS[minMaxAddress] }.split(',')`);
    var tempMinValue = (Math.min(...tempAddress));
    var tempMaxValue = (Math.max(...tempAddress));
    var prependStringMin = `export var ${ MIN_MAX_ADRS[minMaxAddress] }_Min = `;
    var prependStringMax = `export var ${ MIN_MAX_ADRS[minMaxAddress] }_Max = `;
    var tempStringMin = "";
    var tempStringMax = "";
    var readFileForChecking = "";
    for (let clipLen = 0; clipLen < CLIP_LENGTH; clipLen++)
    {
      //Get rid of final comma
      clipLen == CLIP_LENGTH - 1 ? tempStringMin += `${ tempMinValue }` : tempStringMin += `${ tempMinValue },`;
      clipLen == CLIP_LENGTH - 1 ? tempStringMax += `${ tempMaxValue }` : tempStringMax += `${ tempMaxValue },`;
    }

    var readFileForChecking = fs.readFileSync(NODE_JS_FILE, {encoding: 'utf8'});
    if (!readFileForChecking.includes(prependStringMin) && (!readFileForChecking.includes(prependStringMax)))
    {
      fs.appendFileSync(`${ NODE_JS_FILE }`, ` ${ prependStringMin.toString() }"${ tempStringMin.toString() }";\n`, {flag: 'a+', encoding: 'utf8'}, (err => {}));
      fs.appendFileSync(`${ NODE_JS_FILE }`, ` ${ prependStringMax.toString() }"${ tempStringMax.toString() }";\n`, {flag: 'a+', encoding: 'utf8'}, (err => {}));
    }
    if (prependStringMin.match(/P\d_Combo_Meter_Value/gm))
    {
      fs.writeFileSync(`${ DIR_OUTPATH }${ MIN_MAX_ADRS[minMaxAddress] }_Min.js`, `var result = [];\nresult[0] = [${ tempStringMin.toString() }];\n`, {encoding: 'utf8'}, (err => {}));
      fs.writeFileSync(`${ DIR_OUTPATH }${ MIN_MAX_ADRS[minMaxAddress] }_Max.js`, `var result = [];\nresult[0] = [${ tempStringMax.toString() }];\n`, {encoding: 'utf8'}, (err => {}));
    }
  }
};
writeMinMaxToNodeJSFile()

// Writing Directories and JS Files from Node JS File

if (!fs.existsSync(`${ DIR_OUTPATH }`))
{
  fs.mkdirSync(`${ DIR_OUTPATH }`), {recursive: true};
}

function writeAllJSForAE()//✅
{
  fs.readFileSync(`${ DIR_MAIN_FILES }${ FILE_NAME_NO_EXT }_node.js`, 'utf8')
    .toString().split(';').forEach((exportVar) =>
    {
      var allVariableInfoREGEX = /export var (\w+) = "(.*)"/gmi;
      var nameOfVariable;
      while (nameOfVariable = allVariableInfoREGEX.exec(exportVar))
      {
        if (!fs.existsSync(`${ DIR_OUTPATH }${ nameOfVariable[1] }.js`))
          fs.writeFileSync(`${ DIR_OUTPATH }${ nameOfVariable[1] }.js`,
            `export var result = [];\n result[0] = [${ nameOfVariable[2] }];\n`,
            {encoding: 'utf8'}, (err => {}));
      }
    })
}
function writeTotalFrameCountCNV()
{
  var totalFrameArr = [];
  pMem.Total_Frames.split(',').forEach((frame, index) =>
  {
    totalFrameArr.push(index + 1);
  });
  if (!fs.existsSync(`${ DIR_OUTPATH }Total_Frames_CNV.js`))
  {
    fs.writeFileSync(`${ DIR_OUTPATH }Total_Frames_CNV.js`, `var result = [];\nresult[0] = [${ totalFrameArr }];\n`, {encoding: 'utf8'}, (err => {}));
    totalFrameArr.reverse()
    fs.appendFileSync(`${ DIR_OUTPATH }Total_Frames_CNV.js`, `result[1] = [${ totalFrameArr }];\n`, {encoding: 'utf8'}, (err => {}));
  }
};
function writeP1P2Addresses()
{
  var miscAdrArray = [[]];
  for (let miscAdrIterator in MISC_ADRS)
  {
    eval(`pMem.${ MISC_ADRS[miscAdrIterator] }`).split(',').forEach((address) =>
    {
      miscAdrArray[0].push(address);
    });

    if (!fs.existsSync(`${ DIR_OUTPATH }${ MISC_ADRS[miscAdrIterator] }.js`))
    {
      fs.writeFileSync(`${ DIR_OUTPATH }${ MISC_ADRS[miscAdrIterator] }.js`, `var result = [];\nresult[0] = [${ miscAdrArray }];\n`, {encoding: 'utf8'}, (err => {}));
      miscAdrArray[0] = [];
    }
  }
};

function writeStageDataCNV()
{
  var stageData = [];
  pMem.Stage_Selector.split(',').forEach((frame) =>
  {
    stageData.push(frame)
  });

  if (!fs.existsSync(`${ DIR_OUTPATH }Stage_Selector_CNV.js`))
  {
    fs.writeFileSync(`${ DIR_OUTPATH }Stage_Selector_CNV.js`, `var result = [];\nresult[0] = [${ stageData }];\n`, {encoding: 'utf8'}, (err => {}));
    stageData = [];

    pMem.Stage_Selector.split(',').forEach((frame) =>
    {
      stageData.push(`'${ Object.values(STAGES_OBJ)[frame] }FF'`) // color + 'FF' for alpha
    });
    fs.appendFileSync(`${ DIR_OUTPATH }Stage_Selector_CNV.js`, `result[1] = [${ stageData }];\n`, {encoding: 'utf8'}, (err => {}));
    stageData = [];
  }
};
function getLabelsfromJS(pathToFile)//✅
{
  var readFileForChecking = fs.readFileSync(NODE_JS_FILE, {encoding: 'utf8'});
  if (readFileForChecking.match("P2_C_Y_Velocity_Max"))
  {
    var playerDataAll = []
    var getFile = fs.readFileSync(pathToFile, 'utf8',);
    getFile.toString().split(';').forEach((line) =>
    {
      let playerMemoryRegex = /(P[1-2]_[A-C]_)(\w+)\s/g; // regex to find all player memory addresses; want capture group 2.
      let tempRegexVar; // Temporary variable to run the exec method
      while (tempRegexVar = playerMemoryRegex.exec(line)) // Exec needs to match true or false
      {
        playerDataAll.push(tempRegexVar[2]); // regex.exec returns array of all matches; item[2] is the address; has many duplicates
        playerDataAll.join(','); // Converts array to string
      };
    });
    var removedDuplicatesArray = [...new Set(playerDataAll)];

    return removedDuplicatesArray
  }
};


// Main function to write data to files OR return finalValues array
function writePlayerMemory(PlayerOneOrPlayerTwo, playerMemoryAddress, write)//✅ ('P1'/'P2', address from data-object, 1/0)
{
  var finalValuesArray = [[], [], []]; // 3 Arrays to hold all 3 player slots.
  var playerObjectSwitcher; // Switches between the Player1 and Player2 objects
  var playerSwitcher; // Switches between "P1" and "P2"

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
  // Eval EX: eval(data.P1_A_Health_Big.split(','))[clipLen])
  for (let clipLen = 0; clipLen < CLIP_LENGTH; clipLen++) // length of clip
  {
    if ((Object.values(playerObjectSwitcher)[0][clipLen] == 0) && (Object.values(playerObjectSwitcher)[1][clipLen] == 0) && (Object.values(playerObjectSwitcher)[2][clipLen] == 0))
    {
      // console.log( `${ playerString}: 3-Character Bug Logic: A == 0 && B == 0 && C == 0    P1: ABC` );
      finalValuesArray[0].push(eval(`pMem.${ Object.keys(playerObjectSwitcher)[0] }${ playerMemoryAddress }.split(',')`)[clipLen]);
      finalValuesArray[1].push(eval(`pMem.${ Object.keys(playerObjectSwitcher)[1] }${ playerMemoryAddress }.split(',')`)[clipLen]);
      finalValuesArray[2].push(eval(`pMem.${ Object.keys(playerObjectSwitcher)[2] }${ playerMemoryAddress }.split(',')`)[clipLen]);
    }
    //2-Character Bug Logic
    else if ((Object.values(playerObjectSwitcher)[0][clipLen] == 0) && (Object.values(playerObjectSwitcher)[1][clipLen] == 0) && (Object.values(playerObjectSwitcher)[2][clipLen] != 0))
    {
      // console.log( `${ playerString}: 2-Character Bug Logic: A == 0 && B == 0 && C != 0    P1: AB` );
      finalValuesArray[0].push(eval(`pMem.${ Object.keys(playerObjectSwitcher)[0] }${ playerMemoryAddress }.split(',')`)[clipLen]);
      finalValuesArray[1].push(eval(`pMem.${ Object.keys(playerObjectSwitcher)[1] }${ playerMemoryAddress }.split(',')`)[clipLen]);
    }
    else if ((Object.values(playerObjectSwitcher)[0][clipLen] == 0) && (Object.values(playerObjectSwitcher)[1][clipLen] != 0) && (Object.values(playerObjectSwitcher)[2][clipLen] == 0))
    {
      // console.log( `${ playerString}: 2-Character Bug Logic: A == 0 && B != 0 && C == 0    P1: AC` );
      finalValuesArray[0].push(eval(`pMem.${ Object.keys(playerObjectSwitcher)[0] }${ playerMemoryAddress }.split(',')`)[clipLen]);
      finalValuesArray[1].push(eval(`pMem.${ Object.keys(playerObjectSwitcher)[2] }${ playerMemoryAddress }.split(',')`)[clipLen]);
    }
    else if ((Object.values(playerObjectSwitcher)[0][clipLen] != 0) && (Object.values(playerObjectSwitcher)[1][clipLen] == 0) && (Object.values(playerObjectSwitcher)[2][clipLen] == 0))
    {
      // console.log( `${ playerString}: 2-Character Bug Logic: A != 0 && B == 0 && C == 0    P1: BC` );
      finalValuesArray[0].push(eval(`pMem.${ Object.keys(playerObjectSwitcher)[1] }${ playerMemoryAddress }.split(',')`)[clipLen]);
      finalValuesArray[1].push(eval(`pMem.${ Object.keys(playerObjectSwitcher)[2] }${ playerMemoryAddress }.split(',')`)[clipLen]);
    }
    //1-Character Logic
    else if ((Object.values(playerObjectSwitcher)[0][clipLen] == 0) && (Object.values(playerObjectSwitcher)[1][clipLen] != 0) && (Object.values(playerObjectSwitcher)[2][clipLen] != 0))
    {
      // console.log( `${ playerString}: 1-Character Logic: A == 0 && B != 0 && C != 0        P1: A` );
      finalValuesArray[0].push(eval(`pMem.${ Object.keys(playerObjectSwitcher)[0] }${ playerMemoryAddress }.split(',')`)[clipLen]);
      //                          eval(data.P1_A_Health_Big.split(','))[clipLen])
    }
    else if ((Object.values(playerObjectSwitcher)[0][clipLen] != 0) && (Object.values(playerObjectSwitcher)[1][clipLen] == 0) && (Object.values(playerObjectSwitcher)[2][clipLen] != 0))
    {
      // console.log( `${ playerString}: 1-Character Logic: A != 0 && B == 0 && C != 0        P1: B` );
      finalValuesArray[0].push(eval(`pMem.${ Object.keys(playerObjectSwitcher)[1] }${ playerMemoryAddress }.split( ',' )`)[clipLen]);
      //                          eval(data.P1_B_Health_Big.split(','))[clipLen])
    }
    else if ((Object.values(playerObjectSwitcher)[0][clipLen] != 0) && (Object.values(playerObjectSwitcher)[1][clipLen] != 0) && (Object.values(playerObjectSwitcher)[2][clipLen] == 0))
    {
      // console.log( `${ playerString}: 1 - Character Logic: A != 0 && B != 0 && C == 0       P1: C` );
      finalValuesArray[0].push(eval(`pMem.${ Object.keys(playerObjectSwitcher)[2] }${ playerMemoryAddress }.split(',')`)[clipLen]);
      //                          eval(data.P1_B_Health_Big.split(','))[clipLen])
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
  for (let floatAddress in FLOATING_POINT_ADRS)
  {
    var toFixedDigitNumberZero = 0; //7 by default
    var floatArrayFixed = [[], [], []];
    if (`${ playerSwitcher }_${ playerMemoryAddress.toString() }` == `${ playerSwitcher }_${ FLOATING_POINT_ADRS[floatAddress] }`)
    {
      //ToFixed
      if (!fs.existsSync(`${ DIR_OUTPATH }/${ playerSwitcher }_${ FLOATING_POINT_ADRS[floatAddress] }_ToFixed_${ toFixedDigitNumberZero }.js`))
      {
        fs.writeFileSync(`${ DIR_OUTPATH }/${ playerSwitcher }_${ FLOATING_POINT_ADRS[floatAddress] }_ToFixed_${ toFixedDigitNumberZero }.js`, `result = [];` + '\n', {encoding: 'utf8'}, (err => {}));

        finalValuesArray[0].forEach((value) =>
        {
          value = parseFloat(value)
          floatArrayFixed[0].push(value.toFixed(toFixedDigitNumberZero));
        });
        finalValuesArray[1].forEach((value) =>
        {
          value = parseFloat(value)
          floatArrayFixed[1].push(value.toFixed(toFixedDigitNumberZero));
        });
        finalValuesArray[2].forEach((value) =>
        {
          value = parseFloat(value)
          floatArrayFixed[2].push(value.toFixed(toFixedDigitNumberZero));
        });
        fs.appendFileSync(`${ DIR_OUTPATH }/${ playerSwitcher }_${ FLOATING_POINT_ADRS[floatAddress] }_ToFixed_${ toFixedDigitNumberZero }.js`,
          `result[0]=[${ floatArrayFixed[0].toString() }];` + '\n' +
          `result[1]=[${ floatArrayFixed[1].toString() }];` + '\n' +
          `result[2]=[${ floatArrayFixed[2].toString() }];`
          , {encoding: 'utf8'}
          , (err => {}));
      }
    }
  }
  for (let floatAddress in FLOATING_POINT_ADRS)
  {
    var toFixedDigitNumberTwo = 2; //7 by default
    var floatArrayFixed = [[], [], []];
    if (`${ playerSwitcher }_${ playerMemoryAddress.toString() }` == `${ playerSwitcher }_${ FLOATING_POINT_ADRS[floatAddress] }`)
    {
      //ToFixed
      if (!fs.existsSync(`${ DIR_OUTPATH }/${ playerSwitcher }_${ FLOATING_POINT_ADRS[floatAddress] }_ToFixed_${ toFixedDigitNumberTwo }.js`))
      {
        fs.writeFileSync(`${ DIR_OUTPATH }/${ playerSwitcher }_${ FLOATING_POINT_ADRS[floatAddress] }_ToFixed_${ toFixedDigitNumberTwo }.js`, `result = [];` + '\n', {encoding: 'utf8'}, (err => {}));

        finalValuesArray[0].forEach((value) =>
        {
          value = parseFloat(value)
          floatArrayFixed[0].push(value.toFixed(toFixedDigitNumberTwo));
        });
        finalValuesArray[1].forEach((value) =>
        {
          value = parseFloat(value)
          floatArrayFixed[1].push(value.toFixed(toFixedDigitNumberTwo));
        });
        finalValuesArray[2].forEach((value) =>
        {
          value = parseFloat(value)
          floatArrayFixed[2].push(value.toFixed(toFixedDigitNumberTwo));
        });
        fs.appendFileSync(`${ DIR_OUTPATH }/${ playerSwitcher }_${ FLOATING_POINT_ADRS[floatAddress] }_ToFixed_${ toFixedDigitNumberTwo }.js`,
          `result[0]=[${ floatArrayFixed[0].toString() }];` + '\n' +
          `result[1]=[${ floatArrayFixed[1].toString() }];` + '\n' +
          `result[2]=[${ floatArrayFixed[2].toString() }];`
          , {encoding: 'utf8'}
          , (err => {}));
      }
    }
  }
  // Check if files exist
  if (!fs.existsSync(`${ DIR_OUTPATH }/${ playerSwitcher }_${ playerMemoryAddress.split(',') }.js`))
  {
    fs.writeFileSync(`${ DIR_OUTPATH }/${ playerSwitcher }_${ playerMemoryAddress.split(',') }.js`,
      `var result = [];` + '\n',
      {flag: 'a+', encoding: 'utf8'},
      (err => {}));

    // Append main data
    for (let dataArrayPerCharacter in finalValuesArray)
    {
      fs.appendFileSync(`${ DIR_OUTPATH }/${ playerSwitcher }_${ playerMemoryAddress.split(',') }.js`,
        `result[${ dataArrayPerCharacter }] = [${ finalValuesArray[dataArrayPerCharacter] }];\n`,
        {encoding: 'utf8'},
        (err => {}));
    }
  }
}; // End of Mainfunction()

// Write Static Data Conversion. Example ID_2: 01 turns into "Ryu"
function writeStaticDataCNV() //✅
{
  const STATIC_DATA_OBJS = [KNOCKDOWN_STATE_OBJ, PROX_BLOCK_OBJ, NAME_TABLE_OBJ, PORTRAITS_TO_TIME_OBJ]
  const STATIC_DATA_ADRS = ['Knockdown_State', 'Is_Prox_Block', 'ID_2', 'ID_2']
  var staticLookupResultsArray = [[], [], []];

  for (let playersLen = 1; playersLen < 3; playersLen++)
  {
    for (let staticDataLen = 0; staticDataLen < STATIC_DATA_ADRS.length; staticDataLen++)
    {
      // Make directories if they don't exist
      if (!fs.existsSync(DIR_OUTPATH))
        fs.mkdirSync(DIR_OUTPATH);
      //Write base file
      if (STATIC_DATA_OBJS[staticDataLen] == PORTRAITS_TO_TIME_OBJ) // PortraitsToTime Condition
      {
        fs.writeFileSync(`${ DIR_OUTPATH }P${ playersLen }_PortraitsToTime.js`,
          `var result = [];` + '\n',
          {encoding: 'utf8'},
          (err => {}));
      }
      else
      {
        fs.writeFileSync(`${ DIR_OUTPATH }P${ playersLen }_${ STATIC_DATA_ADRS[staticDataLen] }_CNV.js`,
          `var result = [];` + '\n',
          {encoding: 'utf8'},
          (err => {}));
      }
    }
    for (let staticDataLen = 0; staticDataLen < STATIC_DATA_ADRS.length; staticDataLen++)
    {
      var callPlayerMemoryFN = writePlayerMemory(`${ playersLen }`, STATIC_DATA_ADRS[staticDataLen], 0);
      for (let playerMemLength = 0; playerMemLength < callPlayerMemoryFN.length; playerMemLength++)
      {
        //Push and convert all three arrays' values
        for (let characterSlot = 0; characterSlot < callPlayerMemoryFN[playerMemLength].length; characterSlot++)
        {
          staticLookupResultsArray[playerMemLength].push(`'${ Object.values(STATIC_DATA_OBJS[staticDataLen])[callPlayerMemoryFN[playerMemLength][characterSlot]] }'`);
        }

        if (STATIC_DATA_OBJS[staticDataLen] == PORTRAITS_TO_TIME_OBJ) // PortraitsToTime Condition
        {
          fs.appendFileSync(`${ DIR_OUTPATH }P${ playersLen }_PortraitsToTime.js`, `result[${ playerMemLength }] = [${ staticLookupResultsArray[playerMemLength] }];\n`,
            {encoding: 'utf8'},
            (err => {}));
          staticLookupResultsArray = [[], [], []];
        }
        else
        {
          fs.appendFileSync(`${ DIR_OUTPATH }P${ playersLen }_${ STATIC_DATA_ADRS[staticDataLen] }_CNV.js`, `result[${ playerMemLength }] = [${ staticLookupResultsArray[playerMemLength] }];\n`,
            {encoding: 'utf8'},
            (err => {}));
          staticLookupResultsArray = [[], [], []];
        }
      }
    }
  }
};

function writeInputCNV()
{
  var P1Inputs = pMem.P1_Input_DEC.split(',');
  var P2Inputs = pMem.P2_Input_DEC.split(',');
  let playerInputResults = ''; // holds each result for P1 and P2
  let playerInputsCNVArray = []; // contains transformed results for P1 and P2
  let tempPlayerString = ''; // Changes to "P1" or "P2"

  var buttonConversionVersion1 =
  {
    "6": 1024, 	// 6 = right
    "4": 2048, 	// 4 = left
    "2": 4096, 	// 2 = down
    "8": 8192, 	// 8 = up
    "u": 512, 	// LP = u
    "j": 64,	  // LK = j
    "i": 256,	  // HP = i
    "k": 32,	  // HK = k
    "o": 128,	  // A1 = o
    "l": 16,	  // A2 = l
    "(": 32768, // START = (
    ")": 2,		  // SELECT = )
  };

  var buttonConversionVersion2 =
  {
    "6": 1024, 	    // 6 = right
    "4": 2048, 	    // 4 = left
    "2": 4096, 	    // 2 = down
    "8": 8192, 	    // 8 = up
    "LP": 512, 	    // LP = u
    "LK": 64,	      // LK = j
    "HP": 256,	    // HP = i
    "HK": 32,	      // HK = k
    "AA": 128,	    // A1 = o
    "AB": 16,	      // A2 = l
    "START": 32768, // START = (
    "SELECT": 2,    // SELECT = )
  };

  for (let playersLen = 1; playersLen < 3; playersLen++)
  {
    playersLen == 1 ? tempPlayerString = P1Inputs : tempPlayerString = P2Inputs;
    //Input Conversion Type 1
    for (let input in tempPlayerString)
    {
      for (let button in Object.entries(buttonConversionVersion1))
      {
        if ((tempPlayerString[input] & Object.values(buttonConversionVersion1)[button]) != 0)
        {
          playerInputResults += `${ Object.keys(buttonConversionVersion1)[button] }`;
        }
      }
      playerInputsCNVArray.push(playerInputResults);
      playerInputResults = '';
    }
    fs.writeFileSync(`${ DIR_OUTPATH }P${ playersLen }_Inputs_CNV.js`,
      `var result = [];` + '\n' + `result[0] = ['` +
      `${ playerInputsCNVArray.toString()
        .replace(/24/gi, '1')
        .replace(/42/gi, '1')
        .replace(/26/gi, '3')
        .replace(/62/gi, '3')
        .replace(/48/gi, '7')
        .replace(/84/gi, '7')
        .replace(/86/gi, '9')
        .replace(/68/gi, '9')
      }'];` + '\n',
      {encoding: 'utf8'},
      (err => {}));
    playerInputsCNVArray = [];

    //Input Conversion Type 2
    for (let input in tempPlayerString)
    {
      for (let button in Object.entries(buttonConversionVersion2))
      {
        if ((tempPlayerString[input] & Object.values(buttonConversionVersion2)[button]) != 0)
        {
          playerInputResults += Object.keys(buttonConversionVersion2)[button];
        }
      }
      playerInputsCNVArray.push(playerInputResults);
      playerInputResults = '';
    }
    fs.appendFileSync(`${ DIR_OUTPATH }P${ playersLen }_Inputs_CNV.js`,
      `result[1] = ['${ playerInputsCNVArray.toString()
        //Fix diagonals
        .replace(/24/gi, '1')
        .replace(/42/gi, '1')
        .replace(/26/gi, '3')
        .replace(/62/gi, '3')
        .replace(/48/gi, '7')
        .replace(/84/gi, '7')
        .replace(/86/gi, '9')
        .replace(/68/gi, '9')
        //Add '+' to direction+button inputs
        .replace(/([1-9](?=\w+))/gm, '$1+')
        //Replace numbers with Letter-notation
        .replace(/2|2\+/gm, 'D')
        .replace(/6|6\+/gm, 'R')
        .replace(/8|8\+/gm, 'U')
        .replace(/4|4\+/gm, 'L')
        .replace(/1|1\+/gm, 'DL')
        .replace(/3|3\+/gm, 'DR')
        .replace(/9|9\+/gm, 'UR')
        .replace(/7|7\+/gm, 'UL')
        //Re-write assists' notation
        .replace(/AA/gi, 'A1')
        .replace(/AB/gi, 'A2')
      }'];`,
      {encoding: 'utf8'},
      (err => {}));
    playerInputsCNVArray = [];
  }
}

//Boolean results for particular game-states
//Search for "NEW_STATE_ADD_HERE" to add new states properly
var tempCounter = 0;
var tempSwitch = 0;

function writeNewStates()
{
  //Temps for switching P1 and P2
  var tempPlayerValue;
  var tempPlayerString;
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
    //NEW_STATE_ADD_HERE : Define your SINGLE get-Address here

    // List of files to be written. Will have prefix of P1_ or P2_
    //⭐ Start Adding New States as Strings here!
    var allStateNamesArray = [
      'State_Being_Hit',
      'State_Flying_Screen_Air',
      'State_Flying_Screen_OTG',
      'State_FS_Install_1',
      'State_FS_Install_2',
      'State_NJ_Air',
      'State_NJ_Rising',
      'State_OTG_Extra_Stun',
      'State_OTG_Forced_Stun',
      'State_OTG_Hit',
      'State_OTG_Roll_Invincible',
      'State_OTG_Roll_Stunned',
      'State_ProxBlock_Air',
      'State_ProxBlock_Ground',
      'State_Pushblock_Air',
      'State_Pushblock_Ground',
      'State_Rising_Invincibility',
      'State_SJ_Air',
      'State_SJ_Counter',
      'State_Stun',
      'State_Tech_Hit',
      'State_Thrown_Air',
      'State_Thrown_Ground',
      //NEW_STATE_ADD_HERE
      //ROM-specific states
      'State_ROM_01_OpponentStateA',
      'State_ROM_02_ChoiceA',
      'State_ROM_03_InputA_LK',
      'State_ROM_03_InputA_MK',
      'State_ROM_04_ChoiceB',
      'State_ROM_05_ChoiceC',
      'State_ROM_06_InputB_AirDash',
      'State_ROM_08_InputC_DLK',
      'State_ROM_08_InputC_MK',
      'State_ROM_09_ChoiceE',

    ];
    // write the files
    for (var stateName in allStateNamesArray)
    {
      fs.writeFileSync(`${ DIR_OUTPATH }${ tempPlayerString }_${ allStateNamesArray[stateName] }.js`, `var result = [];` + '\n', {encoding: 'utf8'}, (err => {}));
    }
    // Explicitly named arrays to store the values of each State-Logic-Check
    var arrStateBeingHit = [[], [], []];
    var arrStateFlying_Screen_Air = [[], [], []];
    var arrStateFlyingScreen_OTG = [[], [], []];
    var arrStateFS_Install_1 = [[], [], []];
    var arrStateFS_Install_2 = [[], [], []];
    var arrStateNJ_Air = [[], [], []];
    var arrStateNJ_Rising = [[], [], []];
    var arrStateOTG_Extra_Stun = [[], [], []];
    var arrStateOTG_Forced_Stun = [[], [], []];
    var arrStateOTG_Hit = [[], [], []];
    var arrStateOTG_Roll_Invincible = [[], [], []];
    var arrStateOTG_Roll_Stunned = [[], [], []];
    var arrStateProxBlock_Air = [[], [], []];
    var arrStateProxBlock_Ground = [[], [], []];
    var arrStatePushblock_Air = [[], [], []];
    var arrStatePushblock_Ground = [[], [], []];
    var arrStateRising_Invincibility = [[], [], []];
    var arrStateSJ_Air = [[], [], []];
    var arrStateSJ_Counter = [[], [], []];
    var arrStateStun = [[], [], []];
    var arrStateTech_Hit = [[], [], []];
    var arrStateThrown_Air = [[], [], []];
    var arrStateThrown_Ground = [[], [], []];
    //NEW_STATE_ADD_HERE ⏫
    //ROM-Specific States
    var arrStateROM_01_OpponentStateA = [[], [], []];
    var arrStateROM_02_ChoiceA = [[], [], []];
    var arrStateROM_03_InputA_LK = [[], [], []];
    var arrStateROM_03_InputA_MK = [[], [], []];
    var arrStateROM_04_ChoiceB = [[], [], []];
    var arrStateROM_05_ChoiceC = [[], [], []];
    var arrStateROM_06_InputB_AirDash = [[], [], []];
    var arrStateROM_08_InputC_DLK = [[], [], []];
    var arrStateROM_08_InputC_MK = [[], [], []];
    var arrStateROM_09_ChoiceE = [[], [], []];

    var allStatesArray = [
      arrStateBeingHit,
      arrStateFlying_Screen_Air,
      arrStateFlyingScreen_OTG,
      arrStateFS_Install_1,
      arrStateFS_Install_2,
      arrStateNJ_Air,
      arrStateNJ_Rising,
      arrStateOTG_Extra_Stun,
      arrStateOTG_Forced_Stun,
      arrStateOTG_Hit,
      arrStateOTG_Roll_Invincible,
      arrStateOTG_Roll_Stunned,
      arrStateProxBlock_Air,
      arrStateProxBlock_Ground,
      arrStatePushblock_Air,
      arrStatePushblock_Ground,
      arrStateRising_Invincibility,
      arrStateSJ_Air,
      arrStateSJ_Counter,
      arrStateStun,
      arrStateTech_Hit,
      arrStateThrown_Air,
      arrStateThrown_Ground,
      //NEW_STATE_ADD_HERE ⏫
      //ROM-Specific States
      arrStateROM_01_OpponentStateA,
      arrStateROM_02_ChoiceA,
      arrStateROM_03_InputA_LK,
      arrStateROM_03_InputA_MK,
      arrStateROM_04_ChoiceB,
      arrStateROM_05_ChoiceC,
      arrStateROM_06_InputB_AirDash,
      arrStateROM_08_InputC_DLK,
      arrStateROM_08_InputC_MK,
      arrStateROM_09_ChoiceE,
    ];
    // for each slot (abc) in a Player's side
    for (var playerSlotI = 0 /*0|1|2*/; playerSlotI < 3; playerSlotI++)
    {
      // for each frame in a clip
      for (var clipLen = 0; clipLen < CLIP_LENGTH; clipLen++)
      {
        // Pushing the boolean-results for each State. E.g. BeingHit result = [ 0,0,0,1,1,1,1,1... ]
        //Being_Hit
        ((getKnockdown_State)[playerSlotI][clipLen] == 32) && ((getHitStop)[playerSlotI][clipLen] > 0)
          ? arrStateBeingHit[playerSlotI].push(1)
          : arrStateBeingHit[playerSlotI].push(0);
        // // "Flying_Screen_Air"
        ((getFlyingScreen)[playerSlotI][clipLen] == 1) && ((getKnockdown_State)[playerSlotI][clipLen] == 32) && ((getAirborne)[playerSlotI][clipLen] == 2)
          ? arrStateFlying_Screen_Air[playerSlotI].push(1)
          : arrStateFlying_Screen_Air[playerSlotI].push(0);
        // // // "Flying_Screen_OTG"
        ((getFlyingScreen)[playerSlotI][clipLen] == 1) && ((getKnockdown_State)[playerSlotI][clipLen] == 32) && ((getAirborne)[playerSlotI][clipLen] == 3)
          ? arrStateFlyingScreen_OTG[playerSlotI].push(1)
          : arrStateFlyingScreen_OTG[playerSlotI].push(0);
        // // // "FS_Install_1"
        ((getFSI_Points)[playerSlotI][clipLen] == 8) || ((getFSI_Points)[playerSlotI][clipLen] == 9)
          ? arrStateFS_Install_1[playerSlotI].push(1)
          : arrStateFS_Install_1[playerSlotI].push(0);
        // // "FS_Install_2"
        ((getFSI_Points)[playerSlotI][clipLen] > 9)
          ? arrStateFS_Install_2[playerSlotI].push(1)
          : arrStateFS_Install_2[playerSlotI].push(0);
        // // "NJ_Air"
        ((getAirborne)[playerSlotI][clipLen] == 2) && ((getKnockdown_State)[playerSlotI][clipLen] == 3) && ((getSJ_Counter)[playerSlotI][clipLen] == 0)
          ? arrStateNJ_Air[playerSlotI].push(1)
          : arrStateNJ_Air[playerSlotI].push(0);
        // // "NJ_Rising
        ((getAirborne)[playerSlotI][clipLen] == 0) && ((getKnockdown_State)[playerSlotI][clipLen] == 2) && ((getSJ_Counter)[playerSlotI][clipLen] == 0)
          ? arrStateNJ_Rising[playerSlotI].push(1)
          : arrStateNJ_Rising[playerSlotI].push(0);
        // // "OTG_Extra_Stun"
        ((getKnockdown_State)[playerSlotI][clipLen] == 23) && (((getAirborne)[playerSlotI][clipLen] == 3))
          ? arrStateOTG_Extra_Stun[playerSlotI].push(1)
          : arrStateOTG_Extra_Stun[playerSlotI].push(0);
        // // "OTG_Forced_Stun"
        ((getKnockdown_State)[playerSlotI][clipLen] == 32) && (((getAirborne)[playerSlotI][clipLen] == 3))
          ? arrStateOTG_Forced_Stun[playerSlotI].push(1)
          : arrStateOTG_Forced_Stun[playerSlotI].push(0);
        // // "OTG_Hit"
        ((getAction_Flags)[playerSlotI][clipLen] == 0) && ((getAirborne)[playerSlotI][clipLen] == 3) && (((getKnockdown_State)[playerSlotI][clipLen] == 32))
          ? arrStateOTG_Hit[playerSlotI].push(1)
          : arrStateOTG_Hit[playerSlotI].push(0);
        // // "OTG_Roll_Invincible"
        ((getAction_Flags)[playerSlotI][clipLen] == 2) && ((getAirborne)[playerSlotI][clipLen] == 1) && (((getAttack_Immune)[playerSlotI][clipLen] == 1) && ((getKnockdown_State)[playerSlotI][clipLen] == 17))
          ? arrStateOTG_Roll_Invincible[playerSlotI].push(1)
          : arrStateOTG_Roll_Invincible[playerSlotI].push(0);
        // // "OTG_Roll_Stunned"
        ((getAction_Flags)[playerSlotI][clipLen] == 1) && ((getAirborne)[playerSlotI][clipLen] == 3) && (((getKnockdown_State)[playerSlotI][clipLen] == 32))
          ? arrStateOTG_Roll_Stunned[playerSlotI].push(1)
          : arrStateOTG_Roll_Stunned[playerSlotI].push(0);
        // // "ProxBlock_Air"
        (((getIs_Prox_Block)[playerSlotI][clipLen] == 6) && ((getKnockdown_State)[playerSlotI][clipLen] == 19))
          ? arrStateProxBlock_Air[playerSlotI].push(1)
          : arrStateProxBlock_Air[playerSlotI].push(0);
        // // "ProxBlock_Ground"
        (((getIs_Prox_Block)[playerSlotI][clipLen] == 5) && ((getKnockdown_State)[playerSlotI][clipLen] == 18))
          ? arrStateProxBlock_Ground[playerSlotI].push(1)
          : arrStateProxBlock_Ground[playerSlotI].push(0);
        // // "Pushblock_Air"
        (((getBlock_Meter)[playerSlotI][clipLen] > 0) && ((getAnimation_Timer_Main)[playerSlotI][clipLen] < 28) && ((getIs_Prox_Block)[playerSlotI][clipLen] == 6) && ((getAction_Flags)[playerSlotI][clipLen] == 2))
          ? arrStatePushblock_Air[playerSlotI].push(1)
          : arrStatePushblock_Air[playerSlotI].push(0);
        // // "Pushblock_Ground"
        ((getBlock_Meter)[playerSlotI][clipLen] > 0) && ((getAnimation_Timer_Main)[playerSlotI][clipLen] < 28) && ((getIs_Prox_Block)[playerSlotI][clipLen] == 5) && (((getAction_Flags)[playerSlotI][clipLen] == 3))
          ? arrStatePushblock_Ground[playerSlotI].push(1)
          : arrStatePushblock_Ground[playerSlotI].push(0);
        // // "Rising_Invincibility"
        (((getAirborne)[playerSlotI][clipLen] == 0) && ((getAttack_Immune)[playerSlotI][clipLen] == 1) && ((getKnockdown_State)[playerSlotI][clipLen] == 17))
          ? arrStateRising_Invincibility[playerSlotI].push(1)
          : arrStateRising_Invincibility[playerSlotI].push(0);
        // // "SJ_Air"
        (((getAirborne)[playerSlotI][clipLen] == 2) && ((getKnockdown_State)[playerSlotI][clipLen] == 14) && ((getSJ_Counter)[playerSlotI][clipLen] == 1))
          ? arrStateSJ_Air[playerSlotI].push(1)
          : arrStateSJ_Air[playerSlotI].push(0);
        // // "SJ_Counter"
        ((getSJ_Counter)[playerSlotI][clipLen] == 2)
          ? arrStateSJ_Counter[playerSlotI].push(1)
          : arrStateSJ_Counter[playerSlotI].push(0);
        // // "Stun"
        (((getKnockdown_State)[playerSlotI][clipLen] == 32) && ((getIs_Prox_Block)[playerSlotI][clipLen] == 13))
          ? arrStateStun[playerSlotI].push(1)
          : arrStateStun[playerSlotI].push(0);
        // // "Tech_Hit"
        (((getKnockdown_State)[playerSlotI][clipLen] == 27))
          ? arrStateTech_Hit[playerSlotI].push(1)
          : arrStateTech_Hit[playerSlotI].push(0);
        // // "Thrown_Air"
        (((getAirborne)[playerSlotI][clipLen] == 2) && ((getKnockdown_State)[playerSlotI][clipLen] == 31) && ((getIs_Prox_Block)[playerSlotI][clipLen] == 16))
          ? arrStateThrown_Air[playerSlotI].push(1)
          : arrStateThrown_Air[playerSlotI].push(0);
        // // "Thrown_Ground"
        (((getAirborne)[playerSlotI][clipLen] == 0) && ((getKnockdown_State)[playerSlotI][clipLen] == 31) && ((getIs_Prox_Block)[playerSlotI][clipLen] == 16))
          ? arrStateThrown_Ground[playerSlotI].push(1)
          : arrStateThrown_Ground[playerSlotI].push(0);
        // // "NEW_STATE_ADD_NAME_HERE" (its name in comments)⏫
        // NEW_STATE_ADD_HERE ⏫


        // ROM-Specific State Checks
        // ROM_01_OpponentA. Goal is to find if dummy is high or low. Starting wth setting the end-point of a ROM Cycle.
        (getKnockdown_State)[playerSlotI][clipLen] == 4 // Magneto is landing from the air.
          ? arrStateROM_01_OpponentStateA[playerSlotI].push(1)
          : arrStateROM_01_OpponentStateA[playerSlotI].push(0);
        // "ROM_02_ChoiceA" (Did Magneto wait before doing a SJ.LK?)
        (((getKnockdown_State)[playerSlotI][clipLen] == 14) && ((getAir_Dash_Count)[playerSlotI][clipLen] == 0) && ((getY_Position_Arena)[playerSlotI][clipLen] <= 160))
          ? arrStateROM_02_ChoiceA[playerSlotI].push(1)
          : arrStateROM_02_ChoiceA[playerSlotI].push(0);
        // ROM_03_InputA
        // "ROM_03_InputA_LK"
        (((getNormal_Strength)[playerSlotI][clipLen] == 0) && ((getKnockdown_State)[playerSlotI][clipLen] == 20) && ((getPunchKick)[playerSlotI][clipLen] == 1)) && (getAttack_Number)[playerSlotI][clipLen] == 15 && ((getAir_Dash_Count)[playerSlotI][clipLen] == 0)
          ? arrStateROM_03_InputA_LK[playerSlotI].push(1)
          : arrStateROM_03_InputA_LK[playerSlotI].push(0);
        // "ROM_03_InputA_MK"
        (((getNormal_Strength)[playerSlotI][clipLen] == 1) && ((getKnockdown_State)[playerSlotI][clipLen] == 20) && ((getPunchKick)[playerSlotI][clipLen] == 1)) && ((getAttack_Number)[playerSlotI][clipLen] == 16) && (getAir_Dash_Count)[playerSlotI][clipLen] == 0
          ? arrStateROM_03_InputA_MK[playerSlotI].push(1)
          : arrStateROM_03_InputA_MK[playerSlotI].push(0);
        // "ROM_04_ChoiceB" (Did Magneto wait before doing a SJ.MK after a SJ.LK?)
        (((getNormal_Strength)[playerSlotI][clipLen] == 0) && ((getKnockdown_State)[playerSlotI][clipLen] == 20) && ((getPunchKick)[playerSlotI][clipLen] == 1)) && (getAttack_Number)[playerSlotI][clipLen] == 15 && ((getAir_Dash_Count)[playerSlotI][clipLen] == 0)
          ? arrStateROM_04_ChoiceB[playerSlotI].push(1)
          : arrStateROM_04_ChoiceB[playerSlotI].push(0);
        // "ROM_05_ChoiceC" (Did Magneto wait before doing AirDashing after a SJ.LK?)
        (((getNormal_Strength)[playerSlotI][clipLen] == 0) && ((getKnockdown_State)[playerSlotI][clipLen] == 20) && ((getPunchKick)[playerSlotI][clipLen] == 1)) && (getAttack_Number)[playerSlotI][clipLen] == 15 && ((getAir_Dash_Count)[playerSlotI][clipLen] == 0)
          ? arrStateROM_05_ChoiceC[playerSlotI].push(1)
          : arrStateROM_05_ChoiceC[playerSlotI].push(0);
        // "ROM_06_InputB_AirDash"
        ((getAir_Dash_Count)[playerSlotI][clipLen] == 1)
          ? arrStateROM_06_InputB_AirDash[playerSlotI].push(1)
          : arrStateROM_06_InputB_AirDash[playerSlotI].push(0);
        // // "ROM_08_InputC_DLK"
        (((getNormal_Strength)[playerSlotI][clipLen] == 0) && ((getKnockdown_State)[playerSlotI][clipLen] == 20) && ((getPunchKick)[playerSlotI][clipLen] == 1)) && ((getAttack_Number)[playerSlotI][clipLen] == 18) && (getAir_Dash_Count)[playerSlotI][clipLen] == 1
          ? arrStateROM_08_InputC_DLK[playerSlotI].push(1)
          : arrStateROM_08_InputC_DLK[playerSlotI].push(0);
        // // "ROM_08_InputC_MK"
        (((getNormal_Strength)[playerSlotI][clipLen] == 1) && ((getKnockdown_State)[playerSlotI][clipLen] == 20) && ((getPunchKick)[playerSlotI][clipLen] == 1)) && ((getAttack_Number)[playerSlotI][clipLen] == 16) && (getAir_Dash_Count)[playerSlotI][clipLen] == 1
          ? arrStateROM_08_InputC_MK[playerSlotI].push(1)
          : arrStateROM_08_InputC_MK[playerSlotI].push(0);
        (((getNormal_Strength)[playerSlotI][clipLen] == 0) && ((getKnockdown_State)[playerSlotI][clipLen] == 20) && ((getPunchKick)[playerSlotI][clipLen] == 1)) && (getAttack_Number)[playerSlotI][clipLen] == 18 && ((getAir_Dash_Count)[playerSlotI][clipLen] == 1)
          ? arrStateROM_09_ChoiceE[playerSlotI].push(1)
          : arrStateROM_09_ChoiceE[playerSlotI].push(0);
      } // clipLen Scope

      // Slot Scope

      // Increase each consecutive "1" by 1. Ex: "1,1,1,1,1" becomes "1,2,3,4,5" until they hit 0.
      // Applies to ROM cases as well!
      var counter = 0;
      for (let stateArray in allStatesArray)
      {
        allStatesArray[stateArray][playerSlotI].map((num, index) => // Go through all 3 arrays' values + keep track of the index
        {
          if (num === 0)
          {
            counter = 0
            return allStatesArray[stateArray][playerSlotI][index] // returns the extant value inside of the array
          }
          else
          {
            allStatesArray[stateArray][playerSlotI][index] = num + counter
            counter++
            return allStatesArray[stateArray][playerSlotI][index + counter]
          }
        });
      }

      // 01_Opponent State A Setup
      // Set Loop point for 01_OpponentStateA (Magneto lands from his Super Jump)
      const ROM_OPPONENTSTATES = [
        arrStateROM_01_OpponentStateA,
        // in case of OpponentStateB at the end of the ROM cycle
      ];

      for (let romFile in ROM_OPPONENTSTATES)
      {
        for (let clipLen = 0; clipLen < CLIP_LENGTH; clipLen++)
        {
          if (ROM_OPPONENTSTATES[romFile][playerSlotI][clipLen] == 1)
          {
            ROM_OPPONENTSTATES[romFile][playerSlotI][clipLen] = 65535;
          }
        }
      };

      for (let romFile in ROM_OPPONENTSTATES)
      {
        // Checking when we are Rising-To-SuperJump (before we wait or not wait)
        for (let clipLen = 0; clipLen < CLIP_LENGTH; clipLen++)
        {
          ((getKnockdown_State)[playerSlotI][clipLen] == 13)
            ? ROM_OPPONENTSTATES[romFile][playerSlotI][clipLen] = 255 // Set to 255 to indicate that we are Rising-To-SuperJump
            : ROM_OPPONENTSTATES[romFile][playerSlotI][clipLen] = ROM_OPPONENTSTATES[romFile][playerSlotI][clipLen];
        }
        // Checking when we are Rising-to-SuperJump AND the Enemy's distance being HIGHER to the ground
        for (let clipLen = 0; clipLen < CLIP_LENGTH; clipLen++)
        {
          ((getKnockdown_State)[playerSlotI][clipLen] == 13) && ((getY_Position_From_Enemy)[playerSlotI][clipLen] >= 155)
            ? ROM_OPPONENTSTATES[romFile][playerSlotI][clipLen] = 888 // Turns 255 to 888 (high)
            : ROM_OPPONENTSTATES[romFile][playerSlotI][clipLen] = ROM_OPPONENTSTATES[romFile][playerSlotI][clipLen];
        }
        // Checking when we are Rising-to-SuperJump AND the Enemy's distance being LOWER to the ground
        for (let clipLen = 0; clipLen < CLIP_LENGTH; clipLen++)
        {
          ((getKnockdown_State)[playerSlotI][clipLen] == 13) && ((getY_Position_From_Enemy)[playerSlotI][clipLen] <= 154)
            ? ROM_OPPONENTSTATES[romFile][playerSlotI][clipLen] = 777 // Turns 255 to 777 (low)
            : ROM_OPPONENTSTATES[romFile][playerSlotI][clipLen] = ROM_OPPONENTSTATES[romFile][playerSlotI][clipLen];
        }

        // Setting Booleans for ROM_OpponentStateA results per ROM cycle.
        //High Air
        var AirSwitch = 0;
        for (var clipLen = 0; clipLen < CLIP_LENGTH; clipLen++)
        {
          if (ROM_OPPONENTSTATES[romFile][playerSlotI][clipLen] == 888)
          {
            AirSwitch = 1;
            ROM_OPPONENTSTATES[romFile][playerSlotI][clipLen] = 1;
          }
          else if (AirSwitch == 1)
          {
            if (ROM_OPPONENTSTATES[romFile][playerSlotI][clipLen] != 65535)
            {
              ROM_OPPONENTSTATES[romFile][playerSlotI][clipLen] = 1;
            }
            else if (ROM_OPPONENTSTATES[romFile][playerSlotI][clipLen] == 65535)
            {
              AirSwitch = 0;
            }
          }
        }
        //Low Air
        AirSwitch = 0;
        for (var clipLen = 0; clipLen < CLIP_LENGTH; clipLen++)
        {
          if (ROM_OPPONENTSTATES[romFile][playerSlotI][clipLen] == 777)
          {
            AirSwitch = 1;
            ROM_OPPONENTSTATES[romFile][playerSlotI][clipLen] = 2;
          }
          else if (AirSwitch == 1)
          {
            if (ROM_OPPONENTSTATES[romFile][playerSlotI][clipLen] != 65535)
            {
              ROM_OPPONENTSTATES[romFile][playerSlotI][clipLen] = 2;
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
        arrStateROM_03_InputA_LK,
        arrStateROM_03_InputA_MK,
        arrStateROM_06_InputB_AirDash,
        arrStateROM_08_InputC_DLK,
        arrStateROM_08_InputC_MK,
      ];
      // Setting the end-point of a ROM Cycle.
      for (let romFile in ROM_INPUTS)
      {
        for (var clipLen = 0; clipLen < CLIP_LENGTH; clipLen++)
        {
          if ((getAirborne)[playerSlotI][clipLen] == 0)
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
      for (let arrayWithROMData in arrStateROM_04_ChoiceB) // 3 arrays
      {
        // Find Grounded state for ROM loops
        for (var clipLen = 0; clipLen < CLIP_LENGTH; clipLen++)
        {
          if ((getAirborne)[arrayWithROMData][clipLen] == 0)
          {
            arrStateROM_04_ChoiceB[arrayWithROMData][clipLen] = 65535;
          }
        }
        var GroundSwitch = 0
        for (var clipLen = 0; clipLen < CLIP_LENGTH; clipLen++)
        {
          if ((arrStateROM_04_ChoiceB[arrayWithROMData][clipLen] != 65535) && (arrStateROM_04_ChoiceB[arrayWithROMData][clipLen] != 0))
          {
            GroundSwitch = 1;
            arrStateROM_04_ChoiceB[arrayWithROMData][clipLen] = 1;
          }
          else if (GroundSwitch == 1)
          {
            if (arrStateROM_04_ChoiceB[arrayWithROMData][clipLen] != 65535) // if NOT grounded
            {
              arrStateROM_04_ChoiceB[arrayWithROMData][clipLen] = 1; // my ROM cycle is still going
            }
            else if (arrStateROM_04_ChoiceB[arrayWithROMData][clipLen] == 65535) // On the ground; stop attacking
            {
              GroundSwitch = 0;
            }
          }
        }
        // Label the LKs & MKs
        for (var clipLen = 0; clipLen < CLIP_LENGTH; clipLen++)
        {
          if (arrStateROM_04_ChoiceB[arrayWithROMData][clipLen] == 1)
          {
            // Am I MK?
            if (((getNormal_Strength)[arrayWithROMData][clipLen] == 1) && ((getAir_Dash_Count)[arrayWithROMData][clipLen] == 0))
            {
              arrStateROM_04_ChoiceB[arrayWithROMData][clipLen] = "\'MK\'";
            }
            else if (((getNormal_Strength)[arrayWithROMData][clipLen] == 0) && ((getAir_Dash_Count)[arrayWithROMData][clipLen] == 0))
            {
              arrStateROM_04_ChoiceB[arrayWithROMData][clipLen] = "\'LK\'";
            }
            else if (((getAir_Dash_Count)[arrayWithROMData][clipLen] == 1) && ((getKnockdown_State)[arrayWithROMData][clipLen] != 20))
            {
              arrStateROM_04_ChoiceB[arrayWithROMData][clipLen] = 0;
            }
          }
        }
        // Count the frames of LKs using tempCounter
        for (var clipLen = 0; clipLen < CLIP_LENGTH; clipLen++)
        {
          if (arrStateROM_04_ChoiceB[arrayWithROMData][clipLen] == '\'LK\'')
          {
            tempCounter += 1;
          }
          // Stop on encountering a MK
          else if (arrStateROM_04_ChoiceB[arrayWithROMData][clipLen] == '\'MK\'') // We hit a MK
          {
            //Lookahead
            for (let positiveI = 0; positiveI < CLIP_LENGTH; positiveI++)
            {
              // Everything until 65535 is = tempCounter
              if (arrStateROM_04_ChoiceB[arrayWithROMData][clipLen + positiveI] != 65535)
              {
                tempSwitch = 1
                arrStateROM_04_ChoiceB[arrayWithROMData][clipLen + positiveI] = tempCounter;
              }
              else if (tempSwitch == 1)
              {
                arrStateROM_04_ChoiceB[arrayWithROMData][clipLen + positiveI] = tempCounter;
                if (arrStateROM_04_ChoiceB[arrayWithROMData][clipLen + positiveI] == 65535)
                {
                  tempSwitch = 0;
                }
                break //lookahead is done, we hit 65535
              }
            }
            //Lookbehind, expect the number of LKs to equal the tempCounter value
            for (let negativeI = 1; negativeI < tempCounter + 1; negativeI++)
            {
              if (arrStateROM_04_ChoiceB[arrayWithROMData][clipLen - negativeI] == '\'LK\'')
              {
                arrStateROM_04_ChoiceB[arrayWithROMData][clipLen - negativeI] = tempCounter;
              }
            }
          }
          else // Reset the counters
          {
            tempCounter = 0;
            tempSwitch = 0;
          }
        }
        // Clean up the values for AE Part1
        for (var clipLen = 0; clipLen < CLIP_LENGTH; clipLen++)
        {
          if ((arrStateROM_04_ChoiceB[arrayWithROMData][clipLen] != 65535)
            && (arrStateROM_04_ChoiceB[arrayWithROMData][clipLen] >= 0)
            && (arrStateROM_04_ChoiceB[arrayWithROMData][clipLen] < 3)
            || (arrStateROM_04_ChoiceB[arrayWithROMData][clipLen] == '\'LK\''))
          {
            arrStateROM_04_ChoiceB[arrayWithROMData][clipLen] = 0;
          }
        }
        // Clean up the values for AE Part2
        for (var clipLen = 0; clipLen < CLIP_LENGTH; clipLen++)
        {
          if ((arrStateROM_04_ChoiceB[arrayWithROMData][clipLen] != 65535)
            && (arrStateROM_04_ChoiceB[arrayWithROMData][clipLen] >= 10))
          {
            arrStateROM_04_ChoiceB[arrayWithROMData][clipLen] = '\'Wait\''
          }
          else if (((arrStateROM_04_ChoiceB[arrayWithROMData][clipLen] != 65535))
            && (arrStateROM_04_ChoiceB[arrayWithROMData][clipLen] < 10)
            && (arrStateROM_04_ChoiceB[arrayWithROMData][clipLen] > 0))
          {
            arrStateROM_04_ChoiceB[arrayWithROMData][clipLen] = '\'No-Wait\''
          }
        }
      }
      // 05_ChoiceC (time: LK -> AirDash)
      for (let arrayWithROMData in arrStateROM_05_ChoiceC) // 3 arrays
      {
        // Find Grounded state for ROM loops
        for (var clipLen = 0; clipLen < CLIP_LENGTH; clipLen++)
        {
          if ((getAirborne)[arrayWithROMData][clipLen] == 0)
          {
            arrStateROM_05_ChoiceC[arrayWithROMData][clipLen] = 65535;
          }
        }
        var GroundSwitch = 0
        for (var clipLen = 0; clipLen < CLIP_LENGTH; clipLen++)
        {
          if ((arrStateROM_05_ChoiceC[arrayWithROMData][clipLen] != 65535) && (arrStateROM_05_ChoiceC[arrayWithROMData][clipLen] != 0))
          {
            GroundSwitch = 1;
            arrStateROM_05_ChoiceC[arrayWithROMData][clipLen] = 1;
          }
          else if (GroundSwitch == 1)
          {
            if (arrStateROM_05_ChoiceC[arrayWithROMData][clipLen] != 65535) // if NOT grounded
            {
              arrStateROM_05_ChoiceC[arrayWithROMData][clipLen] = 1; // my ROM cycle is still going
            }
            else if (arrStateROM_05_ChoiceC[arrayWithROMData][clipLen] == 65535) // On the ground; stop attacking
            {
              GroundSwitch = 0;
            }
          }
        }
        // Label the LKs & AirDashes
        for (var clipLen = 0; clipLen < CLIP_LENGTH; clipLen++)
        {
          if (arrStateROM_05_ChoiceC[arrayWithROMData][clipLen] == 1)
          {
            // Am I AirDash
            if (((getNormal_Strength)[arrayWithROMData][clipLen] == 0) && ((getAir_Dash_Count)[arrayWithROMData][clipLen] == 1))
            {
              arrStateROM_05_ChoiceC[arrayWithROMData][clipLen] = "\'AirDash\'";
            }
            else if (((getNormal_Strength)[arrayWithROMData][clipLen] == 0) && ((getAir_Dash_Count)[arrayWithROMData][clipLen] == 0))
            {
              arrStateROM_05_ChoiceC[arrayWithROMData][clipLen] = "\'LK\'";
            }
            else if (((getNormal_Strength)[arrayWithROMData][clipLen] == 1) && ((getAir_Dash_Count)[arrayWithROMData][clipLen] == 0))
            {
              arrStateROM_05_ChoiceC[arrayWithROMData][clipLen] = "\'MK\'"; // First MK
            }
            else if (((getNormal_Strength)[arrayWithROMData][clipLen] == 1) && ((getAir_Dash_Count)[arrayWithROMData][clipLen] == 1))
            {
              arrStateROM_05_ChoiceC[arrayWithROMData][clipLen] = "\'AirDash\'"; // Second MK
            }
          }
        }
        // Count LKs before AirDash
        for (var clipLen = 0; clipLen < CLIP_LENGTH; clipLen++)
        {
          if (arrStateROM_05_ChoiceC[arrayWithROMData][clipLen] == '\'LK\'')
          {
            tempCounter += 1;
          }
          // Stop on encountering an AirDash
          else if (arrStateROM_05_ChoiceC[arrayWithROMData][clipLen] == '\'AirDash\'') // We hit an AirDash
          {
            //Lookahead
            for (let positiveI = 0; positiveI < CLIP_LENGTH; positiveI++)
            {
              // Everything until 65535 is = tempCounter
              if (arrStateROM_05_ChoiceC[arrayWithROMData][clipLen + positiveI] != 65535)
              {
                tempSwitch = 1
                arrStateROM_05_ChoiceC[arrayWithROMData][clipLen + positiveI] = tempCounter;
              }
              else if (tempSwitch == 1)
              {
                arrStateROM_05_ChoiceC[arrayWithROMData][clipLen + positiveI] = tempCounter;
                if (arrStateROM_05_ChoiceC[arrayWithROMData][clipLen + positiveI] == 65535)
                {
                  tempSwitch = 0;
                }
                break //lookahead is done, we hit 65535
              }
            }
            //Lookbehind, expect the number of LKs to equal the tempCounter value
            for (let negativeI = 1; negativeI < tempCounter + 1; negativeI++)
            {
              if (arrStateROM_05_ChoiceC[arrayWithROMData][clipLen - negativeI] == '\'LK\'')
              {
                arrStateROM_05_ChoiceC[arrayWithROMData][clipLen - negativeI] = tempCounter;
              }
            }
          }
          else // Reset the counters
          {
            tempCounter = 0;
            tempSwitch = 0;
          }
        }
        // Clean up the values for AE Part1
        for (var clipLen = 0; clipLen < CLIP_LENGTH; clipLen++)
        {
          if ((arrStateROM_05_ChoiceC[arrayWithROMData][clipLen] != 65535)
            && (arrStateROM_05_ChoiceC[arrayWithROMData][clipLen] >= 20))
          {
            arrStateROM_05_ChoiceC[arrayWithROMData][clipLen] = '\'Wait\''
          }
          else if (((arrStateROM_05_ChoiceC[arrayWithROMData][clipLen] != 65535))
            && (arrStateROM_05_ChoiceC[arrayWithROMData][clipLen] < 20)
            && (arrStateROM_05_ChoiceC[arrayWithROMData][clipLen] > 1))
          {
            arrStateROM_05_ChoiceC[arrayWithROMData][clipLen] = '\'No-Wait\''
          }
        }
        // Clean up the values for AE Part2
        for (var clipLen = 0; clipLen < CLIP_LENGTH; clipLen++)
        {
          if ((arrStateROM_05_ChoiceC[arrayWithROMData][clipLen] == '\'LK\'') || (arrStateROM_05_ChoiceC[arrayWithROMData][clipLen] == '\'MK\''))
          {
            arrStateROM_05_ChoiceC[arrayWithROMData][clipLen] = 0;
          }
        }
      } // end of 05_ChoiceC

      // 05_ChoiceC2 - ( MK to AirDash )









      // 09_ChoiceE (time: LK -> MK)
      for (let arrayWithROMData in arrStateROM_09_ChoiceE) // 3 arrays
      {
        for (var clipLen = 0; clipLen < CLIP_LENGTH; clipLen++)
        {
          if ((getAirborne)[arrayWithROMData][clipLen] == 0)
          {
            arrStateROM_09_ChoiceE[arrayWithROMData][clipLen] = 65535;
          }
        }
        var GroundSwitch = 0
        for (var clipLen = 0; clipLen < CLIP_LENGTH; clipLen++)
        {
          if ((arrStateROM_09_ChoiceE[arrayWithROMData][clipLen] != 65535) && (arrStateROM_09_ChoiceE[arrayWithROMData][clipLen] != 0))
          {
            GroundSwitch = 1;
            arrStateROM_09_ChoiceE[arrayWithROMData][clipLen] = 1;
          }
          else if (GroundSwitch == 1)
          {
            if (arrStateROM_09_ChoiceE[arrayWithROMData][clipLen] != 65535) // if NOT grounded
            {
              arrStateROM_09_ChoiceE[arrayWithROMData][clipLen] = 1; // my ROM cycle is still going
            }
            else if (arrStateROM_09_ChoiceE[arrayWithROMData][clipLen] == 65535) // On the ground; stop attacking
            {
              GroundSwitch = 0;
            }
          }
        }
        // Label the LKs & MKs
        for (var clipLen = 0; clipLen < CLIP_LENGTH; clipLen++)
        {
          if (arrStateROM_09_ChoiceE[arrayWithROMData][clipLen] == 1)
          {
            // Am I MK?
            if (((getNormal_Strength)[arrayWithROMData][clipLen] == 1) && ((getAir_Dash_Count)[arrayWithROMData][clipLen] == 1)) // MK
            {
              arrStateROM_09_ChoiceE[arrayWithROMData][clipLen] = "\'MK\'";
            }
            else if (((getAttack_Number)[arrayWithROMData][clipLen] == 18) && ((getNormal_Strength)[arrayWithROMData][clipLen] == 0) && ((getAir_Dash_Count)[arrayWithROMData][clipLen] == 1)) // 2LK
            {
              arrStateROM_09_ChoiceE[arrayWithROMData][clipLen] = "\'DLK\'";
            }
          }
        }
        // Count the frames of LKs using tempCounter
        for (var clipLen = 0; clipLen < CLIP_LENGTH; clipLen++)
        {
          if (arrStateROM_09_ChoiceE[arrayWithROMData][clipLen] == '\'DLK\'')
          {
            tempCounter += 1;
          }
          // Stop on encountering a MK
          else if (arrStateROM_09_ChoiceE[arrayWithROMData][clipLen] == '\'MK\'') // We hit a MK
          {
            //Lookahead
            for (let positiveI = 0; positiveI < CLIP_LENGTH; positiveI++) // CLIP_LENGTH is used, but we will break out of the loop before it is reached
            {
              // Everything until 65535 is = tempCounter
              if (arrStateROM_09_ChoiceE[arrayWithROMData][clipLen + positiveI] != 65535)
              {
                tempSwitch = 1
                arrStateROM_09_ChoiceE[arrayWithROMData][clipLen + positiveI] = tempCounter;
              }
              else if (tempSwitch == 1)
              {
                arrStateROM_09_ChoiceE[arrayWithROMData][clipLen + positiveI] = tempCounter;
                if (arrStateROM_09_ChoiceE[arrayWithROMData][clipLen + positiveI] == 65535)
                {
                  tempSwitch = 0;
                }
                break //lookahead is done, we hit 65535
              }
            }
            //Lookbehind, expect the number of 2LKs to equal the tempCounter value
            for (let negativeI = 1; negativeI < tempCounter + 1; negativeI++)
            {
              if (arrStateROM_09_ChoiceE[arrayWithROMData][clipLen - negativeI] == '\'DLK\'')
              {
                arrStateROM_09_ChoiceE[arrayWithROMData][clipLen - negativeI] = tempCounter;
              }
            }
          }
          else // Reset the counters
          {
            tempCounter = 0;
            tempSwitch = 0;
          }
        }
        // Clean up the values for AE Part1
        for (var clipLen = 0; clipLen < CLIP_LENGTH; clipLen++)
        {
          if ((arrStateROM_09_ChoiceE[arrayWithROMData][clipLen] != 65535)
            && (arrStateROM_09_ChoiceE[arrayWithROMData][clipLen] >= 0)
            && (arrStateROM_09_ChoiceE[arrayWithROMData][clipLen] < 3))
          // || (arrStateROM_09_ChoiceE[arrayWithROMData][clipLen] == '\'DLK\''))
          {
            arrStateROM_09_ChoiceE[arrayWithROMData][clipLen] = 0;
          }
        }
        // Clean up the values for AE Part2
        for (var clipLen = 0; clipLen < CLIP_LENGTH; clipLen++)
        {
          if ((arrStateROM_09_ChoiceE[arrayWithROMData][clipLen] != 65535)
            && (arrStateROM_09_ChoiceE[arrayWithROMData][clipLen] >= 13))
          {
            arrStateROM_09_ChoiceE[arrayWithROMData][clipLen] = '\'Wait\''
          }
          else if (((arrStateROM_09_ChoiceE[arrayWithROMData][clipLen] != 65535))
            && (arrStateROM_09_ChoiceE[arrayWithROMData][clipLen] < 13)
            && (arrStateROM_09_ChoiceE[arrayWithROMData][clipLen] > 0))
          {
            arrStateROM_09_ChoiceE[arrayWithROMData][clipLen] = '\'No-Wait\''
          }
        }
      } // End of 09_ChoiceE Scope 









      // Append data arrays into files
      for (let stateTokenI = 0; stateTokenI < allStateNamesArray.length; stateTokenI++)
      {
        fs.appendFileSync(`${ DIR_OUTPATH }${ tempPlayerString }_${ allStateNamesArray[stateTokenI] }.js`, `result[${ playerSlotI }] = [${ allStatesArray[stateTokenI][playerSlotI] }];\n`, {encoding: 'utf8'}, (err => {}));
      }
    }
  }
}

// writeMinMaxToNodeJSFile() // breaks next function on first-run; re-run program to get full results
getLabelsfromJS(NODE_JS_FILE).forEach((label) =>
{
  writePlayerMemory(1, label.toString(), 1);
  writePlayerMemory(2, label.toString(), 1);
});
writeStaticDataCNV();
writeInputCNV();
writeNewStates();
writeTotalFrameCountCNV();
writeStageDataCNV()
writeP1P2Addresses();
writeAllJSForAE();