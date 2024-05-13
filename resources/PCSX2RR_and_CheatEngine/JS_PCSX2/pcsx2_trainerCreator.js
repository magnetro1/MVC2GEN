/*
  Trainer propagator for PCSX2
    - Creates a LUA script for Cheat Engine
    - Paste into `Scripts > Trainer_V2` in Cheat Engine
    - Check "Frame_Counter" to activate script inside of:
       Main > System_Values > Frame_Skip
 */

import clipboard from "clipboardy";

// function sleep(ms) {
//   return new Promise(resolve => setTimeout(resolve, ms));
// }

// Use 'One' or 'Two' to denote PMem calls and formatting
const ENTRIES = [
  'Frame_Counter', //reserved
  'P1_Input_DEC',  //reserved
  'P2_Input_DEC',  //reserved
  'P1_Combo_Meter_Value',
  'P2_Combo_Meter_Value',
  // PMem calls, use 'One' or 'Two' to denote P1 or P2
  // 'One_Been_OTG',
  // 'Two_Been_OTG',
  // 'One_Throw_Limiter',
  // 'Two_Throw_Limiter',
  // 'One_THC_State',
  // 'Two_THC_State',
  // 'One_Air_Dash_Count',
  // 'Two_Air_Dash_Count',
  // 'One_Incoming_Timer',
  // 'Two_Incoming_Timer',
];

// Form Constants
const L_Color = '0x00b140'; // green; used in OBS
const L_Width = 820 - 2 // sub Windows Panel // 279
const L_Height = 580 - 28 // sub Windows Panel // 480
const L_XPos = 3;
const L_YPos = 3;
const L_FontSize = 18;
const L_RowsOffset = 32;
const L_Font_1 = {
  fName0: 'Source Code Pro',
  fSize0: L_FontSize,
  fSColor0: '0xFFFFFF',
};
const L_Font_2 = {
  fName1: 'Source Code Pro',
  fSize1: L_FontSize,
  fSColor1: '0xFF0000',
};

const TEMPLATE_LITERAL_START =
  `[ENABLE]
{$lua}
-- ENABLE 'Frame_Counter' after form launches,
-- then DISABLE it in order to let the form update.
-- Label Position Variables
local fWidth =  ${L_Width}
local fHeight = ${L_Height}

-- Custom Font Variaxbles
local cFont0 = {
  fName =  '${L_Font_1.fName0}',
  fSize =   ${L_Font_1.fSize0},
  fColor =  ${L_Font_1.fSColor0},
}

local cFont1 = {
  fName =  '${L_Font_2.fName1}',
  fSize =   ${L_Font_2.fSize1},
  fColor =  ${L_Font_2.fSColor1},
}

-- Input Converter
local inputConverterObject = {
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

function getPoint(p1OrP2)
  -- ToString and get P1 or P2
  p1OrP2 = tostring(p1OrP2)
  if p1OrP2 == "P1" or p1OrP2 == "p1" or p1OrP2 == "1" then
    p1OrP2 = "P1"
  elseif p1OrP2 == "P2" or p1OrP2 == "p2" or p1OrP2 == "2" then
    p1OrP2 = "P2"
  else
    print("Invalid input. Please enter 'P1' or 'P2'.")
    return
  end

  -- Store function calls
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
  -- find the point
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

-- Knockdown_State Converter
Knockdown_State_OBJ     = {}
Knockdown_State_OBJ[0]  = "Neutral"
Knockdown_State_OBJ[1]  = "Walking"
Knockdown_State_OBJ[2]  = "Normal Jump Rise"
Knockdown_State_OBJ[3]  = "Normal Jump"
Knockdown_State_OBJ[4]  = "Landing"
Knockdown_State_OBJ[5]  = "Crouching"
Knockdown_State_OBJ[6]  = "Crouched"
Knockdown_State_OBJ[7]  = "Stand Rise"
Knockdown_State_OBJ[8]  = "Stand Turn"
Knockdown_State_OBJ[9]  = "Crouch Turning"
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


function GetPMem(p1OrP2, memVal)
  -- ToString and get P1 or P2
  p1OrP2 = tostring(p1OrP2)
  if p1OrP2 == "P1" or p1OrP2 == "p1" or p1OrP2 == "1" then
    p1OrP2 = "P1"
  elseif p1OrP2 == "P2" or p1OrP2 == "p2" or p1OrP2 == "2" then
    p1OrP2 = "P2"
  else
    print("Invalid input. Please enter 'P1' or 'P2'.")
    return
  end

  local pResult = getPoint(p1OrP2)
  local retString = ''
  local inputValue = tostring(pResult .. memVal) -- EX: P1_A_Knockdown_State
  local getValue = getAddressList()
    .getMemoryRecordByDescription(inputValue).Value
  -- do lookup if Knockdown_State
  if memVal == "Knockdown_State" then
    getValue = tonumber(getValue)
    retString = p1OrP2 .. "_" .. (Knockdown_State_OBJ[tonumber(getValue)])
    return retString
  else
    retString = p1OrP2 .. "_" .. memVal .. ": " .. getValue
    -- print ( retString )
    return retString
  end
end

-- Timer and Form Creation
local timer = createTimer(nil)
local MVC2_1 = createForm()
  MVC2_1.caption = 'MvC2 Data Display'
  MVC2_1.width = fWidth
  MVC2_1.height = fHeight
  MVC2_1.color = ${L_Color}
local stopButton = createButton(MVC2_1)
  stopButton.setName('Stop')

function fnToggleForm()
  timer_setEnabled(timer, not timer_getEnabled(timer))
end

control_onClick(stopButton, fnToggleForm)
control_setPosition(stopButton, 0,0)

function fnUpdateOnTimer(memoryrecord, before, currentstate)
  timer_onTimer(timer, fnGetAndSetData)
  timer_setInterval(timer,100)
  timer_setEnabled(timer, true)
  return true
end

---Dynamic Entries

--labels
`;

const TEMPLATE_LITERAL_INPUTS =
  `  -- Process Directions
  local P1Str = ''
  local P2Str = ''
  local p1Inputs = memRec1.Value
  local p2Inputs = memRec2.Value
  -- & operation
  for i, v in pairs(inputConverterObject) do
    if ( bAnd(p1Inputs, inputConverterObject[i]) ~= 0 ) then
      P1Str = P1Str .. i
    end
    if ( bAnd(p2Inputs, inputConverterObject[i]) ~= 0 ) then
      P2Str = P2Str .. i
    end
  end\n`;

const TEMPLATE_LITERAL_END = `\n{$asm}\n[DISABLE]`;

let labels = ''
let descriptions = ''
let memoryRecords = ''
let mainFunction = ''
let activates = ''

// Expects ENTRIES-NUM!

// labels
for (let labelsIdx = 0; labelsIdx < ENTRIES.length; labelsIdx++) {
  // Combo_Meter Exception!
  if (ENTRIES[labelsIdx].includes('Combo_Meter_Value')) {
    labels +=
      `local labelX${labelsIdx} = createLabel(MVC2_1)
      labelX${labelsIdx}.Font.Size = cFont1.fSize;
      labelX${labelsIdx}.Font.Color = cFont1.fColor;
      labelX${labelsIdx}.Font.Name = cFont1.fName\n`
  }
  else {
    labels +=
      `local labelX${labelsIdx} = createLabel(MVC2_1)
      labelX${labelsIdx}.Font.Size = cFont0.fSize;
      labelX${labelsIdx}.Font.Color = cFont0.fColor;
      labelX${labelsIdx}.Font.Name = cFont0.fName\n`
  }
}

// descriptions
for (let descriptionsIdx = 0; descriptionsIdx < ENTRIES.length; descriptionsIdx++) {
  // if the entry has the prefix One_ or Two_, then it's a PMem call, continue
  if (ENTRIES[descriptionsIdx].includes('One_') || ENTRIES[descriptionsIdx].includes('Two_')) {
    continue
  }
  descriptions +=
    `local desc${descriptionsIdx} = '${ENTRIES[descriptionsIdx]}'\n`
}

// memory records
for (let memRecIdx = 0; memRecIdx < ENTRIES.length; memRecIdx++) {
  // if the entry has the prefix One_ or Two_, then it's a PMem call
  let pString = ''
  if (ENTRIES[memRecIdx].includes('One_') || ENTRIES[memRecIdx].includes('one_')) {
    pString = 'P1'
    memoryRecords +=
      `local memRec${memRecIdx} = GetPMem('P1', '${ENTRIES[memRecIdx].split('One_')[1]}')\n`
    continue
  }
  else if (ENTRIES[memRecIdx].includes('Two_') || ENTRIES[memRecIdx].includes('two_')) {
    pString = 'P2'
    memoryRecords +=
      `local memRec${memRecIdx} = GetPMem('P2', '${ENTRIES[memRecIdx].split('Two_')[1]}')\n`
    continue
  }
  memoryRecords +=
    `local memRec${memRecIdx} = getAddressList().getMemoryRecordByDescription(desc${memRecIdx})\n`
}

// mainFunction
for (let mainFunctionIdx = 0, rowSpacer = 20; mainFunctionIdx < ENTRIES.length; mainFunctionIdx++, rowSpacer += L_RowsOffset) {
  // Input_DEC Exception!
  if (mainFunctionIdx === 1) {
    mainFunction +=
      `  local data1 = desc1 .. ': ' .. P1Str;
    control_setPosition(labelX${mainFunctionIdx}, ${L_XPos},${L_YPos + rowSpacer});
    control_setCaption(labelX${mainFunctionIdx},data${mainFunctionIdx})\n`
    continue
  }
  // Input_DEC Exception!
  if (mainFunctionIdx === 2) {
    mainFunction +=
      `  local data2 = desc2 .. ': ' .. P2Str;
  control_setPosition(labelX${mainFunctionIdx}, ${L_XPos},${L_YPos + rowSpacer});
  control_setCaption(labelX${mainFunctionIdx},data${mainFunctionIdx})\n`
    continue
  }
  // Skip PMem calls
  if (ENTRIES[mainFunctionIdx].includes('One_')) {
    mainFunction +=
      `  local data${mainFunctionIdx} = GetPMem('P1', '${ENTRIES[mainFunctionIdx].split('One_')[1]}');
  control_setPosition(labelX${mainFunctionIdx}, ${L_XPos},${L_YPos + rowSpacer});
  control_setCaption(labelX${mainFunctionIdx},data${mainFunctionIdx})\n`
    continue
  }
  // Skip PMem calls
  else if (ENTRIES[mainFunctionIdx].includes('Two_')) {
    mainFunction +=
      `  local data${mainFunctionIdx} = GetPMem('P2', '${ENTRIES[mainFunctionIdx].split('Two_')[1]}');
  control_setPosition(labelX${mainFunctionIdx}, ${L_XPos},${L_YPos + rowSpacer});
  control_setCaption(labelX${mainFunctionIdx},data${mainFunctionIdx})\n`
    continue
  }
  // Else, continue as normal
  mainFunction +=
    `  local data${mainFunctionIdx} = desc${mainFunctionIdx} .. ': '.. memoryrecord_getValue(memRec${mainFunctionIdx});
  control_setPosition(labelX${mainFunctionIdx}, ${L_XPos},${L_YPos + rowSpacer});
  control_setCaption(labelX${mainFunctionIdx},data${mainFunctionIdx})\n`
}

// activate
for (let activatesIdx = 0; activatesIdx < ENTRIES.length; activatesIdx++) {
  // Skip PMem calls
  if (ENTRIES[activatesIdx].includes('One_') || ENTRIES[activatesIdx].includes('Two_')) {
    continue
  }
  activates += `memoryrecord_onActivate(memRec${activatesIdx}, fnUpdateOnTimer)\n`
}

// update strings
labels += `\n--descriptions\n`
descriptions += `\n--memory records\n`
memoryRecords += `\n--setup function\nfunction fnGetAndSetData()\n${TEMPLATE_LITERAL_INPUTS}\n`
mainFunction += `  return true\nend\n\n-- activate\n`

const FINAL_STRING =
  TEMPLATE_LITERAL_START
  + labels
  + descriptions
  + memoryRecords
  + mainFunction
  + activates
  + TEMPLATE_LITERAL_END;

clipboard.writeSync(FINAL_STRING);

console.log('Copied to clipboard!' || '');
