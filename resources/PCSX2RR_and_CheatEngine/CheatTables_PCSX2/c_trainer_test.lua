[ENABLE]
{$lua}
-- Load the mvc2_tables.lua file
local mvc2 = require('./support/static/mvc2_tables')
-- ENABLE 'Frame_Counter' after form launches,
-- then DISABLE it in order to let the form update.
-- Main Variables
VAR_0 = 'Frame_Counter'
VAR_1 = 'P1_Input_DEC'
VAR_2 = 'P2_Input_DEC'
VAR_3 = 'P1_Combo_Meter_Value'
VAR_4 = 'P2_Combo_Meter_Value'
VAR_5 = 'P1_Meter_Big'
VAR_6 = 'P2_Meter_Big'
VAR_7 = 'P1_Meter_Small'
VAR_8 = 'P2_Meter_Small'

--Label Position Variables
local fWidth = 598
local fHeight = 972
--Custom Font Variables
local cFont0 = {
fName =  'Courier',
fSize =   23,
fColor = 0xFF0000,
}
local cFont1 = {
fName =  'Courier',
fSize =   23,
fColor =  0xFFFFFF,
}
--Timer and Form Creation
local timer = createTimer(nil)
local MvC2DataDisplay = createForm()
MvC2DataDisplay.caption = 'MvC2 Data Display'
MvC2DataDisplay.width = fWidth
MvC2DataDisplay.height = fHeight
MvC2DataDisplay.color = 0x00b140
local stopButton = createButton(MvC2DataDisplay)
stopButton.setName('Stop')
function fnToggleForm()
timer_setEnabled(timer, not timer_getEnabled(timer))
end
control_onClick(stopButton, fnToggleForm)
control_setPosition(stopButton, 0, 0)
function fnUpdateOnTimer(memoryrecord, before, currentstate)
timer_onTimer(timer, fnGetAndSetData)
timer_setInterval(timer, 100)
timer_setEnabled(timer, true)
return true
end
--- Dynamic Entries
--labels
labelX0 = createLabel(MvC2DataDisplay)
labelX0.Font.Size = cFont1.fSize;
labelX0.Font.Color = cFont1.fColor;
labelX0.Font.Name = cFont1.fName
-- Rest of the labels...
--memory records
memRec0 = getAddressList().getMemoryRecordByDescription(VAR_0)
memRec1 = getAddressList().getMemoryRecordByDescription(VAR_1)
memRec2 = getAddressList().getMemoryRecordByDescription(VAR_2)
memRec3 = getAddressList().getMemoryRecordByDescription(VAR_3)
memRec4 = getAddressList().getMemoryRecordByDescription(VAR_4)
memRec5 = getAddressList().getMemoryRecordByDescription(VAR_5)
memRec6 = getAddressList().getMemoryRecordByDescription(VAR_6)
memRec7 = getAddressList().getMemoryRecordByDescription(VAR_7)
memRec8 = getAddressList().getMemoryRecordByDescription(VAR_8)

function fnGetAndSetData()
local p1Inputs = memRec1.Value
local p2Inputs = memRec2.Value
local p1InputStr, p2InputStr = mvc2.processInputBits(p1Inputs, p2Inputs)
local data0 = 'Frame_Counter'..': '..memoryrecord_getValue(memRec0)
local data1 = 'P1_Input_DEC'.. ': '..p1InputStr
local data2 = 'P2_Input_DEC'.. ': '..p2InputStr
local data3 = 'P1_Combo_Meter_Value'..': '..memoryrecord_getValue(memRec3)
local data4 = 'P2_Combo_Meter_Value'..': '..memoryrecord_getValue(memRec4)
local data5 = 'P1_Meter_Big'..': '..memoryrecord_getValue(memRec5)
local data6 = 'P2_Meter_Big'..': '..memoryrecord_getValue(memRec6)
local data7 = 'P1_Meter_Small'..': '..memoryrecord_getValue(memRec7)
local data8 = 'P2_Meter_Small'..': '..memoryrecord_getValue(memRec8)
-- Set label captions
control_setCaption(labelX0, data0)
control_setCaption(labelX1, data1)
control_setCaption(labelX2, data2)
control_setCaption(labelX3, data3)
control_setCaption(labelX4, data4)
control_setCaption(labelX5, data5)
control_setCaption(labelX6, data6)
control_setCaption(labelX7, data7)
control_setCaption(labelX8, data8)
return true
end
-- activate
memoryrecord_onActivate(memRec0, fnUpdateOnTimer)
memoryrecord_onActivate(memRec1, fnUpdateOnTimer)
memoryrecord_onActivate(memRec2, fnUpdateOnTimer)
memoryrecord_onActivate(memRec3, fnUpdateOnTimer)
memoryrecord_onActivate(memRec4, fnUpdateOnTimer)
memoryrecord_onActivate(memRec5, fnUpdateOnTimer)
memoryrecord_onActivate(memRec6, fnUpdateOnTimer)
memoryrecord_onActivate(memRec7, fnUpdateOnTimer)
memoryrecord_onActivate(memRec8, fnUpdateOnTimer)
{$asm}
[DISABLE]
