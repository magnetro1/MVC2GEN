import { Knockdown_State, StagesTable, ProxBlock, namesTable} from './constObjects/staticData.js';
import * as data from './csv_to_js/Shuma47_node.js';
import * as fs from 'fs';

// console.log(Knockdown_State);
// console.log(StagesTable);
// console.log(ProxBlock);
// console.log(namesTable);

  var slotNames = ["P1_A_","P1_B_","P1_C_","P2_A_","P2_B_","P2_C_"];
  var newStateNames = ["Being_Hit","Flying_Screen_Air","FlyingScreen_OTG","FSD_Dash","FS_Install_1","FS_Install_2","NJ_Air","NJ_Rising","OTG_Extra_Stun","OTG_Forced_Stun","OTG_Hit","OTG_Roll_Invincible","OTG_Roll_Stunned","ProxBlock_Air","ProxBlock_Ground","Pushblock_Air","Pushblock_Ground","Rising_Invincibility","SJ_Air","SJ_Counter","Stun","Tech_Hit","Thrown_Air","Thrown_Ground"];


var P1_A_Action_Flags = data.P1_A_Action_Flags.split(',');
var P1_A_Airborne = data.P1_A_Airborne.split(',');
var P1_A_Animation_Timer_Main = data.P1_A_Animation_Timer_Main.split(',');
var P1_A_Attack_Immune = data.P1_A_Attack_Immune.split(',');
var P1_A_Block_Meter = data.P1_A_Block_Meter.split(',');
var P1_A_FlyingScreen = data.P1_A_FlyingScreen.split(',');
var P1_A_FSI_Points = data.P1_A_FSI_Points.split(',');
var P1_A_is_Prox_Block = data.P1_A_is_Prox_Block.split(',');
var P1_A_Knockdown_State = data.P1_A_Knockdown_State.split(',');
var P1_A_PunchKick = data.P1_A_PunchKick.split(',');
var P1_A_SJ_Counter = data.P1_A_SJ_Counter.split(',');

var P1_B_Action_Flags = data.P1_B_Action_Flags.split(',');
var P1_B_Airborne = data.P1_B_Airborne.split(',');
var P1_B_Animation_Timer_Main = data.P1_B_Animation_Timer_Main.split(',');
var P1_B_Attack_Immune = data.P1_B_Attack_Immune.split(',');
var P1_B_Block_Meter = data.P1_B_Block_Meter.split(',');
var P1_B_FlyingScreen = data.P1_B_FlyingScreen.split(',');
var P1_B_FSI_Points = data.P1_B_FSI_Points.split(',');
var P1_B_is_Prox_Block = data.P1_B_is_Prox_Block.split(',');
var P1_B_Knockdown_State = data.P1_B_Knockdown_State.split(',');
var P1_B_PunchKick = data.P1_B_PunchKick.split(',');
var P1_B_SJ_Counter = data.P1_B_SJ_Counter.split(',');

var P1_C_Action_Flags = data.P1_C_Action_Flags.split(',');
var P1_C_Airborne = data.P1_C_Airborne.split(',');
var P1_C_Animation_Timer_Main = data.P1_C_Animation_Timer_Main.split(',');
var P1_C_Attack_Immune = data.P1_C_Attack_Immune.split(',');
var P1_C_Block_Meter = data.P1_C_Block_Meter.split(',');
var P1_C_FlyingScreen = data.P1_C_FlyingScreen.split(',');
var P1_C_FSI_Points = data.P1_C_FSI_Points.split(',');
var P1_C_is_Prox_Block = data.P1_C_is_Prox_Block.split(',');
var P1_C_Knockdown_State = data.P1_C_Knockdown_State.split(',');
var P1_C_PunchKick = data.P1_C_PunchKick.split(',');
var P1_C_SJ_Counter = data.P1_C_SJ_Counter.split(',');


var P2_A_Action_Flags = data.P2_A_Action_Flags.split(',');
var P2_A_Airborne = data.P2_A_Airborne.split(',');
var P2_A_Animation_Timer_Main = data.P2_A_Animation_Timer_Main.split(',');
var P2_A_Attack_Immune = data.P2_A_Attack_Immune.split(',');
var P2_A_Block_Meter = data.P2_A_Block_Meter.split(',');
var P2_A_FlyingScreen = data.P2_A_FlyingScreen.split(',');
var P2_A_FSI_Points = data.P2_A_FSI_Points.split(',');
var P2_A_is_Prox_Block = data.P2_A_is_Prox_Block.split(',');
var P2_A_Knockdown_State = data.P2_A_Knockdown_State.split(',');
var P2_A_PunchKick = data.P2_A_PunchKick.split(',');
var P2_A_SJ_Counter = data.P2_A_SJ_Counter.split(',');

var P2_B_Action_Flags = data.P2_B_Action_Flags.split(',');
var P2_B_Airborne = data.P2_B_Airborne.split(',');
var P2_B_Animation_Timer_Main = data.P2_B_Animation_Timer_Main.split(',');
var P2_B_Attack_Immune = data.P2_B_Attack_Immune.split(',');
var P2_B_Block_Meter = data.P2_B_Block_Meter.split(',');
var P2_B_FlyingScreen = data.P2_B_FlyingScreen.split(',');
var P2_B_FSI_Points = data.P2_B_FSI_Points.split(',');
var P2_B_is_Prox_Block = data.P2_B_is_Prox_Block.split(',');
var P2_B_Knockdown_State = data.P2_B_Knockdown_State.split(',');
var P2_B_PunchKick = data.P2_B_PunchKick.split(',');
var P2_B_SJ_Counter = data.P2_B_SJ_Counter.split(',');

var P2_C_Action_Flags = data.P2_C_Action_Flags.split(',');
var P2_C_Airborne = data.P2_C_Airborne.split(',');
var P2_C_Animation_Timer_Main = data.P2_C_Animation_Timer_Main.split(',');
var P2_C_Attack_Immune = data.P2_C_Attack_Immune.split(',');
var P2_C_Block_Meter = data.P2_C_Block_Meter.split(',');
var P2_C_FlyingScreen = data.P2_C_FlyingScreen.split(',');
var P2_C_FSI_Points = data.P2_C_FSI_Points.split(',');
var P2_C_is_Prox_Block = data.P2_C_is_Prox_Block.split(',');
var P2_C_Knockdown_State = data.P2_C_Knockdown_State.split(',');
var P2_C_PunchKick = data.P2_C_PunchKick.split(',');
var P2_C_SJ_Counter = data.P2_C_SJ_Counter.split(',');


var P1_A_BeingHit = P1_A_Animation_Timer_Main.map(( value, i ) => 
{
  let a = P1_A_Animation_Timer_Main[i]
  let b = P1_A_Knockdown_State[i]
  return a > 0 && b == 32
})

fs.writeFile(`P1_A_BeingHit.js`, `export var P1_A_BeingHit = "${P1_A_BeingHit.toString()}";`, (err) => 
{
    if (err)
      console.log(err);
    else {
      console.log('Hola');
    }
});

var P1_B_BeingHit = P1_B_Animation_Timer_Main.map(( value, i ) => 
{
  let a = P1_B_Animation_Timer_Main[i]
  let b = P1_B_Knockdown_State[i]
  return a > 0 && b == 32
})

fs.writeFile(`P1_B_BeingHit.js`, `export var P1_B_BeingHit = "${P1_B_BeingHit.toString()}";`, (err) => 
{
    if (err)
      console.log(err);
    else {
      console.log('Hola');
    }
});
var P1_C_BeingHit = P1_C_Animation_Timer_Main.map(( value, i ) => 
{
  let a = P1_C_Animation_Timer_Main[i]
  let b = P1_C_Knockdown_State[i]
  return a > 0 && b == 32
})

fs.writeFile(`P1_C_BeingHit.js`, `export var P1_C_BeingHit = "${P1_C_BeingHit.toString()}";`, (err) => 
{
    if (err)
      console.log(err);
    else {
      console.log('Hola');
    }
});
var P2_A_BeingHit = P2_A_Animation_Timer_Main.map(( value, i ) => 
{
  let a = P2_A_Animation_Timer_Main[i]
  let b = P2_A_Knockdown_State[i]
  return a > 0 && b == 32
})

fs.writeFile(`P2_A_BeingHit.js`, `export var P2_A_BeingHit = "${P2_A_BeingHit.toString()}";`, (err) => 
{
    if (err)
      console.log(err);
    else {
      console.log('Hola');
    }
});

var P2_B_BeingHit = P2_B_Animation_Timer_Main.map(( value, i ) => 
{
  let a = P2_B_Animation_Timer_Main[i]
  let b = P2_B_Knockdown_State[i]
  return a > 0 && b == 32
})

fs.writeFile(`P2_B_BeingHit.js`, `export var P2_B_BeingHit = "${P2_B_BeingHit.toString()}";`, (err) => 
{
    if (err)
      console.log(err);
    else {
      console.log('Hola');
    }
});
var P2_C_BeingHit = P2_C_Animation_Timer_Main.map(( value, i ) => 
{
  let a = P2_C_Animation_Timer_Main[i]
  let b = P2_C_Knockdown_State[i]
  return a > 0 && b == 32
})

fs.writeFile(`P2_C_BeingHit.js`, `export var P2_C_BeingHit = "${P2_C_BeingHit.toString()}";`, (err) => 
{
    if (err)
      console.log(err);
    else {
      console.log('Hola');
    }
});