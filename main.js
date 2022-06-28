import { Knockdown_State, StagesTable, ProxBlock, namesTable} from './main_files/staticData.js';
import * as data from './main_files/Shuma47_node.js';
import * as fs from 'fs';
//   var newStateNames = ["Being_Hit","Flying_Screen_Air","FlyingScreen_OTG","FSD_Dash","FS_Install_1","FS_Install_2","NJ_Air","NJ_Rising","OTG_Extra_Stun","OTG_Forced_Stun","OTG_Hit","OTG_Roll_Invincible","OTG_Roll_Stunned","ProxBlock_Air","ProxBlock_Ground","Pushblock_Air","Pushblock_Ground","Rising_Invincibility","SJ_Air","SJ_Counter","Stun","Tech_Hit","Thrown_Air","Thrown_Ground"];
//Point Checker System
//These arrays will contain the active-point-character prefixes (Ex: P1_A_)
const P1 = [];
const P2 = [];
//Prefixes for future address-lookups
const pointTableP1 =
{
	P1_A_ : data.P1_A_Is_Point.split(','),
	P1_B_ : data.P1_B_Is_Point.split(','),
	P1_C_ : data.P1_C_Is_Point.split(','),
}
const pointTableP2 =
{
	P2_A_ : data.P2_A_Is_Point.split(','),
	P2_B_ : data.P2_A_Is_Point.split(','),
	P2_C_ : data.P2_A_Is_Point.split(','),
}
//Loops to check which keys have a 0 value and push them into previous arrays
//P1
for ( let i = 0 ; i < Object.values(pointTableP1).length ; i++ )
{
	for ( let k = 0; k < Object.values(pointTableP1)[i].length; k++ )
	{
		if (Object.values(pointTableP1)[i][k] == 0)
		{
			P1.push(Object.keys(pointTableP1)[i])
		}
		else
		{
			console.log("P1NG")
		}
	}
}
for ( let i = 0 ; i < Object.values(pointTableP2).length ; i++ )
{
	for ( let k = 0; k < Object.values(pointTableP2)[i].length; k++ )
	{
		if (Object.values(pointTableP2)[i][k] == 0)
		{
			P2.push(Object.keys(pointTableP2)[i])
		}
		else
		{
			console.log("P2NG")
		}
	}
}
var P1_BeingHit = '';
for ( let i = 0; i < P1.length; i++)
{
	var beingHitVars = [Math.round(eval(`data.${P1[i]}Animation_Timer_Main.split(',')`)),Math.round(eval(`data.${P1[0]}Knockdown_State.split(',')`))];
	P1_BeingHit += beingHitVars[0][i] > 0 && beingHitVars[1][i] == 32 ? 1 + ',' : 0 + ','
}
var P2_BeingHit = '';
for ( let i = 0; i < P2.length; i++)
{
	var beingHitVars = [Math.round(eval(`data.${P2[i]}Animation_Timer_Main.split(',')`)),Math.round(eval(`data.${P2[0]}Knockdown_State.split(',')`))];
	P2_BeingHit += beingHitVars[0][i] > 0 && beingHitVars[1][i] == 32 ? 1 + ',' : 0 + ','
}
// console.log(P1_BeingHit)
// console.log(P2_BeingHit)
// fs.writeFile(`P2_C_BeingHit.js`, `export var P2_C_BeingHit = "${P2_C_BeingHit.toString()}";`, (err) =>
// {
//	 if (err)
//	   console.log(err);
//	 else {
//	   console.log('Hola');
//	 }
// });