-- 01_CameraCore.lua
local CameraCore = {
  -- Define pointers first
  Pointers = {
      yPos = "[pcsx2.exe+026983F4]+F50",
      yRot = "[pcsx2.exe+026983F4]+F98",
      zNOP = "[pcsx2.exe+026983F4]+FF4",
      zSpt = "[pcsx2.exe+026983F8]",
  },
  
  -- Constants
  Z_OFFSET = 812
}

function CameraCore.lerp(v0, v1, t)
  -- Only error on actual errors, no debug prints
  if v0 == nil then error("lerp: v0 is nil") end
  if v1 == nil then error("lerp: v1 is nil") end
  if t == nil then error("lerp: t is nil") end
  return (1 - t) * v0 + t * v1
end

function CameraCore.readTimeFrame()
  return readInteger("pcsx2.exe+271A324")
end

function CameraCore.validateCoordinates(coords)
  if not coords.frames or coords.frames <= 0 then
      error("Invalid frames value: must be greater than 0")
  end
  
  -- Define required dimensions (excluding zSpt since it's calculated)
  local requiredDimensions = {
      "yPos",
      "yRot",
      "zNOP"
  }
  
  -- Check only the required dimensions
  for _, dimension in ipairs(requiredDimensions) do
      if not coords[dimension] then
          error(string.format("Missing required dimension: %s", dimension))
      end
  end
end

function CameraCore.readCurrentCameraState()
    local state = {}
    -- Fixed: CameraPointers -> CameraCore.Pointers
    for dimension, pointer in pairs(CameraCore.Pointers) do
        local value = readFloat(pointer)
        if not value then
            error(string.format("Failed to read %s from memory", dimension))
        end
        state[dimension] = value
    end
    return state
end

function CameraCore.writeCameraState(dimensions)
    -- Fixed: CameraPointers -> CameraCore.Pointers
    for dimension, pointer in pairs(CameraCore.Pointers) do
        local valueToWrite
        if dimension == "zSpt" then
            -- Calculate zSpt from zNOP automatically
            valueToWrite = dimensions.zNOP - CameraCore.Z_OFFSET
        else
            valueToWrite = dimensions[dimension]
        end

        if not writeFloat(pointer, valueToWrite) then
            error(string.format("Failed to write %s to memory", dimension))
        end
    end
end

return CameraCore
