/*
  Trainer propagator for PCSX2
    - Creates a LUA script for Cheat Engine
    - Copy output into `Scritps > Trainer_V2` in Cheat Engine
    - PCSX2 must be running and the memory records offset using the 2D Pointer action
 */

import clipboard from "clipboardy";

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
// JS Values
const ENTRIES = [
  'Frame_Counter', //reserved
  'P1_Input_DEC', //reserved
  'P2_Input_DEC', //reserved
  'P1_Combo_Meter_Value',
  'P2_Combo_Meter_Value',
  'P1_A_Hitstop2',
  'P1_B_Hitstop2',
  'P1_C_Hitstop2',
  'P2_A_Hitstop2',
  'P2_B_Hitstop2',
  'P2_C_Hitstop2',
];

// Form Constants
const luaFormColor = '0x00b140'; // green; used in OBS
const luaFormWidth = 820 - 2 // subtracting due to Windows Panel // 279
const luaFormHeight = 580 - 28 // subtracting due to Windows Panel // 480
const luaFormXPos = 3;
const luaFormYPos = 3;
const luaFontSize = 25;
// const luaLabelColOffset = 0;
const luaLabelRowOffset = 38;
const luaFont0 = {
  fName0: 'Source Code Pro',
  fSize0: luaFontSize,
  // fSColor0: '0x000000',
  fSColor0: '0xFFFFFF',
};
const luaFont1 = {
  fName1: 'Source Code Pro',
  fSize1: luaFontSize,
  // fSColor0: '0x000000',
  fSColor1: '0xFF0000', //red
};

const tempLitStart =
  `[ENABLE]
{$lua}
-- ENABLE 'Frame_Counter' after form launches,
-- then DISABLE it in order to let the form update.
-- Label Position Variables
local fWidth = ${luaFormWidth}
local fHeight = ${luaFormHeight}

-- Custom Font Variables
local cFont0 = {
  fName = '${luaFont0.fName0}',
  fSize = ${luaFont0.fSize0},
  fColor = ${luaFont0.fSColor0},
}
local cFont1 = {
  fName = '${luaFont1.fName1}',
  fSize = ${luaFont1.fSize1},
  fColor = ${luaFont1.fSColor1},
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

-- Point Checker System
P1A = getAddressList().getMemoryRecordByDescription("P1_A_Is_Point");
P1B = getAddressList().getMemoryRecordByDescription("P1_B_Is_Point");
P1C = getAddressList().getMemoryRecordByDescription("P1_C_Is_Point");
P2A = getAddressList().getMemoryRecordByDescription("P2_A_Is_Point");
P2B = getAddressList().getMemoryRecordByDescription("P2_B_Is_Point");
P2C = getAddressList().getMemoryRecordByDescription("P2_C_Is_Point");

function GetPMem(p1OrP2, memVal)
  -- ToString and get P1 or P2
  p1OrP2 = tostring(p1OrP2)
  memVal = tostring(memVal)
  if p1OrP2 == "P1" or p1OrP2 == "p1" or p1OrP2 == "1" then
    p1OrP2 = "P1"
  elseif p1OrP2 == "P2" or p1OrP2 == "p2" or p1OrP2 == "2" then
    p1OrP2 = "P2"
  end

  local str = ''
  local getP1A = memoryrecord_getValue(P1A)
  local getP1B = memoryrecord_getValue(P1B)
  local getP1C = memoryrecord_getValue(P1C)

  local getP2A = memoryrecord_getValue(P2A)
  local getP2B = memoryrecord_getValue(P2B)
  local getP2C = memoryrecord_getValue(P2C)

  -- Get A, B, or C
  if p1OrP2 == "P1" then
    if tonumber(getP1A) == 0 then
      str = 'P1_A_';
    elseif tonumber(getP1B) == 0 then
      str = 'P1_B_';
    elseif tonumber(getP1C) == 0 then
      str = 'P1_C_';
    end
  elseif p1OrP2 == "P2" then
    if tonumber(getP2A) == 0 then
      str = 'P2_A_';
    elseif tonumber(getP2B) == 0 then
      str = 'P2_B_';
    elseif tonumber(getP2C) == 0 then
      str = 'P2_C_';
    end
  end

  local inputValue = tostring(str .. memVal)
  local getValue = getAddressList().getMemoryRecordByDescription(inputValue).Value
  -- print(getValue)
  return tonumber(getValue)
end

-- Timer and Form Creation
local timer = createTimer(nil)
local MvC2DataDisplay = createForm()
  MvC2DataDisplay.caption = 'MvC2 Data Display'
  MvC2DataDisplay.width = fWidth
  MvC2DataDisplay.height = fHeight
  MvC2DataDisplay.color = ${luaFormColor}
local stopButton = createButton(MvC2DataDisplay)
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

const tempLitP1InputConverter =
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
  end`;

const tempLitEnd = `{$asm}\n[DISABLE]`;

let labelsStr = '', descriptionsStr = '', memRecStr = '', mainFunctionStr = '', activatesStr = '';

// labels
for (let labelsIdx = 0; labelsIdx < ENTRIES.length; labelsIdx++) {
  // Combo_Meter_Value Exception!
  if (ENTRIES[labelsIdx].includes('Combo_Meter_Value')) {
    labelsStr += `local labelX${labelsIdx} = createLabel(MvC2DataDisplay)
      labelX${labelsIdx}.Font.Size = cFont1.fSize;labelX${labelsIdx}.Font.Color = cFont1.fColor;labelX${labelsIdx}.Font.Name = cFont1.fName\n`
  }
  else {
    labelsStr += `local labelX${labelsIdx} = createLabel(MvC2DataDisplay)
      labelX${labelsIdx}.Font.Size = cFont0.fSize;labelX${labelsIdx}.Font.Color = cFont0.fColor;labelX${labelsIdx}.Font.Name = cFont0.fName\n`
  }

}
// descriptions
for (let descriptionsIdx = 0; descriptionsIdx < ENTRIES.length; descriptionsIdx++) {
  descriptionsStr += `local desc${descriptionsIdx} = '${ENTRIES[descriptionsIdx]}'\n`
}
// memory records
for (let memRecIdx = 0; memRecIdx < ENTRIES.length; memRecIdx++) {
  memRecStr += `local memRec${memRecIdx} = getAddressList().getMemoryRecordByDescription(desc${memRecIdx})\n`
}
// setup function
for (let mainFunctionIdx = 0, updaterVal = 20; mainFunctionIdx < ENTRIES.length; mainFunctionIdx++, updaterVal += luaLabelRowOffset) {
  if (mainFunctionIdx === 1) {
    mainFunctionStr += `  local data1 = desc1 .. ': ' .. P1Str                        ;control_setPosition(labelX${mainFunctionIdx}, ${luaFormXPos},${luaFormYPos + updaterVal});control_setCaption(labelX${mainFunctionIdx},data${mainFunctionIdx})\n`
    continue
  }
  if (mainFunctionIdx === 2) {
    mainFunctionStr += `  local data2 = desc2 .. ': ' .. P2Str                        ;control_setPosition(labelX${mainFunctionIdx}, ${luaFormXPos},${luaFormYPos + updaterVal});control_setCaption(labelX${mainFunctionIdx},data${mainFunctionIdx})\n`
    continue
  }
  mainFunctionStr += `  local data${mainFunctionIdx} = desc${mainFunctionIdx} .. ': '.. memoryrecord_getValue(memRec${mainFunctionIdx});control_setPosition(labelX${mainFunctionIdx}, ${luaFormXPos},${luaFormYPos + updaterVal});control_setCaption(labelX${mainFunctionIdx},data${mainFunctionIdx})\n`
}
// activate
for (let activatesIdx = 0; activatesIdx < ENTRIES.length; activatesIdx++) {
  activatesStr += `memoryrecord_onActivate(memRec${activatesIdx}, fnUpdateOnTimer)\n`
}
// update strings
labelsStr += `\n--descriptions\n`
descriptionsStr += `\n--memory records\n`
memRecStr += `\n--setup function\nfunction fnGetAndSetData()\n${tempLitP1InputConverter}\n`
mainFunctionStr += `  return true\nend\n\n-- activate\n`

const finalStr = tempLitStart + labelsStr + descriptionsStr + memRecStr + mainFunctionStr + activatesStr + tempLitEnd;
clipboard.writeSync(finalStr);

console.log('Copied to clipboard!' || '');
sleep(1000);
