function MainFunction()
	contScript = true
	currentFrame = readTF()
	oldFrame = currentFrame
	macroframe = 1
	macrocount = 1
	nextframe = false
	while (contScript) do
		sleep(1)
		if (currentFrame ~= oldFrame) then 
			-- FrameUpdate()
			nextframe = true
			oldFrame = currentFrame
		else
			nextframe = false
		end
		FrameUpdate(nextframe)
		currentFrame = readTF()
		if isKeyPressed(VK_HOME) then contScript = false end
	end
end

function readTF()
    local tfPointer = "pcsx2.exe+271A324"
    return readInteger(tfPointer)
end

function FrameUpdate(isnewframe)
	MacroStep(isnewframe)
end

macroinputs = {
-- Doom 100% Technique
{ 4, "buffer"},
{ 29, "SDB"},
{ 21, "Z"},
--Doom SJ-HK Pattern
{ 1, "S"},
{ 3, "W" },
{ 2, "B" },
{ 2, "S" },
{ 3, "W" },
{ 2, "B" },
{ 1, "S" },
{ 3, "W" },
{ 2, "B" },
{ 1, "S" },
{ 3, "W" },
{ 3, "B" },
{ 1, "Z" },
}
function MacroStep(isnewframe)
	if (isnewframe) then macroframe = macroframe + 1 end
	if (macroframe == 1 and macrocount == 1 and readFSR() ~= 1) then return end -- frame skip sync
	if (macroframe > macroinputs[macrocount][1]) then -- next inputs check
		MacroInputActualLetters(macroinputs[macrocount][2], false)
		macroframe = 1
		macrocount = macrocount + 1
	end
	if (macrocount > #macroinputs) then -- end of inputs check
		contScript = false
		return
	end
	MacroInputActualLetters(macroinputs[macrocount][2], true)
end

lilyoffset = getAddress("LilyPad.dll+D550")
keyboardbyteoffset = {
Z = 0xB4, B = 0xAC
}
keyboardintoffset = {
W = {0xBC, -1},
S = {0xBC, 1}, 
D = {0xB8, 1}
}
function MacroInputActualLetters(_string, _ispressed)
	local _pressbyte = 0xFF
    if (not _ispressed) then _pressbyte = 0x00 end
	_string = string.match(_string, "%u+") or ""
	for i = 1, string.len(_string) do
		local _offset = keyboardbyteoffset[string.sub(_string, i, i)]
		if (_offset) then
			writeBytes(lilyoffset + _offset, _pressbyte)
		else
			_offset = keyboardintoffset[string.sub(_string, i, i)]
			if (_offset) then
				writeInteger(lilyoffset + _offset[1], _pressbyte * _offset[2])
			end
		end
	end
end