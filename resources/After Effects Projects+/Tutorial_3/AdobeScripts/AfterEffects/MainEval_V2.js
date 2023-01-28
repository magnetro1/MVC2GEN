//Clip Info
const clipName = function ()
{
  getName = comp( "PathString" ).layer( "MainPathString" )( "Text" )( "Source Text" );
  getNameTrunc = getName.split( "\\" ).reverse()[ 1 ].replace( "_ae", "" );
  // Total_Frames
  let dataPath =
    comp( "PathString" ).layer( "MainPathString" )( "Text" )( "Source Text" );
  let assemble = dataPath + "Total_Frames" + ".js";
  $.evalFile( assemble );
  let stringSplit = string.split( "," );
  let tfLength = stringSplit[ stringSplit.length - 1 ];
  let tfVal = mnlLookup( "Total_Frames" );
  let tfCurr = tfVal - stringSplit[ 0 ];
  let tfRemaining = tfLength - tfVal;

  return (
    getNameTrunc +
    "\r" +
    "Total_Frames: " +
    tfCurr +
    " | Remaining: " +
    tfRemaining
  );
};

// Manual Lookup Function // Needs complete target-address. Ex: "P1_A_Health_Big"
const mnlLookup = function ( address )
{
  let dataPath =
    comp( "PathString" ).layer( "MainPathString" )( "Text" )( "Source Text" );
  let assemble = dataPath + address + ".js";
  $.evalFile( assemble ); // $.evals an external file containing a variable called "string"
  let check = string.split( "," )[ timeToFrames( time ) ];
  if ( isNaN( check ) )
  {
    return 0;
  }
  return check;
};

//Point Checker System
//These arrays will contain the active-point-character prefixes (Ex: P1_A_)
const P1 = [];
const P2 = [];

//Object-Keys use prefixes for future address-lookups (Ex: P1_A_ + Health_Big)
const pointTableP1 = {
  P1_A_: mnlLookup( "P1_A_is_Point" ),
  P1_B_: mnlLookup( "P1_B_is_Point" ),
  P1_C_: mnlLookup( "P1_C_is_Point" ),
};
const pointTableP2 = {
  P2_A_: mnlLookup( "P2_A_is_Point" ),
  P2_B_: mnlLookup( "P2_B_is_Point" ),
  P2_C_: mnlLookup( "P2_C_is_Point" ),
};

//Loops to check which keys have a 0 value and push them into previous arrays
//P1
for ( let i = 0; i < Object.values( pointTableP1 ).length; i++ )
{
  Object.values( pointTableP1 )[ i ] == 0
    ? P1.push( Object.keys( pointTableP1 )[ i ] )
    : "eod";
}

//P2
for ( let i = 0; i < Object.values( pointTableP2 ).length; i++ )
{
  Object.values( pointTableP2 )[ i ] == 0
    ? P2.push( Object.keys( pointTableP2 )[ i ] )
    : "eod";
}

//Main look-up function. Displays data in an array
const varLookup2 = function ( Pz, address )
{
  try
  {
    let PzData = [];
    for ( let i = 0; i < Pz.length; i++ )
    {
      let dataDir =
        comp( "PathString" ).layer( "MainPathString" )( "Text" )(
          "Source Text"
        );
      let assemble2 = dataDir + Pz[ i ] + address + ".js"; //uses function parameters
      $.evalFile( assemble2 );
      let check = Math.round( string.split( "," )[ timeToFrames( time ) ] );
      if ( isNaN( check ) )
      {
        return 0;
      }
      {
        PzData.push( check );
      }
    }
    return PzData;
  } catch ( error )
  {
    return "EoD";
  }
};

// Min/Max finder Functions for Linear interpolation animations
//Min
const minFN = function ( Pz, address )
{
  addressSearch = varLookup2( Pz, address );
  arrMin = [];
  for ( i = 0; i < addressSearch.length; i++ )
  {
    let dataPath =
      comp( "PathString" ).layer( "MainPathString" )( "Text" )( "Source Text" );
    let assemble = dataPath + Pz[ i ] + address + ".js";
    $.evalFile( assemble );
    let stringSplit = string.split( "," );
    let xMath = Math.round(
      Math.min.apply( null, stringSplit.splice( 0, stringSplit.length ) )
    );
    arrMin.push( xMath );
  }
  return arrMin;
};

//Max
const maxFN = function ( Pz, address )
{
  addressSearch = varLookup2( Pz, address );
  arrMax = [];
  for ( i = 0; i < addressSearch.length; i++ )
  {
    let dataPath =
      comp( "PathString" ).layer( "MainPathString" )( "Text" )( "Source Text" );
    let assemble = dataPath + Pz[ i ] + address + ".js";
    $.evalFile( assemble );
    let stringSplit = string.split( "," );
    let xMath = Math.round(
      Math.max.apply( null, stringSplit.splice( 0, stringSplit.length ) )
    );
    arrMax.push( xMath );
  }
  return arrMax;
};

//P1 or P2 address lookup. Needs P1 or P2 & ex: "Combo_Meter_Value"
const P1P2Lookup = function ( Py, address )
{
  try
  {
    let dataPath =
      comp( "PathString" ).layer( "MainPathString" )( "Text" )( "Source Text" );
    if ( Py == P1 )
    {
      Py = "P1_";
    } else
    {
      Py = "P2_";
    }
    let assemble = dataPath + Py + address + ".js";
    $.evalFile( assemble );
    let check = string.split( "," )[ timeToFrames( time ) ];
    if ( isNaN( check ) )
    {
      return 0;
    }
    return check;
  } catch ( error )
  {
    return "EoD!";
  }
};

// Complete character list from namesTable
function teamFinder()
{
  let placeArr = [];
  placeArr.push( mnlLookup( "P1_A_ID_2" ) );
  placeArr.push( mnlLookup( "P1_B_ID_2" ) );
  placeArr.push( mnlLookup( "P1_C_ID_2" ) );
  placeArr.push( mnlLookup( "P2_A_ID_2" ) );
  placeArr.push( mnlLookup( "P2_B_ID_2" ) );
  placeArr.push( mnlLookup( "P2_C_ID_2" ) );
  let names = "";
  for ( let i = 0; i < placeArr.length; i++ )
  {
    names += Object.values( namesTable )[ placeArr[ i ] ] + ",";
  }
  return names;
}

// Get P1/P2 active-point-character name function from namesTable
getPointName = function ( Pz )
{
  charName = varLookup2( Pz, "ID_2" );
  let arr = [];
  for ( i = 0; i < charName.length; i++ )
  {
    arr.push( namesTable[ charName[ i ] ] );
  }
  return arr;
};

//Knockdown_State Function gets P1 or P2 point-character's Knockdown_State
function Knockdown_StateFN( Pz )
{
  // P1 or P2
  let KSLookup = varLookup2( Pz, "Knockdown_State" );
  let arrKeys = [];
  let arrValues = [];
  for ( k = 0; k < KSLookup.length; k++ )
  {
    arrKeys.push( KSLookup[ k ] );
  }
  for ( v = 0; v < arrKeys.length; v++ )
  {
    arrValues.push( Knockdown_StateObj[ arrKeys[ v ] ] );
  }
  return arrValues;
}

//Prox_Block Function
function Prox_BlockFN( Pz )
{
  let ProxLookup = varLookup2( Pz, "Is_Prox_Block" );
  let arrKeys = [];
  let arrValues = [];
  for ( k = 0; k < ProxLookup.length; k++ )
  {
    arrKeys.push( ProxLookup[ k ] );
  }
  for ( v = 0; v < arrKeys.length; v++ )
  {
    arrValues.push( ProxBlocKObj[ arrKeys[ v ] ] );
  }
  return arrValues;
}
// Names Table / For address ID_2
const namesTable = {
  0: "Ryu",
  1: "Zangief",
  2: "Guile",
  3: "Morrigan",
  4: "Anakaris",
  5: "Strider Hiryu",
  6: "Cyclops",
  7: "Wolverine (Adamantium)",
  8: "Psylocke",
  9: "Iceman",
  10: "Rogue",
  11: "Captain America",
  12: "Spider-Man",
  13: "Hulk",
  14: "Venom",
  15: "Doctor Doom",
  16: "Tron Bonne",
  17: "Jill",
  18: "Hayato",
  19: "Ruby Heart",
  20: "Sonson",
  21: "Amingo",
  22: "Marrow",
  23: "Cable",
  24: "Abyss-1",
  25: "Abyss-2",
  26: "Abyss-3",
  27: "Chun-Li",
  28: "Megaman",
  29: "Roll",
  30: "Akuma",
  31: "B.B. Hood",
  32: "Felicia",
  33: "Charlie",
  34: "Sakura",
  35: "Dan",
  36: "Cammy",
  37: "Dhalsim",
  38: "M.Bison",
  39: "Ken",
  40: "Gambit",
  41: "Juggernaut",
  42: "Storm",
  43: "Sabretooth",
  44: "Magneto",
  45: "Shuma-Gorath",
  46: "War Machine",
  47: "Silver Samurai",
  48: "Omega Red",
  49: "Spiral",
  50: "Colossus",
  51: "Iron Man",
  52: "Sentinel",
  53: "Blackheart",
  54: "Thanos",
  55: "Jin",
  56: "Captain Commando",
  57: "Wolverine (Bone)",
  58: "Servbot",
};

//Knockdown_State Table
const Knockdown_StateObj = {
  0: "Neutral",
  1: "Walking",
  2: "Rising to Normal Jump",
  3: "Normal Jump",
  4: "Landing from Jump",
  5: "Starting to Crouch",
  6: "Fully-Crouched",
  7: "Rising from Crouch",
  8: "Turning Around",
  9: "Crouch Turning Around",
  10: "Forward Dashing",
  11: "Back Dashing",
  12: "???",
  13: "Rising to Super Jump",
  14: "Super Jumping",
  15: "Air Recovery",
  16: "???",
  17: "Getting up from OTG Stun & Tech Roll",
  18: "Blocking",
  19: "Air-Prox-Block & Blocking & Pushblocking",
  20: "Normal Attacks",
  21: "Special Attacks",
  22: "Assist value after match ends",
  23: "Extra OTG Stun",
  24: "Flight Neutral",
  25: "Corner Jump",
  26: "Air Dash",
  27: "Tech Hit flip out",
  28: "Tag/Assist-is-Called",
  29: "Supers & Snapbacks & THC",
  30: "Throwing opponent",
  31: "Being thrown",
  32: "Stunned & Forced-OTG Stun",
  33: "???",
  34: "OC Launcher",
};

//Prox_Block Table
const ProxBlocKObj = {
  0: "Neutral",
  1: "Air",
  2: "Dashing",
  3: "Crouching",
  4: "Turning Around",
  5: "Ground Block",
  6: "Air Block",
  7: "Standing Punches",
  8: "Standing Kicks",
  9: "Crouching Punches",
  10: "Crouching Kicks",
  11: "Air Punches",
  12: "Air Kicks",
  13: "Stunned",
  14: "???",
  15: "Throwing",
  16: "Being thrown",
  17: "Getting up from OTG (Invulnerable,",
  18: "Match Start (Throw Invulnerable,",
  19: "Win Pose",
  20: "Tag-in & OC Launcher",
  21: "Specials & Snapbacks",
  22: "Supers",
  23: "???",
  24: "Assist Related",
  25: "???",
  26: "Air Dash",
};

// Prints out various character information
const logicTracker = function (
  Px //"P1" or "P2"
)
{
  //Static values derived from original set of data
  let dataAdrObj = {
    Action_Flags: varLookup2( Px, "Action_Flags" ),
    Airborne: varLookup2( Px, "Airborne" ),
    Animation_Timer_Main: varLookup2( Px, "Animation_Timer_Main" ),
    Attack_Immune: varLookup2( Px, "Attack_Immune" ),
    Block_Meter: varLookup2( Px, "Block_Meter" ),
    FlyingScreen: varLookup2( Px, "FlyingScreen" ),
    FSI_Points: varLookup2( Px, "FSI_Points" ),
    Hitstop: varLookup2( Px, "Animation_Timer_Main" ),
    Knockdown_State: varLookup2( Px, "Knockdown_State" ),
    PunchKick: varLookup2( Px, "PunchKick" ),
    SJ_Counter: varLookup2( Px, "SJ_Counter" ),
    Is_Prox_Block: varLookup2( Px, "Is_Prox_Block" ),
  };
  // empty arrays that will contain our character's values
  let arrBeing_Hit = [];
  let arrFlying_Screen_Air = [];
  let arrFlyingScreen_OTG = [];
  let arrFSD_Dash = [];
  let arrFS_Install_1 = [];
  let arrFS_Install_2 = [];
  let arrNJ_Air = [];
  let arrNJ_Rising = [];
  let arrOTG_Extra_Stun = [];
  let arrOTG_Forced_Stun = [];
  let arrOTG_Hit = [];
  let arrOTG_Roll_Invincible = [];
  let arrOTG_Roll_Stunned = [];
  let arrProxBlock_Air = [];
  let arrProxBlock_Ground = [];
  let arrPushblock_Air = [];
  let arrPushblock_Ground = [];
  let arrRising_Invincibility = [];
  let arrSJ_Air = [];
  let arrSJ_Counter = [];
  let arrStun = [];
  let arrTech_Hit = [];
  let arrThrown_Air = [];
  let arrThrown_Ground = [];

  // Status Keys and Values
  let statusObject = {
    //Each of these keys will contain an array of 1 or 0, indicating active/inactive
    Being_Hit: arrBeing_Hit,
    Flying_Screen_Air: arrFlying_Screen_Air,
    FlyingScreen_OTG: arrFlyingScreen_OTG,
    FSD_Dash: arrFSD_Dash,
    FS_Install_1: arrFS_Install_1,
    FS_Install_2: arrFS_Install_2,
    NJ_Air: arrNJ_Air,
    NJ_Rising: arrNJ_Rising,
    OTG_Extra_Stun: arrOTG_Extra_Stun,
    OTG_Forced_Stun: arrOTG_Forced_Stun,
    OTG_Hit: arrOTG_Hit,
    OTG_Roll_Invincible: arrOTG_Roll_Invincible,
    OTG_Roll_Stunned: arrOTG_Roll_Stunned,
    ProxBlock_Air: arrProxBlock_Air,
    ProxBlock_Ground: arrProxBlock_Ground,
    Pushblock_Air: arrPushblock_Air,
    Pushblock_Ground: arrPushblock_Ground,
    Rising_Invincibility: arrRising_Invincibility,
    SJ_Air: arrSJ_Air,
    SJ_Counter: arrSJ_Counter,
    Stun: arrStun,
    Tech_Hit: arrTech_Hit,
    Thrown_Air: arrThrown_Air,
    Thrown_Ground: arrThrown_Ground,
  };
  for ( let p = 0; p < Px.length; p++ )
  {
    //Ternary checkers for state active/inactive
    arrBeing_Hit.push(
      dataAdrObj.Animation_Timer_Main[ p ] > 0 &&
        dataAdrObj.Knockdown_State[ p ] == 32
        ? 1
        : 0
    );
    arrFlying_Screen_Air.push(
      dataAdrObj.FlyingScreen[ p ] == 1 &&
        dataAdrObj.Knockdown_State[ p ] == 32 &&
        dataAdrObj.Airborne[ p ] == 2
        ? 1
        : 0
    );
    arrFlyingScreen_OTG.push(
      dataAdrObj.FlyingScreen[ p ] == 1 &&
        dataAdrObj.Knockdown_State[ p ] == 32 &&
        dataAdrObj.Airborne[ p ] == 3
        ? 1
        : 0
    );
    arrFS_Install_1.push(
      dataAdrObj.FSI_Points[ p ] == 8 || dataAdrObj.FSI_Points[ p ] == 9
        ? 1
        : 0
    );
    arrFS_Install_2.push( dataAdrObj.FSI_Points[ p ] > 9 ? 1 : 0 );
    arrNJ_Air.push(
      dataAdrObj.Airborne[ p ] == 2 &&
        dataAdrObj.Knockdown_State[ p ] == 3 &&
        dataAdrObj.SJ_Counter[ p ] == 0
        ? 1
        : 0
    );
    arrNJ_Rising.push(
      dataAdrObj.Airborne[ p ] == 0 &&
        dataAdrObj.Knockdown_State[ p ] == 2 &&
        dataAdrObj.SJ_Counter[ p ] == 0
        ? 1
        : 0
    );
    arrOTG_Extra_Stun.push(
      dataAdrObj.Knockdown_State[ p ] == 23 && dataAdrObj.Airborne[ p ] == 3
        ? 1
        : 0
    );
    arrOTG_Forced_Stun.push(
      dataAdrObj.Knockdown_State[ p ] == 32 && dataAdrObj.Airborne[ p ] == 3
        ? 1
        : 0
    );
    arrOTG_Hit.push(
      dataAdrObj.Action_Flags[ p ] == 0 &&
        dataAdrObj.Airborne[ p ] == 3 &&
        dataAdrObj.Knockdown_State[ p ] == 32
        ? 1
        : 0
    );
    arrOTG_Roll_Invincible.push(
      dataAdrObj.Action_Flags[ p ] == 2 &&
        dataAdrObj.Airborne[ p ] == 1 &&
        dataAdrObj.Attack_Immune[ p ] == 1 &&
        dataAdrObj.Knockdown_State[ p ] == 17
        ? 1
        : 0
    );
    arrOTG_Roll_Stunned.push(
      dataAdrObj.Action_Flags[ p ] == 1 &&
        dataAdrObj.Airborne[ p ] == 3 &&
        dataAdrObj.Knockdown_State[ p ] == 32
        ? 1
        : 0
    );
    arrProxBlock_Air.push(
      dataAdrObj.Is_Prox_Block[ p ] == 6 &&
        dataAdrObj.Knockdown_State[ p ] == 19
        ? 1
        : 0
    );
    arrProxBlock_Ground.push(
      dataAdrObj.Is_Prox_Block[ p ] == 5 &&
        dataAdrObj.Knockdown_State[ p ] == 18
        ? 1
        : 0
    );
    arrPushblock_Air.push(
      dataAdrObj.Block_Meter[ p ] > 0 &&
        dataAdrObj.Animation_Timer_Main[ p ] < 28 &&
        dataAdrObj.Is_Prox_Block[ p ] == 6 &&
        dataAdrObj.Action_Flags[ p ] == 2
        ? 1
        : 0
    );
    arrPushblock_Ground.push(
      dataAdrObj.Block_Meter[ p ] > 0 &&
        dataAdrObj.Animation_Timer_Main[ p ] < 28 &&
        dataAdrObj.Is_Prox_Block[ p ] == 5 &&
        dataAdrObj.Action_Flags[ p ] == 3
        ? 1
        : 0
    );
    arrRising_Invincibility.push(
      dataAdrObj.Airborne[ p ] == 0 &&
        dataAdrObj.Attack_Immune[ p ] == 1 &&
        dataAdrObj.Knockdown_State[ p ] == 17
        ? 1
        : 0
    );
    arrSJ_Air.push(
      dataAdrObj.Airborne[ p ] == 2 &&
        dataAdrObj.Knockdown_State[ p ] == 14 &&
        dataAdrObj.SJ_Counter[ p ] == 1
        ? 1
        : 0
    );
    arrSJ_Counter.push( dataAdrObj.SJ_Counter[ p ] == 2 ? 1 : 0 );
    arrStun.push(
      dataAdrObj.Knockdown_State[ p ] == 32 &&
        dataAdrObj.Is_Prox_Block[ p ] == 13
        ? 1
        : 0
    );
    arrTech_Hit.push( dataAdrObj.Knockdown_State[ p ] == 27 ? 1 : 0 );
    arrThrown_Air.push(
      dataAdrObj.Airborne[ p ] == 2 &&
        dataAdrObj.Knockdown_State[ p ] == 31 &&
        dataAdrObj.Is_Prox_Block[ p ] == 16
        ? 1
        : 0
    );
    arrThrown_Ground.push(
      dataAdrObj.Airborne[ p ] == 0 &&
        dataAdrObj.Knockdown_State[ p ] == 31 &&
        dataAdrObj.Is_Prox_Block[ p ] == 16
        ? 1
        : 0
    );
  }
  let fnStatusKeys = Object.keys( statusObject );
  let fnStatusValues = Object.values( statusObject );
  let resultTable = "";

  for ( i = 0; i < fnStatusValues.length; i++ )
  {
    resultTable += Px + fnStatusKeys[ i ] + ": " + fnStatusValues[ i ] + "\r";
  }

  return resultTable;
};

/*
List of Functions for reference
logicTracker(P2)
Knockdown_StateFN(P1) 
Prox_BlockFN(P1)
minFN(P1, "X_Position_Arena")
maxFN(P1, "X_Position_Arena")
clipName()
getPointName(P1) 
varLookup2(P1 , "Y_Position_Arena")
P1P2Lookup(P1, "Combo_Meter_Value") +" Hits" 
teamFinder()
*/

templateLiteral = `Clip_Info: ${ clipName() }
P1_Point_ID_2: ${ varLookup2( P1, "ID_2" ) }
P2_Point_ID_2: ${ varLookup2( P2, "ID_2" ) }
P1_Point: ${ getPointName( P1 ) }
P2_Point: ${ getPointName( P2 ) }
Team_Finder: ${ teamFinder() }
P1_Dizzy: ${ varLookup2( P1, "Dizzy" ) }
P2_Dizzy: ${ varLookup2( P2, "Dizzy" ) }
P1_Dizzy_Reset_Timer: ${ varLookup2( P1, "Dizzy_Reset_Timer" ) }
P2_Dizzy_Reset_Timer: ${ varLookup2( P2, "Dizzy_Reset_Timer" ) }
P1_Health_Big: ${ varLookup2( P1, "Health_Big" ) }
P2_Health_Big: ${ varLookup2( P2, "Health_Big" ) }
${ logicTracker( P1 ) }
${ logicTracker( P2 ) }
`;
