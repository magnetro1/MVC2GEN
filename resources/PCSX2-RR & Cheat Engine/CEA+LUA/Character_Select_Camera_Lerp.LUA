-- Dimension Pointers
camPtr = {
fov  = "[pcsx2.exe+026983F4]+FAC",
xPos = "[pcsx2.exe+026983F4]+F4C",
xRot = "[pcsx2.exe+026983F4]+F94",
yPos = "[pcsx2.exe+026983F4]+F50",
yRot = "[pcsx2.exe+026983F4]+F98",
--zNOP = "[pcsx2.exe+026983F4]+FF4",
--zSpt = "[pcsx2.exe+026983F8]",
zChr = "[pcsx2.exe+026983F4]+F54",
}
-- Functions
function lerp(v0, v1, t)
    return (1 - t) * v0 + t * v1
end
function readTF()
    local tfPointer = "pcsx2.exe+271A324"
    return readInteger(tfPointer)
end
function cameraAnim(camCoord)
	assert(camCoord.frames > 0) -- checks if the frame/step value is greater than 0
	local camStart = {} 	-- new array that is filled up with the dimensions; will be reading and writing to this
	local contScript = true 		-- used for breaking out of loop
	local currentTime = 0 			-- timer starts at 0, will be changed
	local initialFrame = readTF()
-- Reads the extant values
	for dimension, pointer in pairs(camPtr) do
		assert(camCoord[dimension]) -- checks that the camCoord list is populated
		camStart[dimension] = readFloat(pointer) -- gets and sets each dimension in camStart to its value. used once.
	end
-- Main loop; uses currentTime as the main checker
    while currentTime < 1 and contScript do
        for dimension, pointer in pairs(camPtr) do
            writeFloat(pointer, lerp(camStart[dimension], camCoord[dimension], currentTime))
        end
-- Allows to break out of the animation by pressing the Home key
        if isKeyPressed(VK_HOME) then
            contScript = false
        end
	local elapsedFrames = readTF() - initialFrame	-- should result in '1'
    currentTime = elapsedFrames / camCoord.frames	-- sets currentTime to '1' / 'frames. Ex: 1/500 = .002
    sleep(1)	-- prevents the script from running constantly.
    end
-- Writes the final coord value to each dimension to eliminate floating imprecision
	for dimension, pointer in pairs(camPtr) do
		writeFloat(pointer, camCoord[dimension])
	end
end
-- Coordinates
camCoords = { -- creates a table that contains the coordinates-per-dimension in their own array, separated by commas
{frames = 100, fov = 43, xPos = 0, xRot = 0, yPos = 10, yRot = 175, zChr = 100,}, -- first array / camera coordinates
{frames = 500, fov = 43, xPos = 0, xRot = 0, yPos = 90, yRot = 185, zChr = 800,}, -- second array
}
for i = 1, #camCoords do -- numeric-for to iterate through each coordinate, starting at fov
	cameraAnim(camCoords[i]) --calls the cameraAnim function and uses each camCoord array
end