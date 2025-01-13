[ENABLE]
{$lua}

local CameraCore = require('./support/camera/01_CameraCore')
local NOPManager = require('./support/camera/02_NOP')
local CameraAnimation = require('./support/camera/03_CameraAnim')

CameraAnimation.Core = CameraCore

local activeNOPs = {"Y", "Z","YClamp"}
local CameraSequence = {
    {  
        frames = 120,
        yPos = 900,
        yRot = 900,
        zNOP = 2500,
    },
}

NOPManager.enable(activeNOPs)

for i, coords in ipairs(CameraSequence) do
    if not CameraAnimation.animate(coords) then
        break
    end
end

NOPManager.disable(activeNOPs)
writeFloat(CameraCore.Pointers.zSpt, 0)
{$asm}
[DISABLE]
