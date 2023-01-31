-- -- Variables and Functions
-- local outPath = "H:\\Git\\MVC2GEN\\resources\\Both_Emulator_Resources\\JS_Utils\\CSV_FILES\\MvC2DataAll_Original.csv"
-- local _starting_new_write_flag = false
-- local contScript = true
-- local data_table = {}

-- local function readTF()
--   local tfPointer = ("pcsx2.exe+271A324")
--   local totalFrameNumber = readInteger(tfPointer)
--   return (totalFrameNumber)
-- end

-- function CSV_WRITER(path, data)
--   local separator = ","
--   local file_handle = assert(io.open(path, "a"))
--   local output_string = ""
--   if _starting_new_write_flag == false then
--     for i = 0, #data, 1 do
--       if i < #data then
--         output_string = output_string .. data[i].desc .. separator
--       else
--         output_string = output_string .. data[i].desc
--       end
--     end
--     _starting_new_write_flag = true
--     file_handle:write(output_string)
--     file_handle:write("\n")
--     output_string = ""
--   end
--   for i = 0, #data, 1 do
--     if i < #data then
--       output_string = output_string .. data[i].val .. separator
--     else
--       output_string = output_string .. data[i].val
--     end
--   end

--   if isKeyPressed(VK_HOME) then
--     file_handle:write(output_string)
--     file_handle:write("\n")
--     file_handle:close()
--     return true
--   end
-- end

-- CURRENT_FRAME = readTF()
-- -- Main Script
-- ADRLST = getAddressList()
-- --startREGEX

-- -- Lua Capture Data Script:

-- V0 = ADRLST.getMemoryRecordByDescription("Total_Frames")
-- V1 = ADRLST.getMemoryRecordByDescription("P2_A_Health_Big")
-- V2 = ADRLST.getMemoryRecordByDescription("P1_Input_DEC")
-- V3 = ADRLST.getMemoryRecordByDescription("Frame_Skip_Counter")
-- V4 = ADRLST.getMemoryRecordByDescription("Frame_Skip_Toggle")

-- V0_PREV = V0.Value

-- -- Condition Loop
-- while (CURRENT_FRAME ~= V0.Value) and contScript do
--   while V0.Value == V0_PREV do
--     if isKeyPressed(VK_HOME) then
--       contScript = false
--       break
--     end
--   end

--   data_table[0] = { desc = V0.Description, val = V0.Value }
--   data_table[1] = { desc = V1.Description, val = V1.Value }
--   data_table[2] = { desc = V2.Description, val = V2.Value }
--   data_table[3] = { desc = V3.Description, val = V3.Value }
--   data_table[4] = { desc = V4.Description, val = V4.Value }

--   --stopREGEX
--   V0_PREV = V0.Value
--   CSV_WRITER(outPath, data_table)
-- end

local contScript = true
local tmpStr = ""
ADRLST = getAddressList()
V0 = ADRLST.getMemoryRecordByDescription("Total_Frames")
V0_PREV = V0.Value
V1 = ADRLST.getMemoryRecordByDescription("P2_A_Health_Big").Value
CURRENT_FRAME = readTF()
local function readTF()
  local tfPointer = ("pcsx2.exe+271A324")
  local totalFrameNumber = readInteger(tfPointer)
  return (totalFrameNumber)
end

-- Condition Loop
CURRENT_FRAME = readTF()
while (CURRENT_FRAME ~= V0.Value) and contScript do
  while V0.Value == V0_PREV do
    if isKeyPressed(VK_HOME) then
      contScript = false
      break
    end
    tmpStr = tmpStr .. V0_PREV .. "," .. V1 .. '\n'
  end
  V0_PREV = V0.Value
end

if (contScript == false) then
  local file_handle = assert(io.open("H:\\Git\\MVC2GEN\\resources\\Both_Emulator_Resources\\JS_Utils\\CSV_FILES\\MvC2DataAll_Original.csv"
    , "a"))
  -- tmpStr = tonumber(tmpStr, 16)
  file_handle:write(tmpStr)
  -- file_handle:write("\n")
  file_handle:close()
end
