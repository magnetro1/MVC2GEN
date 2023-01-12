-- Variables and Functions
outPath = 'g:\\MvC2DataShort_Original.csv'

_starting_new_write_flag = false
contScript = true
data_table = {}

function readTF()
	tfPointer = ("pcsx2.exe+271A324")
    readITF   = readInteger(tfPointer)
	return(readITF)
end

function csv_write(path, data)
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

currentFrame = readTF()

-- Main Script
address_list = getAddressList()
v0= address_list.getMemoryRecordByDescription("Total_Frames")
v1= address_list.getMemoryRecordByDescription("P2_A_Y_Positoin_Arena")


v0_prev = v0.Value

-- Condition Loop
while (currentFrame ~= v0.Value) and contScript do
	while v0.Value == v0_prev do
		if isKeyPressed(VK_HOME) then
			contScript = false
			break
		end
	end

	data_table[0]= { desc = v0.Description , val = v0.Value }
	data_table[1]= { desc = v1.Description , val = v1.Value }


	v0_prev = v0.Value
	csv_write(outPath, data_table)
end