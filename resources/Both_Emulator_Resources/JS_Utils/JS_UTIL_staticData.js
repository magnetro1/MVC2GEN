/* eslint-disable no-multi-spaces */

/**
  *@description State Tracker

  0: 'Neutral',
  
  1: 'Air',
  
  2: 'Dashing',
  
  3: 'Crouching',
  
  4: 'Turning Around',
  
  5: 'Ground Block',
  
  6: 'Air Block',
  
  7: 'Stand Punches',
  
  8: 'Stand Kicks',
  
  9: 'Crouch Punches',
  
  10: 'Crouch Kicks',
  
  11: 'Air Punches',
  
  12: 'Air Kicks',
  
  13: 'Stunned',
  
  14: '???',
  
  15: 'Throwing',
  
  16: 'Being Thrown',
  
  17: 'OTG Rise',
  
  18: 'Match Start',
  
  19: 'Win Pose',
  
  20: 'Tag-in & OC Launcher',
  
  21: 'Specials & Snapbacks',
  
  22: 'Supers',
  
  23: '???',
  
  24: 'Assist Related',
  
  25: '???',
  
  26: 'Air Dash',
  */
export const IS_PROX_BLOCK_OBJ = {
  0: 'Neutral',
  1: 'Air',
  2: 'Dashing',
  3: 'Crouching',
  4: 'Turning Around',
  5: 'Ground Block',
  6: 'Air Block',
  7: 'Stand Punches',
  8: 'Stand Kicks',
  9: 'Crouch Punches',
  10: 'Crouch Kicks',
  11: 'Air Punches',
  12: 'Air Kicks',
  13: 'Stunned',
  14: '???',
  15: 'Throwing',
  16: 'Being Thrown',
  17: 'OTG Rise',
  18: 'Match Start',
  19: 'Win Pose',
  20: 'Tag-in & OC Launcher',
  21: 'Specials & Snapbacks',
  22: 'Supers',
  23: '???',
  24: 'Assist Related',
  25: '???',
  26: 'Air Dash',
};

/**
 * @description State Tracker
  
0: 'Neutral',
  
  1: 'Walking',
  
  2: 'Normal Jump Rise',
  
  3: 'Normal Jump',
  
  4: 'Landing',
  
  5: 'Crouching',
  
  6: 'Crouched',
  
  7: 'Stand Rise',
  
  8: 'Stand Turn',
  
  9: 'Crouch Turning',
  
  10: 'Forward Dashing',
  
  11: 'Back Dashing',
  
  12: 'Double Dizzy', // ⭐ DC-only
  
  13: 'Super Jump Rise',
  
  14: 'Super Jumping',
  
  15: 'Air Recovery',
  
  16: '???', // ⭐
  
  17: 'Knockdown Rise',
  
  18: 'Ground Block',
  
  19: 'Air Blocking',
  
  20: 'Normal Attacks',
  
  21: 'Special Attacks',
  
  22: 'Post-Match Pose',
  
  23: 'Extra OTG Stun',
  
  24: 'Neutral Flight',
  
  25: 'Corner Jump',
  
  26: 'Air Dash',
  
  27: 'Tech Hit',
  
  28: 'Switching & Assists',
  
  29: 'Supers & Flashes',
  
  30: 'Throwing',
  
  31: 'Being Thrown',
  
  32: 'Stunned',
  
  33: '???', // ⭐
  
  34: 'Command Launcher',
 */
export const KNOCKDOWN_STATE_OBJ = {
  0: 'Neutral',
  1: 'Walking',
  2: 'Normal Jump Rise',
  3: 'Normal Jump',
  4: 'Landing',
  5: 'Crouching',
  6: 'Crouched',
  7: 'Stand Rise',
  8: 'Stand Turn',
  9: 'Crouch Turning',
  10: 'Forward Dashing',
  11: 'Back Dashing',
  12: 'Double Dizzy', // ⭐ DC-only
  13: 'Super Jump Rise',
  14: 'Super Jumping',
  15: 'Air Recovery',
  16: '???', // ⭐
  17: 'Knockdown Rise',
  18: 'Ground Block',
  19: 'Air Blocking',
  20: 'Normal Attacks',
  21: 'Special Attacks',
  22: 'Post-Match Pose',
  23: 'Extra OTG Stun',
  24: 'Neutral Flight',
  25: 'Corner Jump',
  26: 'Air Dash',
  27: 'Tech Hit',
  28: 'Switching & Assists',
  29: 'Supers & Flashes',
  30: 'Throwing',
  31: 'Being Thrown',
  32: 'Stunned',
  33: '???', // ⭐
  34: 'Command Launcher',
};
/**
 * @description Character Hex ID to string.
  
'0x00': 'Ryu',
  
  '0x01': 'Zangief',
  
  '0x02': 'Guile',
  
  '0x03': 'Morrigan',
  
  '0x04': 'Anakaris',
  
  '0x05': 'Strider Hiryu',
  
  '0x06': 'Cyclops',
  
  '0x07': 'Wolverine',
  
  '0x08': 'Psylocke',
  
  '0x09': 'Iceman',
  
  '0x0a': 'Rogue',
  
  '0x0b': 'Captain America',
  
  '0x0c': 'Spider-Man',
  
  '0x0d': 'Hulk',
  
  '0x0e': 'Venom',
  
  '0x0f': 'Doctor Doom',
  
  '0x10': 'Tron Bonne',
  
  '0x11': 'Jill',
  
  '0x12': 'Hayato',
  
  '0x13': 'Ruby Heart',
  
  '0x14': 'Sonson',
  
  '0x15': 'Amingo',
  
  '0x16': 'Marrow',
  
  '0x17': 'Cable',
  
  '0x18': 'Abyss-A',
  
  '0x19': 'Abyss-B',
  
  '0x1a': 'Abyss-C',
  
  '0x1b': 'Chun-Li',
  
  '0x1c': 'Megaman',
  
  '0x1d': 'Roll',
  
  '0x1e': 'Akuma',
  
  '0x1f': 'B.B. Hood',
  
  '0x20': 'Felicia',
  
  '0x21': 'Charlie',
  
  '0x22': 'Sakura',
  
  '0x23': 'Dan',
  
  '0x24': 'Cammy',
  
  '0x25': 'Dhalsim',
  
  '0x26': 'M.Bison',
  
  '0x27': 'Ken',
  
  '0x28': 'Gambit',
  
  '0x29': 'Juggernaut',
  
  '0x2a': 'Storm',
  
  '0x2b': 'Sabretooth',
  
  '0x2c': 'Magneto',
  
  '0x2d': 'Shuma-Gorath',
  
  '0x2e': 'War Machine',
  
  '0x2f': 'Silver Samurai',
  
  '0x30': 'Omega Red',
  
  '0x31': 'Spiral',
  
  '0x32': 'Colossus',
  
  '0x33': 'Iron Man',
  
  '0x34': 'Sentinel',
  
  '0x35': 'Blackheart',
  
  '0x36': 'Thanos',
  
  '0x37': 'Jin',
  
  '0x38': 'Captain Commando',
  
  '0x39': 'Wolverine-B',
  
  '0x3a': 'Servbot'
 */
export const HEX_NAME_TABLE_OBJ = {
  '0x00': 'Ryu',
  '0x01': 'Zangief',
  '0x02': 'Guile',
  '0x03': 'Morrigan',
  '0x04': 'Anakaris',
  '0x05': 'Strider Hiryu',
  '0x06': 'Cyclops',
  '0x07': 'Wolverine',
  '0x08': 'Psylocke',
  '0x09': 'Iceman',
  '0x0a': 'Rogue',
  '0x0b': 'Captain America',
  '0x0c': 'Spider-Man',
  '0x0d': 'Hulk',
  '0x0e': 'Venom',
  '0x0f': 'Doctor Doom',
  '0x10': 'Tron Bonne',
  '0x11': 'Jill',
  '0x12': 'Hayato',
  '0x13': 'Ruby Heart',
  '0x14': 'Sonson',
  '0x15': 'Amingo',
  '0x16': 'Marrow',
  '0x17': 'Cable',
  '0x18': 'Abyss-A',
  '0x19': 'Abyss-B',
  '0x1a': 'Abyss-C',
  '0x1b': 'Chun-Li',
  '0x1c': 'Megaman',
  '0x1d': 'Roll',
  '0x1e': 'Akuma',
  '0x1f': 'B.B. Hood',
  '0x20': 'Felicia',
  '0x21': 'Charlie',
  '0x22': 'Sakura',
  '0x23': 'Dan',
  '0x24': 'Cammy',
  '0x25': 'Dhalsim',
  '0x26': 'M.Bison',
  '0x27': 'Ken',
  '0x28': 'Gambit',
  '0x29': 'Juggernaut',
  '0x2a': 'Storm',
  '0x2b': 'Sabretooth',
  '0x2c': 'Magneto',
  '0x2d': 'Shuma-Gorath',
  '0x2e': 'War Machine',
  '0x2f': 'Silver Samurai',
  '0x30': 'Omega Red',
  '0x31': 'Spiral',
  '0x32': 'Colossus',
  '0x33': 'Iron Man',
  '0x34': 'Sentinel',
  '0x35': 'Blackheart',
  '0x36': 'Thanos',
  '0x37': 'Jin',
  '0x38': 'Captain Commando',
  '0x39': 'Wolverine-B',
  '0x3a': 'Servbot'
};
/**
 * @description Character Decimal ID to string.
  
0: 'Ryu',
  
  1: 'Zangief',
  
  2: 'Guile',
  
  3: 'Morrigan',
  
  4: 'Anakaris',
  
  5: 'Strider Hiryu',
  
  6: 'Cyclops',
  
  7: 'Wolverine',
  
  8: 'Psylocke',
  
  9: 'Iceman',
  
  10: 'Rogue',
  
  11: 'Captain America',
  
  12: 'Spider-Man',
  
  13: 'Hulk',
  
  14: 'Venom',
  
  15: 'Doctor Doom',
  
  16: 'Tron Bonne',
  
  17: 'Jill',
  
  18: 'Hayato',
  
  19: 'Ruby Heart',
  
  20: 'Sonson',
  
  21: 'Amingo',
  
  22: 'Marrow',
  
  23: 'Cable',
  
  24: 'Abyss-A',
  
  25: 'Abyss-B',
  
  26: 'Abyss-C',
  
  27: 'Chun-Li',
  
  28: 'Megaman',
  
  29: 'Roll',
  
  30: 'Akuma',
  
  31: 'B.B. Hood',
  
  32: 'Felicia',
  
  33: 'Charlie',
  
  34: 'Sakura',
  
  35: 'Dan',
  
  36: 'Cammy',
  
  37: 'Dhalsim',
  
  38: 'M.Bison',
  
  39: 'Ken',
  
  40: 'Gambit',
  
  41: 'Juggernaut',
  
  42: 'Storm',
  
  43: 'Sabretooth',
  
  44: 'Magneto',
  
  45: 'Shuma-Gorath',
  
  46: 'War Machine',
  
  47: 'Silver Samurai',
  
  48: 'Omega Red',
  
  49: 'Spiral',
  
  50: 'Colossus',
  
  51: 'Iron Man',
  
  52: 'Sentinel',
  
  53: 'Blackheart',
  
  54: 'Thanos',
  
  55: 'Jin',
  
  56: 'Captain Commando',
  
  57: 'Wolverine-B',
  
  58: 'Servbot',
 */
export const DEC_NAME_TABLE_OBJ = {
  0: 'Ryu',
  1: 'Zangief',
  2: 'Guile',
  3: 'Morrigan',
  4: 'Anakaris',
  5: 'Strider Hiryu',
  6: 'Cyclops',
  7: 'Wolverine',
  8: 'Psylocke',
  9: 'Iceman',
  10: 'Rogue',
  11: 'Captain America',
  12: 'Spider-Man',
  13: 'Hulk',
  14: 'Venom',
  15: 'Doctor Doom',
  16: 'Tron Bonne',
  17: 'Jill',
  18: 'Hayato',
  19: 'Ruby Heart',
  20: 'Sonson',
  21: 'Amingo',
  22: 'Marrow',
  23: 'Cable',
  24: 'Abyss-A',
  25: 'Abyss-B',
  26: 'Abyss-C',
  27: 'Chun-Li',
  28: 'Megaman',
  29: 'Roll',
  30: 'Akuma',
  31: 'B.B. Hood',
  32: 'Felicia',
  33: 'Charlie',
  34: 'Sakura',
  35: 'Dan',
  36: 'Cammy',
  37: 'Dhalsim',
  38: 'M.Bison',
  39: 'Ken',
  40: 'Gambit',
  41: 'Juggernaut',
  42: 'Storm',
  43: 'Sabretooth',
  44: 'Magneto',
  45: 'Shuma-Gorath',
  46: 'War Machine',
  47: 'Silver Samurai',
  48: 'Omega Red',
  49: 'Spiral',
  50: 'Colossus',
  51: 'Iron Man',
  52: 'Sentinel',
  53: 'Blackheart',
  54: 'Thanos',
  55: 'Jin',
  56: 'Captain Commando',
  57: 'Wolverine-B',
  58: 'Servbot',
};

export const MIN_MAX_ADDRESSES = [
  'P1_A_X_Gravity',
  'P1_A_X_Position_Arena',
  'P1_A_X_Position_From_Enemy',
  'P1_A_X_Position_Screen',
  'P1_A_Y_Gravity',
  'P1_A_Y_Position_Arena',
  'P1_A_Y_Position_From_Enemy',
  'P1_A_Y_Position_Screen',
  'P1_A_X_Velocity',
  'P1_A_Y_Velocity',
  'P1_B_X_Gravity',
  'P1_B_X_Position_Arena',
  'P1_B_X_Position_From_Enemy',
  'P1_B_X_Position_Screen',
  'P1_B_Y_Gravity',
  'P1_B_Y_Position_Arena',
  'P1_B_Y_Position_From_Enemy',
  'P1_B_Y_Position_Screen',
  'P1_B_X_Velocity',
  'P1_B_Y_Velocity',
  'P1_C_X_Gravity',
  'P1_C_X_Position_Arena',
  'P1_C_X_Position_From_Enemy',
  'P1_C_X_Position_Screen',
  'P1_C_Y_Gravity',
  'P1_C_Y_Position_Arena',
  'P1_C_Y_Position_From_Enemy',
  'P1_C_Y_Position_Screen',
  'P1_C_X_Velocity',
  'P1_C_Y_Velocity',
  'P2_A_X_Gravity',
  'P2_A_X_Position_Arena',
  'P2_A_X_Position_From_Enemy',
  'P2_A_X_Position_Screen',
  'P2_A_Y_Gravity',
  'P2_A_Y_Position_Arena',
  'P2_A_Y_Position_From_Enemy',
  'P2_A_Y_Position_Screen',
  'P2_A_X_Velocity',
  'P2_A_Y_Velocity',
  'P2_B_X_Gravity',
  'P2_B_X_Position_Arena',
  'P2_B_X_Position_From_Enemy',
  'P2_B_X_Position_Screen',
  'P2_B_Y_Gravity',
  'P2_B_Y_Position_Arena',
  'P2_B_Y_Position_From_Enemy',
  'P2_B_Y_Position_Screen',
  'P2_B_X_Velocity',
  'P2_B_Y_Velocity',
  'P2_C_X_Gravity',
  'P2_C_X_Position_Arena',
  'P2_C_X_Position_From_Enemy',
  'P2_C_X_Position_Screen',
  'P2_C_Y_Gravity',
  'P2_C_Y_Position_Arena',
  'P2_C_Y_Position_From_Enemy',
  'P2_C_Y_Position_Screen',
  'P2_C_X_Velocity',
  'P2_C_Y_Velocity',

  'P1_A_Bison_214kk_Timer',
  'P1_A_Dhalsim_214kk_Timer',
  'P1_A_Doom_214kk_Timer',
  'P1_A_Iron_Man_214kk_Timer',
  'P1_A_Magneto_214kk_Timer',
  'P1_A_Megaman_214kk_Timer',
  'P1_A_Sentinel_214kk_Timer',
  'P1_A_Storm_214kk_Timer',
  'P1_A_War_Machine_214kk_Timer',
  'P1_B_Bison_214kk_Timer',
  'P1_B_Dhalsim_214kk_Timer',
  'P1_B_Doom_214kk_Timer',
  'P1_B_Iron_Man_214kk_Timer',
  'P1_B_Magneto_214kk_Timer',
  'P1_B_Megaman_214kk_Timer',
  'P1_B_Sentinel_214kk_Timer',
  'P1_B_Storm_214kk_Timer',
  'P1_B_War_Machine_214kk_Timer',
  'P1_C_Bison_214kk_Timer',
  'P1_C_Dhalsim_214kk_Timer',
  'P1_C_Doom_214kk_Timer',
  'P1_C_Iron_Man_214kk_Timer',
  'P1_C_Magneto_214kk_Timer',
  'P1_C_Megaman_214kk_Timer',
  'P1_C_Sentinel_214kk_Timer',
  'P1_C_Storm_214kk_Timer',
  'P1_C_War_Machine_214kk_Timer',
  'P2_A_Bison_214kk_Timer',
  'P2_A_Dhalsim_214kk_Timer',
  'P2_A_Doom_214kk_Timer',
  'P2_A_Iron_Man_214kk_Timer',
  'P2_A_Magneto_214kk_Timer',
  'P2_A_Megaman_214kk_Timer',
  'P2_A_Sentinel_214kk_Timer',
  'P2_A_Storm_214kk_Timer',
  'P2_A_War_Machine_214kk_Timer',
  'P2_B_Bison_214kk_Timer',
  'P2_B_Dhalsim_214kk_Timer',
  'P2_B_Doom_214kk_Timer',
  'P2_B_Iron_Man_214kk_Timer',
  'P2_B_Magneto_214kk_Timer',
  'P2_B_Megaman_214kk_Timer',
  'P2_B_Sentinel_214kk_Timer',
  'P2_B_Storm_214kk_Timer',
  'P2_B_War_Machine_214kk_Timer',
  'P2_C_Bison_214kk_Timer',
  'P2_C_Dhalsim_214kk_Timer',
  'P2_C_Doom_214kk_Timer',
  'P2_C_Iron_Man_214kk_Timer',
  'P2_C_Magneto_214kk_Timer',
  'P2_C_Megaman_214kk_Timer',
  'P2_C_Sentinel_214kk_Timer',
  'P2_C_Storm_214kk_Timer',
  'P2_C_War_Machine_214kk_Timer',

  // 'P1_Combo_Meter_Value',
  // 'P2_Combo_Meter_Value',
];

/**
 * @description Contains the addresses for rounding
 */
export const FLOATING_POINT_ADDRESSES = [
  'X_Gravity',
  'X_Position_Arena',
  'X_Position_From_Enemy',
  'X_Position_Screen',
  'X_Velocity',
  'Y_Gravity',
  'Y_Position_Arena',
  'Y_Position_From_Enemy',
  'Y_Position_Screen',
  'Y_Velocity',

  // 'Bison_214kk_Timer',
  // 'Dhalsim_214kk_Timer',
  // 'Doom_214kk_Timer',
  // 'Iron_Man_214kk_Timer',
  // 'Magneto_214kk_Timer',
  // 'Megaman_214kk_Timer',
  // 'Sentinel_214kk_Timer',
  // 'Storm_214kk_Timer',
  // 'War_Machine_214kk_Timer',
];

/**
* @description Miscellaneous addresses for which special calculations are not
necessary. Example: A_2D_Game_Timer
* */
export const P1P2_ADDRESSES = [
  'Total_Frames',
  'Camera_Field_of_View',
  'Camera_X_Position',
  'Camera_X_Rotation',
  'Camera_Y_Position',
  'Camera_Y_Rotation',
  'A_2D_Game_Timer',
  'P1_Assist_Flag',
  'P2_Assist_Flag',
  'P1_Attacks_Done',
  'P1_Attacks_Successful',
  'P1_Combo_Meter_Value',
  'P1_Max_Combo',
  'P2_Attacks_Done',
  'P2_Attacks_Successful',
  'P2_Combo_Meter_Value',
  'P2_Max_Combo',
  'P1_Hitbox_Count',
  'P2_Hitbox_Count',
  'P1_Meter_Big',
  'P1_Meter_Small',
  'P2_Meter_Big',
  'P2_Meter_Small',
  'P1_Pause_ID',
  'P2_Pause_ID',
  'Frame_Skip_Counter',
  'Frame_Skip_Cycle_Value',
  'Frame_Skip_Rate',
  'Frame_Skip_Toggle',
  'Is_Paused',
  'Match_Start_Throw_Timer',
  'Match_Tracker',
  'Pause_Count',
  'Stage_Selector',
  'Timer_Secondary',
];

/**
* @description Contains the decimal value of each stage as a key, and the color hex code for
After Effects.

0 : Boat1

1 : Desert1

2 : Factory

3 : Carnival1

4 : Bridge1

5 : Cave2

6 : Clock2

7 : Raft2

8 : Abyss

9 : Boat2

10 : Desert2

11 : Training

12 : Carnival2

13 : Bridge2

14 : Cave1

15 : Clock1

16 : Raft1
* */
export const STAGES_OBJ = {
  0: 'C09A71FF', // 'Boat1',
  1: 'E1540CFF', // 'Desert1',
  2: '6D574FFF', // 'Factory',
  3: 'CF461BFF', // 'Carnival1',
  4: 'ECE4B9FF', // 'Bridge1',
  5: '257B8AFF', // 'Cave2',
  6: 'D0C1ACFF', // 'Clock2',
  7: 'B764AAFF', // 'Raft2',
  8: '263548FF', // 'Abyss',
  9: '788998FF', // 'Boat2', 
  10: '3F5FFFFF', // 'Desert2',
  11: '266D04FF', // 'Training',
  12: '74566EFF', // 'Carnival2',
  13: 'E9797FFF', // 'Bridge2',
  14: 'A43812FF', // 'Cave1',
  15: '888885FF', // 'Clock1',
  16: '8CA7DFFF', // 'Raft1'
};

/**
 * @description Decimal to Names

0 : Boat1

1 : Desert1

2 : Factory

3 : Carnival1

4 : Bridge1

5 : Cave2

6 : Clock2

7 : Raft2

8 : Abyss

9 : Boat2

10 : Desert2

11 : Training

12 : Carnival2

13 : Bridge2

14 : Cave1

15 : Clock1

16 : Raft1

 * */
export const STAGES_NAMES = {
  0: 'Boat1', // 'Boat1',
  1: 'Desert1', // 'Desert1',
  2: 'Factory', // 'Factory',
  3: 'Carnival1', // 'Carnival1',
  4: 'Bridge1', // 'Bridge1',
  5: 'Cave2', // 'Cave2',
  6: 'Clock2', // 'Clock2',
  7: 'Raft2', // 'Raft2',
  8: 'Abyss', // 'Abyss',
  9: 'Boat2', // 'Boat2', 
  10: 'Desert2', // 'Desert2',
  11: 'Training', // 'Training',
  12: 'Carnival2', // 'Carnival2',
  13: 'Bridge2', // 'Bridge2',
  14: 'Cave1', // 'Cave1',
  15: 'Clock1', // 'Clock1',
  16: 'Raft1', // 'Raft1'
};

/**
* @description Contains text call-outs based on the Combo Meter value
* @description

03:     Yes

04-05:  Good

06-07:  Great

08-09:  Very Good

10-29:  Wonderful

30-49:  Fantastic

50-99:  Monster

100+:   Marvelous

*/
export const COMBO_CALLOUTS = [
  'Yes',
  'Good',
  'Great',
  'Very Good',
  'Wonderful',
  'Fantastic',
  'Monster',
  'Marvelous',
];

/**
* @description Contains the decimal value of each character, and its alphabetical value in time for
an After Effects timer remap. Ex: decimal: 30, second: 4 (Akuma)
* */
export const PORTRAITS_TO_TIME_OBJ = {
  24: 1,  // Abyss-1
  25: 2,  // Abyss-2
  26: 3,  // Abyss-3
  30: 4,  // Akuma
  21: 5,  // Amingo
  4: 6,   // Anakaris
  31: 7,  // B.B. Hood
  53: 8,  // Blackheart
  23: 9,  // Cable
  36: 10, // Cammy
  11: 11, // Captain America
  56: 12, // Captain Commando
  33: 13, // Charlie
  27: 14, // Chun-Li
  50: 15, // Colossus
  6: 16,  // Cyclops
  35: 17, // Dan
  37: 18, // Dhalsim
  15: 19, // Doctor Doom
  32: 20, // Felicia
  40: 21, // Gambit
  2: 22,  // Guile
  18: 23, // Hayato
  13: 24, // Hulk
  9: 25,  // Iceman
  51: 26, // Iron Man
  17: 27, // Jill
  55: 28, // Jin
  41: 29, // Juggernaut
  39: 30, // Ken
  38: 31, // M.Bison
  44: 32, // Magneto
  22: 33, // Marrow
  28: 34, // Megaman
  3: 35,  // Morrigan
  48: 36, // Omega Red
  8: 37,  // Psylocke
  10: 38, // Rogue
  29: 39, // Roll
  19: 40, // Ruby Heart
  0: 41,  // Ryu
  43: 42, // Sabretooth
  34: 43, // Sakura
  52: 44, // Sentinel
  58: 45, // Servbot
  45: 46, // Shuma-Gorath
  47: 47, // Silver Samurai
  20: 48, // Sonson
  12: 49, // Spider-Man
  49: 50, // Spiral
  42: 51, // Storm
  5: 52,  // Strider Hiryu
  54: 53, // Thanos
  16: 54, // Tron Bonne
  14: 55, // Venom
  46: 56, // War Machine
  7: 57,  // Wolverine (Adamantium)
  57: 58, // Wolverine (Bone)
  1: 59,  // Zangief
};
// Normal Composition Positions
export const AE_TO_POSITION_OBJ = {
  1: [0, 0],        // Abyss-1
  2: [0, 0],        // Abyss-2
  3: [0, 0],        // Abyss-3
  4: [122, 1976],   // Akuma
  5: [176, 1986],   // Amingo
  6: [188, 1766],   // Anakaris
  7: [288, 1689],   // B.B. Hood
  8: [-1, 2080],    // Blackheart
  9: [409, 2035],   // Cable  
  // 9: [409, 2235],   // Cable  
  10: [557, 1590],  // Cammy
  11: [198, 2005],  // Captain America
  12: [117, 2245],  // Captain Commando
  13: [120, 1990],  // Charlie
  14: [560, 1900],  // Chun-Li
  15: [80, 1650],   // Colossus
  16: [60, 2000],   // Cyclops  
  17: [275, 1867],  // Dan
  18: [-513, 1560], // Dhalsim
  19: [322, 1911],  // Doctor Doom
  20: [211, 1678],  // Felicia
  21: [286, 1933],  // Gambit
  22: [-138, 1791], // Guile
  23: [199, 1830],  // Hayato
  24: [-36, 1726],  // Hulk
  25: [251, 1488],  // Iceman
  26: [273, 1488],  // Iron Man
  27: [502, 1658],  // Jill
  28: [60, 1658],   // Jin
  29: [119, 1768],  // Juggernaut
  30: [-5, 1985],   // Ken
  31: [-29, 1869],  // M.Bison
  // 32: [86, 2030],  // Magneto
  32: [86, 1830],  // Magneto
  33: [-155, 1634], // Marrow
  34: [150, 1600],  // Megaman
  35: [418, 2083],  // Morrigan
  36: [8, 2063],    // Omega Red
  37: [212, 1886],  // Psylocke
  38: [96, 1982],   // Rogue
  39: [380, 1894],  // Roll
  40: [149, 2000],  // Ruby Heart
  41: [-135, 1560], // Ryu
  42: [81, 1861],   // Sabretooth
  43: [-123, 1523], // Sakura
  44: [-106, 1979],  // Sentinel
  // 44: [-106, 2161],  // Sentinel
  45: [149, 1464],  // Servbot
  46: [-87, 1751],  // Shuma-Gorath
  47: [186, 1751],  // Silver Samurai
  48: [0, 0],       // Sonson
  49: [273, 1958],  // Spider-Man
  50: [275, 1850],  // Spiral
  // 51: [260, 1722],  // Storm
  51: [260, 1786],  // Storm
  52: [229, 1668],  // Strider Hiryu
  53: [128, 1654],  // Thanos
  54: [105, 1733],  // Tron Bonne
  55: [-45, 1975],  // Venom
  56: [-78, 1883],  // War Machine
  57: [-56, 1849],  // Wolverine (Adamantium)
  58: [126, 1882],  // Wolverine (Bone)
  59: [257, 1731],  // Zangief
};
// CVS2 Healthbar Composition Positions
export const AE_TO_CVS2_POSITION_OBJ = {
  1: [0, 0],        // Abyss-1
  2: [0, 0],        // Abyss-2
  3: [0, 0],        // Abyss-3
  4: [122, 1976],   // Akuma
  5: [176, 1986],   // Amingo
  6: [188, 1766],   // Anakaris
  7: [288, 1689],   // B.B. Hood
  8: [-1, 2080],    // Blackheart
  9: [385, 2250],   // Cable // ✔
  10: [557, 1590],  // Cammy
  11: [198, 2005],  // Captain America
  12: [143, 2193],  // Captain Commando // ✔
  13: [120, 1990],  // Charlie
  14: [560, 1900],  // Chun-Li
  15: [80, 1650],   // Colossus
  16: [75, 1822],   // Cyclops // ✔
  17: [275, 1867],  // Dan
  18: [-513, 1560], // Dhalsim
  19: [322, 1911],  // Doctor Doom
  20: [211, 1678],  // Felicia
  21: [286, 1933],  // Gambit
  22: [-138, 1791], // Guile
  23: [199, 1830],  // Hayato
  24: [-36, 1726],  // Hulk
  25: [251, 1488],  // Iceman
  26: [273, 1488],  // Iron Man
  27: [502, 1658],  // Jill
  28: [60, 1658],   // Jin
  29: [119, 1768],  // Juggernaut
  30: [-5, 1985],   // Ken
  31: [-29, 1869],  // M.Bison
  32: [120, 2115],  // Magneto // ✔
  33: [-155, 1634], // Marrow
  34: [150, 1600],  // Megaman
  35: [418, 2083],  // Morrigan
  36: [8, 2063],    // Omega Red
  37: [194, 1784],  // Psylocke // ✔
  38: [96, 1982],   // Rogue
  39: [380, 1894],  // Roll
  40: [149, 2000],  // Ruby Heart
  41: [-135, 1560], // Ryu
  42: [81, 1861],   // Sabretooth
  43: [-123, 1523], // Sakura
  44: [-86, 2125],  // Sentinel // ✔
  45: [149, 1464],  // Servbot
  46: [-87, 1751],  // Shuma-Gorath
  47: [186, 1751],  // Silver Samurai
  48: [0, 0],       // Sonson
  49: [273, 1958],  // Spider-Man
  50: [275, 1850],  // Spiral
  51: [209, 1761],  // Storm // ✔
  52: [229, 1668],  // Strider Hiryu
  53: [128, 1654],  // Thanos
  54: [105, 1733],  // Tron Bonne
  55: [-45, 1975],  // Venom
  56: [-78, 1883],  // War Machine
  57: [-56, 1849],  // Wolverine (Adamantium)
  58: [126, 1882],  // Wolverine (Bone)
  59: [257, 1731],  // Zangief
};
/**
 * @description Addresses to exclude from the project for CTScraper.js file
 */
export const UNUSED_CT_ADDRESSES = [
  '01_SCV_Alignment',
  'Camera_Lock_duplicate',
  'FOV_duplicate',
  'FOV',
  'P1_A_Base',
  'P1_B_Base',
  'P1_C_Base',
  'P2_A_Base',
  'P2_B_Base',
  'P2_C_Base',
  'P1_A_ID_duplicate',
  'P1_B_ID_duplicate',
  'P1_C_ID_duplicate',
  'P2_A_ID_duplicate',
  'P2_B_ID_duplicate',
  'P2_C_ID_duplicate',
  'P1_A_Sprite_Scale_X',
  'P1_A_Sprite_Scale_Y',
  'P1_A_Sprite_Scale_Z',
  'P1_A_X_Hitbox_Scale',
  'P1_A_Y_Hitbox_Scale',
  'P1_B_Sprite_Scale_X',
  'P1_B_Sprite_Scale_Y',
  'P1_B_Sprite_Scale_Z',
  'P1_B_X_Hitbox_Scale',
  'P1_B_Y_Hitbox_Scale',
  'P1_C_Sprite_Scale_X',
  'P1_C_Sprite_Scale_Y',
  'P1_C_Sprite_Scale_Z',
  'P1_C_X_Hitbox_Scale',
  'P1_C_Y_Hitbox_Scale',
  'P2_A_Sprite_Scale_X',
  'P2_A_Sprite_Scale_Y',
  'P2_A_Sprite_Scale_Z',
  'P2_A_X_Hitbox_Scale',
  'P2_A_Y_Hitbox_Scale',
  'P2_B_Sprite_Scale_X',
  'P2_B_Sprite_Scale_Y',
  'P2_B_Sprite_Scale_Z',
  'P2_B_X_Hitbox_Scale',
  'P2_B_Y_Hitbox_Scale',
  'P2_C_Sprite_Scale_X',
  'P2_C_Sprite_Scale_Y',
  'P2_C_Sprite_Scale_Z',
  'P2_C_X_Hitbox_Scale',
  'P2_C_Y_Hitbox_Scale',
  'Win_Display_Toggle_duplicate',
  'X_Pos_Clamp_Left_duplicate',
  'X_Pos_Clamp_Right_duplicate',
  'X_Pos_NOP_duplicate',
  'X_Rot_NOP_duplicate',
  'Y_Camera_duplicate',
  'Y_Clamp_Top_duplicate',
  'Y_NOP_duplicate',
  'Y_Pos_NOP_duplicate',
  'Y_Rot_NOP_duplicate',
  'Z_NOP_duplicate',
  'Z_POS_duplicate',
  'Z_SPR_duplicate',
  'Z_Y_Camera_duplicate',
];

/**
* @description Uses custom font in After Effects to display the inputs.
  
"6": 1024,  // 6 = right
  
  "4": 2048,  // 4 = left
  
  "2": 4096,  // 2 = down
  
  "8": 8192,  // 8 = up
  
  "u": 512,   // LP = u
  
  "j": 64,    // LK = j
  
  "i": 256,   // HP = i
  
  "k": 32,    // HK = k
  
  "o": 128,   // A1 = o
  
  "l": 16,    // A2 = l
  
  "(": 32768, // START = (
  
  ")": 2,     // SELECT = )
**/
export const INPUT_CONVERSION_1 =
{
  "6": 1024,  // 6 = right
  "4": 2048,  // 4 = left
  "2": 4096,  // 2 = down
  "8": 8192,  // 8 = up
  "u": 512,   // LP = u
  "j": 64,    // LK = j
  "i": 256,   // HP = i
  "k": 32,    // HK = k
  "o": 128,   // A1 = o
  "l": 16,    // A2 = l
  "(": 32768, // START = (
  ")": 2,     // SELECT = )
};
/**
* @description Readable FGC Notation.
  
"6": 1024,
  
  "4": 2048,
  
  "2": 4096,
  
  "8": 8192,
  
  "LP": 512,
  
  "LK": 64,
  
  "HP": 256,
  
  "HK": 32,
  
  "AA": 128,
  
  "AB": 16,
  
  "START": 32768,
  
  "SELECT": 2,
**/
export const INPUT_CONVERSION_2 =
{
  "6": 1024,
  "4": 2048,
  "2": 4096,
  "8": 8192,
  "LP": 512,
  "LK": 64,
  "HP": 256,
  "HK": 32,
  "AA": 128,
  "AB": 16,
  "START": 32768,
  "SELECT": 2,
};

export const PMEM_PREFIXES = ['P1_A_', 'P2_A_', 'P1_B_', 'P2_B_', 'P1_C_', 'P2_C_']

// Names by Shortest to Longest
/*
Ryu
Dan
Ken
Jin
Hulk
Jill
Roll
Guile
Rogue
Venom
Cable
Akuma
Cammy
Storm
Iceman
Hayato
Sonson
Amingo
Marrow
Sakura
Gambit
Spiral
Thanos
Zangief
Cyclops
Abyss-A
Abyss-B
Abyss-C
Chun-Li
Megaman
Felicia
Charlie
Dhalsim
M.Bison
Magneto
Servbot
Morrigan
Anakaris
Psylocke
Colossus
Iron Man
Sentinel
Wolverine
B.B. Hood
Omega Red
Spider-Man
Tron Bonne
Ruby Heart
Juggernaut
Sabretooth
Blackheart
Doctor Doom
War Machine
Wolverine-B
Shuma-Gorath
Strider Hiryu
Silver Samurai
Captain America
Captain Commando
*/

// Names Alphabetically
/*
Abyss-A
Abyss-B
Abyss-C
Akuma
Amingo
Anakaris
B.B. Hood
Blackheart
Cable
Cammy
Captain America
Captain Commando
Charlie
Chun-Li
Colossus
Cyclops
Dan
Dhalsim
Doctor Doom
Felicia
Gambit
Guile
Hayato
Hulk
Iceman
Iron Man
Jill
Jin
Juggernaut
Ken
M.Bison
Magneto
Marrow
Megaman
Morrigan
Omega Red
Psylocke
Rogue
Roll
Ruby Heart
Ryu
Sabretooth
Sakura
Sentinel
Servbot
Shuma-Gorath
Silver Samurai
Sonson
Spider-Man
Spiral
Storm
Strider Hiryu
Thanos
Tron Bonne
Venom
War Machine
Wolverine
Wolverine-B
Zangief
*/

// Names Websafe/Project
/*
Abyss_A
Abyss_B
Abyss_C
Akuma
Amingo
Anakaris
B_B_Hood
Blackheart
Cable
Cammy
Captain_America
Captain_Commando
Charlie
Chun_Li
Colossus
Cyclops
Dan
Dhalsim
Doctor_Doom
Felicia
Gambit
Guile
Hayato
Hulk
Iceman
Iron_Man
Jill
Jin
Juggernaut
Ken
M_Bison
Magneto
Marrow
Megaman
Morrigan
Omega_Red
Psylocke
Rogue
Roll
Ruby_Heart
Ryu
Sabretooth
Sakura
Sentinel
Servbot
Shuma_Gorath
Silver_Samurai
Sonson
Spider_Man
Spiral
Storm
Strider_Hiryu
Thanos
Tron_Bonne
Venom
War_Machine
Wolverine
Wolverine_B
Zangief
*/
