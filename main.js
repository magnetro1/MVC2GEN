import { Knockdown_State, StagesTable, ProxBlock, namesTable} from './main_files/staticData.js';
// import * as data from './main_files/Shuma47_node.js';
import * as data from './main_files/CaptainCommandoRogueCable8_node.js';
import * as fs from 'fs';
const slots = ["P1_A_","P1_B_","P1_C_","P2_A_","P2_B_","P2_C_"];

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

for (var  m = 0 ; m < BeingHitArray.length ; m++ )
{
	for ( let i = 0; i < data.A_2D_Game_Timer.split(',').length ; i++ )
	{
		// console.log(slots[m]+"Knockdown_State: "+(eval(`data.${slots[m]}Knockdown_State.split(',')`)[i]))
		// console.log(slots[m]+"Animation_Timer_Main: "+(eval(`data.${slots[m]}Animation_Timer_Main.split(',')`)[i]))
		BeingHitArray[m] += ( eval(`data.${slots[m]}Animation_Timer_Main.split(',')`)[i] > 0
			&& eval(`data.${slots[m]}Knockdown_State.split(',')`)[i] == 32 ) 
			? 1 + ',' : 0 + ','
	}
	console.log(slots[m]+"BeingHit: " + BeingHitArray[m]);
}
// console.log(BeingHitArray);

for (var  m = 0 ; m < FlyingScreenAirArray.length ; m++ )
{
	for ( let i = 0; i < data.A_2D_Game_Timer.split(',').length ; i++ )
	{
		// console.log(slots[m]+"FlyingScreen: "+(eval(`data.${slots[m]}FlyingScreen.split(',')`)[i]))
		// console.log(slots[m]+"Knockdown_State: "+(eval(`data.${slots[m]}Knockdown_State.split(',')`)[i]))
		// console.log(slots[m]+"Airborne: "+(eval(`data.${slots[m]}Airborne.split(',')`)[i]))
		FlyingScreenAirArray[m] += ( eval(`data.${slots[m]}FlyingScreen.split(',')`)[i] == 1 
			&& eval(`data.${slots[m]}Knockdown_State.split(',')`)[i] == 32
			&& eval(`data.${slots[m]}Airborne.split(',')`)[i] == 2) 
			? 1 + ',' : 0 + ','
	}
	console.log(slots[m]+"FlyingScreenAir: " + FlyingScreenAirArray[m]);
}
// console.log(FlyingScreenAirArray);

// fs.writeFile(`P2_C_BeingHit.js`, `export var P2_C_BeingHit = "${P2_C_BeingHit.toString()}";`, (err) =>
// {
// 	 if (err)
// 	   console.log(err);
// 	 else {
// 	   console.log('Hola');
// 	 }
// });