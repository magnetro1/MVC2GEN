/*
Trainer propagator for PCSX2 README
- Creates a LUA script for Cheat Engine
- Paste into `Scripts > Trainer_V3` in Cheat Engine
- Check "Frame_Counter" to activate script inside of:
    Main > System_Values > Frame_Skip
- To turn off, first click "Stop" button, then uncheck "Frame_Counter"
 */

import clipboard from "clipboardy";

/**
 * Prefix Key:
 * 
 * MISC  = Miscellaneous Values that should not be edited;
 * 1 Entry in Lua-Window
 * 
 * SYST  = System Values that possess P1 and P2;
 * 2 Entries in Lua-Window
 * 
 * PMEM  = Player Memory Values that possess
 * P1_A, P1_B, P1_C, P2_A, P2_B, P2_C;
 * 2 Entries in Lua-Window
 * 
 * SYST AND PMEM entries require subtracting the iteration
 * by 1 to get the correct value.
 * 
 * Rename these when editing the script; the rest should work on its own!
 */
const ENTRIES = [
  'MISC_Frame_Counter',         // 1 Entry in Lua-Window
  //
  'MISC_Frame_Skip_Toggle',     // 1 Entry in Lua-Window
  'SYST_Input_DEC',             // 2 Entries in Lua-Window
  'SYST_Combo_Meter_Value',     // 2 Entries in Lua-Window
  //
  'PMEM_Throw_Counter_Mash',    // 2 Entries in Lua-Window
  'PMEM_Throw_RNG',             // 2 Entries in Lua-Window
  'PMEM_Hitstop2',              // 2 Entries in Lua-Window
];

// the ones we will use to write the lua script
const REAL_ENTRIES = [];

// Trainer-box constants
const T_PROPS = {
  tColor: '0x00b140', // green; used in OBS for green screen
  tWidth: 800 - 2, // sub Windows Panel
  tHeight: 600 - 28, // sub Windows Panel
  tXPos: 3,
  tYPos: 3,
  tFontSize: 28,
  tRowsOffset: 45,
  tRowSpacer: 20,
};
// Font constants
const T_FONT_0 = {
  fName0: 'Cascade Mono',
  fSize0: T_PROPS.tFontSize,
  fColor0: '0xFF0000',
};
const T_FONT_1 = {
  fName1: 'Cascade Mono',
  fSize1: T_PROPS.tFontSize,
  fColor1: '0xFFFFFF',
};

/**
 * Generates a list of variables based on the ENTRIES array.
 * The variables will keep their prefixes for the Javascript,
 * but will be stripped for the Lua code.
 * @returns {string} The generated variable list.
 */
function WriteEntryList() {
  let var_list_main = '';

  for (let i = 0, counter = 0; i < ENTRIES.length; i++) {
    if (ENTRIES[i].includes('MISC_')) {
      var_list_main += `VAR_${counter} = '${ENTRIES[i]}'\n`
        .replace('MISC_', '');
      counter++;
    }
    else if (ENTRIES[i].includes('SYST_')) {
      var_list_main += `VAR_${counter} = 'P1_${ENTRIES[i]}'\n`
        .replace('SYST_', '');
      counter++;
      var_list_main += `VAR_${counter} = 'P2_${ENTRIES[i]}'\n`
        .replace('SYST_', '');
      counter++;
    }
    else if (ENTRIES[i].includes('PMEM_')) {
      var_list_main += `VAR_${counter} = 'One_${ENTRIES[i]}'\n`
        .replace('PMEM_', '');
      counter++;
      var_list_main += `VAR_${counter} = 'Two_${ENTRIES[i]}'\n`
        .replace('PMEM_', '');
      counter++;
    }
    else {
      throw new Error('Invalid prefix found in ENTRIES array!');
    }
  }
  return var_list_main;
}
// console.log(WriteEntryList());
function ConvertToPlayerString(pString) {
  let playerValue = '';
  if (
    (pString === 'One') ||
    (pString === 'one') ||
    (pString === 'P1') ||
    (pString === 'ONE')
  ) {
    playerValue = 'P1';
  } else if (
    (pString === 'Two') ||
    (pString === 'two') ||
    (pString === 'P2') ||
    (pString === 'TWO')
  ) {
    playerValue = 'P2';
  }
  return playerValue;
}

const TEMPLATE_LITERAL_START =
  `[ENABLE]
{$lua}

-- ENABLE 'Frame_Counter' after form launches,
-- then DISABLE it in order to let the form update.
`

// contains constants for conversion
const TEMPLATE_LITERAL_MIDDLE = `
-- Main Variables

${WriteEntryList()}

--Label Position Variables
local fWidth = ${T_PROPS.tWidth}
local fHeight = ${T_PROPS.tHeight}

--Custom Font Variables
local cFont0 = {
  fName =  '${T_FONT_0.fName0}',
  fSize =   ${T_FONT_0.fSize0},
  fColor = ${T_FONT_0.fColor0},
}

local cFont1 = {
  fName =  '${T_FONT_1.fName1}',
  fSize =   ${T_FONT_1.fSize1},
  fColor =  ${T_FONT_1.fColor1},
}

-- Converter Objects

inputConverterObject = {
  Down  = 4096,
  Up    = 8192,
  Right = 1024,
  Left  = 2048,
  LP    = 512,
  LK    = 64,
  HP    = 256,
  HK    = 32,
  AA    = 128,
  AB    = 16,
  ST    = 32768,
  SE    = 2,
}

Knockdown_State_OBJ = {}
Knockdown_State_OBJ[0] = "Neutral"
Knockdown_State_OBJ[1] = "Walking"
Knockdown_State_OBJ[2] = "Normal Jump Rise"
Knockdown_State_OBJ[3] = "Normal Jump"
Knockdown_State_OBJ[4] = "Landing"
Knockdown_State_OBJ[5] = "Crouching"
Knockdown_State_OBJ[6] = "Crouched"
Knockdown_State_OBJ[7] = "Stand Rise"
Knockdown_State_OBJ[8] = "Stand Turn"
Knockdown_State_OBJ[9] = "Crouch Turning"
Knockdown_State_OBJ[10] = "Forward Dashing"
Knockdown_State_OBJ[11] = "Back Dashing"
Knockdown_State_OBJ[12] = "Double Dizzy"
Knockdown_State_OBJ[13] = "Super Jump Rise"
Knockdown_State_OBJ[14] = "Super Jumping"
Knockdown_State_OBJ[15] = "Air Recovery"
Knockdown_State_OBJ[16] = "???"
Knockdown_State_OBJ[17] = "Knockdown Rise"
Knockdown_State_OBJ[18] = "Ground Block"
Knockdown_State_OBJ[19] = "Air Blocking"
Knockdown_State_OBJ[20] = "Normal Attacks"
Knockdown_State_OBJ[21] = "Special Attacks"
Knockdown_State_OBJ[22] = "Post-Match"
Knockdown_State_OBJ[23] = "Extra OTG Stun"
Knockdown_State_OBJ[24] = "Neutral Flight"
Knockdown_State_OBJ[25] = "Corner Jump"
Knockdown_State_OBJ[26] = "Air Dash"
Knockdown_State_OBJ[27] = "Tech Hit"
Knockdown_State_OBJ[28] = "Switching & Assists"
Knockdown_State_OBJ[29] = "Supers & Flashes"
Knockdown_State_OBJ[30] = "Throwing"
Knockdown_State_OBJ[31] = "Thrown"
Knockdown_State_OBJ[32] = "Stunned"
Knockdown_State_OBJ[33] = "???"
Knockdown_State_OBJ[34] = "Command Launcher"


function GetPointForPMem(p1OrP2)
  p1OrP2 = tostring(p1OrP2)
  
  if p1OrP2 == "P1" or p1OrP2 == "p1" or p1OrP2 == "1" then
    p1OrP2 = "P1"
  elseif p1OrP2 == "P2" or p1OrP2 == "p2" or p1OrP2 == "2" then
    p1OrP2 = "P2"
  else
    print("Invalid input. Please enter 'P1' or 'P2'.")
    return
  end

  --Store CE function calls in variables
  local getP1A = memoryrecord_getValue(getAddressList()
    .getMemoryRecordByDescription("P1_A_Is_Point"))
  local getP1B = memoryrecord_getValue(getAddressList()
    .getMemoryRecordByDescription("P1_B_Is_Point"))
  local getP1C = memoryrecord_getValue(getAddressList()
    .getMemoryRecordByDescription("P1_C_Is_Point"))      

  local getP2A = memoryrecord_getValue(getAddressList()
    .getMemoryRecordByDescription("P2_A_Is_Point"))
  local getP2B = memoryrecord_getValue(getAddressList()
    .getMemoryRecordByDescription("P2_B_Is_Point"))
  local getP2C = memoryrecord_getValue(getAddressList()
    .getMemoryRecordByDescription("P2_C_Is_Point"))

  local pointResult = ''
  
  --find the point
  if p1OrP2 == "P1" then
    if tonumber(getP1A) == 0 then
      pointResult = 'P1_A_';
    elseif tonumber(getP1B) == 0 then
      pointResult = 'P1_B_';
    elseif tonumber(getP1C) == 0 then
      pointResult = 'P1_C_';
    end
  elseif p1OrP2 == "P2" then
    if tonumber(getP2A) == 0 then
      pointResult = 'P2_A_';
    elseif tonumber(getP2B) == 0 then
      pointResult = 'P2_B_';
    elseif tonumber(getP2C) == 0 then
      pointResult = 'P2_C_';
    end
  end
  return pointResult
end

function GetPMem(p1OrP2, memVal)
-- get rid of the ONE_ or TWO_ from memVal in LUA; using LUA
  memVal = tostring(memVal)
  memVal = string.gsub(memVal, "One_", "")
  memVal = string.gsub(memVal, "Two_", "")
  --print(memVal);
  
  p1OrP2 = tostring(p1OrP2)
  
  if p1OrP2 == "P1" or p1OrP2 == "p1" or p1OrP2 == "1" then
    p1OrP2 = "P1"
  elseif p1OrP2 == "P2" or p1OrP2 == "p2" or p1OrP2 == "2" then
    p1OrP2 = "P2"
  else
    print("Invalid input. Please enter 'P1' or 'P2'.")
    return
  end
  local pResult = GetPointForPMem(p1OrP2)
  local retString = ''

  local inputValue = tostring(pResult..memVal)-- EX: P1_A_Knockdown_State
  local getValue = getAddressList().getMemoryRecordByDescription(inputValue).Value

  -- do lookup if Knockdown_State
  if memVal == "Knockdown_State" then
    getValue = tonumber(getValue)
    retString = p1OrP2.. "_".. (Knockdown_State_OBJ[tonumber(getValue)])
    return retString
  else
    retString = p1OrP2.. "_"..memVal.. ": "..getValue

    return retString
  end
end

--Timer and Form Creation
local timer = createTimer(nil)
local MvC2DataDisplay = createForm()
MvC2DataDisplay.caption = 'MvC2 Data Display'
MvC2DataDisplay.width = fWidth
MvC2DataDisplay.height = fHeight
MvC2DataDisplay.color = ${T_PROPS.tColor}

local stopButton = createButton(MvC2DataDisplay)
stopButton.setName('Stop')

function fnToggleForm()
  timer_setEnabled(timer, not timer_getEnabled(timer))
end

control_onClick(stopButton, fnToggleForm)
control_setPosition(stopButton, 0, 0)

function fnUpdateOnTimer(memoryrecord, before, currentstate)
  timer_onTimer(timer, fnGetAndSetData)
  timer_setInterval(timer, 100)
  timer_setEnabled(timer, true)
  return true
end

--- Dynamic Entries

--labels`;

const TEMPLATE_LITERAL_INPUTS =
  `  --Process Directions
  local P1Str = ''
  local P2Str = ''
  local p1Inputs = memRec2.Value -- reserved! 
  local p2Inputs = memRec3.Value -- reserved! 
  -- Bitwise-And operation
  for i, v in pairs(inputConverterObject) do
    if (bAnd(p1Inputs, inputConverterObject[i]) ~= 0) then
      P1Str = P1Str..i
    end
    if (bAnd(p2Inputs, inputConverterObject[i]) ~= 0 ) then
      P2Str = P2Str..i
    end
  end\n`;

const TEMPLATE_LITERAL_END = `\n{$asm} \n[DISABLE]`;

// Dynamic stuff
// Gets concatenated to the end of the script
let sLabels = ''
let sDescriptions = '' // not used; using VAR_XX instead
let sMemoryRecords = ''
let sMainFunction = ''
let sActivates = ''

function MakeRealEntries(entry, idx) {
  if (entry.includes('PMEM') || entry.includes('SYST')) {
    let p1Entry = entry.replace('PMEM_', 'ONE_')
      .replace('SYST_', 'P1_');
    let p2Entry = entry.replace('PMEM_', 'TWO_')
      .replace('SYST_', 'P2_');
    REAL_ENTRIES.push(p1Entry);
    REAL_ENTRIES.push(p2Entry);
    idx++;
    // console.log(`Pushed ${p1Entry} and ${p2Entry} to ENTRIES`);
  }
  else {
    let miscEntry = entry.replace('MISC_', '');
    REAL_ENTRIES.push(miscEntry);
  }
}

for (let idx = 0; idx < ENTRIES.length; idx++) {
  MakeRealEntries(ENTRIES[idx], idx)
}

// now we can start writing the script
// labels. 1 label per entry, visual
for (let labelsIdx = 0; labelsIdx < REAL_ENTRIES.length; labelsIdx++) {

  sLabels += `
labelX${labelsIdx} = createLabel(MvC2DataDisplay)`;

  if (REAL_ENTRIES[labelsIdx].includes('Combo_Meter_Value')) {
    sLabels += `
labelX${labelsIdx}.Font.Size = cFont0.fSize;
labelX${labelsIdx}.Font.Size = cFont0.fSize;
labelX${labelsIdx}.Font.Color = cFont0.fColor;
labelX${labelsIdx}.Font.Name = cFont0.fName\n`
  }
  else {
    sLabels += `
labelX${labelsIdx}.Font.Size = cFont1.fSize;
labelX${labelsIdx}.Font.Color = cFont1.fColor;
labelX${labelsIdx}.Font.Name = cFont1.fName\n`
  }
}
// console.log(sLabels)



// memory records
for (let memRecIdx = 0; memRecIdx < REAL_ENTRIES.length; memRecIdx++) {
  // if the entry has the prefix ONE_ or TWO_, then it's a PMem call
  let pString = ''
  if (REAL_ENTRIES[memRecIdx].includes('ONE_')) {
    pString = 'P1'
    sMemoryRecords +=
      `memRec${memRecIdx} = GetPMem('P1', VAR_${memRecIdx}) \n`
    continue
  }
  else if (REAL_ENTRIES[memRecIdx].includes('TWO_')) {
    pString = 'P2'
    sMemoryRecords +=
      `memRec${memRecIdx} = GetPMem('P2', VAR_${memRecIdx}) \n`
    continue
  }
  sMemoryRecords +=
    `memRec${memRecIdx} = getAddressList().getMemoryRecordByDescription(VAR_${memRecIdx}) \n`
}
// console.log(sMemoryRecords)

// mainFunction

for (let mainIDX = 0; mainIDX < REAL_ENTRIES.length; mainIDX++, T_PROPS.tRowSpacer += T_PROPS.tRowsOffset) {
  if (REAL_ENTRIES[mainIDX].includes('Input_DEC')) {
    // Figure out the player, P1 or P2
    let pString = ConvertToPlayerString(REAL_ENTRIES[mainIDX].split('_')[0])

    sMainFunction +=
      `  local data${mainIDX} = '${REAL_ENTRIES[mainIDX]}'.. ': '..${pString}Str `
    // console.log(pString)
    sMainFunction += `
    control_setPosition(labelX${mainIDX}, ${T_PROPS.tXPos}, ${T_PROPS.tYPos + T_PROPS.tRowSpacer});
    control_setCaption(labelX${mainIDX}, data${mainIDX}) \n`
  }
  else if (REAL_ENTRIES[mainIDX].includes('ONE_') || REAL_ENTRIES[mainIDX].includes('TWO_')) {
    let pString = ConvertToPlayerString(REAL_ENTRIES[mainIDX].split('_')[0])
    sMainFunction += `  local data${mainIDX} = GetPMem('${pString}', '${REAL_ENTRIES[mainIDX]}')
    control_setPosition(labelX${mainIDX}, ${T_PROPS.tXPos}, ${T_PROPS.tYPos + T_PROPS.tRowSpacer});
    control_setCaption(labelX${mainIDX}, data${mainIDX}) \n`;
    // remove ONE_ or TWO_ from the string
    sMainFunction = sMainFunction.replace('ONE_', '').replace('TWO_', '')
  }
  else {
    sMainFunction +=
      `  local data${mainIDX} = '${REAL_ENTRIES[mainIDX]}'..': '..memoryrecord_getValue(memRec${mainIDX});
    control_setPosition(labelX${mainIDX}, ${T_PROPS.tXPos}, ${T_PROPS.tYPos + T_PROPS.tRowSpacer});
    control_setCaption(labelX${mainIDX}, data${mainIDX}) \n`
  }
  // console.log(sMainFunction)
}

// activate
for (let activatesIdx = 0; activatesIdx < REAL_ENTRIES.length; activatesIdx++) {
  // Skip PMem calls
  if (REAL_ENTRIES[activatesIdx].includes('ONE_') || REAL_ENTRIES[activatesIdx].includes('TWO_')) {
    continue
  }
  sActivates += `memoryrecord_onActivate(memRec${activatesIdx}, fnUpdateOnTimer) \n`
}

// update strings
sLabels += `\n--descriptions\n`
sDescriptions += `\n--memory records\n`
sMemoryRecords += `\n--setup function\nfunction fnGetAndSetData()\n${TEMPLATE_LITERAL_INPUTS} \n`
sMainFunction += `  return true\nend\n\n-- activate\n`

const FINAL_STRING =
  TEMPLATE_LITERAL_START
  + TEMPLATE_LITERAL_MIDDLE
  + sLabels
  + sDescriptions
  + sMemoryRecords
  + sMainFunction
  + sActivates
  + TEMPLATE_LITERAL_END;

clipboard.writeSync(FINAL_STRING);
