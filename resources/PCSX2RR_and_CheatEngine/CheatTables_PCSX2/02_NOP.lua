local NOPManager = {}

-- All available NOPs
NOPManager.AVAILABLE_NOPS = {
    Y = "Y_NOP",
    Z = "Z_NOP",
    YClamp = "Y_Clamp_Disable"
}

-- Enable only specified NOPs
function NOPManager.enable(nopList)
    for _, nopName in ipairs(nopList) do
        local description = NOPManager.AVAILABLE_NOPS[nopName]
        if description then
            local nop = getAddressList().getMemoryRecordByDescription(description)
            if nop then 
                nop.Active = true 
            else
                print("Warning: NOP '" .. nopName .. "' not found in address list")
            end
        else
            print("Warning: Unknown NOP type '" .. nopName .. "'")
        end
    end
end

-- Disable only specified NOPs
function NOPManager.disable(nopList)
    for _, nopName in ipairs(nopList) do
        local description = NOPManager.AVAILABLE_NOPS[nopName]
        if description then
            local nop = getAddressList().getMemoryRecordByDescription(description)
            if nop then 
                nop.Active = false 
            end
        end
    end
end

return NOPManager
