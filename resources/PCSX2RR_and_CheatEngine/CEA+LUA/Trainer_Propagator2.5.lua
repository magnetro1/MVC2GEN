[ENABLE]
//code from here to '[DISABLE]' will be used to enable the cheat
{$lua}
-- ACTIVATE Frame_Counter IN CHEAT ENGINE AFTER TRAINER lAUNCHES

openProcess([[pcsx2.exe]])
addresslist = getAddressList()
myform= createForm()
myform.width = 800
myform.height = 400
xOffset = 10
yOffset = 30
-- label creations
label1= createLabel(myform)
label2= createLabel(myform)
label3= createLabel(myform)
label4= createLabel(myform)
label5= createLabel(myform)
label6= createLabel(myform)
label7= createLabel(myform)
label8= createLabel(myform)
label9= createLabel(myform)
label10= createLabel(myform)
label11= createLabel(myform)
label12= createLabel(myform)
label13= createLabel(myform)
label14= createLabel(myform)
label15= createLabel(myform)
label16= createLabel(myform)
label17= createLabel(myform)
label18= createLabel(myform)
label19= createLabel(myform)
label20= createLabel(myform)
label21= createLabel(myform)
label22= createLabel(myform)
label23= createLabel(myform)
label24= createLabel(myform)
label25= createLabel(myform)
label26= createLabel(myform)
label27= createLabel(myform)
label28= createLabel(myform)
label29= createLabel(myform)
label30= createLabel(myform)
label31= createLabel(myform)
label32= createLabel(myform)
label33= createLabel(myform)
label34= createLabel(myform)
label35= createLabel(myform)
label36= createLabel(myform)
label37= createLabel(myform)
label38= createLabel(myform)
label39= createLabel(myform)
label40= createLabel(myform)
label41= createLabel(myform)
label42= createLabel(myform)
label43= createLabel(myform)
label44= createLabel(myform)
label45= createLabel(myform)
label46= createLabel(myform)
label47= createLabel(myform)
label48= createLabel(myform)
label49= createLabel(myform)
label50= createLabel(myform)
label51= createLabel(myform)
label52= createLabel(myform)
label53= createLabel(myform)

--value assignments

value1 = nil
value2 = nil
value3 = nil
value4 = nil
value5 = nil
value6 = nil
value7 = nil
value8 = nil
value9 = nil
value10 = nil
value11 = nil
value12 = nil
value13 = nil
value14 = nil
value15 = nil
value16 = nil
value17 = nil
value18 = nil
value19 = nil
value20 = nil
value21 = nil
value22 = nil
value23 = nil
value24 = nil
value25 = nil
value26 = nil
value27 = nil
value28 = nil
value29 = nil
value30 = nil
value31 = nil
value32 = nil
value33 = nil
value34 = nil
value35 = nil
value36 = nil
value37 = nil
value38 = nil
value39 = nil
value40 = nil
value41 = nil
value42 = nil
value43 = nil
value44 = nil
value45 = nil
value46 = nil
value47 = nil
value48 = nil
value49 = nil
value50 = nil
value51 = nil
value52 = nil
value53 = nil

-- timer creation
local t=createTimer(nil)
-- description set
description1=[[Frame_Counter]]
local memrec1=addresslist_getMemoryRecordByDescription(addresslist, description1)

description2=[[P1_A_Health_Big]]
local memrec2=addresslist_getMemoryRecordByDescription(addresslist, description2)

description3=[[P1_B_Health_Big]]
local memrec3=addresslist_getMemoryRecordByDescription(addresslist, description3)

description4=[[P1_C_Health_Big]]
local memrec4=addresslist_getMemoryRecordByDescription(addresslist, description4)

description5=[[P2_A_Health_Big]]
local memrec5=addresslist_getMemoryRecordByDescription(addresslist, description5)

description6=[[P2_B_Health_Big]]
local memrec6=addresslist_getMemoryRecordByDescription(addresslist, description6)

description7=[[P2_C_Health_Big]]
local memrec7=addresslist_getMemoryRecordByDescription(addresslist, description7)

description8=[[P1_Meter_Big]]
local memrec8=addresslist_getMemoryRecordByDescription(addresslist, description8)

description9=[[P2_Meter_Big]]
local memrec9=addresslist_getMemoryRecordByDescription(addresslist, description9)

description10=[[P1_Combo_Meter_Value]]
local memrec10=addresslist_getMemoryRecordByDescription(addresslist, description10)

description11=[[P2_Combo_Meter_Value]]
local memrec11=addresslist_getMemoryRecordByDescription(addresslist, description11)

description12=[[P1_Hitstop]]
local memrec12=addresslist_getMemoryRecordByDescription(addresslist, description12)

description13=[[P2_Hitstop]]
local memrec13=addresslist_getMemoryRecordByDescription(addresslist, description13)

description14=[[Frame_Skip_Counter]]
local memrec14=addresslist_getMemoryRecordByDescription(addresslist, description14)

description15=[[Frame_Skip_Toggle]]
local memrec15=addresslist_getMemoryRecordByDescription(addresslist, description15)

description16=[[P1_Input_DEC]]
local memrec16=addresslist_getMemoryRecordByDescription(addresslist, description16)

description17=[[P2_Input_DEC]]
local memrec17=addresslist_getMemoryRecordByDescription(addresslist, description17)

description18=[[P1_A_Block_Meter]]
local memrec18=addresslist_getMemoryRecordByDescription(addresslist, description18)

description19=[[P1_B_Block_Meter]]
local memrec19=addresslist_getMemoryRecordByDescription(addresslist, description19)

description20=[[P1_C_Block_Meter]]
local memrec20=addresslist_getMemoryRecordByDescription(addresslist, description20)

description21=[[P2_A_Block_Meter]]
local memrec21=addresslist_getMemoryRecordByDescription(addresslist, description21)

description22=[[P2_B_Block_Meter]]
local memrec22=addresslist_getMemoryRecordByDescription(addresslist, description22)

description23=[[P2_C_Block_Meter]]
local memrec23=addresslist_getMemoryRecordByDescription(addresslist, description23)

description24=[[P1_A_SJ_Counter]]
local memrec24=addresslist_getMemoryRecordByDescription(addresslist, description24)

description25=[[P1_B_SJ_Counter]]
local memrec25=addresslist_getMemoryRecordByDescription(addresslist, description25)

description26=[[P1_C_SJ_Counter]]
local memrec26=addresslist_getMemoryRecordByDescription(addresslist, description26)

description27=[[P2_A_SJ_Counter]]
local memrec27=addresslist_getMemoryRecordByDescription(addresslist, description27)

description28=[[P2_B_SJ_Counter]]
local memrec28=addresslist_getMemoryRecordByDescription(addresslist, description28)

description29=[[P2_C_SJ_Counter]]
local memrec29=addresslist_getMemoryRecordByDescription(addresslist, description29)

description30=[[P1_A_Dizzy_Value]]
local memrec30=addresslist_getMemoryRecordByDescription(addresslist, description30)

description31=[[P1_B_Dizzy_Value]]
local memrec31=addresslist_getMemoryRecordByDescription(addresslist, description31)

description32=[[P1_C_Dizzy_Value]]
local memrec32=addresslist_getMemoryRecordByDescription(addresslist, description32)

description33=[[P2_A_Dizzy_Value]]
local memrec33=addresslist_getMemoryRecordByDescription(addresslist, description33)

description34=[[P2_B_Dizzy_Value]]
local memrec34=addresslist_getMemoryRecordByDescription(addresslist, description34)

description35=[[P2_C_Dizzy_Value]]
local memrec35=addresslist_getMemoryRecordByDescription(addresslist, description35)

description36=[[P1_vs_A_Invincibility]]
local memrec36=addresslist_getMemoryRecordByDescription(addresslist, description36)

description37=[[P1_vs_B_Invincibility]]
local memrec37=addresslist_getMemoryRecordByDescription(addresslist, description37)

description38=[[P1_vs_C_Invincibility]]
local memrec38=addresslist_getMemoryRecordByDescription(addresslist, description38)

description39=[[P2_vs_A_Invincibility]]
local memrec39=addresslist_getMemoryRecordByDescription(addresslist, description39)

description40=[[P2_vs_B_Invincibility]]
local memrec40=addresslist_getMemoryRecordByDescription(addresslist, description40)

description41=[[P2_vs_C_Invincibility]]
local memrec41=addresslist_getMemoryRecordByDescription(addresslist, description41)

description42=[[P1_A_FlyingScreen]]
local memrec42=addresslist_getMemoryRecordByDescription(addresslist, description42)

description43=[[P1_B_FlyingScreen]]
local memrec43=addresslist_getMemoryRecordByDescription(addresslist, description43)

description44=[[P1_C_FlyingScreen]]
local memrec44=addresslist_getMemoryRecordByDescription(addresslist, description44)

description45=[[P2_A_FlyingScreen]]
local memrec45=addresslist_getMemoryRecordByDescription(addresslist, description45)

description46=[[P2_B_FlyingScreen]]
local memrec46=addresslist_getMemoryRecordByDescription(addresslist, description46)

description47=[[P2_C_FlyingScreen]]
local memrec47=addresslist_getMemoryRecordByDescription(addresslist, description47)

description48=[[P1_A_Unfly]]
local memrec48=addresslist_getMemoryRecordByDescription(addresslist, description48)

description49=[[P1_B_Unfly]]
local memrec49=addresslist_getMemoryRecordByDescription(addresslist, description49)

description50=[[P1_C_Unfly]]
local memrec50=addresslist_getMemoryRecordByDescription(addresslist, description50)

description51=[[P2_A_Unfly]]
local memrec51=addresslist_getMemoryRecordByDescription(addresslist, description51)

description52=[[P2_B_Unfly]]
local memrec52=addresslist_getMemoryRecordByDescription(addresslist, description52)

description53=[[P2_C_Unfly]]
local memrec53=addresslist_getMemoryRecordByDescription(addresslist, description53)



-- function changing()
function changing()

--first column
value1=description1..":  "..memoryrecord_getValue(memrec1)
control_setPosition(label1, 10,10)
control_setCaption(label1,value1)

value2=description2..":  "..memoryrecord_getValue(memrec2)
control_setPosition(label2, 10,30)
control_setCaption(label2,value2)

value3=description3..":  "..memoryrecord_getValue(memrec3)
control_setPosition(label3, 10,50)
control_setCaption(label3,value3)

value4=description4..":  "..memoryrecord_getValue(memrec4)
control_setPosition(label4, 10,70)
control_setCaption(label4,value4)

value5=description5..":  "..memoryrecord_getValue(memrec5)
control_setPosition(label5, 10,90)
control_setCaption(label5,value5)

value6=description6..":  "..memoryrecord_getValue(memrec6)
control_setPosition(label6, 10,110)
control_setCaption(label6,value6)

value7=description7..":  "..memoryrecord_getValue(memrec7)
control_setPosition(label7, 10,130)
control_setCaption(label7,value7)

value8=description8..":  "..memoryrecord_getValue(memrec8)
control_setPosition(label8, 10,150)
control_setCaption(label8,value8)

value9=description9..":  "..memoryrecord_getValue(memrec9)
control_setPosition(label9, 10,170)
control_setCaption(label9,value9)


--second column
value10=description10..":  "..memoryrecord_getValue(memrec10)
control_setPosition(label10, 210,10)
control_setCaption(label10,value10)

value11=description11..":  "..memoryrecord_getValue(memrec11)
control_setPosition(label11, 210,30)
control_setCaption(label11,value11)

value12=description12..":  "..memoryrecord_getValue(memrec12)
control_setPosition(label12, 210,50)
control_setCaption(label12,value12)

value13=description13..":  "..memoryrecord_getValue(memrec13)
control_setPosition(label13, 210,70)
control_setCaption(label13,value13)

value14=description14..":  "..memoryrecord_getValue(memrec14)
control_setPosition(label14, 210,90)
control_setCaption(label14,value14)

value15=description15..":  "..memoryrecord_getValue(memrec15)
control_setPosition(label15, 210,110)
control_setCaption(label15,value15)

value16=description16..":  "..memoryrecord_getValue(memrec16)
control_setPosition(label16, 210,130)
control_setCaption(label16,value16)

value17=description17..":  "..memoryrecord_getValue(memrec17)
control_setPosition(label17, 210,150)
control_setCaption(label17,value17)


--third column
value18=description18..":  "..memoryrecord_getValue(memrec18)
control_setPosition(label18, 410,10)
control_setCaption(label18,value18)

value19=description19..":  "..memoryrecord_getValue(memrec19)
control_setPosition(label19, 410,30)
control_setCaption(label19,value19)

value20=description20..":  "..memoryrecord_getValue(memrec20)
control_setPosition(label20, 410,50)
control_setCaption(label20,value20)

value21=description21..":  "..memoryrecord_getValue(memrec21)
control_setPosition(label21, 410,70)
control_setCaption(label21,value21)

value22=description22..":  "..memoryrecord_getValue(memrec22)
control_setPosition(label22, 410,90)
control_setCaption(label22,value22)

value23=description23..":  "..memoryrecord_getValue(memrec23)
control_setPosition(label23, 410,110)
control_setCaption(label23,value23)


-- fourth column
value24=description24..":  "..memoryrecord_getValue(memrec24)
control_setPosition(label24, 610,10)
control_setCaption(label24,value24)

value25=description25..":  "..memoryrecord_getValue(memrec25)
control_setPosition(label25, 610,30)
control_setCaption(label25,value25)

value26=description26..":  "..memoryrecord_getValue(memrec26)
control_setPosition(label26, 610,50)
control_setCaption(label26,value26)

value27=description27..":  "..memoryrecord_getValue(memrec27)
control_setPosition(label27, 610,70)
control_setCaption(label27,value27)

value28=description28..":  "..memoryrecord_getValue(memrec28)
control_setPosition(label28, 610,90)
control_setCaption(label28,value28)

value29=description29..":  "..memoryrecord_getValue(memrec29)
control_setPosition(label29, 610,110)
control_setCaption(label29,value29)


-- return/new row
value30=description30..":  "..memoryrecord_getValue(memrec30)
control_setPosition(label30, 10,240)
control_setCaption(label30,value30)

value31=description31..":  "..memoryrecord_getValue(memrec31)
control_setPosition(label31, 10,260)
control_setCaption(label31,value31)

value32=description32..":  "..memoryrecord_getValue(memrec32)
control_setPosition(label32, 10,280)
control_setCaption(label32,value32)

value33=description33..":  "..memoryrecord_getValue(memrec33)
control_setPosition(label33, 10,300)
control_setCaption(label33,value33)

value34=description34..":  "..memoryrecord_getValue(memrec34)
control_setPosition(label34, 10,320)
control_setCaption(label34,value34)

value35=description35..":  "..memoryrecord_getValue(memrec35)
control_setPosition(label35, 10,340)
control_setCaption(label35,value35)


-- row 2 column 2
value36=description36..":  "..memoryrecord_getValue(memrec36)
control_setPosition(label36, 210,240)
control_setCaption(label36,value36)

value37=description37..":  "..memoryrecord_getValue(memrec37)
control_setPosition(label37, 210,260)
control_setCaption(label37,value37)

value38=description38..":  "..memoryrecord_getValue(memrec38)
control_setPosition(label38, 210,280)
control_setCaption(label38,value38)

value39=description39..":  "..memoryrecord_getValue(memrec39)
control_setPosition(label39, 210,300)
control_setCaption(label39,value39)

value40=description40..":  "..memoryrecord_getValue(memrec40)
control_setPosition(label40, 210,320)
control_setCaption(label40,value40)

value41=description41..":  "..memoryrecord_getValue(memrec41)
control_setPosition(label41, 210,340)
control_setCaption(label41,value41)


-- row 2 column 3
value42=description42..":  "..memoryrecord_getValue(memrec42)
control_setPosition(label42, 410,240)
control_setCaption(label42,value42)

value43=description43..":  "..memoryrecord_getValue(memrec43)
control_setPosition(label43, 410,260)
control_setCaption(label43,value43)

value44=description44..":  "..memoryrecord_getValue(memrec44)
control_setPosition(label44, 410,280)
control_setCaption(label44,value44)

value45=description45..":  "..memoryrecord_getValue(memrec45)
control_setPosition(label45, 410,300)
control_setCaption(label45,value45)

value46=description46..":  "..memoryrecord_getValue(memrec46)
control_setPosition(label46, 410,320)
control_setCaption(label46,value46)

value47=description47..":  "..memoryrecord_getValue(memrec47)
control_setPosition(label47, 410,340)
control_setCaption(label47,value47)


-- row 2 column 4
value48=description48..":  "..memoryrecord_getValue(memrec48)
control_setPosition(label48, 610,240)
control_setCaption(label48,value48)

value49=description49..":  "..memoryrecord_getValue(memrec49)
control_setPosition(label49, 610,260)
control_setCaption(label49,value49)

value50=description50..":  "..memoryrecord_getValue(memrec50)
control_setPosition(label50, 610,280)
control_setCaption(label50,value50)

value51=description51..":  "..memoryrecord_getValue(memrec51)
control_setPosition(label51, 610,300)
control_setCaption(label51,value51)

value52=description52..":  "..memoryrecord_getValue(memrec52)
control_setPosition(label52, 610,320)
control_setCaption(label52,value52)

value53=description53..":  "..memoryrecord_getValue(memrec53)
control_setPosition(label53, 610,340)
control_setCaption(label53,value53)


-- row 2 column 4


-- end function

return true
end
-- function mem, before and current
function start(memoryrecord, before, currentstate)
  timer_onTimer(t, changing)
  timer_setInterval(t,100)
  timer_setEnabled(t, true)
return true
end
-- set active
memoryrecord_onActivate(memrec1, start)
memoryrecord_onActivate(memrec2, start)
memoryrecord_onActivate(memrec3, start)
memoryrecord_onActivate(memrec4, start)
memoryrecord_onActivate(memrec5, start)
memoryrecord_onActivate(memrec6, start)
memoryrecord_onActivate(memrec7, start)
memoryrecord_onActivate(memrec8, start)
memoryrecord_onActivate(memrec9, start)
memoryrecord_onActivate(memrec10, start)
memoryrecord_onActivate(memrec11, start)
memoryrecord_onActivate(memrec12, start)
memoryrecord_onActivate(memrec13, start)
memoryrecord_onActivate(memrec14, start)
memoryrecord_onActivate(memrec15, start)
memoryrecord_onActivate(memrec16, start)
memoryrecord_onActivate(memrec17, start)
memoryrecord_onActivate(memrec18, start)
memoryrecord_onActivate(memrec19, start)
memoryrecord_onActivate(memrec20, start)
memoryrecord_onActivate(memrec21, start)
memoryrecord_onActivate(memrec22, start)
memoryrecord_onActivate(memrec23, start)
memoryrecord_onActivate(memrec24, start)
memoryrecord_onActivate(memrec25, start)
memoryrecord_onActivate(memrec26, start)
memoryrecord_onActivate(memrec27, start)
memoryrecord_onActivate(memrec28, start)
memoryrecord_onActivate(memrec29, start)
memoryrecord_onActivate(memrec30, start)
memoryrecord_onActivate(memrec31, start)
memoryrecord_onActivate(memrec32, start)
memoryrecord_onActivate(memrec33, start)
memoryrecord_onActivate(memrec34, start)
memoryrecord_onActivate(memrec35, start)
memoryrecord_onActivate(memrec36, start)
memoryrecord_onActivate(memrec37, start)
memoryrecord_onActivate(memrec38, start)
memoryrecord_onActivate(memrec39, start)
memoryrecord_onActivate(memrec40, start)
memoryrecord_onActivate(memrec41, start)
memoryrecord_onActivate(memrec42, start)
memoryrecord_onActivate(memrec43, start)
memoryrecord_onActivate(memrec44, start)
memoryrecord_onActivate(memrec45, start)
memoryrecord_onActivate(memrec46, start)
memoryrecord_onActivate(memrec47, start)
memoryrecord_onActivate(memrec48, start)
memoryrecord_onActivate(memrec49, start)
memoryrecord_onActivate(memrec50, start)
memoryrecord_onActivate(memrec51, start)
memoryrecord_onActivate(memrec52, start)
memoryrecord_onActivate(memrec53, start)

-- set buttons
button1 = createButton(myform)
button1.setName( "Stop" )

function toggle()
timer_setEnabled(t,not timer_getEnabled(t))
end
control_onClick(button1, toggle)
control_setPosition(button1, 800-75,0) -- minus 75 from the width

{$asm}


[DISABLE]
//code from here till the end of the code will be used to disable the cheat