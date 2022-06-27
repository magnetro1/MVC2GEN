var totalNum = 53+1;
var iterationNum = 1;

var labels = ["Frame_Counter",
"P1_A_Health_Big",
"P1_B_Health_Big",
"P1_C_Health_Big",
"P2_A_Health_Big",
"P2_B_Health_Big",
"P2_C_Health_Big",
"P1_Meter_Big",
"P2_Meter_Big",
"P1_Combo_Meter_Value",
"P2_Combo_Meter_Value",
"P1_Hitstop",
"P2_Hitstop",
"Frame_Skip_Counter",
"Frame_Skip_Toggle",
"P1_Input_DEC",
"P2_Input_DEC",
"P1_A_Block_Meter",
"P1_B_Block_Meter",
"P1_C_Block_Meter",
"P2_A_Block_Meter",
"P2_B_Block_Meter",
"P2_C_Block_Meter",
"P1_A_SJ_Counter",
"P1_B_SJ_Counter",
"P1_C_SJ_Counter",
"P2_A_SJ_Counter",
"P2_B_SJ_Counter",
"P2_C_SJ_Counter",
"P1_A_Dizzy_Value",
"P1_B_Dizzy_Value",
"P1_C_Dizzy_Value",
"P2_A_Dizzy_Value",
"P2_B_Dizzy_Value",
"P2_C_Dizzy_Value",
"P1_vs_A_Invincibility",
"P1_vs_B_Invincibility",
"P1_vs_C_Invincibility",
"P2_vs_A_Invincibility",
"P2_vs_B_Invincibility",
"P2_vs_C_Invincibility",
"P1_A_FlyingScreen",
"P1_B_FlyingScreen",
"P1_C_FlyingScreen",
"P2_A_FlyingScreen",
"P2_B_FlyingScreen",
"P2_C_FlyingScreen",
"P1_A_Unfly",
"P1_B_Unfly",
"P1_C_Unfly",
"P2_A_Unfly",
"P2_B_Unfly",
"P2_C_Unfly",
]

let form1 = `[ENABLE]
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
`

let text1 = "";
let text2 = "";
let text3 = "";
let text4 = "";
let text5 = "";
let text6 = "";
let text7 = "";
let text8 = "";
let text9 = "";
let text10 = "";
let text11 = "";
let text12 = "";
let text13 = "";


for (loop1 = iterationNum; loop1 < totalNum; loop1++) {
	
text1 += 
`label${loop1}= createLabel(myform)
`
}

console.log(form1 + text1)
console.log(`--value assignments
`)
for (loop2 = iterationNum; loop2 < totalNum; loop2++){
text2 += 
`value${loop2} = nil
`	
}

console.log(text2)
console.log(`-- timer creation
local t=createTimer(nil)
-- description set`)




for (loop3 = iterationNum, labelIteration = 0; loop3 < totalNum, labelIteration < labels.length; loop3++, labelIteration++) {
text3 += `description${loop3}=[[${labels[labelIteration]}]]
local memrec${loop3}=addresslist_getMemoryRecordByDescription(addresslist, description${loop3})

`
}
console.log(text3)
console.log(`
-- function changing()
function changing()

--first column`)



// Positional Assignments
let yNumList0 = [0, 20, 40, 60, 80, 100, 120, 140, 160];
let xOffset = 200;

//first column
for (loop4 = 1, i = 0 ; loop4 < 9, i < yNumList0.length; loop4++, i++)
{
text4 += `value${loop4}=description${loop4}..":  "..memoryrecord_getValue(memrec${loop4})
control_setPosition(label${loop4}, 10,${10+yNumList0[i]})
control_setCaption(label${loop4},value${loop4})

`
}
console.log(text4 + `
--second column`)

//second column
for(loop5 = 10, i = 0; loop5 < 18, i < yNumList0.length-1; loop5++, i++) {
text5 += `value${loop5}=description${loop5}..":  "..memoryrecord_getValue(memrec${loop5})
control_setPosition(label${loop5}, ${10+xOffset},${10+yNumList0[i]})
control_setCaption(label${loop5},value${loop5})

`
}
console.log(text5 + `
--third column`)

//third column
for(loop6 = 18, i = 0; loop6 < 24, i < yNumList0.length-3; loop6++, i++) {
text6 += `value${loop6}=description${loop6}..":  "..memoryrecord_getValue(memrec${loop6})
control_setPosition(label${loop6}, ${10+xOffset*2},${10+yNumList0[i]})
control_setCaption(label${loop6},value${loop6})

`
}
console.log(text6 + `
-- fourth column`)

//fourth column
for(loop7 = 24, i = 0; loop7 < 30, i < yNumList0.length-3; loop7++, i++) {
text7 += `value${loop7}=description${loop7}..":  "..memoryrecord_getValue(memrec${loop7})
control_setPosition(label${loop7}, ${10+xOffset*3},${10+yNumList0[i]})
control_setCaption(label${loop7},value${loop7})

`
}
console.log(text7 + `
-- return/new row`)


for (loop8 = 30, i = 0 ; loop8 < 35, i < yNumList0.length-3; loop8++, i++)
{
text8 += `value${loop8}=description${loop8}..":  "..memoryrecord_getValue(memrec${loop8})
control_setPosition(label${loop8}, 10,${240+yNumList0[i]})
control_setCaption(label${loop8},value${loop8})

`
}
console.log(text8 + `
-- row 2 column 2`)

for (loop9 = 36, i = 0 ; loop9 < 41, i < yNumList0.length-3; loop9++, i++)
{
text9 += `value${loop9}=description${loop9}..":  "..memoryrecord_getValue(memrec${loop9})
control_setPosition(label${loop9}, ${10+xOffset},${240+yNumList0[i]})
control_setCaption(label${loop9},value${loop9})

`
}
console.log(text9 + `
-- row 2 column 3`)

for (loop10 = 42, i = 0 ; loop10 < 46, i < yNumList0.length-3; loop10++, i++)
{
text10 += `value${loop10}=description${loop10}..":  "..memoryrecord_getValue(memrec${loop10})
control_setPosition(label${loop10}, ${10+xOffset*2},${240+yNumList0[i]})
control_setCaption(label${loop10},value${loop10})

`
}
console.log(text10 + `
-- row 2 column 4`)



for (loop11 = 48, i = 0 ; loop11 < 53, i < yNumList0.length-3; loop11++, i++)
{
text11 += `value${loop11}=description${loop11}..":  "..memoryrecord_getValue(memrec${loop11})
control_setPosition(label${loop11}, ${10+xOffset*3},${240+yNumList0[i]})
control_setCaption(label${loop11},value${loop11})

`
}
console.log(text11 + `
-- row 2 column 4`)

// finish placing columns & rows


console.log(`


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
-- set active`)
//last loop

for (loop13 = iterationNum; loop13 < totalNum; loop13++) {

text13 += `memoryrecord_onActivate(memrec${loop13}, start)
`

}


console.log(text13)
console.log(`-- set buttons
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
`)