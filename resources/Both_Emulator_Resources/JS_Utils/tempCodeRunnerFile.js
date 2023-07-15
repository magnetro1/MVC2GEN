// 09_ChoiceF (time: LK -> MK)
        var ROM_ChoiceF = Object.values(nStateObj.State_Magneto_ROM_09_ChoiceF);
        for (const arrayWithROMData in ROM_ChoiceF) // 3 arrays
        {
          for (var cLen = 0; cLen < CLIP_LENGTH; cLen++) {
            if ((Airborne)[arrayWithROMData][cLen] == 0) {
              ROM_ChoiceF[arrayWithROMData][cLen] = 65535;
            }
            else if ((Y_Velocity)[arrayWithROMData][cLen] == 0) // if grounded
            {
              ROM_ChoiceF[arrayWithROMData][cLen] = 65535;
            }
          }
          var GroundSwitch = 0
          for (var cLen = 0; cLen < CLIP_LENGTH; cLen++) {
            if ((ROM_ChoiceF[arrayWithROMData][cLen] != 65535)
              && (ROM_ChoiceF[arrayWithROMData][cLen] != 0)) {
              GroundSwitch = 1;
              ROM_ChoiceF[arrayWithROMData][cLen] = 1;
            }
            else if (GroundSwitch == 1) {
              if (ROM_ChoiceF[arrayWithROMData][cLen] != 65535) // if NOT grounded
              {
                ROM_ChoiceF[arrayWithROMData][cLen] = 1; // my ROM cycle is still going
              }
              else if (ROM_ChoiceF[arrayWithROMData][cLen] == 65535) // On the ground; stop attacking
              {
                GroundSwitch = 0;
              }
            }
          }

          // Label the LKs & MKs
          for (var cLen = 0; cLen < CLIP_LENGTH; cLen++) {
            if (ROM_ChoiceF[arrayWithROMData][cLen] == 1) {
              // Am I MK?
              if (((Normal_Strength)[arrayWithROMData][cLen] == 1)
                && ((Attack_Number)[arrayWithROMData][cLen] == 16)
                && ((Air_Dash_Count)[arrayWithROMData][cLen] == 1)) // MK
              {
                ROM_ChoiceF[arrayWithROMData][cLen] = `MK`;
              }
              else if (((Attack_Number)[arrayWithROMData][cLen] == 18)
                && ((Normal_Strength)[arrayWithROMData][cLen] == 0)
                && ((Air_Dash_Count)[arrayWithROMData][cLen] == 1)) // DLK
              {
                ROM_ChoiceF[arrayWithROMData][cLen] = `DLK`;
              }
            }
          }
          // Count the frames of LKs using tempCounter
          for (var cLen = 0; cLen < CLIP_LENGTH; cLen++) {
            if (ROM_ChoiceF[arrayWithROMData][cLen] == `DLK`) {
              tempROMCounter += 1;
            }
            // Stop on encountering a MK
            else if (ROM_ChoiceF[arrayWithROMData][cLen] == `MK`) // We hit a MK
            {
              // Lookahead
              for (let positiveI = 0; positiveI < CLIP_LENGTH; positiveI++) // CLIP_LENGTH is used, but we will break out of the loop before it is reached
              {
                // Everything until 65535 is = tempCounter
                if (ROM_ChoiceF[arrayWithROMData][cLen + positiveI] != 65535) {
                  tempROMSwitch = 1
                  ROM_ChoiceF[arrayWithROMData][cLen + positiveI] = tempROMCounter;
                }
                else if (tempROMSwitch == 1) {
                  ROM_ChoiceF[arrayWithROMData][cLen + positiveI] = tempROMCounter;
                  if (ROM_ChoiceF[arrayWithROMData][cLen + positiveI] == 65535) {
                    tempROMSwitch = 0;
                  }
                  break // lookahead is done, we hit 65535
                }
              }
              // Lookbehind, expect the number of 2LKs to equal the tempCounter value
              for (let negativeI = 1; negativeI < tempROMCounter + 1; negativeI++) {
                if (ROM_ChoiceF[arrayWithROMData][cLen - negativeI] == `DLK`) {
                  ROM_ChoiceF[arrayWithROMData][cLen - negativeI] = tempROMCounter;
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
          for (var cLen = 0; cLen < CLIP_LENGTH; cLen++) {
            if ((ROM_ChoiceF[arrayWithROMData][cLen] != 65535)
              && (ROM_ChoiceF[arrayWithROMData][cLen] >= 0)
              && (ROM_ChoiceF[arrayWithROMData][cLen] < 3))
            // || (arrStateROM_09_ChoiceF[arrayWithROMData][cLen] == `DLK`))
            {
              ROM_ChoiceF[arrayWithROMData][cLen] = 0;
            }
          }
          // Clean up the values for AE Part2
          for (var cLen = 0; cLen < CLIP_LENGTH; cLen++) {
            if ((ROM_ChoiceF[arrayWithROMData][cLen] != 65535)
              && (ROM_ChoiceF[arrayWithROMData][cLen] >= 17)) {
              ROM_ChoiceF[arrayWithROMData][cLen] = `Wait`
            }
            else if (((ROM_ChoiceF[arrayWithROMData][cLen] != 65535))
              && (ROM_ChoiceF[arrayWithROMData][cLen] < 17)
              && (ROM_ChoiceF[arrayWithROMData][cLen] > 0)) {
              ROM_ChoiceF[arrayWithROMData][cLen] = `No-Wait`
            }
          }
        } // End of 09_ChoiceF Scope