/*
  Trainer propagator for PCSX2
    - Creates a LUA script for Cheat Engine
    - Copy output into `Scritps > Trainer_V2` in Cheat Engine
    - PCSX2 must be running & the memory records offset using the 2D Pointer action
 */

import clipboard from "clipboardy";

// JS Values
const ENTRIES = [
  'Frame_Counter', //reserved
  'P1_Input_DEC', //reserved
  'P2_Input_DEC', //reserved
  'P1_Combo_Meter_Value',
  'P2_Combo_Meter_Value',
  'P2_B_X_Position_Arena',
  'P2_B_Y_Position_Arena',
  'P2_B_X_Velocity',
  'P2_B_Y_Velocity',
  'P2_B_X_Gravity',
  'P2_B_Y_Gravity',

];

// Form Constants
const luaFormWidth = 820 - 2 // subtracting due to Windows Panel // 279
const luaFormHeight = 480 - 28 // subtracting due to Windows Panel // 480
const luaFormXPos = 5;
const luaFormYPos = 5;
// const luaLabelColOffset = 0;
const luaLabelRowOffset = 25;
const luaFont0 = {
  fName0: 'Consolas',
  fSize0: 18,
  fSColor0: '0x000000',
};

const tempLitStart =
  `[ENABLE]
{$lua}
-- ENABLE 'Frame_Counter' after form launches,
-- then DISABLE it in order to let the form update.
-- Label Position Variables
local fWidth = ${ luaFormWidth }
local fHeight = ${ luaFormHeight }

-- Custom Font Variables
local cFont0 = {
  fName = '${ luaFont0.fName0 }',
  fSize = ${ luaFont0.fSize0 },
  fColor = ${ luaFont0.fSColor0 },
}
-- Input Converter
local inputConverterObject = {
  D     = 4096,
  U     = 8192,
  R     = 1024,
  L     = 2048,
  LP    = 512,
  LK    = 64,
  HP    = 256,
  HK    = 32,
  AA    = 128,
  AB    = 16,
  ST    = 32768,
  SE    = 2,
}
-- Timer & Form Creation
local timer = createTimer(nil)
local MvC2DataDisplay = createForm()
  MvC2DataDisplay.caption = 'MvC2 Data Display'
  MvC2DataDisplay.width = fWidth
  MvC2DataDisplay.height = fHeight
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
  local p1 = memRec1.Value
  local p2 = memRec2.Value
  for i, v in pairs(inputConverterObject) do
    if ( bAnd(p1, inputConverterObject[i]) ~= 0 ) then
      P1Str = P1Str .. i
    end
    if ( bAnd(p2, inputConverterObject[i]) ~= 0 ) then
      P2Str = P2Str .. i
    end
  end`;

const tempLitEnd = `{$asm}\n[DISABLE]`;

let labelsStr = '', descriptionsStr = '', memRecStr = '', mainFunctionStr = '', activatesStr = '';

// labels
for (let labelsIdx = 0; labelsIdx < ENTRIES.length; labelsIdx++)
{

  labelsStr += `local vX${ labelsIdx } = createLabel(MvC2DataDisplay)
  vX${ labelsIdx }.Font.Size = cFont0.fSize;vX${ labelsIdx }.Font.Color = cFont0.fColor;vX${ labelsIdx }.Font.Name = cFont0.fName\n`
}
// descriptions
for (let descriptionsIdx = 0; descriptionsIdx < ENTRIES.length; descriptionsIdx++)
{
  descriptionsStr += `local desc${ descriptionsIdx } = '${ ENTRIES[descriptionsIdx] }'\n`
}
// memory records
for (let memRecIdx = 0; memRecIdx < ENTRIES.length; memRecIdx++)
{
  memRecStr += `local memRec${ memRecIdx } = getAddressList().getMemoryRecordByDescription(desc${ memRecIdx })\n`
}
// setup function
for (let mainFunctionIdx = 0, updaterVal = 20; mainFunctionIdx < ENTRIES.length; mainFunctionIdx++, updaterVal += luaLabelRowOffset)
{
  if (mainFunctionIdx === 1)
  {
    mainFunctionStr += `  local data1 = desc1 .. ': ' .. P1Str                        ;control_setPosition(vX${ mainFunctionIdx }, ${ luaFormXPos },${ luaFormYPos + updaterVal });control_setCaption(vX${ mainFunctionIdx },data${ mainFunctionIdx })\n`
    continue
  }
  if (mainFunctionIdx === 2)
  {
    mainFunctionStr += `  local data2 = desc2 .. ': ' .. P2Str                        ;control_setPosition(vX${ mainFunctionIdx }, ${ luaFormXPos },${ luaFormYPos + updaterVal });control_setCaption(vX${ mainFunctionIdx },data${ mainFunctionIdx })\n`
    continue
  }
  mainFunctionStr += `  local data${ mainFunctionIdx } = desc${ mainFunctionIdx } .. ': '.. memoryrecord_getValue(memRec${ mainFunctionIdx });control_setPosition(vX${ mainFunctionIdx }, ${ luaFormXPos },${ luaFormYPos + updaterVal });control_setCaption(vX${ mainFunctionIdx },data${ mainFunctionIdx })\n`
}
// activate
for (let activatesIdx = 0; activatesIdx < ENTRIES.length; activatesIdx++)
{
  activatesStr += `memoryrecord_onActivate(memRec${ activatesIdx }, fnUpdateOnTimer)\n`
}
// update strings
labelsStr += `\n--descriptions\n`
descriptionsStr += `\n--memory records\n`
memRecStr += `\n--setup function\nfunction fnGetAndSetData()\n${ tempLitP1InputConverter }\n`
mainFunctionStr += `  return true\nend\n\n-- activate\n`

const finalStr = tempLitStart + labelsStr + descriptionsStr + memRecStr + mainFunctionStr + activatesStr + tempLitEnd;
console.log('Finished');
clipboard.writeSync(finalStr);