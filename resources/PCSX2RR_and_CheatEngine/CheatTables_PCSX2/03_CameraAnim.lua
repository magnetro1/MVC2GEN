-- 03_CameraAnim.lua
local CameraAnimation = {}
CameraAnimation.Core = nil

function CameraAnimation.animate(targetCoords)
    if not CameraAnimation.Core then
        error("CameraAnimation not initialized with CameraCore")
        return false
    end

    local initialState = CameraAnimation.Core.readCurrentCameraState()
    local initialFrame = CameraAnimation.Core.readTimeFrame()
    local isAnimating = true
    local timeSpeed = 1 / targetCoords.frames
    local currentTime = 0
    local oldFrame = initialFrame

    while currentTime < 1.0 and isAnimating do
        local currentFrame = CameraAnimation.Core.readTimeFrame()
        
        while currentFrame == oldFrame and isAnimating do
            if isKeyPressed(VK_HOME) then
                isAnimating = false
            end
            currentFrame = CameraAnimation.Core.readTimeFrame()
        end
        
        oldFrame = currentFrame
        currentTime = currentTime + timeSpeed
        
        local interpolatedState = {}
        -- Skip zSpt in interpolation since it's derived
        for dimension in pairs(CameraAnimation.Core.Pointers) do
            if dimension ~= "zSpt" then  -- Skip zSpt interpolation
                interpolatedState[dimension] = CameraAnimation.Core.lerp(
                    initialState[dimension],
                    targetCoords[dimension],
                    currentTime
                )
            end
        end
        
        CameraAnimation.Core.writeCameraState(interpolatedState)
    end
    
    if isAnimating then
        CameraAnimation.Core.writeCameraState(targetCoords)
    end

    return isAnimating
end

return CameraAnimation
