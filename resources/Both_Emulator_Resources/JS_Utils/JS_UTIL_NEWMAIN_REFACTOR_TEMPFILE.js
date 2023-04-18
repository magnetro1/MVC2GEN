/* eslint-disable */
const DO_ROM_FILES = false; // Do or Skip ROM logic files
/**
 * @description Writes State-Files that count and increment consecutive true values. 
 * Search for "NEW_STATE_ADD_HERE" across the function to append address fetches and new states.
 */
function writeNewStates() {
  // Temps for switching P1 and P2
  let tempPlayerValue, tempPlayerString;
  // Temps for ROM data
  let tempROMCounter = 0;
  let tempROMSwitch = 0;
  // P1 and P2
  for (tempPlayerValue = 1; tempPlayerValue < 3; tempPlayerValue++) {
    tempPlayerValue == 1 ? tempPlayerString = 'P1' : tempPlayerString = 'P2';

    // Fetches relevant SINGLE addresses for State-Logic-Checking
    var getAction_Flags = writePlayerMemory(tempPlayerString, 'Action_Flags', 0);
    var getAir_Dash_Count = writePlayerMemory(tempPlayerString, 'Air_Dash_Count', 0);
    var getAirborne = writePlayerMemory(tempPlayerString, 'Airborne', 0);
    var getAnimation_Timer_Main = writePlayerMemory(tempPlayerString, 'Animation_Timer_Main', 0);
    var getAttack_Immune = writePlayerMemory(tempPlayerString, 'Attack_Immune', 0);
    var getAttack_Number = writePlayerMemory(tempPlayerString, 'Attack_Number', 0);
    var getBlock_Meter = writePlayerMemory(tempPlayerString, 'Block_Meter', 0);
    var getDizzy = writePlayerMemory(tempPlayerString, 'Dizzy', 0);
    var getDizzy_Reset_Timer = writePlayerMemory(tempPlayerString, 'Dizzy_Reset_Timer', 0);
    var getHitStop = writePlayerMemory(tempPlayerString, 'Hitstop2', 0);
    var getKnockdown_State = writePlayerMemory(tempPlayerString, 'Knockdown_State', 0);
    var getFlyingScreen = writePlayerMemory(tempPlayerString, 'FlyingScreen', 0);
    var getFSI_Points = writePlayerMemory(tempPlayerString, 'FlyingScreen', 0);
    var getIs_Prox_Block = writePlayerMemory(tempPlayerString, 'Is_Prox_Block', 0);
    var getNormal_Strength = writePlayerMemory(tempPlayerString, 'Normal_Strength', 0);
    var getPunchKick = writePlayerMemory(tempPlayerString, 'PunchKick', 0);
    var getSJ_Counter = writePlayerMemory(tempPlayerString, 'SJ_Counter', 0);
    var getY_Position_Arena = writePlayerMemory(tempPlayerString, 'Y_Position_Arena', 0);
    var getY_Position_From_Enemy = writePlayerMemory(tempPlayerString, 'Y_Position_From_Enemy', 0);
    var getY_VELOCITY = writePlayerMemory(tempPlayerString, 'Y_Velocity', 0);
    // NEW_STATE_ADD_HERE : Define your SINGLE get-Address here if you need something that isn't on the list.

    // List of files to be written. Will have prefix of P1_ or P2_
    var allNewStateObject =
    {
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
      State_InUnDizzy: [[], [], []],
      // NEW_STATE_ADD_HERE ⏫

      // ROM-Specific States | Will write if DO_ROM_FILES == true
      State_ROM_01_OpponentStateA: [[], [], []],
      State_ROM_02_ChoiceA: [[], [], []],
      State_ROM_03_InputA_LK: [[], [], []],
      State_ROM_03_InputA_MK: [[], [], []],
      State_ROM_04_ChoiceB: [[], [], []],
      State_ROM_05_ChoiceC: [[], [], []],
      State_ROM_05_ChoiceD: [[], [], []],
      State_ROM_06_InputB_AirDash: [[], [], []],
      State_ROM_07_ChoiceE: [[], [], []],
      State_ROM_08_InputC_DLK: [[], [], []],
      State_ROM_08_InputC_MK: [[], [], []],
      State_ROM_09_ChoiceF: [[], [], []],
    }

    // for each slot (abc) in a Player's side
    for (let playerSlotI = 0; playerSlotI < 3; playerSlotI++) {
      // for each frame in a clip
      for (let clipLen = 0; clipLen < CLIP_LENGTH; clipLen++) {
        // Pushing the boolean-results for each State. Example BeingHit result = [ 0,0,0,1,1,1,1,1... ]

        // Being_Hit
        (
          ((getKnockdown_State)[playerSlotI][clipLen] == 32)
          && ((getHitStop)[playerSlotI][clipLen] > 0)
        )
          ? allNewStateObject.State_Being_Hit[playerSlotI].push(1)
          : allNewStateObject.State_Being_Hit[playerSlotI].push(0);
        // "Flying_Screen_Air"
        (
          ((getFlyingScreen)[playerSlotI][clipLen] == 1)
          && ((getKnockdown_State)[playerSlotI][clipLen] == 32)
          && ((getAirborne)[playerSlotI][clipLen] == 2)
        )
          ? allNewStateObject.State_Flying_Screen_Air[playerSlotI].push(1)
          : allNewStateObject.State_Flying_Screen_Air[playerSlotI].push(0);
        // "Flying_Screen_OTG"
        (
          ((getFlyingScreen)[playerSlotI][clipLen] == 1)
          && ((getKnockdown_State)[playerSlotI][clipLen] == 32)
          && ((getAirborne)[playerSlotI][clipLen] == 3)
        )
          ? allNewStateObject.State_Flying_Screen_OTG[playerSlotI].push(1)
          : allNewStateObject.State_Flying_Screen_OTG[playerSlotI].push(0);
        // "FS_Install_1"
        (
          ((getFSI_Points)[playerSlotI][clipLen] == 8)
          || ((getFSI_Points)[playerSlotI][clipLen] == 9)
        )
          ? allNewStateObject.State_FS_Install_1[playerSlotI].push(1)
          : allNewStateObject.State_FS_Install_1[playerSlotI].push(0);
        // "FS_Install_2"
        (
          ((getFSI_Points)[playerSlotI][clipLen] > 9)
        )
          ? allNewStateObject.State_FS_Install_2[playerSlotI].push(1)
          : allNewStateObject.State_FS_Install_2[playerSlotI].push(0);
        // "NJ_Air"
        (
          ((getAirborne)[playerSlotI][clipLen] == 2)
          && ((getKnockdown_State)[playerSlotI][clipLen] == 3)
          && ((getSJ_Counter)[playerSlotI][clipLen] == 0)
        )
          ? allNewStateObject.State_NJ_Air[playerSlotI].push(1)
          : allNewStateObject.State_NJ_Air[playerSlotI].push(0);
        // "NJ_Rising
        (
          ((getAirborne)[playerSlotI][clipLen] == 0)
          && ((getKnockdown_State)[playerSlotI][clipLen] == 2)
          && ((getSJ_Counter)[playerSlotI][clipLen] == 0)
        )
          ? allNewStateObject.State_NJ_Rising[playerSlotI].push(1)
          : allNewStateObject.State_NJ_Rising[playerSlotI].push(0);
        // "OTG_Extra_Stun"
        (
          ((getKnockdown_State)[playerSlotI][clipLen] == 23)
          && (((getAirborne)[playerSlotI][clipLen] == 3))
        )
          ? allNewStateObject.State_OTG_Extra_Stun[playerSlotI].push(1)
          : allNewStateObject.State_OTG_Extra_Stun[playerSlotI].push(0);

        // "OTG_Forced_Stun"
        (
          ((getKnockdown_State)[playerSlotI][clipLen] == 32)
          && (((getAirborne)[playerSlotI][clipLen] == 3))
        )
          ? allNewStateObject.State_OTG_Forced_Stun[playerSlotI].push(1)
          : allNewStateObject.State_OTG_Forced_Stun[playerSlotI].push(0);
        // "OTG_Hit"
        (
          ((getAction_Flags)[playerSlotI][clipLen] == 0)
          && ((getAirborne)[playerSlotI][clipLen] == 3)
          && (((getKnockdown_State)[playerSlotI][clipLen] == 32))
        )
          ? allNewStateObject.State_OTG_Hit[playerSlotI].push(1)
          : allNewStateObject.State_OTG_Hit[playerSlotI].push(0);
        // "OTG_Roll_Invincible"
        (
          ((getAction_Flags)[playerSlotI][clipLen] == 2)
          && ((getAirborne)[playerSlotI][clipLen] == 1)
          && (((getAttack_Immune)[playerSlotI][clipLen] == 1)
            && ((getKnockdown_State)[playerSlotI][clipLen] == 17))
        )
          ? allNewStateObject.State_OTG_Roll_Invincible[playerSlotI].push(1)
          : allNewStateObject.State_OTG_Roll_Invincible[playerSlotI].push(0);

        // "OTG_Roll_Stunned"
        (
          ((getAction_Flags)[playerSlotI][clipLen] == 1)
          && ((getAirborne)[playerSlotI][clipLen] == 3)
          && (((getKnockdown_State)[playerSlotI][clipLen] == 32))
        )
          ? allNewStateObject.State_OTG_Roll_Stunned[playerSlotI].push(1)
          : allNewStateObject.State_OTG_Roll_Stunned[playerSlotI].push(0);
        // "ProxBlock_Air"
        (
          ((getIs_Prox_Block)[playerSlotI][clipLen] == 6)
          && ((getKnockdown_State)[playerSlotI][clipLen] == 19)
        )
          ? allNewStateObject.State_ProxBlock_Air[playerSlotI].push(1)
          : allNewStateObject.State_ProxBlock_Air[playerSlotI].push(0);
        // "ProxBlock_Ground"
        (
          ((getIs_Prox_Block)[playerSlotI][clipLen] == 5)
          && ((getKnockdown_State)[playerSlotI][clipLen] == 18)
        )
          ? allNewStateObject.State_ProxBlock_Ground[playerSlotI].push(1)
          : allNewStateObject.State_ProxBlock_Ground[playerSlotI].push(0);
        // "Pushblock_Air"
        (
          ((getBlock_Meter)[playerSlotI][clipLen] > 0)
          && ((getAnimation_Timer_Main)[playerSlotI][clipLen] < 28)
          && ((getIs_Prox_Block)[playerSlotI][clipLen] == 6)
          && ((getAction_Flags)[playerSlotI][clipLen] == 2)
        )
          ? allNewStateObject.State_Pushblock_Air[playerSlotI].push(1)
          : allNewStateObject.State_Pushblock_Air[playerSlotI].push(0);
        // "Pushblock_Ground"
        (
          ((getBlock_Meter)[playerSlotI][clipLen] > 0)
          && ((getAnimation_Timer_Main)[playerSlotI][clipLen] < 28)
          && ((getIs_Prox_Block)[playerSlotI][clipLen] == 5)
          && (((getAction_Flags)[playerSlotI][clipLen] == 3))
        )
          ? allNewStateObject.State_Pushblock_Ground[playerSlotI].push(1)
          : allNewStateObject.State_Pushblock_Ground[playerSlotI].push(0);
        // "Rising_Invincibility"
        (
          ((getAirborne)[playerSlotI][clipLen] == 0)
          && ((getAttack_Immune)[playerSlotI][clipLen] == 1)
          && ((getKnockdown_State)[playerSlotI][clipLen] == 17)
        )
          ? allNewStateObject.State_Rising_Invincibility[playerSlotI].push(1)
          : allNewStateObject.State_Rising_Invincibility[playerSlotI].push(0);
        // "SJ_Air"
        (
          ((getAirborne)[playerSlotI][clipLen] == 2)
          && ((getKnockdown_State)[playerSlotI][clipLen] == 14)
          && ((getSJ_Counter)[playerSlotI][clipLen] == 1)
        )
          ? allNewStateObject.State_SJ_Air[playerSlotI].push(1)
          : allNewStateObject.State_SJ_Air[playerSlotI].push(0);
        // "SJ_Counter"
        (
          ((getSJ_Counter)[playerSlotI][clipLen] == 2)
        )
          ? allNewStateObject.State_SJ_Counter[playerSlotI].push(1)
          : allNewStateObject.State_SJ_Counter[playerSlotI].push(0);
        // "Stun"
        (
          ((getKnockdown_State)[playerSlotI][clipLen] == 32)
          && ((getIs_Prox_Block)[playerSlotI][clipLen] == 13)
        )
          ? allNewStateObject.State_Stun[playerSlotI].push(1)
          : allNewStateObject.State_Stun[playerSlotI].push(0);
        // "Tech_Hit"
        (
          ((getKnockdown_State)[playerSlotI][clipLen] == 27)
        )
          ? allNewStateObject.State_Tech_Hit[playerSlotI].push(1)
          : allNewStateObject.State_Tech_Hit[playerSlotI].push(0);
        // "Thrown_Air"
        (
          ((getAirborne)[playerSlotI][clipLen] == 2)
          && ((getKnockdown_State)[playerSlotI][clipLen] == 31)
          && ((getIs_Prox_Block)[playerSlotI][clipLen] == 16)
        )
          ? allNewStateObject.State_Thrown_Air[playerSlotI].push(1)
          : allNewStateObject.State_Thrown_Air[playerSlotI].push(0);
        // "Thrown_Ground"
        (
          ((getAirborne)[playerSlotI][clipLen] == 0)
          && ((getKnockdown_State)[playerSlotI][clipLen] == 31)
          && ((getIs_Prox_Block)[playerSlotI][clipLen] == 16)
        )
          ? allNewStateObject.State_Thrown_Ground[playerSlotI].push(1)
          : allNewStateObject.State_Thrown_Ground[playerSlotI].push(0);
        // "Undizzy"
        (
          ((getAttack_Immune)[playerSlotI][clipLen] == 2)
          && ((getKnockdown_State)[playerSlotI][clipLen] == 32)
          && ((getIs_Prox_Block)[playerSlotI][clipLen] == 13)
          && ((getDizzy)[playerSlotI][clipLen] == 80)
          && ((getDizzy_Reset_Timer)[playerSlotI][clipLen] == 60)
        )
          ? allNewStateObject.State_Thrown_Ground[playerSlotI].push(1)
          : allNewStateObject.State_Thrown_Ground[playerSlotI].push(0);
        // "NEW_STATE_ADD_NAME_HERE" (its name in comments)
        // NEW_STATE_ADD_HERE

        // ROM-Specific State Checks

        // ROM_01_OpponentA. Goal is to find if dummy is high or low. Starting wth setting the end-point of a ROM Cycle.
        (getKnockdown_State)[playerSlotI][clipLen] == 4 // Magneto is landing from the air.
          ? allNewStateObject.State_ROM_01_OpponentStateA[playerSlotI].push(1)
          : allNewStateObject.State_ROM_01_OpponentStateA[playerSlotI].push(0);
        // "ROM_02_ChoiceA" (Did Magneto wait before doing a SJ.LK?)
        (((getKnockdown_State)[playerSlotI][clipLen] == 14)
          && ((getAir_Dash_Count)[playerSlotI][clipLen] == 0)
          && ((getY_Position_Arena)[playerSlotI][clipLen] <= 160))
          ? allNewStateObject.State_ROM_02_ChoiceA[playerSlotI].push(1)
          : allNewStateObject.State_ROM_02_ChoiceA[playerSlotI].push(0);
        // ROM_03_InputA
        // "ROM_03_InputA_LK"
        (((getNormal_Strength)[playerSlotI][clipLen] == 0)
          && ((getKnockdown_State)[playerSlotI][clipLen] == 20)
          && ((getPunchKick)[playerSlotI][clipLen] == 1))
          && (getAttack_Number)[playerSlotI][clipLen] == 15
          && ((getAir_Dash_Count)[playerSlotI][clipLen] == 0)
          ? allNewStateObject.State_ROM_03_InputA_LK[playerSlotI].push(1)
          : allNewStateObject.State_ROM_03_InputA_LK[playerSlotI].push(0);
        // "ROM_03_InputA_MK"
        (((getNormal_Strength)[playerSlotI][clipLen] == 1)
          && ((getKnockdown_State)[playerSlotI][clipLen] == 20)
          && ((getPunchKick)[playerSlotI][clipLen] == 1))
          && ((getAttack_Number)[playerSlotI][clipLen] == 16)
          && (getAir_Dash_Count)[playerSlotI][clipLen] == 0
          ? allNewStateObject.State_ROM_03_InputA_MK[playerSlotI].push(1)
          : allNewStateObject.State_ROM_03_InputA_MK[playerSlotI].push(0);
        // "ROM_04_ChoiceB" (Did Magneto wait before doing a SJ.MK after a SJ.LK?)
        (((getNormal_Strength)[playerSlotI][clipLen] == 0)
          && ((getKnockdown_State)[playerSlotI][clipLen] == 20)
          && ((getPunchKick)[playerSlotI][clipLen] == 1))
          && (getAttack_Number)[playerSlotI][clipLen] == 15
          && ((getAir_Dash_Count)[playerSlotI][clipLen] == 0)
          ? allNewStateObject.State_ROM_04_ChoiceB[playerSlotI].push(1)
          : allNewStateObject.State_ROM_04_ChoiceB[playerSlotI].push(0);
        // "ROM_05_ChoiceC" (Did Magneto wait before doing AirDashing after a SJ.LK?)
        (((getNormal_Strength)[playerSlotI][clipLen] == 0)
          && ((getKnockdown_State)[playerSlotI][clipLen] == 20)
          && ((getPunchKick)[playerSlotI][clipLen] == 1))
          && (getAttack_Number)[playerSlotI][clipLen] == 15
          && ((getAir_Dash_Count)[playerSlotI][clipLen] == 0)
          ? allNewStateObject.State_ROM_05_ChoiceC[playerSlotI].push(1)
          : allNewStateObject.State_ROM_05_ChoiceC[playerSlotI].push(0);
        // "ROM_05_ChoiceD" (Did Magneto wait before doing AirDashing after a SJ.MK?)
        (((getNormal_Strength)[playerSlotI][clipLen] == 1)
          && ((getKnockdown_State)[playerSlotI][clipLen] == 20)
          && ((getPunchKick)[playerSlotI][clipLen] == 1))
          && (getAttack_Number)[playerSlotI][clipLen] == 16
          && ((getAir_Dash_Count)[playerSlotI][clipLen] == 0)
          ? allNewStateObject.State_ROM_05_ChoiceD[playerSlotI].push(1)
          : allNewStateObject.State_ROM_05_ChoiceD[playerSlotI].push(0);
        // "ROM_06_InputB_AirDash"
        ((getAir_Dash_Count)[playerSlotI][clipLen] == 1)
          ? allNewStateObject.State_ROM_06_InputB_AirDash[playerSlotI].push(1)
          : allNewStateObject.State_ROM_06_InputB_AirDash[playerSlotI].push(0);
        // // "ROM_07_ChoiceE" (Did Magneto wait after AirDashing before doing a SJ.DLK?)
        ((getKnockdown_State)[playerSlotI][clipLen] == 26) // Magneto is Air Dash
          ? allNewStateObject.State_ROM_07_ChoiceE[playerSlotI].push(1)
          : allNewStateObject.State_ROM_07_ChoiceE[playerSlotI].push(0);
        // // "ROM_08_InputC_DLK"
        (((getNormal_Strength)[playerSlotI][clipLen] == 0)
          && ((getKnockdown_State)[playerSlotI][clipLen] == 20)
          && ((getPunchKick)[playerSlotI][clipLen] == 1))
          && ((getAttack_Number)[playerSlotI][clipLen] == 18)
          && (getAir_Dash_Count)[playerSlotI][clipLen] == 1
          ? allNewStateObject.State_ROM_08_InputC_DLK[playerSlotI].push(1)
          : allNewStateObject.State_ROM_08_InputC_DLK[playerSlotI].push(0);
        // // "ROM_08_InputC_MK"
        (((getNormal_Strength)[playerSlotI][clipLen] == 1)
          && ((getKnockdown_State)[playerSlotI][clipLen] == 20)
          && ((getPunchKick)[playerSlotI][clipLen] == 1))
          && ((getAttack_Number)[playerSlotI][clipLen] == 16)
          && (getAir_Dash_Count)[playerSlotI][clipLen] == 1
          ? allNewStateObject.State_ROM_08_InputC_MK[playerSlotI].push(1)
          : allNewStateObject.State_ROM_08_InputC_MK[playerSlotI].push(0);
        // "ROM_09_ChoiceF" (Did Magneto wait before doing a SJ.MK after a SJ.DLK?)
        (((getNormal_Strength)[playerSlotI][clipLen] == 0) // Weak
          && ((getKnockdown_State)[playerSlotI][clipLen] == 20) // Normal Attacks
          && ((getPunchKick)[playerSlotI][clipLen] == 1))  // Medium
          && (getAttack_Number)[playerSlotI][clipLen] == 18 // DLK
          && ((getAir_Dash_Count)[playerSlotI][clipLen] == 1) // Air Dash = true
          ? allNewStateObject.State_ROM_09_ChoiceF[playerSlotI].push(1)
          : allNewStateObject.State_ROM_09_ChoiceF[playerSlotI].push(0);
      } // clipLen Scope

      // Count | Increase each consecutive "1" by 1. Ex: "1,1,1,1,1" becomes "1,2,3,4,5" until they hit 0.
      // Applies to ROM cases as well!
      var counter = 0;

      for (let stateDataEntryI in Object.entries(allNewStateObject)) {
        Object.values(allNewStateObject)[stateDataEntryI][playerSlotI].forEach((element, index) => {
          if (element == 0) {
            counter = 0
            return 0;
            // return Object.values(allDataObject)[stateDataEntryI][playerSlotI][index];
          }
          else {
            Object.values(allNewStateObject)[stateDataEntryI][playerSlotI][index] = (element + counter);
            counter++
            return Object.values(allNewStateObject)[stateDataEntryI][playerSlotI][index + counter]
          }
        });
      }

      // StartROMStuff
      /*AttackNumber
        12: j.LP
        13: j.MP
        14: j.HP
        15: j.LK
        16: j.MK
        17: j.HK
        18: J.DLK
      */
      // 01_Opponent State A Setup. Set Loop point for 01_OpponentStateA (Magneto lands from his Super Jump)
      const ROM_OPPONENTSTATES =
        [
          Object.values(allNewStateObject.State_ROM_01_OpponentStateA),
        ];
      // console.log(ROM_OPPONENTSTATES);
      for (let romFile in ROM_OPPONENTSTATES) {
        for (let clipLen = 0; clipLen < CLIP_LENGTH; clipLen++) {
          if ((getAirborne)[playerSlotI][clipLen] == 0) {
            ROM_OPPONENTSTATES[romFile][playerSlotI][clipLen] = 65535;
          }
          else if ((getY_VELOCITY)[playerSlotI][clipLen] == 0) {
            ROM_OPPONENTSTATES[romFile][playerSlotI][clipLen] = 65535;
          }
        }
        // for (let clipLen = 0; clipLen < CLIP_LENGTH; clipLen++)
        // {
        //   if (ROM_OPPONENTSTATES[romFile][playerSlotI][clipLen] == 1)
        //   {
        //     ROM_OPPONENTSTATES[romFile][playerSlotI][clipLen] = 65535;
        //   }
        // }
      };

      for (let romFile in ROM_OPPONENTSTATES) {
        // Checking when we are Rising-To-SuperJump (before we wait or not wait)
        for (let clipLen = 0; clipLen < CLIP_LENGTH; clipLen++) {
          ((getKnockdown_State)[playerSlotI][clipLen] == 13) // 13: "Rising to Super Jump",
            ? ROM_OPPONENTSTATES[romFile][playerSlotI][clipLen] = 255 // Set to 255 to indicate that we are Rising-To-SuperJump
            : ROM_OPPONENTSTATES[romFile][playerSlotI][clipLen] = ROM_OPPONENTSTATES[romFile][playerSlotI][clipLen];
        }
        // Checking when we are Rising-to-SuperJump AND the Enemy's distance being HIGHER to the ground
        for (let clipLen = 0; clipLen < CLIP_LENGTH; clipLen++) {
          ((getKnockdown_State)[playerSlotI][clipLen] == 13) && ((getY_Position_From_Enemy)[playerSlotI][clipLen] >= 140)
            ? ROM_OPPONENTSTATES[romFile][playerSlotI][clipLen] = 888 // Turns 255 to 888 (high)
            : ROM_OPPONENTSTATES[romFile][playerSlotI][clipLen] = ROM_OPPONENTSTATES[romFile][playerSlotI][clipLen];
        }
        // Checking when we are Rising-to-SuperJump AND the Enemy's distance being LOWER to the ground
        for (let clipLen = 0; clipLen < CLIP_LENGTH; clipLen++) {
          ((getKnockdown_State)[playerSlotI][clipLen] == 13) && ((getY_Position_From_Enemy)[playerSlotI][clipLen] <= 139)
            ? ROM_OPPONENTSTATES[romFile][playerSlotI][clipLen] = 777 // Turns 255 to 777 (low)
            : ROM_OPPONENTSTATES[romFile][playerSlotI][clipLen] = ROM_OPPONENTSTATES[romFile][playerSlotI][clipLen];
        }

        // Setting Booleans for ROM_OpponentStateA results per ROM cycle.
        // High Air
        let AirSwitch = 0;
        for (var clipLen = 0; clipLen < CLIP_LENGTH; clipLen++) {
          if (ROM_OPPONENTSTATES[romFile][playerSlotI][clipLen] == 888) {
            AirSwitch = 1;
            ROM_OPPONENTSTATES[romFile][playerSlotI][clipLen] = "High"; // High
          }
          else if (AirSwitch == 1) {
            if (ROM_OPPONENTSTATES[romFile][playerSlotI][clipLen] != 65535) {
              ROM_OPPONENTSTATES[romFile][playerSlotI][clipLen] = "High";
            }
            else if (ROM_OPPONENTSTATES[romFile][playerSlotI][clipLen] == 65535) {
              AirSwitch = 0;
            }
          }
        }
        // Low Air
        AirSwitch = 0;
        for (var clipLen = 0; clipLen < CLIP_LENGTH; clipLen++) {
          if (ROM_OPPONENTSTATES[romFile][playerSlotI][clipLen] == 777) {
            AirSwitch = 1;
            ROM_OPPONENTSTATES[romFile][playerSlotI][clipLen] = "Low";
          }
          else if (AirSwitch == 1) {
            if (ROM_OPPONENTSTATES[romFile][playerSlotI][clipLen] != 65535) {
              ROM_OPPONENTSTATES[romFile][playerSlotI][clipLen] = "Low";
            }
            else if (ROM_OPPONENTSTATES[romFile][playerSlotI][clipLen] == 65535) {
              AirSwitch = 0;
            }
          }
        }
      }

      // 03_InputsA , 06_InputsB , 09_InputsC Setup
      // All Inputs during ROM infinite
      const ROM_INPUTS = [
        Object.values(allNewStateObject.State_ROM_03_InputA_LK),
        Object.values(allNewStateObject.State_ROM_03_InputA_MK),
        Object.values(allNewStateObject.State_ROM_06_InputB_AirDash),
        Object.values(allNewStateObject.State_ROM_08_InputC_DLK),
        Object.values(allNewStateObject.State_ROM_08_InputC_MK),
      ];
      // Setting the end-point of a ROM Cycle.
      for (const romFile in ROM_INPUTS) {
        for (var clipLen = 0; clipLen < CLIP_LENGTH; clipLen++) {
          if ((getAirborne)[playerSlotI][clipLen] == 0) {
            ROM_INPUTS[romFile][playerSlotI][clipLen] = 65535;
          }
          else if ((getY_VELOCITY)[playerSlotI][clipLen] == 0) {
            ROM_INPUTS[romFile][playerSlotI][clipLen] = 65535;
          }
        }
        // Sets the rest of the ROM cycle to active or inactive.
        var GroundSwitch = 0;
        for (var clipLen = 0; clipLen < CLIP_LENGTH; clipLen++) {
          if (ROM_INPUTS[romFile][playerSlotI][clipLen] == 1) // Started an input (air)
          {
            GroundSwitch = 1;
            ROM_INPUTS[romFile][playerSlotI][clipLen] = 1;
          }
          else if (GroundSwitch == 1) {
            if (ROM_INPUTS[romFile][playerSlotI][clipLen] != 65535) // if NOT grounded
            {
              ROM_INPUTS[romFile][playerSlotI][clipLen] = 1;
            }
            else if (ROM_INPUTS[romFile][playerSlotI][clipLen] == 65535) // On the ground; stop attacking
            {
              GroundSwitch = 0;
            }
          }
        }
      }

      // 04_ChoiceB (time: LK -> MK)
      var ROM_CHOICEB = Object.values(allNewStateObject.State_ROM_04_ChoiceB);
      for (var arrayWithROMData in ROM_CHOICEB)// 3 arrays
      {
        // Find Grounded state for ROM loops
        for (var clipLen = 0; clipLen < CLIP_LENGTH; clipLen++) {
          if (((getAirborne)[arrayWithROMData][clipLen] == 0)) {
            ROM_CHOICEB[arrayWithROMData][clipLen] = 65535;
          }
        }
        var GroundSwitch = 0
        for (var clipLen = 0; clipLen < CLIP_LENGTH; clipLen++) {
          if ((ROM_CHOICEB[arrayWithROMData][clipLen] != 65535) && (ROM_CHOICEB[arrayWithROMData][clipLen] != 0)) {
            GroundSwitch = 1;
            ROM_CHOICEB[arrayWithROMData][clipLen] = 1;
          }
          else if (GroundSwitch == 1) {
            if (ROM_CHOICEB[arrayWithROMData][clipLen] != 65535) // if NOT grounded
            {
              ROM_CHOICEB[arrayWithROMData][clipLen] = 1; // my ROM cycle is still going
            }
            else if (ROM_CHOICEB[arrayWithROMData][clipLen] == 65535) // On the ground; stop attacking
            {
              GroundSwitch = 0;
            }
          }
        }
        // Label the LKs & MKs
        for (var clipLen = 0; clipLen < CLIP_LENGTH; clipLen++) {
          if (ROM_CHOICEB[arrayWithROMData][clipLen] == 1) {
            // Am I MK?
            if (((getNormal_Strength)[arrayWithROMData][clipLen] == 1) && ((getAir_Dash_Count)[arrayWithROMData][clipLen] == 0)) {
              ROM_CHOICEB[arrayWithROMData][clipLen] = `MK`;
            }
            else if (((getNormal_Strength)[arrayWithROMData][clipLen] == 0) && ((getAir_Dash_Count)[arrayWithROMData][clipLen] == 0)) {
              ROM_CHOICEB[arrayWithROMData][clipLen] = `LK`;
            }
            else if (((getAir_Dash_Count)[arrayWithROMData][clipLen] == 1) && ((getKnockdown_State)[arrayWithROMData][clipLen] != 20)) {
              ROM_CHOICEB[arrayWithROMData][clipLen] = 0;
            }
          }
        }
        // Count the frames of LKs using tempCounter
        for (var clipLen = 0; clipLen < CLIP_LENGTH; clipLen++) {
          if (ROM_CHOICEB[arrayWithROMData][clipLen] == `LK`) {
            tempROMCounter += 1;
          }
          // Stop on encountering a MK
          else if (ROM_CHOICEB[arrayWithROMData][clipLen] == `MK`) // We hit a MK
          {
            // Lookahead
            for (let positiveI = 0; positiveI < CLIP_LENGTH; positiveI++) {
              // Everything until 65535 is = tempCounter
              if (ROM_CHOICEB[arrayWithROMData][clipLen + positiveI] != 65535) {
                tempROMSwitch = 1
                ROM_CHOICEB[arrayWithROMData][clipLen + positiveI] = tempROMCounter;
              }
              else if (tempROMSwitch == 1) {
                ROM_CHOICEB[arrayWithROMData][clipLen + positiveI] = tempROMCounter;
                if (ROM_CHOICEB[arrayWithROMData][clipLen + positiveI] == 65535) {
                  tempROMSwitch = 0;
                }
                break // lookahead is done, we hit 65535
              }
            }
            // Lookbehind, expect the number of LKs to equal the tempCounter value
            for (let negativeI = 1; negativeI < tempROMCounter + 1; negativeI++) {
              if (ROM_CHOICEB[arrayWithROMData][clipLen - negativeI] == `LK`) {
                ROM_CHOICEB[arrayWithROMData][clipLen - negativeI] = tempROMCounter;
              }
            }
          }
          else // Reset the counters
          {
            tempROMCounter = 0;
            tempROMSwitch = 0;
          }
        }
        // Clean up the values for AE Part1
        for (var clipLen = 0; clipLen < CLIP_LENGTH; clipLen++) {
          if ((ROM_CHOICEB[arrayWithROMData][clipLen] != 65535)
            && (ROM_CHOICEB[arrayWithROMData][clipLen] >= 0)
            && (ROM_CHOICEB[arrayWithROMData][clipLen] < 3)
            || (ROM_CHOICEB[arrayWithROMData][clipLen] == `LK`)) {
            ROM_CHOICEB[arrayWithROMData][clipLen] = 0;
          }
        }
        // Clean up the values for AE Part2
        for (var clipLen = 0; clipLen < CLIP_LENGTH; clipLen++) {
          if ((ROM_CHOICEB[arrayWithROMData][clipLen] != 65535)
            && (ROM_CHOICEB[arrayWithROMData][clipLen] >= 10)) {
            ROM_CHOICEB[arrayWithROMData][clipLen] = `Wait`
          }
          else if (((ROM_CHOICEB[arrayWithROMData][clipLen] != 65535))
            && (ROM_CHOICEB[arrayWithROMData][clipLen] < 10)
            && (ROM_CHOICEB[arrayWithROMData][clipLen] > 0)) {
            ROM_CHOICEB[arrayWithROMData][clipLen] = `No-Wait`
          }
        }
      }

      // 05_ChoiceC (time: LK -> AirDash)
      var ROM_CHOICEC = Object.values(allNewStateObject.State_ROM_05_ChoiceC);
      for (let arrayWithROMData in ROM_CHOICEC) // 3 arrays
      {
        // Find Grounded state for ROM loops
        for (var clipLen = 0; clipLen < CLIP_LENGTH; clipLen++) {
          if ((getAirborne)[arrayWithROMData][clipLen] == 0) {
            ROM_CHOICEC[arrayWithROMData][clipLen] = 65535;
          }
          else if ((getY_VELOCITY)[arrayWithROMData][clipLen] == 0) // if grounded
          {
            ROM_CHOICEC[arrayWithROMData][clipLen] = 65535;
          }
        }
        // Find 1 ROM Cycle after establishing ground state
        var GroundSwitch = 0
        for (var clipLen = 0; clipLen < CLIP_LENGTH; clipLen++) {
          if ((ROM_CHOICEC[arrayWithROMData][clipLen] != 65535) && (ROM_CHOICEC[arrayWithROMData][clipLen] != 0)) {
            GroundSwitch = 1;
            ROM_CHOICEC[arrayWithROMData][clipLen] = 1;
          }
          else if (GroundSwitch == 1) {
            if (ROM_CHOICEC[arrayWithROMData][clipLen] != 65535) // if NOT grounded
            {
              ROM_CHOICEC[arrayWithROMData][clipLen] = 1; // my ROM cycle is still going
            }
            else if (ROM_CHOICEC[arrayWithROMData][clipLen] == 65535) // On the ground; stop attacking
            {
              GroundSwitch = 0;
            }
          }
        }
        // Label the LKs & AirDashes
        for (var clipLen = 0; clipLen < CLIP_LENGTH; clipLen++) {
          if (ROM_CHOICEC[arrayWithROMData][clipLen] == 1) {
            // Am I AirDash
            if (((getNormal_Strength)[arrayWithROMData][clipLen] == 0) && ((getAir_Dash_Count)[arrayWithROMData][clipLen] == 1)) {
              ROM_CHOICEC[arrayWithROMData][clipLen] = `AirDash`;
            }
            else if (((getNormal_Strength)[arrayWithROMData][clipLen] == 0) && ((getAir_Dash_Count)[arrayWithROMData][clipLen] == 0)) {
              ROM_CHOICEC[arrayWithROMData][clipLen] = `LK`;
            }
            else if (((getNormal_Strength)[arrayWithROMData][clipLen] == 1) && ((getAir_Dash_Count)[arrayWithROMData][clipLen] == 0)) {
              ROM_CHOICEC[arrayWithROMData][clipLen] = `MK`; // First MK
            }
            else if (((getNormal_Strength)[arrayWithROMData][clipLen] == 1) && ((getAir_Dash_Count)[arrayWithROMData][clipLen] == 1)) {
              ROM_CHOICEC[arrayWithROMData][clipLen] = `AirDash`; // Second MK
            }
          }
        }
        // Count LKs before AirDash
        for (var clipLen = 0; clipLen < CLIP_LENGTH; clipLen++) {
          if (ROM_CHOICEC[arrayWithROMData][clipLen] == `LK`) {
            tempROMCounter += 1;
          }
          // Stop on encountering an AirDash
          else if (ROM_CHOICEC[arrayWithROMData][clipLen] == `AirDash`) // We hit an AirDash
          {
            // Lookahead
            for (let positiveI = 0; positiveI < CLIP_LENGTH; positiveI++) {
              // Everything until 65535 is = tempCounter
              if (ROM_CHOICEC[arrayWithROMData][clipLen + positiveI] != 65535) {
                tempROMSwitch = 1
                ROM_CHOICEC[arrayWithROMData][clipLen + positiveI] = tempROMCounter;
              }
              else if (tempROMSwitch == 1) {
                ROM_CHOICEC[arrayWithROMData][clipLen + positiveI] = tempROMCounter;
                if (ROM_CHOICEC[arrayWithROMData][clipLen + positiveI] == 65535) {
                  tempROMSwitch = 0;
                }
                break // lookahead is done, we hit 65535
              }
            }
            // Lookbehind, expect the number of LKs to equal the tempCounter value
            for (let negativeI = 1; negativeI < tempROMCounter + 1; negativeI++) {
              if (ROM_CHOICEC[arrayWithROMData][clipLen - negativeI] == `LK`) {
                ROM_CHOICEC[arrayWithROMData][clipLen - negativeI] = tempROMCounter;
              }
            }
          }
          else // Reset the counters
          {
            tempROMCounter = 0;
            tempROMSwitch = 0;
          }
        }
        // Clean up the values for AE Part1
        for (var clipLen = 0; clipLen < CLIP_LENGTH; clipLen++) {
          if ((ROM_CHOICEC[arrayWithROMData][clipLen] != 65535)
            && (ROM_CHOICEC[arrayWithROMData][clipLen] >= 18)) {
            ROM_CHOICEC[arrayWithROMData][clipLen] = `Wait`
          }
          else if (((ROM_CHOICEC[arrayWithROMData][clipLen] != 65535))
            && (ROM_CHOICEC[arrayWithROMData][clipLen] < 18)
            && (ROM_CHOICEC[arrayWithROMData][clipLen] > 1)) {
            ROM_CHOICEC[arrayWithROMData][clipLen] = `No-Wait`
          }
        }
        // Clean up the values for AE Part2
        for (var clipLen = 0; clipLen < CLIP_LENGTH; clipLen++) {
          if ((ROM_CHOICEC[arrayWithROMData][clipLen] == `LK`) || (ROM_CHOICEC[arrayWithROMData][clipLen] == `MK`)) {
            ROM_CHOICEC[arrayWithROMData][clipLen] = 0;
          }
        }
      } // end of 05_ChoiceC

      // 05_ChoiceD (time: MK -> AirDash)
      var ROM_CHOICED = Object.values(allNewStateObject.State_ROM_05_ChoiceD);
      for (let arrayWithROMData in ROM_CHOICED) // 3 arrays
      {
        // Find Grounded state for ROM loops
        for (var clipLen = 0; clipLen < CLIP_LENGTH; clipLen++) {
          if ((getAirborne)[arrayWithROMData][clipLen] == 0) {
            ROM_CHOICED[arrayWithROMData][clipLen] = 65535;
          }
          else if ((getY_VELOCITY)[arrayWithROMData][clipLen] == 0) {
            ROM_CHOICED[arrayWithROMData][clipLen] = 65535;
          }
        }
        // Find 1 ROM Cycle after establishing ground state
        var GroundSwitch = 0
        for (var clipLen = 0; clipLen < CLIP_LENGTH; clipLen++) {
          if ((ROM_CHOICED[arrayWithROMData][clipLen] != 65535) && (ROM_CHOICED[arrayWithROMData][clipLen] != 0)) // we are doing a MK
          {
            GroundSwitch = 1;
            ROM_CHOICED[arrayWithROMData][clipLen] = 1;
          }
          else if (GroundSwitch == 1) {
            if (ROM_CHOICED[arrayWithROMData][clipLen] != 65535) // if NOT grounded
            {
              ROM_CHOICED[arrayWithROMData][clipLen] = 1; // my ROM cycle is still going
            }
            else if (ROM_CHOICED[arrayWithROMData][clipLen] == 65535) // On the ground; stop attacking
            {
              GroundSwitch = 0;
            }
          }
        }
        // Label the MKs & AirDashes
        for (var clipLen = 0; clipLen < CLIP_LENGTH; clipLen++) {
          if (ROM_CHOICED[arrayWithROMData][clipLen] == 1) {
            if (((getNormal_Strength)[arrayWithROMData][clipLen] == 1) && ((getAir_Dash_Count)[arrayWithROMData][clipLen] == 1)) // AirDash during MK
            {
              ROM_CHOICED[arrayWithROMData][clipLen] = `AirDash`;
            }
            else if (((getNormal_Strength)[arrayWithROMData][clipLen] == 0) && ((getAir_Dash_Count)[arrayWithROMData][clipLen] == 0)) {
              ROM_CHOICED[arrayWithROMData][clipLen] = `LK`; // First LK
            }
            else if (((getNormal_Strength)[arrayWithROMData][clipLen] == 1) && ((getAir_Dash_Count)[arrayWithROMData][clipLen] == 0)) {
              ROM_CHOICED[arrayWithROMData][clipLen] = `MK`; // First MK
            }
            else if (((getNormal_Strength)[arrayWithROMData][clipLen] == 1) && ((getAir_Dash_Count)[arrayWithROMData][clipLen] == 1)) {
              ROM_CHOICED[arrayWithROMData][clipLen] = `AirDash`; // Second MK
            }
          }
        }
        // Count MKs before AirDash
        for (var clipLen = 0; clipLen < CLIP_LENGTH; clipLen++) {
          if (ROM_CHOICED[arrayWithROMData][clipLen] == `MK`) {
            tempROMCounter += 1;
          }
          // Stop on encountering an AirDash
          else if (ROM_CHOICED[arrayWithROMData][clipLen] == `AirDash`) // We hit an AirDash
          {
            // Lookahead
            for (let positiveI = 0; positiveI < CLIP_LENGTH; positiveI++) {
              // Everything until 65535 is = tempCounter
              if (ROM_CHOICED[arrayWithROMData][clipLen + positiveI] != 65535) {
                tempROMSwitch = 1
                ROM_CHOICED[arrayWithROMData][clipLen + positiveI] = tempROMCounter;
              }
              else if (tempROMSwitch == 1) {
                ROM_CHOICED[arrayWithROMData][clipLen + positiveI] = tempROMCounter;
                if (ROM_CHOICED[arrayWithROMData][clipLen + positiveI] == 65535) {
                  tempROMSwitch = 0;
                }
                break // lookahead is done, we hit 65535
              }
            }
            // Lookbehind, expect the number of MKs to equal the tempCounter value. Wipe the values until we hit the ground.
            for (let negativeI = 1; negativeI < tempROMCounter + 1; negativeI++) {
              if (ROM_CHOICED[arrayWithROMData][clipLen - negativeI] == `MK`) {
                ROM_CHOICED[arrayWithROMData][clipLen - negativeI] = tempROMCounter;
              }
            }
          }
          else // Reset the counters
          {
            tempROMCounter = 0;
            tempROMSwitch = 0;
          }
        }
        // Clean up the values for AE Part1
        for (var clipLen = 0; clipLen < CLIP_LENGTH; clipLen++) {
          if ((ROM_CHOICED[arrayWithROMData][clipLen] != 65535)
            && (ROM_CHOICED[arrayWithROMData][clipLen] >= 18)) {
            ROM_CHOICED[arrayWithROMData][clipLen] = `Wait`
          }
          else if (((ROM_CHOICED[arrayWithROMData][clipLen] != 65535))
            && (ROM_CHOICED[arrayWithROMData][clipLen] < 18)
            && (ROM_CHOICED[arrayWithROMData][clipLen] > 1)) {
            ROM_CHOICED[arrayWithROMData][clipLen] = `No-Wait`
          }
        }
        // Clean up the values for AE Part2
        for (var clipLen = 0; clipLen < CLIP_LENGTH; clipLen++) {
          if ((ROM_CHOICED[arrayWithROMData][clipLen] == `LK`) || (ROM_CHOICED[arrayWithROMData][clipLen] == `MK`)) {
            ROM_CHOICED[arrayWithROMData][clipLen] = 0;
          }
        }
      } // end of 05_ChoiceD

      // 07_ChoiceE (AirDash to DLK time)
      var ROM_CHOICEE = Object.values(allNewStateObject.State_ROM_07_ChoiceE);
      for (let arrayWithROMData in ROM_CHOICEE) // 3 arrays
      {
        // Find Grounded state for ROM loops
        for (var clipLen = 0; clipLen < CLIP_LENGTH; clipLen++) {
          if ((getAirborne)[arrayWithROMData][clipLen] == 0) {
            ROM_CHOICEE[arrayWithROMData][clipLen] = 65535;
          }
          else if ((getY_VELOCITY)[arrayWithROMData][clipLen] == 0) // if grounded
          {
            ROM_CHOICEE[arrayWithROMData][clipLen] = 65535;
          }
        }
        // Find 1 ROM Cycle after establishing ground state
        var GroundSwitch = 0
        for (var clipLen = 0; clipLen < CLIP_LENGTH; clipLen++) {
          if ((ROM_CHOICEE[arrayWithROMData][clipLen] != 65535) && (ROM_CHOICEE[arrayWithROMData][clipLen] != 0)) // we are air dashing
          {
            GroundSwitch = 1;
            ROM_CHOICEE[arrayWithROMData][clipLen] = 1;
          }
          else if (GroundSwitch == 1) {
            if (ROM_CHOICEE[arrayWithROMData][clipLen] != 65535) // if NOT grounded
            {
              ROM_CHOICEE[arrayWithROMData][clipLen] = 1; // my ROM cycle is still going
            }
            else if (ROM_CHOICEE[arrayWithROMData][clipLen] == 65535) // On the ground; stop attacking
            {
              GroundSwitch = 0;
            }
          }
        }
        for (var clipLen = 0; clipLen < CLIP_LENGTH; clipLen++) {
          if (ROM_CHOICEE[arrayWithROMData][clipLen] == 1) {
            if ((getKnockdown_State)[arrayWithROMData][clipLen] == 26) {
              tempROMCounter += 1;
              ROM_CHOICEE[arrayWithROMData][clipLen] = tempROMCounter;
            }
            else if (ROM_CHOICEE[arrayWithROMData][clipLen] == 1) {
              // look behind and replace the values until 0 with tempCounter
              for (let negativeI = 1; negativeI < CLIP_LENGTH; negativeI++) // look behind until we hit 0
              {
                if (ROM_CHOICEE[arrayWithROMData][clipLen - negativeI] != 0) {
                  ROM_CHOICEE[arrayWithROMData][clipLen - negativeI] = tempROMCounter;
                }
                else if (ROM_CHOICEE[arrayWithROMData][clipLen - negativeI] == 0) {
                  break
                }
              }
              // look ahead until we hit 65535
              for (let positiveI = 0; positiveI < CLIP_LENGTH; positiveI++) {
                if (ROM_CHOICEE[arrayWithROMData][clipLen + positiveI] != 65535) {
                  let newTempNumber = ROM_CHOICEE[arrayWithROMData][clipLen - 1]
                  ROM_CHOICEE[arrayWithROMData][clipLen - 1] = newTempNumber;
                  ROM_CHOICEE[arrayWithROMData][clipLen + positiveI] = newTempNumber;
                }
                else if (ROM_CHOICEE[arrayWithROMData][clipLen + positiveI] == 65535) {
                  tempROMCounter = 1;
                  break
                }
              }
            }
          }
        }
        // Clean up the values for AE Part1
        for (let clipLen = 0; clipLen < CLIP_LENGTH; clipLen++) {
          if ((ROM_CHOICEE[arrayWithROMData][clipLen] != 65535)
            && (ROM_CHOICEE[arrayWithROMData][clipLen] > 0)
            && (ROM_CHOICEE[arrayWithROMData][clipLen] <= 3)) {
            ROM_CHOICEE[arrayWithROMData][clipLen] = `No-Wait`
          }
          else if (((ROM_CHOICEE[arrayWithROMData][clipLen] != 65535))
            && (ROM_CHOICEE[arrayWithROMData][clipLen] > 3)) {
            ROM_CHOICEE[arrayWithROMData][clipLen] = `Wait`
          }
        }
      }
      // End of 07_ChoiceE

      // 09_ChoiceF (time: LK -> MK)
      var ROM_ChoiceF = Object.values(allNewStateObject.State_ROM_09_ChoiceF);
      for (const arrayWithROMData in ROM_ChoiceF) // 3 arrays
      {
        for (var clipLen = 0; clipLen < CLIP_LENGTH; clipLen++) {
          if ((getAirborne)[arrayWithROMData][clipLen] == 0) {
            ROM_ChoiceF[arrayWithROMData][clipLen] = 65535;
          }
          else if ((getY_VELOCITY)[arrayWithROMData][clipLen] == 0) // if grounded
          {
            ROM_ChoiceF[arrayWithROMData][clipLen] = 65535;
          }
        }
        var GroundSwitch = 0
        for (var clipLen = 0; clipLen < CLIP_LENGTH; clipLen++) {
          if ((ROM_ChoiceF[arrayWithROMData][clipLen] != 65535) && (ROM_ChoiceF[arrayWithROMData][clipLen] != 0)) {
            GroundSwitch = 1;
            ROM_ChoiceF[arrayWithROMData][clipLen] = 1;
          }
          else if (GroundSwitch == 1) {
            if (ROM_ChoiceF[arrayWithROMData][clipLen] != 65535) // if NOT grounded
            {
              ROM_ChoiceF[arrayWithROMData][clipLen] = 1; // my ROM cycle is still going
            }
            else if (ROM_ChoiceF[arrayWithROMData][clipLen] == 65535) // On the ground; stop attacking
            {
              GroundSwitch = 0;
            }
          }
        }

        // Label the LKs & MKs
        for (var clipLen = 0; clipLen < CLIP_LENGTH; clipLen++) {
          if (ROM_ChoiceF[arrayWithROMData][clipLen] == 1) {
            // Am I MK?
            if (((getNormal_Strength)[arrayWithROMData][clipLen] == 1)
              && ((getAttack_Number)[arrayWithROMData][clipLen] == 16)
              && ((getAir_Dash_Count)[arrayWithROMData][clipLen] == 1)) // MK
            {
              ROM_ChoiceF[arrayWithROMData][clipLen] = `MK`;
            }
            else if (((getAttack_Number)[arrayWithROMData][clipLen] == 18) && ((getNormal_Strength)[arrayWithROMData][clipLen] == 0) && ((getAir_Dash_Count)[arrayWithROMData][clipLen] == 1)) // DLK
            {
              ROM_ChoiceF[arrayWithROMData][clipLen] = `DLK`;
            }
          }
        }
        // Count the frames of LKs using tempCounter
        for (var clipLen = 0; clipLen < CLIP_LENGTH; clipLen++) {
          if (ROM_ChoiceF[arrayWithROMData][clipLen] == `DLK`) {
            tempROMCounter += 1;
          }
          // Stop on encountering a MK
          else if (ROM_ChoiceF[arrayWithROMData][clipLen] == `MK`) // We hit a MK
          {
            // Lookahead
            for (let positiveI = 0; positiveI < CLIP_LENGTH; positiveI++) // CLIP_LENGTH is used, but we will break out of the loop before it is reached
            {
              // Everything until 65535 is = tempCounter
              if (ROM_ChoiceF[arrayWithROMData][clipLen + positiveI] != 65535) {
                tempROMSwitch = 1
                ROM_ChoiceF[arrayWithROMData][clipLen + positiveI] = tempROMCounter;
              }
              else if (tempROMSwitch == 1) {
                ROM_ChoiceF[arrayWithROMData][clipLen + positiveI] = tempROMCounter;
                if (ROM_ChoiceF[arrayWithROMData][clipLen + positiveI] == 65535) {
                  tempROMSwitch = 0;
                }
                break // lookahead is done, we hit 65535
              }
            }
            // Lookbehind, expect the number of 2LKs to equal the tempCounter value
            for (let negativeI = 1; negativeI < tempROMCounter + 1; negativeI++) {
              if (ROM_ChoiceF[arrayWithROMData][clipLen - negativeI] == `DLK`) {
                ROM_ChoiceF[arrayWithROMData][clipLen - negativeI] = tempROMCounter;
              }
            }
          }
          else // Reset the counters
          {
            tempROMCounter = 0;
            tempROMSwitch = 0;
          }
        }
        // Clean up the values for AE Part1
        for (var clipLen = 0; clipLen < CLIP_LENGTH; clipLen++) {
          if ((ROM_ChoiceF[arrayWithROMData][clipLen] != 65535)
            && (ROM_ChoiceF[arrayWithROMData][clipLen] >= 0)
            && (ROM_ChoiceF[arrayWithROMData][clipLen] < 3))
          // || (arrStateROM_09_ChoiceF[arrayWithROMData][clipLen] == `DLK`))
          {
            ROM_ChoiceF[arrayWithROMData][clipLen] = 0;
          }
        }
        // Clean up the values for AE Part2
        for (var clipLen = 0; clipLen < CLIP_LENGTH; clipLen++) {
          if ((ROM_ChoiceF[arrayWithROMData][clipLen] != 65535)
            && (ROM_ChoiceF[arrayWithROMData][clipLen] >= 17)) {
            ROM_ChoiceF[arrayWithROMData][clipLen] = `Wait`
          }
          else if (((ROM_ChoiceF[arrayWithROMData][clipLen] != 65535))
            && (ROM_ChoiceF[arrayWithROMData][clipLen] < 17)
            && (ROM_ChoiceF[arrayWithROMData][clipLen] > 0)) {
            ROM_ChoiceF[arrayWithROMData][clipLen] = `No-Wait`
          }
        }
      } // End of 09_ChoiceF Scope

      // End ROMStuff End ROM Stuff

      // Write the files
      for (let stateFileIndex = 0; stateFileIndex < Object.entries(allNewStateObject).length; stateFileIndex++) {
        if (DO_ROM_FILES == false) {
          if (Object.keys(allNewStateObject)[stateFileIndex].toString().match('ROM')) {
            continue;
          }
        }
        fs.writeFileSync(`${DIR_OUTPATH}${tempPlayerString}_${Object.keys(allNewStateObject)[stateFileIndex]}.js`,
          `var result = []; ` + '\n', { encoding: 'utf8' });
      }

      // Append data arrays into files
      for (let stateFileDataIndex = 0; stateFileDataIndex < Object.entries(allNewStateObject).length; stateFileDataIndex++) {
        if (DO_ROM_FILES == false) {
          if (Object.keys(allNewStateObject)[stateFileDataIndex].toString().match('ROM')) {
            continue;
          }
        }

        fs.appendFileSync(`${DIR_OUTPATH}${tempPlayerString}_${Object.keys(allNewStateObject)[stateFileDataIndex]}.js`,
          JSON.stringify(Object.values(allNewStateObject)[stateFileDataIndex])
            .replace('[[', `result[0] = [`)
            .replace(',[', '\nresult[1] = [')
            .replace(',[', '\nresult[2] = [')
            .replace(']]', ']')
            .replace(/]$/gm, '];') // end of line close-bracket gets semi-colon
            .replace(/"/gm, '\'') // replace double-quotes with single-quotes
        );
      }
    }
  }
}
writeNewStates()

clipboard.writeSync(DIR_OUTPATH);
console.log(`Done processing ${knownName[csvFilesIDX]} ` || ``);

if ((knownName[csvFilesIDX + 1] == undefined) || (knownName[csvFilesIDX + 1] == null)) {
  console.log(`Done processing all files!`);
  // await sleep(SLEEP_AMOUNT);
  process.exit();
}
