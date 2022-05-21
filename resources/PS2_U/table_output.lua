[ENABLE]
{$lua}
-- Variables and Functions
local outPath = "G:\\Emulators\\PCSX2\\pcsx2\\Cheat Tables+\\table_output.csv"
local _starting_new_write_flag = true
local contScript = true
local data_table = {}
local separator = ","

local type_table = {
  "Byte",
  "2 Byte",
  "4 Byte",
  "8 Byte",
  "Float",
  "Double",
  "String",
  "UnicodeString",
  "ByteArray",
  "Binary",
  "AutoAssembler",
  "Pointer",
  "Custom",
  "Grouped"
}

-- Main Script
local address_list = getAddressList()
local v = {}

local file_handle = assert(io.open(outPath, "w"))

file_handle:write("Description" .. separator .. "Address" .. separator .. "Value" .. separator .. "Type")
file_handle:write("\n")

for i = 0, address_list.Count - 1, 1 do
	v = address_list.getMemoryRecord(i)
    file_handle:write(v.Description .. separator .. v.Address .. separator .. v.Value .. separator .. type_table[v.Type + 1])
    file_handle:write("\n")
end

file_handle:close()
{$asm}
[DISABLE]
