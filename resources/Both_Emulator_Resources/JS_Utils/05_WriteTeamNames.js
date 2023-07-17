import * as fs from 'fs';
import {
  DIR_OUTPATH,
  dataObject,
  clipDataAE,
} from './00_DataObject.js';
import {
  DEC_NAME_TABLE_OBJ
} from './JS_UTIL_staticData.js';

function writeTeamNames() {
  const id = [];
  const name = [];
  // put the first character of each ID into an array.
  id.push(dataObject.P1_A_ID_2.split(',')[0]);
  id.push(dataObject.P1_B_ID_2.split(',')[0]);
  id.push(dataObject.P1_C_ID_2.split(',')[0]);
  id.push(dataObject.P2_A_ID_2.split(',')[0]);
  id.push(dataObject.P2_B_ID_2.split(',')[0]);
  id.push(dataObject.P2_C_ID_2.split(',')[0]);

  id.forEach((id) => {
    name.push(DEC_NAME_TABLE_OBJ[id]);
  });

  // Convert assist types to symbols.
  const assistType = [];
  const assistCNV = [];
  const assistSymbols = ['α', 'β', 'γ']
  // 0, 1, 2 = α, β, γ
  assistType.push(dataObject.P1_A_Assist_Value.split(',')[0]);
  assistType.push(dataObject.P1_B_Assist_Value.split(',')[0]);
  assistType.push(dataObject.P1_C_Assist_Value.split(',')[0]);
  assistType.push(dataObject.P2_A_Assist_Value.split(',')[0]);
  assistType.push(dataObject.P2_B_Assist_Value.split(',')[0]);
  assistType.push(dataObject.P2_C_Assist_Value.split(',')[0]);

  // Convert assist types to symbols.
  assistType.forEach((assist) => {
    assistCNV.push(assistSymbols[assist]);
  });

  let playerOne = '';
  let playerTwo = '';
  playerOne += `P1: ${name[0]}-${assistCNV[0]}, `
  playerOne += `${name[1]}-${assistCNV[1]}, `
  playerOne += `${name[2]}-${assistCNV[2]}`

  playerTwo += `P2: ${name[3]}-${assistCNV[3]}, `
  playerTwo += `${name[4]}-${assistCNV[4]}, `
  playerTwo += `${name[5]}-${assistCNV[5]}`;

  fs.appendFileSync(`${DIR_OUTPATH}${clipDataAE}.js`,
    `result[1] = '${playerOne}';\n`
    + `result[2] = '${playerTwo}';\n`,
  );
}

writeTeamNames();
