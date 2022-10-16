import * as fs from "fs"
import * as path from "path"
import * as pMem from "./main_files/Shuma47_node.js"
import {KNOCKDOWN_STATE_OBJ, PROX_BLOCK_OBJ, NAME_TABLE_OBJ, FLOATING_POINT_ADRS, MIN_MAX_ADRS, MISC_ADRS, STAGES_OBJ, PORTRAITS_TO_TIME_OBJ} from "./main_files/staticData.js"

const DIR_MAIN_FILES = path.join(process.cwd(), `/main_files/`);
const DIR_EXPORT_TO_AE = path.join(process.cwd(), `exportToAE/`);
const DIR_OUTPATH = `${ DIR_EXPORT_TO_AE }Shuma47/`;
const FILE_NAME_NO_EXT = DIR_OUTPATH.toString().match(/(\w+).$/)[1];
const NODE_JS_FILE = `${ DIR_MAIN_FILES }${ FILE_NAME_NO_EXT }_node.js`; // Current-Active-Working-File
const CLIP_LENGTH = pMem.A_2D_Game_Timer.split(",").length; // Used as clip-length frame tracker; address doesn't matter

if (!fs.existsSync(`${ DIR_OUTPATH }`))
{
  fs.mkdirSync(`${ DIR_OUTPATH }`), {recursive: true};
}

function writeAllJSForAE()
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

function writeMinMaxToNodeJSFile()
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
writeMinMaxToNodeJSFile();

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

function getLabelsfromJS(pathToFile)
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
    var removeDuplicates = [...new Set(playerDataAll)];

    return removeDuplicates
  }
};
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
      stageData.push(`'${ Object.values(STAGES_OBJ)[frame] }FF'`)
    });
    fs.appendFileSync(`${ DIR_OUTPATH }Stage_Selector_CNV.js`, `result[1] = [${ stageData }];\n`, {encoding: 'utf8'}, (err => {}));
    stageData = [];
  }
};
// Get unique-list of player memory addresses per clip to feed into main function. EX: P1_A/B/C_Health_Big

// Main function to write data to files OR return finalValues array
// Appends array if 2-character+ bug is on
function writePlayerMemory(PlayerOneOrPlayerTwo, playerMemoryAddress, write) // 'P1'/'P2', address from data-object, 1/0
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
  // Check for Floating Point Addresses so we can truncate their trailing digits
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
  for (let floatAddress in FLOATING_POINT_ADRS)
  {
    var toFixedDigitNumberFour = 4; //7 by default
    var floatArrayFixed = [[], [], []];
    if (`${ playerSwitcher }_${ playerMemoryAddress.toString() }` == `${ playerSwitcher }_${ FLOATING_POINT_ADRS[floatAddress] }`)
    {
      //ToFixed
      if (!fs.existsSync(`${ DIR_OUTPATH }/${ playerSwitcher }_${ FLOATING_POINT_ADRS[floatAddress] }_ToFixed_${ toFixedDigitNumberFour }.js`))
      {
        fs.writeFileSync(`${ DIR_OUTPATH }/${ playerSwitcher }_${ FLOATING_POINT_ADRS[floatAddress] }_ToFixed_${ toFixedDigitNumberFour }.js`, `result = [];` + '\n', {encoding: 'utf8'}, (err => {}));

        finalValuesArray[0].forEach((value) =>
        {
          value = parseFloat(value)
          floatArrayFixed[0].push(value.toFixed(toFixedDigitNumberFour));
        });
        finalValuesArray[1].forEach((value) =>
        {
          value = parseFloat(value)
          floatArrayFixed[1].push(value.toFixed(toFixedDigitNumberFour));
        });
        finalValuesArray[2].forEach((value) =>
        {
          value = parseFloat(value)
          floatArrayFixed[2].push(value.toFixed(toFixedDigitNumberFour));
        });
        fs.appendFileSync(`${ DIR_OUTPATH }/${ playerSwitcher }_${ FLOATING_POINT_ADRS[floatAddress] }_ToFixed_${ toFixedDigitNumberFour }.js`,
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
function writeStaticDataCNV()
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
function writeNewStates()
{
  //Temps for switching P1 and P2
  var tempPlayerValue;
  var tempPlayerString;
  // List of files to be written
  var stateNamesArray = [
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
  ];
  // P1 and P2
  for (tempPlayerValue = 1; tempPlayerValue < 3; tempPlayerValue++)
  {
    tempPlayerValue == 1 ? tempPlayerString = 'P1' : tempPlayerString = 'P2';

    for (var stateName in stateNamesArray)
    {
      fs.writeFileSync(`${ DIR_OUTPATH }${ tempPlayerString }_${ stateNamesArray[stateName] }.js`, `var result = [];` + '\n', {encoding: 'utf8'}, (err => {}));
    }

    // Fetches relevant addresses for State-Logic-Checking
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
    //NEW_STATE_ADD_HERE?

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
    //NEW_STATE_ADD_HERE

    var AllStatesArray = [
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
      arrStateThrown_Ground
      //NEW_STATE_ADD_HERE
    ];
    // for each slot (abc) in a Player's side
    for (var playerSlotI = 0; playerSlotI < 3; playerSlotI++)
    {
      // for each frame in a clip
      for (var clipLen = 0; clipLen < CLIP_LENGTH; clipLen++)
      {
        // Pushing the State-Logic-Checking for each State
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
        // // "NEW_STATE_ADD_NAME_HERE"
        // NEW_STATE_ADD_HERE
      }
      // Increase each consecutive "1" by 1. Ex: "1,1,1,1,1" becomes "1,2,3,4,5" until they hit 0.
      var counter = 0;

      for (let stateArray in AllStatesArray)
      {
        AllStatesArray[stateArray][playerSlotI].map((num, index) => // Go through all 3 arrays' values + keep track of the index
        {
          if (num === 0)
          {
            counter = 0
            return AllStatesArray[stateArray][playerSlotI][index] // returns the extant value inside of the array
          }
          else
          {
            AllStatesArray[stateArray][playerSlotI][index] = num + counter
            counter++
            return AllStatesArray[stateArray][playerSlotI][index + counter]
          }
        })
      }

      fs.appendFileSync(`${ DIR_OUTPATH }${ tempPlayerString }_State_Being_Hit.js`, `result[${ playerSlotI }] = [${ arrStateBeingHit[playerSlotI] }];\n`, {encoding: 'utf8'}, (err => {}));
      fs.appendFileSync(`${ DIR_OUTPATH }${ tempPlayerString }_State_Flying_Screen_Air.js`, `result[${ playerSlotI }] =[${ arrStateFlying_Screen_Air[playerSlotI] }];\n`, {encoding: 'utf8'}, (err => {}));
      fs.appendFileSync(`${ DIR_OUTPATH }${ tempPlayerString }_State_Flying_Screen_OTG.js`, `result[${ playerSlotI }] =[${ arrStateFlyingScreen_OTG[playerSlotI] }];\n`, {encoding: 'utf8'}, (err => {}));
      fs.appendFileSync(`${ DIR_OUTPATH }${ tempPlayerString }_State_FS_Install_1.js`, `result[${ playerSlotI }] =[${ arrStateFS_Install_1[playerSlotI] }];\n`, {encoding: 'utf8'}, (err => {}));
      fs.appendFileSync(`${ DIR_OUTPATH }${ tempPlayerString }_State_FS_Install_2.js`, `result[${ playerSlotI }] =[${ arrStateFS_Install_2[playerSlotI] }];\n`, {encoding: 'utf8'}, (err => {}));
      fs.appendFileSync(`${ DIR_OUTPATH }${ tempPlayerString }_State_NJ_Air.js`, `result[${ playerSlotI }] =[${ arrStateNJ_Air[playerSlotI] }];\n`, {encoding: 'utf8'}, (err => {}));
      fs.appendFileSync(`${ DIR_OUTPATH }${ tempPlayerString }_State_NJ_Rising.js`, `result[${ playerSlotI }] =[${ arrStateNJ_Rising[playerSlotI] }];\n`, {encoding: 'utf8'}, (err => {}));
      fs.appendFileSync(`${ DIR_OUTPATH }${ tempPlayerString }_State_OTG_Extra_Stun.js`, `result[${ playerSlotI }] =[${ arrStateOTG_Extra_Stun[playerSlotI] }];\n`, {encoding: 'utf8'}, (err => {}));
      fs.appendFileSync(`${ DIR_OUTPATH }${ tempPlayerString }_State_OTG_Forced_Stun.js`, `result[${ playerSlotI }] =[${ arrStateOTG_Forced_Stun[playerSlotI] }];\n`, {encoding: 'utf8'}, (err => {}));
      fs.appendFileSync(`${ DIR_OUTPATH }${ tempPlayerString }_State_OTG_Hit.js`, `result[${ playerSlotI }] =[${ arrStateOTG_Hit[playerSlotI] }];\n`, {encoding: 'utf8'}, (err => {}));
      fs.appendFileSync(`${ DIR_OUTPATH }${ tempPlayerString }_State_OTG_Roll_Invincible.js`, `result[${ playerSlotI }] =[${ arrStateOTG_Roll_Invincible[playerSlotI] }];\n`, {encoding: 'utf8'}, (err => {}));
      fs.appendFileSync(`${ DIR_OUTPATH }${ tempPlayerString }_State_OTG_Roll_Stunned.js`, `result[${ playerSlotI }] =[${ arrStateOTG_Roll_Stunned[playerSlotI] }];\n`, {encoding: 'utf8'}, (err => {}));
      fs.appendFileSync(`${ DIR_OUTPATH }${ tempPlayerString }_State_ProxBlock_Air.js`, `result[${ playerSlotI }] =[${ arrStateProxBlock_Air[playerSlotI] }];\n`, {encoding: 'utf8'}, (err => {}));
      fs.appendFileSync(`${ DIR_OUTPATH }${ tempPlayerString }_State_ProxBlock_Ground.js`, `result[${ playerSlotI }] =[${ arrStateProxBlock_Ground[playerSlotI] }];\n`, {encoding: 'utf8'}, (err => {}));
      fs.appendFileSync(`${ DIR_OUTPATH }${ tempPlayerString }_State_Pushblock_Air.js`, `result[${ playerSlotI }] =[${ arrStatePushblock_Air[playerSlotI] }];\n`, {encoding: 'utf8'}, (err => {}));
      fs.appendFileSync(`${ DIR_OUTPATH }${ tempPlayerString }_State_Pushblock_Ground.js`, `result[${ playerSlotI }] =[${ arrStatePushblock_Ground[playerSlotI] }];\n`, {encoding: 'utf8'}, (err => {}));
      fs.appendFileSync(`${ DIR_OUTPATH }${ tempPlayerString }_State_Rising_Invincibility.js`, `result[${ playerSlotI }] =[${ arrStateRising_Invincibility[playerSlotI] }];\n`, {encoding: 'utf8'}, (err => {}));
      fs.appendFileSync(`${ DIR_OUTPATH }${ tempPlayerString }_State_SJ_Air.js`, `result[${ playerSlotI }] =[${ arrStateSJ_Air[playerSlotI] }];\n`, {encoding: 'utf8'}, (err => {}));
      fs.appendFileSync(`${ DIR_OUTPATH }${ tempPlayerString }_State_SJ_Counter.js`, `result[${ playerSlotI }] =[${ arrStateSJ_Counter[playerSlotI] }];\n`, {encoding: 'utf8'}, (err => {}));
      fs.appendFileSync(`${ DIR_OUTPATH }${ tempPlayerString }_State_Stun.js`, `result[${ playerSlotI }] =[${ arrStateStun[playerSlotI] }];\n`, {encoding: 'utf8'}, (err => {}));
      fs.appendFileSync(`${ DIR_OUTPATH }${ tempPlayerString }_State_Tech_Hit.js`, `result[${ playerSlotI }] =[${ arrStateTech_Hit[playerSlotI] }];\n`, {encoding: 'utf8'}, (err => {}));
      fs.appendFileSync(`${ DIR_OUTPATH }${ tempPlayerString }_State_Thrown_Air.js`, `result[${ playerSlotI }] =[${ arrStateThrown_Air[playerSlotI] }];\n`, {encoding: 'utf8'}, (err => {}));
      fs.appendFileSync(`${ DIR_OUTPATH }${ tempPlayerString }_State_Thrown_Ground.js`, `result[${ playerSlotI }] =[${ arrStateThrown_Ground[playerSlotI] }];\n`, {encoding: 'utf8'}, (err => {}));
      //NEW_STATE_ADD_HERE
    }
  }
};

writeMinMaxToNodeJSFile() // breaks next function on first-run; re-run program to get full results
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