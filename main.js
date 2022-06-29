import { Knockdown_State, StagesTable, ProxBlock, namesTable} from './main_files/staticData.js'
// import * as data from './main_files/Shuma47_node.js';
import * as data from './main_files/CaptainCommandoRogueCable8_node.js';
import * as fs from 'fs';

const slots = ["P1_A_","P1_B_","P1_C_","P2_A_","P2_B_","P2_C_"];
const clipLength = data.A_2D_Game_Timer.split(',')

// List of States I'm going to export data for:
//   I was thinking of adding a table of states and their corresponding logics...
//   It would be cool if the MVC2GEN could iterate through this table automatically 
//   to pick out which key and value pairs to use for each character.

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
};


/*Instead for now, there's these arrays corresponding to each character.
I have to create a set of Arrays for each character for now.
*/
var BeingHitArray = [];
	BeingHitArray[0] = '';
	BeingHitArray[1] = '';
	BeingHitArray[2] = '';
	BeingHitArray[3] = '';
	BeingHitArray[4] = '';
	BeingHitArray[5] = '';
	
var FlyingScreenAirArray = [];
	FlyingScreenAirArray[0] = '';
	FlyingScreenAirArray[1] = '';
	FlyingScreenAirArray[2] = '';
	FlyingScreenAirArray[3] = '';
	FlyingScreenAirArray[4] = '';
	FlyingScreenAirArray[5] = '';

for ( let sixCharsI in slots )
{
	let tempTxt = '';
	for ( let frame in clipLength )
	{
		tempTxt += ( eval(`data.${slots[sixCharsI]}FlyingScreen.split(',')`)[frame] == 1 
			&& eval(`data.${slots[sixCharsI]}Knockdown_State.split(',')`)[frame] == 32
			&& eval(`data.${slots[sixCharsI]}Airborne.split(',')`)[frame] == 2) 
			? 1 + ',' : 0 + ',';
		FlyingScreenAirArray[sixCharsI] = `export var ${slots[sixCharsI]}FlyingScreenAir = "${tempTxt}";`;
	}
	tempTxt = '';
	FlyingScreenAirArray[sixCharsI] = FlyingScreenAirArray[sixCharsI].replace(`,"` , `"`);
}

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

console.log(FlyingScreenAirArray[0]);
// console.log(clipLength.length);
// console.log(FlyingScreenAirArray[0].length);
// console.log(FlyingScreenAirArray[1].length);
// console.log(FlyingScreenAirArray[2].length);
// console.log(FlyingScreenAirArray[3].length);
// console.log(FlyingScreenAirArray[4].length);
// console.log(FlyingScreenAirArray[5].length);

// fs.writeFile(`P2_C_BeingHit.js`, `export var P2_C_BeingHit = "${P2_C_BeingHit.toString()}";`, (err) =>
// {
// 	 if (err)
// 	   console.log(err);
// 	 else {
// 	   console.log('Test');
// 	 }
// });

//Point Checker System
//These arrays will contain the active-point-character prefixes (Ex: P1_A_)
// const P1 = [];
// const P2 = [];

// const pointTableP1 =
// {
// 	P1_A_ : data.P1_A_Is_Point.split(','),
// 	P1_B_ : data.P1_B_Is_Point.split(','),
// 	P1_C_ : data.P1_C_Is_Point.split(','),
// };
// const pointTableP2 =
// {
// 	P2_A_ : data.P2_A_Is_Point.split(','),
// 	P2_B_ : data.P2_A_Is_Point.split(','),
// 	P2_C_ : data.P2_A_Is_Point.split(','),
// };
// //Loops to check which keys have a 0 value and push them into previous arrays
// //P1
// for ( let i = 0 ; i < Object.values(pointTableP1).length ; i++ )
// {
// 	for ( let k = 0; k < Object.values(pointTableP1)[i].length; k++ )
// 	{
// 		if (Object.values(pointTableP1)[i][k] == 0)
// 		{
// 			P1.push(Object.keys(pointTableP1)[i])
// 		}
// 		// else
// 		// {
// 		// 	console.log("P1NG")
// 		// }
// 	}
// };
// for ( let i = 0 ; i < Object.values(pointTableP2).length ; i++ )
// {
// 	for ( let k = 0; k < Object.values(pointTableP2)[i].length; k++ )
// 	{
// 		if (Object.values(pointTableP2)[i][k] == 0)
// 		{
// 			P2.push(Object.keys(pointTableP2)[i])
// 		}
// 		// else
// 		// {
// 		// 	console.log("P2NG")
// 		// }
// 	}
// };