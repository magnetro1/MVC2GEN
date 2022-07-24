pathToFile = "E:\\M.csv"
----------Pausing Functions----------
function PauseToggleHotkey()
	if (ActiveGameWindowCheck()) then ToggleCheckBox(ConsoleForm.PauseToggle) end
end

function PauseOnToggle(_sender)
	local _value = 0
	if (_sender.Checked) then _value = 1 end
	WriteByte(exedata.prgmbase + exedata.emupause, _value)
end

function PauseNextFrameHotkey()
	if (ActiveGameWindowCheck()) then PauseNextFrame() end
end

function PauseNextFrame()
	ConsoleForm.PauseToggle.Checked = false
	pausenextframe = true
end

function FrameStepCheck()
	if (pausenextframe) then
		ConsoleForm.PauseToggle.Checked = true
		pausenextframe = false
	end
end
-----------------------------------
-------StartScript---------

PauseNextFrame()
outPath = "E:\\M.csv"
_starting_new_write_flag = false
data_table = {}

function csv_write(path, data)
    separator = ","
    contScript = true
    while contScript == true do
        local file_handle = assert(io.open(path, "a"))
        local output_string = ""
        -- if _starting_new_write_flag == false then
        --     for i = 0, #data, 1 do
        --         if i < #data then
        --             output_string = output_string .. data[i].desc .. separator
        --         else
        --             output_string = output_string .. data[i].desc
        --         end
        --     end
        --     _starting_new_write_flag = true
        --     file_handle:write(output_string)
        --     file_handle:write("\n")
        --     output_string = ""
        -- end

        PauseNextFrame()
        for i = 0, #data, 1 do
            if i < #data then
                output_string = output_string .. data[i].val .. separator
            else
                output_string = output_string .. data[i].val
            end
        end

        file_handle:write(output_string)
        file_handle:write("\n")
        file_handle:close();

        if isKeyPressed(VK_HOME) then
			contScript = false
			break
		end
        -- Check if last line was written into the file
        file = io.open(path, "r+")
        local lastLineResult = nil
        local lineTable = {}
        local counter = 0
        for line in file:lines() do
            table.insert(lineTable, line)
            counter = counter + 1 
        end

        lastLineResult = lineTable[counter] -- can be right or wrong

        if ( lastLineResult.match( (tostring(lastLineResult)) , (tostring(output_string)) ) ) then
            print("Same line, but lets pretend it didnt match")
            PauseNextFrame()
            sleep(1000)
            output_string = '';
        else
            print("NOPE")
            output_string = '';
        end 
    end
end
PauseNextFrame()
address_list = getAddressList()
v0 = address_list.getMemoryRecordByDescription("Total_Frames")
v1 = address_list.getMemoryRecordByDescription("Frame_Skip_Counter")
v2 = address_list.getMemoryRecordByDescription("Frame_Skip_Cycle_Value")
v3 = address_list.getMemoryRecordByDescription("Frame_Skip_Rate")
v4 = address_list.getMemoryRecordByDescription("Frame_Skip_Toggle")


data_table[0]= {desc = v0.Description,val = v0.Value}
data_table[1]= {desc = v1.Description,val = v1.Value}
data_table[2]= {desc = v2.Description,val = v2.Value}
data_table[3]= {desc = v3.Description,val = v3.Value}
data_table[4]= {desc = v4.Description,val = v4.Value}

csv_write(outPath, data_table)