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

P1A                     = getAddressList().getMemoryRecordByDescription("P1_A_Is_Point");
P1B                     = getAddressList().getMemoryRecordByDescription("P1_B_Is_Point");
P1C                     = getAddressList().getMemoryRecordByDescription("P1_C_Is_Point");

P2A                     = getAddressList().getMemoryRecordByDescription("P2_A_Is_Point");
P2B                     = getAddressList().getMemoryRecordByDescription("P2_B_Is_Point");
P2C                     = getAddressList().getMemoryRecordByDescription("P2_C_Is_Point");

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

print(Knockdown_State_OBJ[(GetPMem("P1", "Knockdown_State"))])
