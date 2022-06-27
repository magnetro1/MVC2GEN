import { Knockdown_State, StagesTable, ProxBlock, namesTable} from './constObjects/staticData.js';
import * as data from './csv_to_js/Shuma47_node.js';
import * as fs from 'fs';

// console.log(Knockdown_State);
// console.log(StagesTable);
// console.log(ProxBlock);
// console.log(namesTable);

//Inchoate Map method:
var x  = data.P2_A_Animation_Timer_Main.split(',');
var y  = data.P2_A_Knockdown_State.split(',');
// var z  = data.P2_A_Airborne;

var result = x.map(function(e,i){
  var a = x[i]
  var b = y[i]
  return a > 0 && b == 32
})

fs.writeFile("P2_A_BeingHit.js", `export var P2_A_BeingHit = "${result.toString()}";`, (err) => {
    if (err)
      console.log(err);
    else {
      console.log(fs.readFileSync("P2_A_BeingHit.js", "utf8"));
    }
  });