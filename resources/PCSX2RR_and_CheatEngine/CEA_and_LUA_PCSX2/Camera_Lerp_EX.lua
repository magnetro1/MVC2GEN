--Original Script by Lord_Yoshi
[ENABLE]

{$Lua}

-- include: Y & Z
-- NOPs Y and Z camera controller to allow custom movement 
ytempNOP = getAddressList().getMemoryRecordByDescription("Y_NOP_Temp_Toggle")
ytempNOP.Active = true

ztempNOP = getAddressList().getMemoryRecordByDescription("Z_NOP_Temp_Toggle")
ztempNOP.Active = true
-- Camera Pointers Object (comment-out unused axes)
camPtr = {
  --fov  = "[pcsx2.exe+026983F4]+FAC",
  --xPos = "[pcsx2.exe+026983F4]+F4C",
  --xRot = "[pcsx2.exe+026983F4]+F94",
  yPos = "[pcsx2.exe+026983F4]+F50",
  yRot = "[pcsx2.exe+026983F4]+F98",
  zNOP = "[pcsx2.exe+026983F4]+FF4",
  zSpt = "[pcsx2.exe+026983F8]",
  --zPos = "[pcsx2.exe+026983F4]+F54",
  --ZSpt = "[pcsx2.exe+026983F4]+F60",
}

-- Functions
-- Linear Interpolation Function
function lerp(v0, v1, t)            
	return (1 - t) * v0 + t * v1
end

--Get Total Frames value
function readTF()							
    local tfPointer = "pcsx2.exe+271A324"
    return readInteger(tfPointer)
end

-- Pans the camera over some amount of frames. Script locks until the total frame count has changed then moves the camera.
function cameraPan(camCoord)
	assert(camCoord.frames > 0)
	local timeSpeed = 1 / camCoord.frames
	local camStart = {}
	for i, v in pairs(camPtr) do
		assert(camCoord[i]) -- Ensures table has values for the cam pointers
		camStart[i] = readFloat(v)
	end
	
	local currentTime = 0
	local oldFrame = readTF()
	
	while currentTime < 1.0 and contScript do
		CURRENT_FRAME = readTF()
		while CURRENT_FRAME == oldFrame and contScript do
			if isKeyPressed(VK_HOME) then   -- break loop by pressing HOME key
				contScript = false
			end
			CURRENT_FRAME = readTF()
		end
		oldFrame = CURRENT_FRAME     -- updates frame counter to new number
		currentTime = currentTime + timeSpeed
		for i, v in pairs(camPtr) do
			writeFloat(v, lerp(camStart[i], camCoord[i], currentTime))
		end
	end
	
	for i, v in pairs(camPtr) do
		writeFloat(v, camCoord[i])
	end
end

-- Script

contScript = true -- used to break with VK_HOME
camCoords = {
	--Camera Movement 1
	{
		frames = 90, fov = 43, xPos = 563, xRot = 481, yPos = 95, yRot = 95, zNOP = 812, zSpt = 812-812 
	},

}

for i = 1, #camCoords do
	cameraPan(camCoords[i])
end

ytempNOP = getAddressList().getMemoryRecordByDescription("Y_NOP_Temp_Toggle")
ytempNOP.Active = false

ztempNOP = getAddressList().getMemoryRecordByDescription("Z_NOP_Temp_Toggle")
ztempNOP.Active = false
writeFloat(zSpt, 0)

{$asm}
[DISABLE]
//code from here till the end of the code will be used to disable the cheat
