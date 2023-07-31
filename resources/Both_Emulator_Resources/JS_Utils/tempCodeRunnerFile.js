              && ((pMemObject[`${p1P2_}SJ_Counter`])[pABC][cLen] > 0) // In SJ up or down
              && ((pMemObject[`${p1P2_}Normal_Location`])[pABC][cLen] == 2) // Normal was done in the air
              && ((pMemObject[`${p1P2_}Air_Dash_Count`])[pABC][cLen] == 1) // Air Dash was done once
              && ((pMemObject[`${p1P2_}Knockdown_State`])[pABC][cLen] == 20) // Normal Attacks
              && (playerOneInputs[cLen].match(/7|8|9/g)) // Up dirs