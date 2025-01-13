local mvc2 = {}

mvc2.IS_PROX_BLOCK_OBJ = {
  [0] = 'Neutral',
  [1] = 'Air',
  [2] = 'Dashing',
  [3] = 'Crouching',
  [4] = 'Turning Around',
  [5] = 'Ground Block',
  [6] = 'Air Block',
  [7] = 'Stand Punches',
  [8] = 'Stand Kicks',
  [9] = 'Crouch Punches',
  [10] = 'Crouch Kicks',
  [11] = 'Air Punches',
  [12] = 'Air Kicks',
  [13] = 'Stunned',
  [14] = '???', 
  [15] = 'Throwing',
  [16] = 'Being Thrown',
  [17] = 'OTG Rise',
  [18] = 'Match Start',
  [19] = 'Win Pose',
  [20] = 'Tag-in & OC Launcher',
  [21] = 'Specials & Snapbacks',
  [22] = 'Supers',
  [23] = '???',
  [24] = 'Assist Related',
  [25] = '???',
  [26] = 'Air Dash'
}

mvc2.KNOCKDOWN_STATE_OBJ = {
  [0] = 'Neutral',
  [1] = 'Walking',
  [2] = 'Normal Jump Rise',
  [3] = 'Normal Jump',
  [4] = 'Landing',
  [5] = 'Crouching',
  [6] = 'Crouched',
  [7] = 'Stand Rise',
  [8] = 'Stand Turn',
  [9] = 'Crouch Turning',
  [10] = 'Forward Dashing',
  [11] = 'Back Dashing',
  [12] = 'Double Dizzy',
  [13] = 'Super Jump Rise',
  [14] = 'Super Jumping',
  [15] = 'Air Recovery',
  [16] = '???',
  [17] = 'Knockdown Rise',
  [18] = 'Ground Block',
  [19] = 'Air Blocking',
  [20] = 'Normal Attacks',
  [21] = 'Special Attacks',
  [22] = 'Post-Match Pose',
  [23] = 'Extra OTG Stun',
  [24] = 'Neutral Flight',
  [25] = 'Corner Jump',
  [26] = 'Air Dash',
  [27] = 'Tech Hit',
  [28] = 'Switching & Assists',
  [29] = 'Supers & Flashes',
  [30] = 'Throwing',
  [31] = 'Being Thrown',
  [32] = 'Stunned',
  [33] = '???',
  [34] = 'Command Launcher'
}

mvc2.INPUTS_OBJ = {
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

return mvc2

local utils = {}

function utils.processInputBits(inputValue)
  local P1Str = ''
  local P2Str = ''
  
  -- Bitwise-And operation to extract input bits
  for i, v in pairs(mvc2.INPUTS_OBJ) do
    if (bAnd(p1Inputs, mvc2.INPUTS_OBJ[i]) ~= 0) then
      P1Str = P1Str..i
    end
    if (bAnd(p2Inputs, mvc2.INPUTS_OBJ[i]) ~= 0) then
      P2Str = P2Str..i
    end
  end
  
  return P1Str, P2Str
end

function utils.formatMemoryValue(p1OrP2, memVal)
  memVal = tostring(memVal)
  memVal = string.gsub(memVal, "One_", "")
  memVal = string.gsub(memVal, "Two_", "")
  
  local pResult = utils.GetPointForPMem(p1OrP2)
  local retString = ''

  local inputValue = tostring(pResult..memVal)
  local getValue = getAddressList().getMemoryRecordByDescription(inputValue).Value

  if memVal == "Knockdown_State" then
    getValue = tonumber(getValue)
    retString = p1OrP2.. "_".. (mvc2.KNOCKDOWN_STATE_OBJ[tonumber(getValue)])
  else
    retString = p1OrP2.. "_"..memVal.. ": "..getValue
  end

  return retString
end

function utils.GetPointForPMem(p1OrP2)
  p1OrP2 = tostring(p1OrP2)
  if p1OrP2 == "P1" or p1OrP2 == "p1" or p1OrP2 == "1" then
    p1OrP2 = "P1"
  elseif p1OrP2 == "P2" or p1OrP2 == "p2" or p1OrP2 == "2" then
    p1OrP2 = "P2"
  else
    print("Invalid input. Please enter 'P1' or 'P2'.")
    return
  end
  
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

return utils
