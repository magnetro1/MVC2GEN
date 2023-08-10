          // if (nStateObj.State_Magneto_ROM_01_OpponentStateA != undefined) {
          //   const ROM_OPPONENTSTATES =
          //     [
          //       Object.values(nStateObj.State_Magneto_ROM_01_OpponentStateA),
          //     ];
          //   // console.log(ROM_OPPONENTSTATES);
          //   for (let romFile in ROM_OPPONENTSTATES) {
          //     for (let cLen = 0; cLen < CLIP_LENGTH; cLen++) {
          //       if ((pMemObject[`${p1P2_}Airborne`])[pABC][cLen] == 0) {
          //         ROM_OPPONENTSTATES[romFile][pABC][cLen] = 65535;
          //       }
          //       else if ((pMemObject[`${p1P2_}Y_Velocity`])[pABC][cLen] == 0) {
          //         ROM_OPPONENTSTATES[romFile][pABC][cLen] = 65535;
          //       }
          //     }
          //     // for (let cLen = 0; cLen < CLIP_LENGTH; cLen++)
          //     // {
          //     //   if (ROM_OPPONENTSTATES[romFile][pABC][cLen] == 1)
          //     //   {
          //     //     ROM_OPPONENTSTATES[romFile][pABC][cLen] = 65535;
          //     //   }
          //     // }
          //   };

          //   for (let romFile in ROM_OPPONENTSTATES) {
          //     // Checking when we are Rising-To-SuperJump (before we wait or not wait)
          //     for (let cLen = 0; cLen < CLIP_LENGTH; cLen++) {
          //       ((pMemObject[`${p1P2_}Knockdown_State`])[pABC][cLen] == 13) // 13: "Rising to Super Jump",
          //         ? ROM_OPPONENTSTATES[romFile][pABC][cLen] = 255 // Set to 255 to indicate that we are Rising-To-SuperJump
          //         : ROM_OPPONENTSTATES[romFile][pABC][cLen] = ROM_OPPONENTSTATES[romFile][pABC][cLen];
          //     }
          //     // Checking when we are Rising-to-SuperJump AND the Enemy's distance being HIGHER to the ground
          //     for (let cLen = 0; cLen < CLIP_LENGTH; cLen++) {
          //       ((pMemObject[`${p1P2_}Knockdown_State`])[pABC][cLen] == 13) && ((pMemObject[`${p1P2_}Y_Position_From_Enemy`])[pABC][cLen] >= 140)
          //         ? ROM_OPPONENTSTATES[romFile][pABC][cLen] = 888 // Turns 255 to 888 (high)
          //         : ROM_OPPONENTSTATES[romFile][pABC][cLen] = ROM_OPPONENTSTATES[romFile][pABC][cLen];
          //     }
          //     // Checking when we are Rising-to-SuperJump AND the Enemy's distance being LOWER to the ground
          //     for (let cLen = 0; cLen < CLIP_LENGTH; cLen++) {
          //       ((pMemObject[`${p1P2_}Knockdown_State`])[pABC][cLen] == 13) && ((pMemObject[`${p1P2_}Y_Position_From_Enemy`])[pABC][cLen] <= 139)
          //         ? ROM_OPPONENTSTATES[romFile][pABC][cLen] = 777 // Turns 255 to 777 (low)
          //         : ROM_OPPONENTSTATES[romFile][pABC][cLen] = ROM_OPPONENTSTATES[romFile][pABC][cLen];
          //     }

          //     // Setting Booleans for ROM_OpponentStateA results per ROM cycle.
          //     // High Air
          //     let AirSwitch = 0;
          //     for (var cLen = 0; cLen < CLIP_LENGTH; cLen++) {
          //       if (ROM_OPPONENTSTATES[romFile][pABC][cLen] == 888) {
          //         AirSwitch = 1;
          //         ROM_OPPONENTSTATES[romFile][pABC][cLen] = "High"; // High
          //       }
          //       else if (AirSwitch == 1) {
          //         if (ROM_OPPONENTSTATES[romFile][pABC][cLen] != 65535) {
          //           ROM_OPPONENTSTATES[romFile][pABC][cLen] = "High";
          //         }
          //         else if (ROM_OPPONENTSTATES[romFile][pABC][cLen] == 65535) {
          //           AirSwitch = 0;
          //         }
          //       }
          //     }
          //     // Low Air
          //     AirSwitch = 0;
          //     for (var cLen = 0; cLen < CLIP_LENGTH; cLen++) {
          //       if (ROM_OPPONENTSTATES[romFile][pABC][cLen] == 777) {
          //         AirSwitch = 1;
          //         ROM_OPPONENTSTATES[romFile][pABC][cLen] = "Low";
          //       }
          //       else if (AirSwitch == 1) {
          //         if (ROM_OPPONENTSTATES[romFile][pABC][cLen] != 65535) {
          //           ROM_OPPONENTSTATES[romFile][pABC][cLen] = "Low";
          //         }
          //         else if (ROM_OPPONENTSTATES[romFile][pABC][cLen] == 65535) {
          //           AirSwitch = 0;
          //         }
          //       }
          //     }
          //   }

          //   // 03_InputsA , 06_InputsB , 09_InputsC Setup
          //   // All Inputs during ROM infinite
          //   const ROM_INPUTS = [
          //     Object.values(nStateObj.State_Magneto_ROM_03_InputA_LK),
          //     Object.values(nStateObj.State_Magneto_ROM_03_InputA_MK),
          //     Object.values(nStateObj.State_Magneto_ROM_06_InputB_AirDash),
          //     Object.values(nStateObj.State_Magneto_ROM_08_InputC_DLK),
          //     Object.values(nStateObj.State_Magneto_ROM_08_InputC_MK),
          //   ];
          //   // Setting the end-point of a ROM Cycle.
          //   for (const romFile in ROM_INPUTS) {
          //     for (var cLen = 0; cLen < CLIP_LENGTH; cLen++) {
          //       if ((pMemObject[`${p1P2_}Airborne`])[pABC][cLen] == 0) {
          //         ROM_INPUTS[romFile][pABC][cLen] = 65535;
          //       }
          //       else if ((pMemObject[`${p1P2_}Y_Velocity`])[pABC][cLen] == 0) {
          //         ROM_INPUTS[romFile][pABC][cLen] = 65535;
          //       }
          //     }
          //     // Sets the rest of the ROM cycle to active or inactive.
          //     var GroundSwitch = 0;
          //     for (var cLen = 0; cLen < CLIP_LENGTH; cLen++) {
          //       if (ROM_INPUTS[romFile][pABC][cLen] == 1) // Started an input (air)
          //       {
          //         GroundSwitch = 1;
          //         ROM_INPUTS[romFile][pABC][cLen] = 1;
          //       }
          //       else if (GroundSwitch == 1) {
          //         if (ROM_INPUTS[romFile][pABC][cLen] != 65535) // if NOT grounded
          //         {
          //           ROM_INPUTS[romFile][pABC][cLen] = 1;
          //         }
          //         else if (ROM_INPUTS[romFile][pABC][cLen] == 65535) // On the ground; stop attacking
          //         {
          //           GroundSwitch = 0;
          //         }
          //       }
          //     }
          //   }

          //   // 04_ChoiceB (time: LK -> MK)
          //   var ROM_CHOICEB = Object.values(nStateObj.State_Magneto_ROM_04_ChoiceB);
          //   for (var arrayWithROMData in ROM_CHOICEB)// 3 arrays
          //   {
          //     // Find Grounded state for ROM loops
          //     for (var cLen = 0; cLen < CLIP_LENGTH; cLen++) {
          //       if (((pMemObject[`${p1P2_}Airborne`])[arrayWithROMData][cLen] == 0)) {
          //         ROM_CHOICEB[arrayWithROMData][cLen] = 65535;
          //       }
          //     }
          //     var GroundSwitch = 0
          //     for (var cLen = 0; cLen < CLIP_LENGTH; cLen++) {
          //       if ((ROM_CHOICEB[arrayWithROMData][cLen] != 65535)
          //         && (ROM_CHOICEB[arrayWithROMData][cLen] != 0)) {
          //         GroundSwitch = 1;
          //         ROM_CHOICEB[arrayWithROMData][cLen] = 1;
          //       }
          //       else if (GroundSwitch == 1) {
          //         if (ROM_CHOICEB[arrayWithROMData][cLen] != 65535) // if NOT grounded
          //         {
          //           ROM_CHOICEB[arrayWithROMData][cLen] = 1; // my ROM cycle is still going
          //         }
          //         else if (ROM_CHOICEB[arrayWithROMData][cLen] == 65535) // On the ground; stop attacking
          //         {
          //           GroundSwitch = 0;
          //         }
          //       }
          //     }
          //     // Label the LKs & MKs
          //     for (var cLen = 0; cLen < CLIP_LENGTH; cLen++) {
          //       if (ROM_CHOICEB[arrayWithROMData][cLen] == 1) {
          //         // Am I MK?
          //         if (((pMemObject[`${p1P2_}Normal_Strength`])[arrayWithROMData][cLen] == 1)
          //           && ((pMemObject[`${p1P2_}Air_Dash_Count`])[arrayWithROMData][cLen] == 0)) {
          //           ROM_CHOICEB[arrayWithROMData][cLen] = `MK`;
          //         }
          //         else if (((pMemObject[`${p1P2_}Normal_Strength`])[arrayWithROMData][cLen] == 0)
          //           && ((pMemObject[`${p1P2_}Air_Dash_Count`])[arrayWithROMData][cLen] == 0)) {
          //           ROM_CHOICEB[arrayWithROMData][cLen] = `LK`;
          //         }
          //         else if (((pMemObject[`${p1P2_}Air_Dash_Count`])[arrayWithROMData][cLen] == 1)
          //           && ((pMemObject[`${p1P2_}Knockdown_State`])[arrayWithROMData][cLen] != 20)) {
          //           ROM_CHOICEB[arrayWithROMData][cLen] = 0;
          //         }
          //       }
          //     }
          //     // Count the frames of LKs using tempCounter
          //     for (var cLen = 0; cLen < CLIP_LENGTH; cLen++) {
          //       if (ROM_CHOICEB[arrayWithROMData][cLen] == `LK`) {
          //         tempROMCounter += 1;
          //       }
          //       // Stop on encountering a MK
          //       else if (ROM_CHOICEB[arrayWithROMData][cLen] == `MK`) // We hit a MK
          //       {
          //         // Lookahead
          //         for (let positiveI = 0; positiveI < CLIP_LENGTH; positiveI++) {
          //           // Everything until 65535 is = tempCounter
          //           if (ROM_CHOICEB[arrayWithROMData][cLen + positiveI] != 65535) {
          //             tempROMSwitch = 1
          //             ROM_CHOICEB[arrayWithROMData][cLen + positiveI] = tempROMCounter;
          //           }
          //           else if (tempROMSwitch == 1) {
          //             ROM_CHOICEB[arrayWithROMData][cLen + positiveI] = tempROMCounter;
          //             if (ROM_CHOICEB[arrayWithROMData][cLen + positiveI] == 65535) {
          //               tempROMSwitch = 0;
          //             }
          //             break // lookahead is done, we hit 65535
          //           }
          //         }
          //         // Lookbehind, expect the number of LKs to equal the tempCounter value
          //         for (let negativeI = 1; negativeI < tempROMCounter + 1; negativeI++) {
          //           if (ROM_CHOICEB[arrayWithROMData][cLen - negativeI] == `LK`) {
          //             ROM_CHOICEB[arrayWithROMData][cLen - negativeI] = tempROMCounter;
          //           }
          //         }
          //       }
          //       else // Reset the counters
          //       {
          //         tempROMCounter = 0;
          //         tempROMSwitch = 0;
          //       }
          //     }
          //     // Clean up the values for AE Part1
          //     for (var cLen = 0; cLen < CLIP_LENGTH; cLen++) {
          //       if ((ROM_CHOICEB[arrayWithROMData][cLen] != 65535)
          //         && (ROM_CHOICEB[arrayWithROMData][cLen] >= 0)
          //         && (ROM_CHOICEB[arrayWithROMData][cLen] < 3)
          //         || (ROM_CHOICEB[arrayWithROMData][cLen] == `LK`)) {
          //         ROM_CHOICEB[arrayWithROMData][cLen] = 0;
          //       }
          //     }
          //     // Clean up the values for AE Part2
          //     for (var cLen = 0; cLen < CLIP_LENGTH; cLen++) {
          //       if ((ROM_CHOICEB[arrayWithROMData][cLen] != 65535)
          //         && (ROM_CHOICEB[arrayWithROMData][cLen] >= 10)) {
          //         ROM_CHOICEB[arrayWithROMData][cLen] = `Wait`
          //       }
          //       else if (((ROM_CHOICEB[arrayWithROMData][cLen] != 65535))
          //         && (ROM_CHOICEB[arrayWithROMData][cLen] < 10)
          //         && (ROM_CHOICEB[arrayWithROMData][cLen] > 0)) {
          //         ROM_CHOICEB[arrayWithROMData][cLen] = `No-Wait`
          //       }
          //     }
          //   }

          //   // 05_ChoiceC (time: LK -> AirDash)
          //   var ROM_CHOICEC = Object.values(nStateObj.State_Magneto_ROM_05_ChoiceC);
          //   for (let arrayWithROMData in ROM_CHOICEC) // 3 arrays
          //   {
          //     // Find Grounded state for ROM loops
          //     for (var cLen = 0; cLen < CLIP_LENGTH; cLen++) {
          //       if ((pMemObject[`${p1P2_}Airborne`])[arrayWithROMData][cLen] == 0) {
          //         ROM_CHOICEC[arrayWithROMData][cLen] = 65535;
          //       }
          //       else if ((pMemObject[`${p1P2_}Y_Velocity`])[arrayWithROMData][cLen] == 0) // if grounded
          //       {
          //         ROM_CHOICEC[arrayWithROMData][cLen] = 65535;
          //       }
          //     }
          //     // Find 1 ROM Cycle after establishing ground state
          //     var GroundSwitch = 0
          //     for (var cLen = 0; cLen < CLIP_LENGTH; cLen++) {
          //       if ((ROM_CHOICEC[arrayWithROMData][cLen] != 65535)
          //         && (ROM_CHOICEC[arrayWithROMData][cLen] != 0)) {
          //         GroundSwitch = 1;
          //         ROM_CHOICEC[arrayWithROMData][cLen] = 1;
          //       }
          //       else if (GroundSwitch == 1) {
          //         if (ROM_CHOICEC[arrayWithROMData][cLen] != 65535) // if NOT grounded
          //         {
          //           ROM_CHOICEC[arrayWithROMData][cLen] = 1; // my ROM cycle is still going
          //         }
          //         else if (ROM_CHOICEC[arrayWithROMData][cLen] == 65535) // On the ground; stop attacking
          //         {
          //           GroundSwitch = 0;
          //         }
          //       }
          //     }
          //     // Label the LKs & AirDashes
          //     for (var cLen = 0; cLen < CLIP_LENGTH; cLen++) {
          //       if (ROM_CHOICEC[arrayWithROMData][cLen] == 1) {
          //         // Am I AirDash
          //         if (((pMemObject[`${p1P2_}Normal_Strength`])[arrayWithROMData][cLen] == 0)
          //           && ((pMemObject[`${p1P2_}Air_Dash_Count`])[arrayWithROMData][cLen] == 1)) {
          //           ROM_CHOICEC[arrayWithROMData][cLen] = `AirDash`;
          //         }
          //         else if (((pMemObject[`${p1P2_}Normal_Strength`])[arrayWithROMData][cLen] == 0)
          //           && ((pMemObject[`${p1P2_}Air_Dash_Count`])[arrayWithROMData][cLen] == 0)) {
          //           ROM_CHOICEC[arrayWithROMData][cLen] = `LK`;
          //         }
          //         else if (((pMemObject[`${p1P2_}Normal_Strength`])[arrayWithROMData][cLen] == 1)
          //           && ((pMemObject[`${p1P2_}Air_Dash_Count`])[arrayWithROMData][cLen] == 0)) {
          //           ROM_CHOICEC[arrayWithROMData][cLen] = `MK`; // First MK
          //         }
          //         else if (((pMemObject[`${p1P2_}Normal_Strength`])[arrayWithROMData][cLen] == 1)
          //           && ((pMemObject[`${p1P2_}Air_Dash_Count`])[arrayWithROMData][cLen] == 1)) {
          //           ROM_CHOICEC[arrayWithROMData][cLen] = `AirDash`; // Second MK
          //         }
          //       }
          //     }
          //     // Count LKs before AirDash
          //     for (var cLen = 0; cLen < CLIP_LENGTH; cLen++) {
          //       if (ROM_CHOICEC[arrayWithROMData][cLen] == `LK`) {
          //         tempROMCounter += 1;
          //       }
          //       // Stop on encountering an AirDash
          //       else if (ROM_CHOICEC[arrayWithROMData][cLen] == `AirDash`) // We hit an AirDash
          //       {
          //         // Lookahead
          //         for (let positiveI = 0; positiveI < CLIP_LENGTH; positiveI++) {
          //           // Everything until 65535 is = tempCounter
          //           if (ROM_CHOICEC[arrayWithROMData][cLen + positiveI] != 65535) {
          //             tempROMSwitch = 1
          //             ROM_CHOICEC[arrayWithROMData][cLen + positiveI] = tempROMCounter;
          //           }
          //           else if (tempROMSwitch == 1) {
          //             ROM_CHOICEC[arrayWithROMData][cLen + positiveI] = tempROMCounter;
          //             if (ROM_CHOICEC[arrayWithROMData][cLen + positiveI] == 65535) {
          //               tempROMSwitch = 0;
          //             }
          //             break // lookahead is done, we hit 65535
          //           }
          //         }
          //         // Lookbehind, expect the number of LKs to equal the tempCounter value
          //         for (let negativeI = 1; negativeI < tempROMCounter + 1; negativeI++) {
          //           if (ROM_CHOICEC[arrayWithROMData][cLen - negativeI] == `LK`) {
          //             ROM_CHOICEC[arrayWithROMData][cLen - negativeI] = tempROMCounter;
          //           }
          //         }
          //       }
          //       else // Reset the counters
          //       {
          //         tempROMCounter = 0;
          //         tempROMSwitch = 0;
          //       }
          //     }
          //     // Clean up the values for AE Part1
          //     for (var cLen = 0; cLen < CLIP_LENGTH; cLen++) {
          //       if ((ROM_CHOICEC[arrayWithROMData][cLen] != 65535)
          //         && (ROM_CHOICEC[arrayWithROMData][cLen] >= 18)) {
          //         ROM_CHOICEC[arrayWithROMData][cLen] = `Wait`
          //       }
          //       else if (((ROM_CHOICEC[arrayWithROMData][cLen] != 65535))
          //         && (ROM_CHOICEC[arrayWithROMData][cLen] < 18)
          //         && (ROM_CHOICEC[arrayWithROMData][cLen] > 1)) {
          //         ROM_CHOICEC[arrayWithROMData][cLen] = `No-Wait`
          //       }
          //     }
          //     // Clean up the values for AE Part2
          //     for (var cLen = 0; cLen < CLIP_LENGTH; cLen++) {
          //       if ((ROM_CHOICEC[arrayWithROMData][cLen] == `LK`)
          //         || (ROM_CHOICEC[arrayWithROMData][cLen] == `MK`)) {
          //         ROM_CHOICEC[arrayWithROMData][cLen] = 0;
          //       }
          //     }
          //   } // end of 05_ChoiceC

          //   // 05_ChoiceD (time: MK -> AirDash)
          //   var ROM_CHOICED = Object.values(nStateObj.State_Magneto_ROM_05_ChoiceD);
          //   for (let arrayWithROMData in ROM_CHOICED) // 3 arrays
          //   {
          //     // Find Grounded state for ROM loops
          //     for (var cLen = 0; cLen < CLIP_LENGTH; cLen++) {
          //       if ((pMemObject[`${p1P2_}Airborne`])[arrayWithROMData][cLen] == 0) {
          //         ROM_CHOICED[arrayWithROMData][cLen] = 65535;
          //       }
          //       else if ((pMemObject[`${p1P2_}Y_Velocity`])[arrayWithROMData][cLen] == 0) {
          //         ROM_CHOICED[arrayWithROMData][cLen] = 65535;
          //       }
          //     }
          //     // Find 1 ROM Cycle after establishing ground state
          //     var GroundSwitch = 0
          //     for (var cLen = 0; cLen < CLIP_LENGTH; cLen++) {
          //       if ((ROM_CHOICED[arrayWithROMData][cLen] != 65535)
          //         && (ROM_CHOICED[arrayWithROMData][cLen] != 0)) // we are doing a MK
          //       {
          //         GroundSwitch = 1;
          //         ROM_CHOICED[arrayWithROMData][cLen] = 1;
          //       }
          //       else if (GroundSwitch == 1) {
          //         if (ROM_CHOICED[arrayWithROMData][cLen] != 65535) // if NOT grounded
          //         {
          //           ROM_CHOICED[arrayWithROMData][cLen] = 1; // my ROM cycle is still going
          //         }
          //         else if (ROM_CHOICED[arrayWithROMData][cLen] == 65535) // On the ground; stop attacking
          //         {
          //           GroundSwitch = 0;
          //         }
          //       }
          //     }
          //     // Label the MKs & AirDashes
          //     for (var cLen = 0; cLen < CLIP_LENGTH; cLen++) {
          //       if (ROM_CHOICED[arrayWithROMData][cLen] == 1) {
          //         if (((pMemObject[`${p1P2_}Normal_Strength`])[arrayWithROMData][cLen] == 1)
          //           && ((pMemObject[`${p1P2_}Air_Dash_Count`])[arrayWithROMData][cLen] == 1)) // AirDash during MK
          //         {
          //           ROM_CHOICED[arrayWithROMData][cLen] = `AirDash`;
          //         }
          //         else if (((pMemObject[`${p1P2_}Normal_Strength`])[arrayWithROMData][cLen] == 0)
          //           && ((pMemObject[`${p1P2_}Air_Dash_Count`])[arrayWithROMData][cLen] == 0)) {
          //           ROM_CHOICED[arrayWithROMData][cLen] = `LK`; // First LK
          //         }
          //         else if (((pMemObject[`${p1P2_}Normal_Strength`])[arrayWithROMData][cLen] == 1)
          //           && ((pMemObject[`${p1P2_}Air_Dash_Count`])[arrayWithROMData][cLen] == 0)) {
          //           ROM_CHOICED[arrayWithROMData][cLen] = `MK`; // First MK
          //         }
          //         else if (((pMemObject[`${p1P2_}Normal_Strength`])[arrayWithROMData][cLen] == 1)
          //           && ((pMemObject[`${p1P2_}Air_Dash_Count`])[arrayWithROMData][cLen] == 1)) {
          //           ROM_CHOICED[arrayWithROMData][cLen] = `AirDash`; // Second MK
          //         }
          //       }
          //     }
          //     // Count MKs before AirDash
          //     for (var cLen = 0; cLen < CLIP_LENGTH; cLen++) {
          //       if (ROM_CHOICED[arrayWithROMData][cLen] == `MK`) {
          //         tempROMCounter += 1;
          //       }
          //       // Stop on encountering an AirDash
          //       else if (ROM_CHOICED[arrayWithROMData][cLen] == `AirDash`) // We hit an AirDash
          //       {
          //         // Lookahead
          //         for (let positiveI = 0; positiveI < CLIP_LENGTH; positiveI++) {
          //           // Everything until 65535 is = tempCounter
          //           if (ROM_CHOICED[arrayWithROMData][cLen + positiveI] != 65535) {
          //             tempROMSwitch = 1
          //             ROM_CHOICED[arrayWithROMData][cLen + positiveI] = tempROMCounter;
          //           }
          //           else if (tempROMSwitch == 1) {
          //             ROM_CHOICED[arrayWithROMData][cLen + positiveI] = tempROMCounter;
          //             if (ROM_CHOICED[arrayWithROMData][cLen + positiveI] == 65535) {
          //               tempROMSwitch = 0;
          //             }
          //             break // lookahead is done, we hit 65535
          //           }
          //         }
          //         // Look-behind, expect the number of MKs to equal the tempCounter value. 
          //         // Wipe the values until we hit the ground.
          //         for (let negativeI = 1; negativeI < tempROMCounter + 1; negativeI++) {
          //           if (ROM_CHOICED[arrayWithROMData][cLen - negativeI] == `MK`) {
          //             ROM_CHOICED[arrayWithROMData][cLen - negativeI] = tempROMCounter;
          //           }
          //         }
          //       }
          //       else // Reset the counters
          //       {
          //         tempROMCounter = 0;
          //         tempROMSwitch = 0;
          //       }
          //     }
          //     // Clean up the values for AE Part1
          //     for (var cLen = 0; cLen < CLIP_LENGTH; cLen++) {
          //       if ((ROM_CHOICED[arrayWithROMData][cLen] != 65535)
          //         && (ROM_CHOICED[arrayWithROMData][cLen] >= 18)) {
          //         ROM_CHOICED[arrayWithROMData][cLen] = `Wait`
          //       }
          //       else if (((ROM_CHOICED[arrayWithROMData][cLen] != 65535))
          //         && (ROM_CHOICED[arrayWithROMData][cLen] < 18)
          //         && (ROM_CHOICED[arrayWithROMData][cLen] > 1)) {
          //         ROM_CHOICED[arrayWithROMData][cLen] = `No-Wait`
          //       }
          //     }
          //     // Clean up the values for AE Part2
          //     for (var cLen = 0; cLen < CLIP_LENGTH; cLen++) {
          //       if ((ROM_CHOICED[arrayWithROMData][cLen] == `LK`)
          //         || (ROM_CHOICED[arrayWithROMData][cLen] == `MK`)) {
          //         ROM_CHOICED[arrayWithROMData][cLen] = 0;
          //       }
          //     }
          //   } // end of 05_ChoiceD

          //   // 07_ChoiceE(AirDash to DLK time)
          //   var ROM_CHOICEE = Object.values(nStateObj.State_Magneto_ROM_07_ChoiceE);
          //   for (let arrayWithROMData in ROM_CHOICEE) // 3 arrays
          //   {
          //     // Find Grounded state for ROM loops
          //     for (var cLen = 0; cLen < CLIP_LENGTH; cLen++) {
          //       if ((pMemObject[`${p1P2_}Airborne`])[arrayWithROMData][cLen] == 0) {
          //         ROM_CHOICEE[arrayWithROMData][cLen] = 65535;
          //       }
          //       else if ((pMemObject[`${p1P2_}Y_Velocity`])[arrayWithROMData][cLen] == 0) // if grounded
          //       {
          //         ROM_CHOICEE[arrayWithROMData][cLen] = 65535;
          //       }
          //     }
          //     //   // Find 1 ROM Cycle after establishing ground state
          //     var GroundSwitch = 0
          //     for (var cLen = 0; cLen < CLIP_LENGTH; cLen++) {
          //       if ((ROM_CHOICEE[arrayWithROMData][cLen] != 65535)
          //         && (ROM_CHOICEE[arrayWithROMData][cLen] != 0)) // we are air dashing
          //       {
          //         GroundSwitch = 1;
          //         ROM_CHOICEE[arrayWithROMData][cLen] = 1;
          //       }
          //       else if (GroundSwitch == 1) {
          //         if (ROM_CHOICEE[arrayWithROMData][cLen] != 65535) // if NOT grounded
          //         {
          //           ROM_CHOICEE[arrayWithROMData][cLen] = 1; // my ROM cycle is still going
          //         }
          //         else if (ROM_CHOICEE[arrayWithROMData][cLen] == 65535) // On the ground; stop attacking
          //         {
          //           GroundSwitch = 0;
          //         }
          //       }
          //     }
          //     //   for (var cLen = 0; cLen < CLIP_LENGTH; cLen++) {
          //     //     if (ROM_CHOICEE[arrayWithROMData][cLen] == 1) {
          //     //       if ((pMemObject[`${p1P2_}Knockdown_State`])[arrayWithROMData][cLen] == 26) {
          //     //         tempROMCounter += 1;
          //     //         ROM_CHOICEE[arrayWithROMData][cLen] = tempROMCounter;
          //     //       }
          //     //       else if (ROM_CHOICEE[arrayWithROMData][cLen] == 1) {
          //     //         // look behind and replace the values until 0 with tempCounter
          //     //         for (let negativeI = 1; negativeI < CLIP_LENGTH; negativeI++) // look behind until we hit 0
          //     //         {
          //     //           if (ROM_CHOICEE[arrayWithROMData][cLen - negativeI] != 0) {
          //     //             ROM_CHOICEE[arrayWithROMData][cLen - negativeI] = tempROMCounter;
          //     //           }
          //     //           else if (ROM_CHOICEE[arrayWithROMData][cLen - negativeI] == 0) {
          //     //             break
          //     //           }
          //     //         }
          //     //         // look ahead until we hit 65535
          //     //         for (let positiveI = 0; positiveI < CLIP_LENGTH; positiveI++) {
          //     //           if (ROM_CHOICEE[arrayWithROMData][cLen + positiveI] != 65535) {
          //     //             let newTempNumber = ROM_CHOICEE[arrayWithROMData][cLen - 1]
          //     //             ROM_CHOICEE[arrayWithROMData][cLen - 1] = newTempNumber;
          //     //             ROM_CHOICEE[arrayWithROMData][cLen + positiveI] = newTempNumber;
          //     //           }
          //     //           else if (ROM_CHOICEE[arrayWithROMData][cLen + positiveI] == 65535) {
          //     //             tempROMCounter = 1;
          //     //             break
          //     //           }
          //     //         }
          //     //       }
          //     //     }
          //     //   }
          //     //   // Clean up the values for AE Part1
          //     //   for (let cLen = 0; cLen < CLIP_LENGTH; cLen++) {
          //     //     if ((ROM_CHOICEE[arrayWithROMData][cLen] != 65535)
          //     //       && (ROM_CHOICEE[arrayWithROMData][cLen] > 0)
          //     //       && (ROM_CHOICEE[arrayWithROMData][cLen] <= 3)) {
          //     //       ROM_CHOICEE[arrayWithROMData][cLen] = `No-Wait`
          //     //     }
          //     //     else if (((ROM_CHOICEE[arrayWithROMData][cLen] != 65535))
          //     //       && (ROM_CHOICEE[arrayWithROMData][cLen] > 3)) {
          //     //       ROM_CHOICEE[arrayWithROMData][cLen] = `Wait`
          //     //     }
          //     //   }
          //   }
          //   // // // End of 07_ChoiceE

          //   // 09_ChoiceF (time: LK -> MK)
          //   var ROM_ChoiceF = Object.values(nStateObj.State_Magneto_ROM_09_ChoiceF);
          //   for (const arrayWithROMData in ROM_ChoiceF) // 3 arrays
          //   {
          //     for (var cLen = 0; cLen < CLIP_LENGTH; cLen++) {
          //       if ((pMemObject[`${p1P2_}Airborne`])[arrayWithROMData][cLen] == 0) {
          //         ROM_ChoiceF[arrayWithROMData][cLen] = 65535;
          //       }
          //       else if ((pMemObject[`${p1P2_}Y_Velocity`])[arrayWithROMData][cLen] == 0) // if grounded
          //       {
          //         ROM_ChoiceF[arrayWithROMData][cLen] = 65535;
          //       }
          //     }
          //     var GroundSwitch = 0
          //     for (var cLen = 0; cLen < CLIP_LENGTH; cLen++) {
          //       if ((ROM_ChoiceF[arrayWithROMData][cLen] != 65535)
          //         && (ROM_ChoiceF[arrayWithROMData][cLen] != 0)) {
          //         GroundSwitch = 1;
          //         ROM_ChoiceF[arrayWithROMData][cLen] = 1;
          //       }
          //       else if (GroundSwitch == 1) {
          //         if (ROM_ChoiceF[arrayWithROMData][cLen] != 65535) // if NOT grounded
          //         {
          //           ROM_ChoiceF[arrayWithROMData][cLen] = 1; // my ROM cycle is still going
          //         }
          //         else if (ROM_ChoiceF[arrayWithROMData][cLen] == 65535) // On the ground; stop attacking
          //         {
          //           GroundSwitch = 0;
          //         }
          //       }
          //     }

          //     // Label the LKs & MKs
          //     for (var cLen = 0; cLen < CLIP_LENGTH; cLen++) {
          //       if (ROM_ChoiceF[arrayWithROMData][cLen] == 1) {
          //         // Am I MK?
          //         if (((pMemObject[`${p1P2_}Normal_Strength`])[arrayWithROMData][cLen] == 1)
          //           && ((pMemObject[`${p1P2_}Attack_Number`])[arrayWithROMData][cLen] == 16)
          //           && ((pMemObject[`${p1P2_}Air_Dash_Count`])[arrayWithROMData][cLen] == 1)) // MK
          //         {
          //           ROM_ChoiceF[arrayWithROMData][cLen] = `MK`;
          //         }
          //         else if (((pMemObject[`${p1P2_}Attack_Number`])[arrayWithROMData][cLen] == 18)
          //           && ((pMemObject[`${p1P2_}Normal_Strength`])[arrayWithROMData][cLen] == 0)
          //           && ((pMemObject[`${p1P2_}Air_Dash_Count`])[arrayWithROMData][cLen] == 1)) // DLK
          //         {
          //           ROM_ChoiceF[arrayWithROMData][cLen] = `DLK`;
          //         }
          //       }
          //     }
          //     // Count the frames of LKs using tempCounter
          //     for (var cLen = 0; cLen < CLIP_LENGTH; cLen++) {
          //       if (ROM_ChoiceF[arrayWithROMData][cLen] == `DLK`) {
          //         tempROMCounter += 1;
          //       }
          //       // Stop on encountering a MK
          //       else if (ROM_ChoiceF[arrayWithROMData][cLen] == `MK`) // We hit a MK
          //       {
          //         // Lookahead
          //         for (let positiveI = 0; positiveI < CLIP_LENGTH; positiveI++) // CLIP_LENGTH is used, but we will break out of the loop before it is reached
          //         {
          //           // Everything until 65535 is = tempCounter
          //           if (ROM_ChoiceF[arrayWithROMData][cLen + positiveI] != 65535) {
          //             tempROMSwitch = 1
          //             ROM_ChoiceF[arrayWithROMData][cLen + positiveI] = tempROMCounter;
          //           }
          //           else if (tempROMSwitch == 1) {
          //             ROM_ChoiceF[arrayWithROMData][cLen + positiveI] = tempROMCounter;
          //             if (ROM_ChoiceF[arrayWithROMData][cLen + positiveI] == 65535) {
          //               tempROMSwitch = 0;
          //             }
          //             break // lookahead is done, we hit 65535
          //           }
          //         }
          //         // Lookbehind, expect the number of 2LKs to equal the tempCounter value
          //         for (let negativeI = 1; negativeI < tempROMCounter + 1; negativeI++) {
          //           if (ROM_ChoiceF[arrayWithROMData][cLen - negativeI] == `DLK`) {
          //             ROM_ChoiceF[arrayWithROMData][cLen - negativeI] = tempROMCounter;
          //           }
          //         }
          //       }
          //       else // Reset the counters
          //       {
          //         tempROMCounter = 0;
          //         tempROMSwitch = 0;
          //       }
          //     }
          //     // Clean up the values for AE Part1
          //     for (var cLen = 0; cLen < CLIP_LENGTH; cLen++) {
          //       if ((ROM_ChoiceF[arrayWithROMData][cLen] != 65535)
          //         && (ROM_ChoiceF[arrayWithROMData][cLen] >= 0)
          //         && (ROM_ChoiceF[arrayWithROMData][cLen] < 3))
          //       // || (arrStateROM_09_ChoiceF[arrayWithROMData][cLen] == `DLK`))
          //       {
          //         ROM_ChoiceF[arrayWithROMData][cLen] = 0;
          //       }
          //     }
          //     // Clean up the values for AE Part2
          //     for (var cLen = 0; cLen < CLIP_LENGTH; cLen++) {
          //       if ((ROM_ChoiceF[arrayWithROMData][cLen] != 65535)
          //         && (ROM_ChoiceF[arrayWithROMData][cLen] >= 17)) {
          //         ROM_ChoiceF[arrayWithROMData][cLen] = `Wait`
          //       }
          //       else if (((ROM_ChoiceF[arrayWithROMData][cLen] != 65535))
          //         && (ROM_ChoiceF[arrayWithROMData][cLen] < 17)
          //         && (ROM_ChoiceF[arrayWithROMData][cLen] > 0)) {
          //         ROM_ChoiceF[arrayWithROMData][cLen] = `No-Wait`
          //       }
          //     }
          //   } // End of 09_ChoiceF Scope
          // } // End ROMStuff End ROM Stuff
