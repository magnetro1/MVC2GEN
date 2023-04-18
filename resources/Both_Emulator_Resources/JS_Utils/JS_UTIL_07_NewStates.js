/* eslint-disable max-len */
/* eslint-disable eqeqeq */
/* eslint-disable no-unused-vars */
/* eslint-disable camelcase */
import * as fs from 'fs';
import { DIR_EXPORT_TO_AE } from './JS_UTIL_paths.js';
import getPMem from './JS_UTIL_03_PlayerMemory.js';

/**
 * @description Writes State-Files that count and increment consecutive true values.
 * Search for "NEW_STATE_ADD_HERE" across the function to append address fetches and new states.
 */
export default function writeNewStates(wObjFN) {
  for (const tempObj in wObjFN) {
    const objName = tempObj.toString();
    const DIR_OUTPATH = `${DIR_EXPORT_TO_AE}${tempObj}/`;
    const CLIP_LENGTH = wObjFN[tempObj].Total_Frames.split(',').length;

    // Temps for switching P1 and P2
    let plVal;
    let p1OrP2;
    for (plVal = 1; plVal < 3; plVal++) {
      plVal === 1 ? p1OrP2 = 'P1' : p1OrP2 = 'P2';

      // Fetches relevant SINGLE addresses for State-Logic-Checking
      const Action_Flags = getPMem(wObjFN, objName, p1OrP2, 'Action_Flags', 0);
      const Air_Dash_Count = getPMem(wObjFN, objName, p1OrP2, 'Air_Dash_Count', 0);
      const Airborne = getPMem(wObjFN, objName, p1OrP2, 'Airborne', 0);
      const Animation_Timer_Main = getPMem(wObjFN, objName, p1OrP2, 'Animation_Timer_Main', 0);
      const Attack_Immune = getPMem(wObjFN, objName, p1OrP2, 'Attack_Immune', 0);
      const Attack_Number = getPMem(wObjFN, objName, p1OrP2, 'Attack_Number', 0);
      const Block_Meter = getPMem(wObjFN, objName, p1OrP2, 'Block_Meter', 0);
      const Dizzy = getPMem(wObjFN, objName, p1OrP2, 'Dizzy', 0);
      const Dizzy_Reset_Timer = getPMem(wObjFN, objName, p1OrP2, 'Dizzy_Reset_Timer', 0);
      const HitStop = getPMem(wObjFN, objName, p1OrP2, 'Hitstop2', 0);
      const Knockdown_State = getPMem(wObjFN, objName, p1OrP2, 'Knockdown_State', 0);
      const FlyingScreen = getPMem(wObjFN, objName, p1OrP2, 'FlyingScreen', 0);
      const FSI_Points = getPMem(wObjFN, objName, p1OrP2, 'FlyingScreen', 0);
      const Is_Prox_Block = getPMem(wObjFN, objName, p1OrP2, 'Is_Prox_Block', 0);
      const Normal_Strength = getPMem(wObjFN, objName, p1OrP2, 'Normal_Strength', 0);
      const PunchKick = getPMem(wObjFN, objName, p1OrP2, 'PunchKick', 0);
      const SJ_Counter = getPMem(wObjFN, objName, p1OrP2, 'SJ_Counter', 0);
      const X_Position_Arena = getPMem(wObjFN, objName, p1OrP2, 'X_Position_Arena', 0);
      const X_Position_From_Enemy = getPMem(wObjFN, objName, p1OrP2, 'X_Position_From_Enemy', 0);
      const X_Velocity = getPMem(wObjFN, objName, p1OrP2, 'X_Velocity', 0);
      const Y_Position_Arena = getPMem(wObjFN, objName, p1OrP2, 'Y_Position_Arena', 0);
      const Y_Position_From_Enemy = getPMem(wObjFN, objName, p1OrP2, 'Y_Position_From_Enemy', 0);
      const Y_Velocity = getPMem(wObjFN, objName, p1OrP2, 'Y_Velocity', 0);
      // NEW_STATE_ADD_HERE : Define your SINGLE get-Address here
      // List of files to be written. Will have prefix of P1_ or P2_
      const newStatesObj = {
        State_Being_Hit: [[], [], []],
        State_Flying_Screen_Air: [[], [], []],
        State_Flying_Screen_OTG: [[], [], []],
        State_FS_Install_1: [[], [], []],
        State_FS_Install_2: [[], [], []],
        State_NJ_Air: [[], [], []],
        State_NJ_Rising: [[], [], []],
        State_OTG_Extra_Stun: [[], [], []],
        State_OTG_Forced_Stun: [[], [], []],
        State_OTG_Hit: [[], [], []],
        State_OTG_Roll_Invincible: [[], [], []],
        State_OTG_Roll_Stunned: [[], [], []],
        State_ProxBlock_Air: [[], [], []],
        State_ProxBlock_Ground: [[], [], []],
        State_Pushblock_Air: [[], [], []],
        State_Pushblock_Ground: [[], [], []],
        State_Rising_Invincibility: [[], [], []],
        State_SJ_Air: [[], [], []],
        State_SJ_Counter: [[], [], []],
        State_Stun: [[], [], []],
        State_Tech_Hit: [[], [], []],
        State_Thrown_Air: [[], [], []],
        State_Thrown_Ground: [[], [], []],
        // State_InUnDizzy: [[], [], []],
        // NEW_STATE_ADD_HERE
      };

      for (let abcIDX = 0; abcIDX < 3; abcIDX++) {
        for (let frame = 0; frame < CLIP_LENGTH; frame++) {
          // Being_Hit
          (
            ((Knockdown_State)[abcIDX][frame] == 32)
            && ((HitStop)[abcIDX][frame] > 0)
          )
            ? newStatesObj.State_Being_Hit[abcIDX].push(1)
            : newStatesObj.State_Being_Hit[abcIDX].push(0);
          // "Flying_Screen_Air"
          (
            ((FlyingScreen)[abcIDX][frame] == 1)
            && ((Knockdown_State)[abcIDX][frame] == 32)
            && ((Airborne)[abcIDX][frame] == 2)
          )
            ? newStatesObj.State_Flying_Screen_Air[abcIDX].push(1)
            : newStatesObj.State_Flying_Screen_Air[abcIDX].push(0);
          // "Flying_Screen_OTG"
          (
            ((FlyingScreen)[abcIDX][frame] == 1)
            && ((Knockdown_State)[abcIDX][frame] == 32)
            && ((Airborne)[abcIDX][frame] == 3)
          )
            ? newStatesObj.State_Flying_Screen_OTG[abcIDX].push(1)
            : newStatesObj.State_Flying_Screen_OTG[abcIDX].push(0);
          // "FS_Install_1"
          (
            ((FSI_Points)[abcIDX][frame] == 8)
            || ((FSI_Points)[abcIDX][frame] == 9)
          )
            ? newStatesObj.State_FS_Install_1[abcIDX].push(1)
            : newStatesObj.State_FS_Install_1[abcIDX].push(0);
          // "FS_Install_2"
          (
            ((FSI_Points)[abcIDX][frame] > 9)
          )
            ? newStatesObj.State_FS_Install_2[abcIDX].push(1)
            : newStatesObj.State_FS_Install_2[abcIDX].push(0);
          // "NJ_Air"
          (
            ((Airborne)[abcIDX][frame] == 2)
            && ((Knockdown_State)[abcIDX][frame] == 3)
            && ((SJ_Counter)[abcIDX][frame] == 0)
          )
            ? newStatesObj.State_NJ_Air[abcIDX].push(1)
            : newStatesObj.State_NJ_Air[abcIDX].push(0);
          // "NJ_Rising
          (
            ((Airborne)[abcIDX][frame] == 0)
            && ((Knockdown_State)[abcIDX][frame] == 2)
            && ((SJ_Counter)[abcIDX][frame] == 0)
          )
            ? newStatesObj.State_NJ_Rising[abcIDX].push(1)
            : newStatesObj.State_NJ_Rising[abcIDX].push(0);
          // "OTG_Extra_Stun"
          (
            ((Knockdown_State)[abcIDX][frame] == 23)
            && (((Airborne)[abcIDX][frame] == 3))
          )
            ? newStatesObj.State_OTG_Extra_Stun[abcIDX].push(1)
            : newStatesObj.State_OTG_Extra_Stun[abcIDX].push(0);

          // "OTG_Forced_Stun"
          (
            ((Knockdown_State)[abcIDX][frame] == 32)
            && (((Airborne)[abcIDX][frame] == 3))
          )
            ? newStatesObj.State_OTG_Forced_Stun[abcIDX].push(1)
            : newStatesObj.State_OTG_Forced_Stun[abcIDX].push(0);
          // "OTG_Hit"
          (
            ((Action_Flags)[abcIDX][frame] == 0)
            && ((Airborne)[abcIDX][frame] == 3)
            && (((Knockdown_State)[abcIDX][frame] == 32))
          )
            ? newStatesObj.State_OTG_Hit[abcIDX].push(1)
            : newStatesObj.State_OTG_Hit[abcIDX].push(0);
          // "OTG_Roll_Invincible"
          (
            ((Action_Flags)[abcIDX][frame] == 2)
            && ((Airborne)[abcIDX][frame] == 1)
            && (((Attack_Immune)[abcIDX][frame] == 1)
              && ((Knockdown_State)[abcIDX][frame] == 17))
          )
            ? newStatesObj.State_OTG_Roll_Invincible[abcIDX].push(1)
            : newStatesObj.State_OTG_Roll_Invincible[abcIDX].push(0);

          // "OTG_Roll_Stunned"
          (
            ((Action_Flags)[abcIDX][frame] == 1)
            && ((Airborne)[abcIDX][frame] == 3)
            && (((Knockdown_State)[abcIDX][frame] == 32))
          )
            ? newStatesObj.State_OTG_Roll_Stunned[abcIDX].push(1)
            : newStatesObj.State_OTG_Roll_Stunned[abcIDX].push(0);
          // "ProxBlock_Air"
          (
            ((Is_Prox_Block)[abcIDX][frame] == 6)
            && ((Knockdown_State)[abcIDX][frame] == 19)
          )
            ? newStatesObj.State_ProxBlock_Air[abcIDX].push(1)
            : newStatesObj.State_ProxBlock_Air[abcIDX].push(0);
          // "ProxBlock_Ground"
          (
            ((Is_Prox_Block)[abcIDX][frame] == 5)
            && ((Knockdown_State)[abcIDX][frame] == 18)
          )
            ? newStatesObj.State_ProxBlock_Ground[abcIDX].push(1)
            : newStatesObj.State_ProxBlock_Ground[abcIDX].push(0);
          // "Pushblock_Air"
          (
            ((Block_Meter)[abcIDX][frame] > 0)
            && ((Animation_Timer_Main)[abcIDX][frame] < 28)
            && ((Is_Prox_Block)[abcIDX][frame] == 6)
            && ((Action_Flags)[abcIDX][frame] == 2)
          )
            ? newStatesObj.State_Pushblock_Air[abcIDX].push(1)
            : newStatesObj.State_Pushblock_Air[abcIDX].push(0);
          // "Pushblock_Ground"
          (
            ((Block_Meter)[abcIDX][frame] > 0)
            && ((Animation_Timer_Main)[abcIDX][frame] < 28)
            && ((Is_Prox_Block)[abcIDX][frame] == 5)
            && (((Action_Flags)[abcIDX][frame] == 3))
          )
            ? newStatesObj.State_Pushblock_Ground[abcIDX].push(1)
            : newStatesObj.State_Pushblock_Ground[abcIDX].push(0);
          // "Rising_Invincibility"
          (
            ((Airborne)[abcIDX][frame] == 0)
            && ((Attack_Immune)[abcIDX][frame] == 1)
            && ((Knockdown_State)[abcIDX][frame] == 17)
          )
            ? newStatesObj.State_Rising_Invincibility[abcIDX].push(1)
            : newStatesObj.State_Rising_Invincibility[abcIDX].push(0);
          // "SJ_Air"
          (
            ((Airborne)[abcIDX][frame] == 2)
            && ((Knockdown_State)[abcIDX][frame] == 14)
            && ((SJ_Counter)[abcIDX][frame] == 1)
          )
            ? newStatesObj.State_SJ_Air[abcIDX].push(1)
            : newStatesObj.State_SJ_Air[abcIDX].push(0);
          // "SJ_Counter"
          (
            ((SJ_Counter)[abcIDX][frame] == 2)
          )
            ? newStatesObj.State_SJ_Counter[abcIDX].push(1)
            : newStatesObj.State_SJ_Counter[abcIDX].push(0);
          // "Stun"
          (
            ((Knockdown_State)[abcIDX][frame] == 32)
            && ((Is_Prox_Block)[abcIDX][frame] == 13)
          )
            ? newStatesObj.State_Stun[abcIDX].push(1)
            : newStatesObj.State_Stun[abcIDX].push(0);
          // "Tech_Hit"
          (
            ((Knockdown_State)[abcIDX][frame] == 27)
          )
            ? newStatesObj.State_Tech_Hit[abcIDX].push(1)
            : newStatesObj.State_Tech_Hit[abcIDX].push(0);
          // "Thrown_Air"
          (
            ((Airborne)[abcIDX][frame] == 2)
            && ((Knockdown_State)[abcIDX][frame] == 31)
            && ((Is_Prox_Block)[abcIDX][frame] == 16)
          )
            ? newStatesObj.State_Thrown_Air[abcIDX].push(1)
            : newStatesObj.State_Thrown_Air[abcIDX].push(0);
          // "Thrown_Ground"
          (
            ((Airborne)[abcIDX][frame] == 0)
            && ((Knockdown_State)[abcIDX][frame] == 31)
            && ((Is_Prox_Block)[abcIDX][frame] == 16)
          )
            ? newStatesObj.State_Thrown_Ground[abcIDX].push(1)
            : newStatesObj.State_Thrown_Ground[abcIDX].push(0);
          // // "Undizzy"
          // (
          //   ((Attack_Immune)[abcIDX][frame] == 2)
          //   && ((Knockdown_State)[abcIDX][frame] == 32)
          //   && ((Dizzy)[abcIDX][frame] == 80)
          //   && ((Dizzy_Reset_Timer)[abcIDX][frame] == 60)
          // )
          //   ? newStatesObj.State_Thrown_Ground[abcIDX].push(1)
          //   : newStatesObj.State_Thrown_Ground[abcIDX].push(0);
          // "NEW_STATE_ADD_NAME_HERE" (its name in comments)
          // NEW_STATE_ADD_HERE

          // Increase the consecutive 1s by 1.
          let counter = 0;
          for (const stateObj in Object.entries(newStatesObj)) {
            // eslint-disable-next-line no-loop-func
            Object.values(newStatesObj)[stateObj][abcIDX].forEach((element, index) => {
              if (element == 0) {
                counter = 0;
                return 0;
                // return Object.values(allDataObject)[stateDataEntryI][playerSlotI][index];
              }
              counter += 1;
              Object.values(newStatesObj)[stateObj][abcIDX][index] = counter;
              return Object.values(newStatesObj)[stateObj][abcIDX][index + counter];
            });
          }
        }
        // Write the files if they don't already exist
        for (let state = 0; state < Object.entries(newStatesObj).length; state++) {
          const tempFile = `${DIR_OUTPATH}${p1OrP2}_${Object.keys(newStatesObj)[state]}.js`;
          if (!fs.existsSync(tempFile)) {
            fs.promises.writeFile(
              tempFile,
              `var result = [];\n${JSON.stringify(Object.values(newStatesObj)[state])
                .replace('[[', 'result[0] = [')
                .replace(',[', '\nresult[1] = [')
                .replace(',[', '\nresult[2] = [')
                .replace(']]', ']')
                .replace(/]$/gm, '];')
                .replace(/"/gm, '\'')}`,
              'utf8',
              (err) => {
                if (err) throw err;
              },
            );
          }
          // else {
          //   // console.log(`File ${tempFile.split('/').pop()} already exists. Skipping...`);
          //   continue;
          // }
        }
      }
    }
  }
}
