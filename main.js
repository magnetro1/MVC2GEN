import * as fs from "fs"
import * as path from "path"
// import * as data from './main_files/SpiralUnblockable_node.js'; // TODO figure out how to make this dynamic
import { Knockdown_State_Static, Prox_Block_Static, namesTable_Static, floatingPointAddresses } from "./main_files/staticData.js" // eval(testPath);
import * as data from "./main_files/Shuma47_node.js"
// import * as data from "./main_files/CaptainCommandoRogueCable8_node.js";

const DIR_OUTPATH = path.join( process.cwd(), "/exportToAE/Shuma47/" ) // File Directory to write to; needs to match the clip name to make sense TODO fix this
const CLIP_LENGTH = data.A_2D_Game_Timer.split( "," ).length // Used as clip-length frame tracker; address doesn't matter
//Objects containing Point-Character data used in main function
const POINT_OBJ_P1 = // Objects with the player slots as keys, and their values (0/1/2) as object-values. Ex: 'P1_A_ : 0'
{
  P1_A_: data.P1_A_Is_Point.split( "," ),
  P1_B_: data.P1_B_Is_Point.split( "," ),
  P1_C_: data.P1_C_Is_Point.split( "," ),
};
const POINT_OBJ_P2 =
{
  P2_A_: data.P2_A_Is_Point.split( "," ),
  P2_B_: data.P2_B_Is_Point.split( "," ),
  P2_C_: data.P2_C_Is_Point.split( "," ),
};

/******* Functions ******/

// Fetches usable node-js files exported using Powershell script
const DIR_MAIN_FILES = path.join( process.cwd(), "/main_files/" )
const FILE_NAMES = []
function getNodeJSFiles() // uses dirMainFiles to fetch usable files; returns array of file names
{
  fs.readdirSync( DIR_MAIN_FILES, 'utf8' ).toString().split( ',' ).forEach( function ( file )
  {
    let _nodeJSRegex = /\w+_node.js/g;
    if ( file.match( _nodeJSRegex ) )
    {
      FILE_NAMES.push( file );
    }
  } )
  return FILE_NAMES;
}
// console.log(getNodeJSFiles());

// Get unique-list of player memory addresses per clip to feed into main function. EX: P1_A/B/C_Health_Big
var playerDataAll = []
function getLabelsfromJS( pathToFile )
{
  var getFile = fs.readFileSync( pathToFile, 'utf8', );
  getFile.toString().split( ';' ).forEach( function ( line ) //Split each block of text by semi-colon
  {
    let playerMemoryRegex = /(P[1-2]_[A-C]_)(\w+)\s/g; // regex to find all player memory addresses; want capture group 2.
    let tempRegexVar; // Temporary variable to run the exec method
    while ( tempRegexVar = playerMemoryRegex.exec( line ) ) // Exec needs to match true or false
    {
      playerDataAll.push( tempRegexVar[ 2 ] ); // regex.exec returns array of all matches; item[2] is the address; has many duplicates
      playerDataAll.join( ',' ); // Converts array to string
    };
  } );
  var removeDuplicates = [ ...new Set( playerDataAll ) ];

  return removeDuplicates
}
// Main function to write data to files OR return finalValues array
// Appends array if 2-character+ bug is on


function writePlayerMemory( PlayerOneOrPlayerTwo, playerMemoryAddress, write ) // 'P1'/'P2', address from data-object, 1/0
{
  var finalValuesArray = []; // 3 Arrays to hold all 3 player slots.
  finalValuesArray[ 0 ] = [];
  finalValuesArray[ 1 ] = [];
  finalValuesArray[ 2 ] = [];
  var playerObjectSwitcher; // Switches between the Player1 and Player2 objects
  var playerSwitcher; // Switches between "P1" and "P2"

  if ( PlayerOneOrPlayerTwo == 1 || PlayerOneOrPlayerTwo == "P1" )
  {
    playerObjectSwitcher = POINT_OBJ_P1;
    playerSwitcher = "P1";
  }
  else if ( PlayerOneOrPlayerTwo == 2 || PlayerOneOrPlayerTwo == "P2" )
  {
    playerObjectSwitcher = POINT_OBJ_P2;
    playerSwitcher = "P2";
  }
  // Push all player memory addresses to finalValuesArray depending on the if-statement-logic
  // Eval EX: eval(data.P1_A_Health_Big.split(','))[clipLen])
  for ( let clipLen = 0; clipLen < CLIP_LENGTH; clipLen++ ) // length of clip
  {
    if ( ( Object.values( playerObjectSwitcher )[ 0 ][ clipLen ] == 0 ) && ( Object.values( playerObjectSwitcher )[ 1 ][ clipLen ] == 0 ) && ( Object.values( playerObjectSwitcher )[ 2 ][ clipLen ] == 0 ) )
    {
      // console.log( `${ playerString }: 3-Character Bug Logic: A == 0 && B == 0 && C == 0    P1: ABC` );
      finalValuesArray[ 0 ].push( eval( `data.${ Object.keys( playerObjectSwitcher )[ 0 ] }${ playerMemoryAddress }.split(',')` )[ clipLen ] );
      finalValuesArray[ 1 ].push( eval( `data.${ Object.keys( playerObjectSwitcher )[ 1 ] }${ playerMemoryAddress }.split(',')` )[ clipLen ] );
      finalValuesArray[ 2 ].push( eval( `data.${ Object.keys( playerObjectSwitcher )[ 2 ] }${ playerMemoryAddress }.split(',')` )[ clipLen ] );
    }
    //2-Character Bug Logic
    else if ( ( Object.values( playerObjectSwitcher )[ 0 ][ clipLen ] == 0 ) && ( Object.values( playerObjectSwitcher )[ 1 ][ clipLen ] == 0 ) && ( Object.values( playerObjectSwitcher )[ 2 ][ clipLen ] != 0 ) )
    {
      // console.log( `${ playerString }: 2-Character Bug Logic: A == 0 && B == 0 && C != 0    P1: AB` );
      finalValuesArray[ 0 ].push( eval( `data.${ Object.keys( playerObjectSwitcher )[ 0 ] }${ playerMemoryAddress }.split(',')` )[ clipLen ] );
      finalValuesArray[ 1 ].push( eval( `data.${ Object.keys( playerObjectSwitcher )[ 1 ] }${ playerMemoryAddress }.split(',')` )[ clipLen ] );
    }
    else if ( ( Object.values( playerObjectSwitcher )[ 0 ][ clipLen ] == 0 ) && ( Object.values( playerObjectSwitcher )[ 1 ][ clipLen ] != 0 ) && ( Object.values( playerObjectSwitcher )[ 2 ][ clipLen ] == 0 ) )
    {
      // console.log( `${ playerString }: 2-Character Bug Logic: A == 0 && B != 0 && C == 0    P1: AC` );
      finalValuesArray[ 0 ].push( eval( `data.${ Object.keys( playerObjectSwitcher )[ 0 ] }${ playerMemoryAddress }.split(',')` )[ clipLen ] );
      finalValuesArray[ 1 ].push( eval( `data.${ Object.keys( playerObjectSwitcher )[ 2 ] }${ playerMemoryAddress }.split(',')` )[ clipLen ] );
    }
    else if ( ( Object.values( playerObjectSwitcher )[ 0 ][ clipLen ] != 0 ) && ( Object.values( playerObjectSwitcher )[ 1 ][ clipLen ] == 0 ) && ( Object.values( playerObjectSwitcher )[ 2 ][ clipLen ] == 0 ) )
    {
      // console.log( `${ playerString }: 2-Character Bug Logic: A != 0 && B == 0 && C == 0    P1: BC` );
      finalValuesArray[ 0 ].push( eval( `data.${ Object.keys( playerObjectSwitcher )[ 1 ] }${ playerMemoryAddress }.split(',')` )[ clipLen ] );
      finalValuesArray[ 1 ].push( eval( `data.${ Object.keys( playerObjectSwitcher )[ 2 ] }${ playerMemoryAddress }.split(',')` )[ clipLen ] );
    }
    //1-Character Logic
    else if ( ( Object.values( playerObjectSwitcher )[ 0 ][ clipLen ] == 0 ) && ( Object.values( playerObjectSwitcher )[ 1 ][ clipLen ] != 0 ) && ( Object.values( playerObjectSwitcher )[ 2 ][ clipLen ] != 0 ) )
    {
      // console.log( `${ playerString }: 1-Character Logic: A == 0 && B != 0 && C != 0        P1: A` );
      finalValuesArray[ 0 ].push( eval( `data.${ Object.keys( playerObjectSwitcher )[ 0 ] }${ playerMemoryAddress }.split(',')` )[ clipLen ] );
      //                          eval(data.P1_A_Health_Big.split(','))[clipLen])
    }
    else if ( ( Object.values( playerObjectSwitcher )[ 0 ][ clipLen ] != 0 ) && ( Object.values( playerObjectSwitcher )[ 1 ][ clipLen ] == 0 ) && ( Object.values( playerObjectSwitcher )[ 2 ][ clipLen ] != 0 ) )
    {
      // console.log( `${ playerString }: 1-Character Logic: A != 0 && B == 0 && C != 0        P1: B` );
      finalValuesArray[ 0 ].push( eval( `data.${ Object.keys( playerObjectSwitcher )[ 1 ] }${ playerMemoryAddress }.split( ',' )` )[ clipLen ] );
      //                          eval(data.P1_B_Health_Big.split(','))[clipLen])
    }
    else if ( ( Object.values( playerObjectSwitcher )[ 0 ][ clipLen ] != 0 ) && ( Object.values( playerObjectSwitcher )[ 1 ][ clipLen ] != 0 ) && ( Object.values( playerObjectSwitcher )[ 2 ][ clipLen ] == 0 ) )
    {
      // console.log( `${ playerString }: 1 - Character Logic: A != 0 && B != 0 && C == 0        P1: C` );
      finalValuesArray[ 0 ].push( eval( `data.${ Object.keys( playerObjectSwitcher )[ 2 ] }${ playerMemoryAddress }.split(',')` )[ clipLen ] );
      //                          eval(data.P1_B_Health_Big.split(','))[clipLen])
    }
  }
  // Return if not writing files
  if ( write == 0 )
  {
    return finalValuesArray
  }
  // Write files
  if ( !fs.existsSync( DIR_OUTPATH ) )
  {
    fs.mkdirSync( DIR_OUTPATH );
  }

  // Check for Floating Point Addresses so that we can do stuff with them if they show up
  // for ( let floatAddress in floatingPointAddresses )
  // {
  //   if ( playerMemoryAddress == floatingPointAddresses[ floatAddress ] )
  //   {
  //     fs.writeFileSync( ` ${ DIR_OUTPATH }/${ playerString }_${ playerMemoryAddress }_Rounded.js` ),
  //       `var result = [];` + '\n',
  //       { flag: 'a+', encoding: 'utf8' },
  //       ( err => {} );
  //     console.log( `hola` )
  //   }
  // }
  fs.writeFileSync( `${ DIR_OUTPATH }/${ playerSwitcher }_${ playerMemoryAddress.split( ',' ) }.js`,
    `var result = [];` + '\n',
    { flag: 'a+', encoding: 'utf8' },
    ( err => {} ) );

  // Append main data
  for ( let dataArrayPerCharacter in finalValuesArray )
  {
    fs.appendFileSync( `${ DIR_OUTPATH }/${ playerSwitcher }_${ playerMemoryAddress.split( ',' ) }.js`,
      `result[${ dataArrayPerCharacter }] = [${ finalValuesArray[ dataArrayPerCharacter ] }];\n`,
      { encoding: 'utf8' },
      ( err => {} ) );
  }
} // End of Mainfunction()

// writePlayerMemory( 'P1', 'X_Position_Arena', 1 );
// EXECUTE MAIN FUNCTIONS
// getLabelsfromJS( "./main_files/Shuma47_node.js" ).forEach( ( label ) =>
// {
//   writePlayerMemory( 1, label.toString(), 1 );
//   writePlayerMemory( 2, label.toString(), 1 );
// } );

// Write Static Data Conversion. Example ID: 01 turns into "Ryu"

function writeStaticDataCnv()
{
  const STATIC_DATA_OBJS = [ Knockdown_State_Static, Prox_Block_Static, namesTable_Static ]
  const STATIC_DATA_ADRS = [ 'Knockdown_State', 'Is_Prox_Block', 'ID_2' ]
  var staticLookupResultsArray = [];
  staticLookupResultsArray[ 0 ] = [];
  staticLookupResultsArray[ 1 ] = [];
  staticLookupResultsArray[ 2 ] = [];
  for ( let playersLen = 1; playersLen < 3; playersLen++ )
  {
    for ( let staticDataLen = 0; staticDataLen < STATIC_DATA_ADRS.length; staticDataLen++ )
    {
      // Make directories if they don't exist
      if ( !fs.existsSync( DIR_OUTPATH ) )
        fs.mkdirSync( DIR_OUTPATH );
      //Write base file
      fs.writeFileSync( `${ DIR_OUTPATH }P${ playersLen }_${ STATIC_DATA_ADRS[ staticDataLen ] }_CNV.js`,
        `var result = [];` + '\n',
        { encoding: 'utf8' },
        ( err => {} ) );
    }
    for ( let staticDataLen = 0; staticDataLen < STATIC_DATA_ADRS.length; staticDataLen++ )
    {
      var callPlayerMemoryFN = writePlayerMemory( `${ playersLen }`, STATIC_DATA_ADRS[ staticDataLen ], 0 );
      for ( let playerMemLength = 0; playerMemLength < callPlayerMemoryFN.length; playerMemLength++ )
      {
        //Push and convert all three arrays' values
        for ( let characterSlot = 0; characterSlot < callPlayerMemoryFN[ playerMemLength ].length; characterSlot++ )
        {
          staticLookupResultsArray[ playerMemLength ].push( `'${ Object.values( STATIC_DATA_OBJS[ staticDataLen ] )[ callPlayerMemoryFN[ playerMemLength ][ characterSlot ] ] }'` );
        }
        fs.appendFileSync( `${ DIR_OUTPATH }P${ playersLen }_${ STATIC_DATA_ADRS[ staticDataLen ] }_CNV.js`, `result[${ playerMemLength }] = [${ staticLookupResultsArray[ playerMemLength ] }];\n`,
          { encoding: 'utf8' },
          ( err => {} ) );
        staticLookupResultsArray = [];
        staticLookupResultsArray[ 0 ] = [];
        staticLookupResultsArray[ 1 ] = [];
        staticLookupResultsArray[ 2 ] = [];
      }
    }
  }
};
// writeStaticDataCnv();

function writeInputConvert()
{
  var P1Inputs = data.P1_Input_DEC.split( ',' );
  var P2Inputs = data.P2_Input_DEC.split( ',' );
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

  for ( let playersLen = 1; playersLen < 3; playersLen++ )
  {
    playersLen == 1 ? tempPlayerString = P1Inputs : tempPlayerString = P2Inputs;
    //Input Conversion Type 1
    for ( let input in tempPlayerString )
    {
      for ( let button in Object.entries( buttonConversionVersion1 ) )
      {
        if ( ( tempPlayerString[ input ] & Object.values( buttonConversionVersion1 )[ button ] ) != 0 )
        {
          playerInputResults += `${ Object.keys( buttonConversionVersion1 )[ button ] }`;
        }
      }
      playerInputsCNVArray.push( playerInputResults );
      playerInputResults = '';
    }
    fs.writeFileSync( `${ DIR_OUTPATH }P${ playersLen }_Inputs_CNV.js`, `var result = [];` + '\n' + `result[0] = ['
      ${ playerInputsCNVArray.toString()
        .replace( /24/gi, '1' )
        .replace( /42/gi, '1' )
        .replace( /26/gi, '3' )
        .replace( /62/gi, '3' )
        .replace( /48/gi, '7' )
        .replace( /84/gi, '7' )
        .replace( /86/gi, '9' )
        .replace( /68/gi, '9' )
      }'];` + '\n',
      { encoding: 'utf8' },
      ( err => {} ) );
    playerInputsCNVArray = [];

    //Input Conversion Type 2
    for ( let input in tempPlayerString )
    {
      for ( let button in Object.entries( buttonConversionVersion2 ) )
      {
        if ( ( tempPlayerString[ input ] & Object.values( buttonConversionVersion2 )[ button ] ) != 0 )
        {
          playerInputResults += Object.keys( buttonConversionVersion2 )[ button ];
        }
      }
      playerInputsCNVArray.push( playerInputResults );
      playerInputResults = '';
    }
    fs.appendFileSync( `${ DIR_OUTPATH }P${ playersLen }_Inputs_CNV.js`, `result[1] = ['${ playerInputsCNVArray.toString()
      //Fix diagonals
      .replace( /24/gi, '1' )
      .replace( /42/gi, '1' )
      .replace( /26/gi, '3' )
      .replace( /62/gi, '3' )
      .replace( /48/gi, '7' )
      .replace( /84/gi, '7' )
      .replace( /86/gi, '9' )
      .replace( /68/gi, '9' )
      //Add '+' to direction+button inputs
      .replace( /([1-9](?=\w+))/gm, '$1+' )
      //Replace numbers with Letter-notation
      .replace( /2|2\+/gm, 'D' )
      .replace( /6|6\+/gm, 'R' )
      .replace( /8|8\+/gm, 'U' )
      .replace( /4|4\+/gm, 'L' )
      .replace( /1|1\+/gm, 'DL' )
      .replace( /3|3\+/gm, 'DR' )
      .replace( /9|9\+/gm, 'UR' )
      .replace( /7|7\+/gm, 'UL' )
      //Re-write assists' notation
      .replace( /AA/gi, 'A1' )
      .replace( /AB/gi, 'A2' )
      }'];`,
      { encoding: 'utf8' },
      ( err => {} ) );
    playerInputsCNVArray = [];
  }
}

// writeInputConvert();

var State_Being_Hit_FN = function ()
{
  fs.writeFileSync( `${ DIR_OUTPATH }P1_State_Being_Hit.js`, `var result = [];` + '\n', { encoding: 'utf8' }, ( err => {} ) );
  fs.writeFileSync( `${ DIR_OUTPATH }P2_State_Being_Hit.js`, `var result = [];` + '\n', { encoding: 'utf8' }, ( err => {} ) );

  var state_results_array = [];
  state_results_array[ 0 ] = [];
  state_results_array[ 1 ] = [];
  state_results_array[ 2 ] = [];
  var tempPlayerValue;
  var tempPlayerString;


  for ( tempPlayerValue = 1; tempPlayerValue < 3; tempPlayerValue++ ) // P1 and P2
  {
    if ( tempPlayerValue == 1 ) 
    {
      tempPlayerString = "P1";
    }
    else
    {
      tempPlayerString = "P2";
    }
    var getKnockdown_State = writePlayerMemory( tempPlayerString, 'Knockdown_State', 0 )
    var getAnimation_Timer_Main = writePlayerMemory( tempPlayerString, 'Animation_Timer_Main', 0 )

    for ( let playerSlotI = 0; playerSlotI < 3; playerSlotI++ ) // 3 Arrays for each player. 
    {
      for ( let clipLen = 0; clipLen < CLIP_LENGTH; clipLen++ ) // total amount of frames in a clip
      {
        if ( ( ( getKnockdown_State )[ playerSlotI ][ clipLen ] == 32 ) && ( ( getAnimation_Timer_Main )[ playerSlotI ][ clipLen ] > 0 ) )
        {
          state_results_array[ playerSlotI ].push( 1 );
        }
        else
        {
          state_results_array[ playerSlotI ].push( 0 );
        }
      }
    }
    fs.appendFileSync( `${ DIR_OUTPATH }${ tempPlayerString }_State_Being_Hit.js`, `result[0] = [${ state_results_array[ 0 ].toString() }];\n`, { encoding: 'utf8' }, ( err => {} ) );
    fs.appendFileSync( `${ DIR_OUTPATH }${ tempPlayerString }_State_Being_Hit.js`, `result[1] = [${ state_results_array[ 1 ].toString() }];\n`, { encoding: 'utf8' }, ( err => {} ) );
    fs.appendFileSync( `${ DIR_OUTPATH }${ tempPlayerString }_State_Being_Hit.js`, `result[2] = [${ state_results_array[ 1 ].toString() }];\n`, { encoding: 'utf8' }, ( err => {} ) );
    // Reset the array for the next player
    state_results_array = [];
    state_results_array[ 0 ] = [];
    state_results_array[ 1 ] = [];
    state_results_array[ 2 ] = [];
  }
}

State_Being_Hit_FN()
// console.log( writePlayerMemory( "P1", "Animation_Timer_Main", 0 )[ 0 ][ 0 ] );

//   "Being_Hit": (( Animation_Timer_Main > 0 )&& (Knockdown_State == 32) ) ? 1 : 0,

// i = PlayerOneAndPlayerTwo
// j = ComparisonStates
// k = numberOfArraysInCall
// m = lengthOfEntriesInClip

// finalArray[ i ].push( BlockstunArray[ i ][ j ] && ActionFlags[ 0 ][ 0 ] && AnimationTimerMain[ i ][ j ] )

// console.log( writePlayerMemory( 'Knockdown_State', 1 ) );

// function writeMathFromFilesCnv(pathToData)
// {
// var getFile = fs.readFileSync(pathToData, 'utf8',);
//     getFile.toString().split(';').forEach(function (line) //Split each block of text by semi-colon
//     {
//         let playerMemoryRegex = /(P[1-2]_[A-C]_)(\w+)\s/g; // regex to find all player memory addresses; want capture group 2.
//         let tempRegexVar; // Temporary variable to run the exec method
//         while (tempRegexVar = playerMemoryRegex.exec(line)) // Exec needs to match true or false
//         {
//             playerDataAll.push(tempRegexVar[ 2 ]); // regex.exec returns array of all matches; item[2] is the address; has many duplicates
//             playerDataAll.join(','); // Converts array to string
//         };
//     });
//     var removeDuplicates = [ ...new Set(playerDataAll) ];

//     return removeDuplicates
// }

// writeMathFromFilesCnv("./main_files/Shuma47_node.js")

/* List of States I'm going to export data for:
  I was thinking of adding a table of states and their corresponding logics...
  It would be cool if the MVC2GEN could iterate through this table automatically
  to pick out which key and value pairs to use for each character.
*/

// const newDataToWrite = {
//   "Being_Hit": (( Animation_Timer_Main > 0 )&& (Knockdown_State == 32) ) ? 1 : 0,
//   "Flying_Screen_Air":( (FlyingScreen == 1) && (Knockdown_State == 32) && (Airborne == 2) ) ? 1 : 0,
//   "FlyingScreen_OTG": ((FlyingScreen == 1) && (Knockdown_State == 32) && (Airborne == 3) ) ? 1 : 0,
//   "FS_Install_1": ((FSI_Points == 8) || (FSI_Points == 9) ) ? 1 : 0,
//   "FS_Install_2": ((FSI_Points > 9) ) ? 1 : 0,
//   "NJ_Air": (( (Airborne == 2) && (Knockdown_State == 3) && (SJ_Counter == 0) ) ) ? 1 : 0,
//   "NJ_Rising": ((Airborne == 0) && (Knockdown_State == 2) && (SJ_Counter == 0) ) ? 1 : 0,
//   "OTG_Extra_Stun": ((Knockdown_State == 23) && (Airborne == 3) ) ? 1 : 0,
//   "OTG_Forced_Stun": ((Knockdown_State == 32) && (Airborne == 3) ) ? 1 : 0,
//   "OTG_Hit": ((Action_Flags == 0) && (Airborne == 3) && (Knockdown_State == 32) ) ? 1 : 0,
//   "OTG_Roll_Invincible": ((Action_Flags == 2) && (Airborne == 1) && (Attack_Immune == 1) && (Knockdown_State == 17) ) ? 1 : 0,
//   "OTG_Roll_Stunned": ((Action_Flags == 1) && (Airborne == 3) && (Knockdown_State == 32) ) ? 1 : 0,
//   "ProxBlock_Air": ((Is_Prox_Block == 6) && (Knockdown_State == 19) ) ? 1 : 0,
//   "ProxBlock_Ground": ((Is_Prox_Block == 5) && (Knockdown_State == 18) ) ? 1 : 0,
//   "Pushblock_Air": ((Block_Meter > 0) && (Animation_Timer_Main < 28) && (Is_Prox_Block == 6) && (Action_Flags == 2) ) ? 1 : 0,
//   "Pushblock_Ground": ((Block_Meter > 0) && (Animation_Timer_Main < 28) && (Is_Prox_Block == 5) && (Action_Flags == 3) ) ? 1 : 0,
//   "Rising_Invincibility": ((Airborne == 0) && (Attack_Immune == 1) && (Knockdown_State == 17) ) ? 1 : 0,
//   "SJ_Air": ((Airborne == 2) && (Knockdown_State == 14) && (SJ_Counter == 1) ) ? 1 : 0,
//   "SJ_Counter": ((SJ_Counter == 2) ) ? 1 : 0,
//   "Stun": ((Knockdown_State == 32) && (Is_Prox_Block == 13) ) ? 1 : 0,
//   "Tech_Hit": ((Knockdown_State == 27) ) ? 1 : 0,
//   "Thrown_Air": ((Airborne == 2) && (Knockdown_State == 31) && (Is_Prox_Block == 16) ) ? 1 : 0,
//   "Thrown_Ground": ((Airborne == 0) && (Knockdown_State == 31) && (Is_Prox_Block == 16) ) ? 1 : 0,
// }

/*Instead for now, there's these arrays corresponding to each character.
I have to create a set of Arrays for each character for now.

// var BeingHitArray = [];
// 	BeingHitArray[0] = '';
// 	BeingHitArray[1] = '';
// 	BeingHitArray[2] = '';
// 	BeingHitArray[3] = '';
// 	BeingHitArray[4] = '';
// 	BeingHitArray[5] = '';

// var FlyingScreenAirArray = [];
// 	FlyingScreenAirArray[0] = '';
// 	FlyingScreenAirArray[1] = '';
// 	FlyingScreenAirArray[2] = '';
// 	FlyingScreenAirArray[3] = '';
// 	FlyingScreenAirArray[4] = '';
// 	FlyingScreenAirArray[5] = '';

// for ( let sixCharsI in slots )
// {
// 	let tempTxt = '';
// 	for ( let frame in clipLength )
// 	{
// 		tempTxt += ( eval(`data.${ slots[ sixCharsI ]}FlyingScreen.split( ',' )`)[frame] == 1
// 			&& eval(`data.${ slots[ sixCharsI ]}Knockdown_State.split( ',' )`)[frame] == 32
// 			&& eval(`data.${ slots[ sixCharsI ]}Airborne.split( ',' )`)[frame] == 2)
// 			? 1 + ',' : 0 + ',';
// 		FlyingScreenAirArray[sixCharsI] = `export var ${ slots[ sixCharsI ]}FlyingScreenAir = "${tempTxt}"; `;
// 	}
// 	tempTxt = '';
// 	FlyingScreenAirArray[sixCharsI] = FlyingScreenAirArray[sixCharsI].replace(`, "` , `"`);
// }

//  Old method of doing the loops; I'm keeping it here to update it later.
// I'd like to figure out an efficient way to do these loops before propagating it to the other files.

// for (let  m = 0 ; m < slots.length ; m++ )
// {
//     for ( let i = 0; i < data.A_2D_Game_Timer.split(',').length ; i++ )
//     {
//         // console.log(slots[m]+"Knockdown_State: "+(eval(`data.${ slots[ m ] } Knockdown_State.split( ',' )`)[i]))
//         // console.log(slots[m]+"Animation_Timer_Main: "+(eval(`data.${ slots[ m ] } Animation_Timer_Main.split( ',' )`)[i]))
//         BeingHitArray[m] += ( eval(`data.${ slots[ m ] } Animation_Timer_Main.split( ',' )`)[i] > 0
//             && eval(`data.${ slots[ m ] } Knockdown_State.split( ',' )`)[i] == 32 )
//             ? 1 + ',' : 0 + ','
//     }
//     // console.log(slots[m]+"BeingHit: " + BeingHitArray[m]);
// }
// console.log(BeingHitArray);
*/