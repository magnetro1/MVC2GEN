[ENABLE]
//code from here to '[DISABLE]' will be used to enable the cheat
{$lua}
charTablePath = 'G:\\Emulators\\PCSX2\\pcsx2\\Cheat Tables+\\CEA_LUA\\characters.lua'
charTablePathCheck = io.open(charTablePath, "r")
charList =
{
"Charlie",
}
if  charTablePathCheck then
        dofile(charTablePath) --  contains table: 'characters' = {...AOBs...}
        for i = 1, #charList do
            myAOB = AOBScan( characters [ charList[i] ] ) -- uses 'characters' table
            charTablePathCheck.close()
            for j = 0, myAOB.getCount()-1 do
	            local vN = tonumber(myAOB[j],16)
	            local base = vN+0x50
	            local myTableEntry = getAddressList().createMemoryRecord()
	            myTableEntry.setAddress(base)
	            myTableEntry.Type = vtSingle
	            myTableEntry.Value = 0
	            myTableEntry.Active = 1
	            myTableEntry.setDescription(charList[i])
            end
end
end
{$asm}
[DISABLE]
