-- [ENABLE]
-- {$lua}
-- ENABLE 'Frame_Counter' after form launches,
-- then DISABLE it in order to let the form update.
-- Label Position Variables

local fWidth = 818
local fHeight = 552

-- Custom Font Variables
local cFont0 = {
  fName = 'Source Code Pro',
  fSize = 27,
  fColor = 0xFFFFFF,
}
local cFont1 = {
  fName = 'Source Code Pro',
  fSize = 27,
  fColor = 0xFF0000,
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
  local getP1A = memoryrecord_getValue(getAddressList().getMemoryRecordByDescription("P1_A_Is_Point"))
  local getP1B = memoryrecord_getValue(getAddressList().getMemoryRecordByDescription("P1_B_Is_Point"))
  local getP1C = memoryrecord_getValue(getAddressList().getMemoryRecordByDescription("P1_C_Is_Point"))

  local getP2A = memoryrecord_getValue(getAddressList().getMemoryRecordByDescription("P2_A_Is_Point"))
  local getP2B = memoryrecord_getValue(getAddressList().getMemoryRecordByDescription("P2_B_Is_Point"))
  local getP2C = memoryrecord_getValue(getAddressList().getMemoryRecordByDescription("P2_C_Is_Point"))

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

  -- print (pointResult)
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
  local getValue = getAddressList().getMemoryRecordByDescription(inputValue).Value
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
local MvC2DataDisplay = createForm()
  MvC2DataDisplay.caption = 'MvC2 Data Display'
  MvC2DataDisplay.width = fWidth
  MvC2DataDisplay.height = fHeight
  MvC2DataDisplay.color = 0x00b140
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
local labelX0 = createLabel(MvC2DataDisplay)
      labelX0.Font.Size = cFont0.fSize;labelX0.Font.Color = cFont0.fColor;labelX0.Font.Name = cFont0.fName
local labelX1 = createLabel(MvC2DataDisplay)
      labelX1.Font.Size = cFont0.fSize;labelX1.Font.Color = cFont0.fColor;labelX1.Font.Name = cFont0.fName
local labelX2 = createLabel(MvC2DataDisplay)
      labelX2.Font.Size = cFont0.fSize;labelX2.Font.Color = cFont0.fColor;labelX2.Font.Name = cFont0.fName
local labelX3 = createLabel(MvC2DataDisplay)
      labelX3.Font.Size = cFont1.fSize;labelX3.Font.Color = cFont1.fColor;labelX3.Font.Name = cFont1.fName
local labelX4 = createLabel(MvC2DataDisplay)
      labelX4.Font.Size = cFont1.fSize;labelX4.Font.Color = cFont1.fColor;labelX4.Font.Name = cFont1.fName
local labelX5 = createLabel(MvC2DataDisplay)
      labelX5.Font.Size = cFont0.fSize;labelX5.Font.Color = cFont0.fColor;labelX5.Font.Name = cFont0.fName
local labelX6 = createLabel(MvC2DataDisplay)
      labelX6.Font.Size = cFont0.fSize;labelX6.Font.Color = cFont0.fColor;labelX6.Font.Name = cFont0.fName
local labelX7 = createLabel(MvC2DataDisplay)
      labelX7.Font.Size = cFont0.fSize;labelX7.Font.Color = cFont0.fColor;labelX7.Font.Name = cFont0.fName
local labelX8 = createLabel(MvC2DataDisplay)
      labelX8.Font.Size = cFont0.fSize;labelX8.Font.Color = cFont0.fColor;labelX8.Font.Name = cFont0.fName
local labelX9 = createLabel(MvC2DataDisplay)
      labelX9.Font.Size = cFont0.fSize;labelX9.Font.Color = cFont0.fColor;labelX9.Font.Name = cFont0.fName
local labelX10 = createLabel(MvC2DataDisplay)
      labelX10.Font.Size = cFont0.fSize;labelX10.Font.Color = cFont0.fColor;labelX10.Font.Name = cFont0.fName

--descriptions
local desc0 = 'Frame_Counter'
local desc1 = 'P1_Input_DEC'
local desc2 = 'P2_Input_DEC'
local desc3 = 'P1_Combo_Meter_Value'
local desc4 = 'P2_Combo_Meter_Value'


--memory records
local memRec0 = getAddressList().getMemoryRecordByDescription(desc0)
local memRec1 = getAddressList().getMemoryRecordByDescription(desc1)
local memRec2 = getAddressList().getMemoryRecordByDescription(desc2)
local memRec3 = getAddressList().getMemoryRecordByDescription(desc3)
local memRec4 = getAddressList().getMemoryRecordByDescription(desc4)
-- Call GetPMems
local memRec5 = GetPMem("P1" , "Knockdown_State")
local memRec6 = GetPMem("P2" , "Knockdown_State")

--setup function
function fnGetAndSetData()
  -- Process Directions
  local P1Str = ''
  local P2Str = ''
  local p1Inputs = memRec1.Value
  local p2Inputs = memRec2.Value
  -- bitwise And
  for i, v in pairs(inputConverterObject) do
    if ( bAnd(p1Inputs, inputConverterObject[i]) ~= 0 ) then
      P1Str = P1Str .. i
    end
    if ( bAnd(p2Inputs, inputConverterObject[i]) ~= 0 ) then
      P2Str = P2Str .. i
    end
  end

  local data0 = desc0 .. ': '.. memoryrecord_getValue(memRec0);control_setPosition(labelX0, 3,23);control_setCaption(labelX0,data0)
  local data1 = desc1 .. ': ' .. P1Str                        ;control_setPosition(labelX1, 3,61);control_setCaption(labelX1,data1)
  local data2 = desc2 .. ': ' .. P2Str                        ;control_setPosition(labelX2, 3,99);control_setCaption(labelX2,data2)
  local data3 = desc3 .. ': '.. memoryrecord_getValue(memRec3);control_setPosition(labelX3, 3,137);control_setCaption(labelX3,data3)
  local data4 = desc4 .. ': '.. memoryrecord_getValue(memRec4);control_setPosition(labelX4, 3,175);control_setCaption(labelX4,data4)
  --- Call PMem
  local data5 = GetPMem("P1" , "Knockdown_State");control_setPosition(labelX5, 3,213);control_setCaption(labelX5,data5);
  local data6 = GetPMem("P2" , "Knockdown_State");control_setPosition(labelX6, 3,251);control_setCaption(labelX6,data6)

  return true
end

-- activate
memoryrecord_onActivate(memRec0, fnUpdateOnTimer)
memoryrecord_onActivate(memRec1, fnUpdateOnTimer)
memoryrecord_onActivate(memRec2, fnUpdateOnTimer)
memoryrecord_onActivate(memRec3, fnUpdateOnTimer)
memoryrecord_onActivate(memRec4, fnUpdateOnTimer)

-- {$asm}
-- [DISABLE]
