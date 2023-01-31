-- Variables and Functions
outPath = 'g:\\MvC2DataShort_Original.csv'

_starting_new_write_flag = false
contScript = true
data_table = {}

function readTF()
  tfPointer = ("pcsx2.exe+271A324")
  readITF   = readInteger(tfPointer)
  return (readITF)
end

function CSV_WRITER(path, data)
  separator = ","
  local file_handle = assert(io.open(path, "a"))
  local output_string = ""
  if _starting_new_write_flag == false then
    for i = 0, #data, 1 do
      if i < #data then
        output_string = output_string .. data[i].desc .. separator
      else
        output_string = output_string .. data[i].desc
      end
    end
    _starting_new_write_flag = true
    file_handle:write(output_string)
    file_handle:write("\n")
    output_string = ""
  end
  for i = 0, #data, 1 do
    if i < #data then
      output_string = output_string .. data[i].val .. separator
    else
      output_string = output_string .. data[i].val
    end
  end
  file_handle:write(output_string)
  file_handle:write("\n")
  file_handle:close()
  return true
end

CURRENT_FRAME = readTF()

-- Main Script
ADRLST = getAddressList()
v0 = ADRLST.getMemoryRecordByDescription("Total_Frames")
v1 = ADRLST.getMemoryRecordByDescription("P2_A_Y_Positoin_Arena")


V0_PREV = v0.Value

-- Condition Loop
while (CURRENT_FRAME ~= v0.Value) and contScript do
  while v0.Value == V0_PREV do
    if isKeyPressed(VK_HOME) then
      contScript = false
      break
    end
  end

  data_table[0] = { desc = v0.Description, val = v0.Value }
  data_table[1] = { desc = v1.Description, val = v1.Value }


  V0_PREV = v0.Value
  CSV_WRITER(outPath, data_table)
end
