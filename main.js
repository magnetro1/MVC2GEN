import * as masterAddresses from "./main_files/masterAddresses.js";
import * as fs from 'fs';
import * as data from "./main_files/CaptainCommandoRogueCable8_node.js";
// import * as data from "./main_files/Shuma47_node.js";
// import * as data from "./main_files/SpiralUnblockable_node.js";


// import { Knockdown_State_Static, StagesTable_Static, ProxBlock_Static, namesTable_Static } from './main_files/staticData.js'
// const slots = ["P1_A_","P1_B_","P1_C_","P2_A_","P2_B_","P2_C_"];

// Get unique-list of player memory addresses per clip to feed into the PointCharacterDataWriter function
const getFile = fs.readFileSync('./main_files/CaptainCommandoRogueCable8_node.js', 'utf8',)
var playerDataAll = [];
var uniqueArray = [];
getFile.toString().split(';').map(line => { // split file into lines
        var re = /(P[1-2]_[A-C]_)(\w+)\s/g; // regex to find all Player memory addresses
        var item = ''; // Temporary variable to run the exec function on
        while (item = re.exec(line)){ //I don't know how exec works
            playerDataAll.push(item[2]); // I guess this is how you grab $2 from the regex
            playerDataAll.join(','); // Joins the array values into a string
        };
    });
uniqueArray = [...new Set(playerDataAll)]; // I don't know how Set works

// Writes the P1 or P2 point-character's address data to a file as an array of strings
// If the 2-character bug is active, it will create multiple arrays
const clipLength = data.A_2D_Game_Timer.split(',').length;
const pointTableP1 = {
    P1_A_: data.P1_A_Is_Point.split(","),
    P1_B_: data.P1_B_Is_Point.split(","),
    P1_C_: data.P1_C_Is_Point.split(","),
};
const pointTableP2 = {
    P2_A_: data.P2_A_Is_Point.split(","),
    P2_B_: data.P2_B_Is_Point.split(","),
    P2_C_: data.P2_C_Is_Point.split(","),
};

const PointCharacterDataWriter = function (Px, address)
{
    var pointArray = [];
    var finalValue = [];
    //find point characters
    if (Px == "P1")
    {
        for (let i = 0; i < Object.values(pointTableP1).length; i++) // 3
        {
            for (let k = 0; k < Object.values(pointTableP1)[i].length; k++) // length of clip in frames
            {
                if (Object.values(pointTableP1)[i][k] == 0)
                {
                    pointArray.push(Object.keys(pointTableP1)[i])
                }
            }
        }

    } else if (Px == "P2")
    {
        for (let i = 0; i < Object.values(pointTableP2).length; i++) //3
        {
            for (let k = 0; k < Object.values(pointTableP2)[i].length; k++) // length of clip in frames
            {
                if (Object.values(pointTableP2)[i][k] == 0)
                {
                    pointArray.push(Object.keys(pointTableP2)[i]) 
                }
            }
        }
    } else
    {
        return `Arguments need to be strings!`;
    }

    //Write file & 'head'
    fs.writeFileSync(`${Px}_${address}.js` , `var result = [];`+'\r' , { flag: 'a+', encoding: 'utf8' }, err => {})
    //Append data for first-point
    for ( let a = 0; a < clipLength; a++)
    {
        finalValue += eval(`data.${pointArray[a]}${address}.split(',')`)[a]+','
    }
    fs.appendFile(`${Px}_${address}.js` , `result[0] = [${finalValue.toString()}],`.replace(',]',']').replace('],','];')+'\n' , { flag: 'a+', encoding: 'utf8' }, err => {})
    finalValue = [];
    //2-Character Bug-Logic:
    if ( pointArray.length >= (clipLength*2))
    {
        for (let b = clipLength, i = 0; b < clipLength*2; b++, i++)
        {
            finalValue += eval(`data.${pointArray[b]}${address}.split(',')`)[i]+','
        }
        fs.appendFile(`${Px}_${address}.js` , `result[1] = [${finalValue.toString()}],`.replace(',]',']').replace('],','];')+'\n' , { flag: 'a+', encoding: 'utf8' }, err => {})
        console.log(`2-Character Bug Active on ${Px} side!`)
    }
    //3-Character Bug Logic:
    else if (pointArray.length >= (clipLength*3))
    {
        for (let c = clipLength*2, i = 0; c < clipLength*3; c++, i++)
        {
            finalValue += eval(`data.${pointArray[c]}${address}.split(',')`)[i]+','
        }
        fs.appendFile(`${Px}_${address}.js` , `result[2] = [${finalValue.toString()}],`.replace(',]',']').replace('],','];')+'\n' , { flag: 'a+', encoding: 'utf8' }, err => {})
        console.log(`3-Character Bug Active on ${Px} side!`)
    }
    else
    {
        console.log(`Only 1 Point Character on ${Px} side.`)
    }
};

for (let playerMemI = 0; playerMemI < uniqueArray.length; playerMemI++) {
    PointCharacterDataWriter("P1", uniqueArray[playerMemI].toString());
    PointCharacterDataWriter("P2", uniqueArray[playerMemI].toString());
}


// console.log(masterAddresses.playerAddresses.split(',').length);
// console.log(data.P1_A_Guardbreak_Flag.split(",").length);
// console.log(data.P1_A_Health_Big.split(",").length);
// PointCharacterDataWriter("P1", "Guardbreak_Flag");
// PointCharacterDataWriter("P2","Health_Big")
// fs.readdir('main_files', (err, files) => {
//     files.forEach(file => {
//       console.log(file.includes("_node.js"));
//     });
//   });
/*List of States I'm going to export data for:
  I was thinking of adding a table of states and their corresponding logics...
  It would be cool if the MVC2GEN could iterate through this table automatically
  to pick out which key and value pairs to use for each character.

const newDataToWrite = {
    "Being_Hit": Animation_Timer_Main > 0 && Knockdown_State == 32 ? 1 : 0,
    "Flying_Screen_Air": FlyingScreen == 1 && Knockdown_State == 32 && Airborne == 2 ? 1 : 0,
    "FlyingScreen_OTG": FlyingScreen == 1 && Knockdown_State == 32 && Airborne == 3 ? 1 : 0,
    "FS_Install_1": FSI_Points == 8 || FSI_Points == 9  ? 1 : 0,
    "FS_Install_2": FSI_Points > 9 ? 1 : 0,
    "NJ_Air": Airborne == 2 && Knockdown_State == 3 && SJ_Counter == 0 ? 1 : 0,
    "NJ_Rising": Airborne == 0 && Knockdown_State == 2 && SJ_Counter == 0 ? 1 : 0,
    "OTG_Extra_Stun": Knockdown_State == 23 && Airborne == 3 ? 1 : 0,
    "OTG_Forced_Stun": Knockdown_State == 32 && Airborne == 3 ? 1 : 0,
    "OTG_Hit": Action_Flags == 0 && Airborne == 3 && Knockdown_State == 32 ? 1 : 0,
    "OTG_Roll_Invincible": Action_Flags == 2 && Airborne == 1 && Attack_Immune == 1 && Knockdown_State == 17 ? 1 : 0,
    "OTG_Roll_Stunned": Action_Flags == 1 && Airborne == 3 && Knockdown_State == 32 ? 1 : 0,
    "ProxBlock_Air": Is_Prox_Block == 6 && Knockdown_State == 19 ? 1 : 0,
    "ProxBlock_Ground": Is_Prox_Block == 5 && Knockdown_State == 18 ? 1 : 0,
    "Pushblock_Air": Block_Meter > 0 && Animation_Timer_Main < 28 && Is_Prox_Block == 6 && Action_Flags == 2 ? 1 : 0,
    "Pushblock_Ground": Block_Meter > 0 && Animation_Timer_Main < 28 && Is_Prox_Block == 5 && Action_Flags == 3 ? 1 : 0,
    "Rising_Invincibility": Airborne == 0 && Attack_Immune == 1 && Knockdown_State == 17 ? 1 : 0,
    "SJ_Air": Airborne == 2 && Knockdown_State == 14 && SJ_Counter == 1 ? 1 : 0,
    "SJ_Counter": SJ_Counter == 2 ? 1 : 0,
    "Stun": Knockdown_State == 32 && Is_Prox_Block == 13 ? 1 : 0,
    "Tech_Hit": Knockdown_State == 27 ? 1 : 0,
    "Thrown_Air": Airborne == 2 && Knockdown_State == 31 && Is_Prox_Block == 16 ? 1 : 0,
    "Thrown_Ground": Airborne == 0 && Knockdown_State == 31 && Is_Prox_Block == 16 ? 1 : 0,
}


/*Instead for now, there's these arrays corresponding to each character.
I have to create a set of Arrays for each character for now.
*/
// var BeingHitArray = [];
// 	BeingHitArray[0] = '';
// 	BeingHitArray[1] = '';
// 	BeingHitArray[2] = '';
// 	BeingHitArray[3] = '';
// 	BeingHitArray[4] = '';
// 	BeingHitArray[5] = '';

// var FlyingScreenAirArray = [];
// 	FlyingScreenAirArray[0] = '';
// 	FlyingScreenAirArray[1] = '';
// 	FlyingScreenAirArray[2] = '';
// 	FlyingScreenAirArray[3] = '';
// 	FlyingScreenAirArray[4] = '';
// 	FlyingScreenAirArray[5] = '';

// for ( let sixCharsI in slots )
// {
// 	let tempTxt = '';
// 	for ( let frame in clipLength )
// 	{
// 		tempTxt += ( eval(`data.${slots[sixCharsI]}FlyingScreen.split(',')`)[frame] == 1
// 			&& eval(`data.${slots[sixCharsI]}Knockdown_State.split(',')`)[frame] == 32
// 			&& eval(`data.${slots[sixCharsI]}Airborne.split(',')`)[frame] == 2)
// 			? 1 + ',' : 0 + ',';
// 		FlyingScreenAirArray[sixCharsI] = `export var ${slots[sixCharsI]}FlyingScreenAir = "${tempTxt}";`;
// 	}
// 	tempTxt = '';
// 	FlyingScreenAirArray[sixCharsI] = FlyingScreenAirArray[sixCharsI].replace(`,"` , `"`);
// }

/*Old method of doing the loops; I'm keeping it here to update it later.
I'd like to figure out an efficient way to do these loops before propagating it to the other files.

for (let  m = 0 ; m < slots.length ; m++ )
{
    for ( let i = 0; i < data.A_2D_Game_Timer.split(',').length ; i++ )
    {
        // console.log(slots[m]+"Knockdown_State: "+(eval(`data.${slots[m]}Knockdown_State.split(',')`)[i]))
        // console.log(slots[m]+"Animation_Timer_Main: "+(eval(`data.${slots[m]}Animation_Timer_Main.split(',')`)[i]))
        BeingHitArray[m] += ( eval(`data.${slots[m]}Animation_Timer_Main.split(',')`)[i] > 0
            && eval(`data.${slots[m]}Knockdown_State.split(',')`)[i] == 32 )
            ? 1 + ',' : 0 + ','
    }
    // console.log(slots[m]+"BeingHit: " + BeingHitArray[m]);
}
console.log(BeingHitArray);
*/

// console.log(FlyingScreenAirArray);
// console.log(clipLength.length);
// console.log(FlyingScreenAirArray[0].length);
// console.log(FlyingScreenAirArray[1].length);
// console.log(FlyingScreenAirArray[2].length);
// console.log(FlyingScreenAirArray[3].length);
// console.log(FlyingScreenAirArray[4].length);
// console.log(FlyingScreenAirArray[5].length);


