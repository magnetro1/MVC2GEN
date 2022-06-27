var iteration = 48
var toNum = 55

//1 
let text1 = "";
for (g = iteration; g < toNum; g++) {
text1 += 
`label${g}= createLabel(myform)
`
}

console.log(text1)

//2
let text2 = "";
for (h = iteration; h < toNum; h++) {
text2 += 	
`value${h} = nil
`
}

console.log(text2)

//3
let text3 = "";

for (i = iteration; i < toNum; i++) {
text3 +=		
`description${i}=[[P1_A_Dizzy_Value]]
local memrec${i}=addresslist_getMemoryRecordByDescription(addresslist, description${i})
`
}

console.log(text3)

//4
let text4 = "";
let numArr = [240, 260, 280, 300, 320, 340];
for (j = 45, m = 0; j < 51, m < 6 ; j++, m++) {
text4 +=
`value${j} = description${j}..":  "..memoryrecord_getValue(memrec${j})
control_setPosition(label${j}, (10*${numArr[m]}),240-yOffset)
control_setCaption(label${j},value${j})

`
}
console.log(text4)


//5
let text5 = "";
for (k = iteration; k < toNum; k++) {
text5 += `memoryrecord_onActivate(memrec${k}, start)
`
}

console.log(text5)
