export const PROX_BLOCK_OBJ =
{
  0: 'Neutral',
  1: 'Air',
  2: 'Dashing',
  3: 'Crouching',
  4: 'Turning Around',
  5: 'Ground Block',
  6: 'Air Block',
  7: 'Standing Punches',
  8: 'Standing Kicks',
  9: 'Crouching Punches',
  10: 'Crouching Kicks',
  11: 'Air Punches',
  12: 'Air Kicks',
  13: 'Stunned',
  14: '???',
  15: 'Throwing',
  16: 'Being thrown',
  17: 'Invuln OTG Rise',
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
export const KNOCKDOWN_STATE_OBJ =
{
  0: 'Neutral',
  1: 'Walking',
  2: 'Rising to Normal Jump',
  3: 'Normal Jump',
  4: 'Landing from Jump',
  5: 'Starting Crouch',
  6: 'Fully-Crouched',
  7: 'Rising to Standing',
  8: 'Turning',
  9: 'Crouch Turning',
  10: 'Forward Dashing',
  11: 'Back Dashing',
  12: '???',
  13: 'Rising to Super Jump',
  14: 'Super Jumping',
  15: 'Air Recovery',
  16: '???',
  17: 'Rising from Knockdown',
  18: 'Ground: Pre-Block & Block & Pushblock',
  19: 'Air: Pre-Block & Block & Pushblock',
  20: 'Normal Attacks',
  21: 'Special Attacks',
  22: 'Post-Match Pose',
  23: 'Extra OTG Stun',
  24: 'Flight Neutral',
  25: 'Corner Jump',
  26: 'Air Dash',
  27: 'Tech Hit',
  28: 'Tagging & Assist-is-Called',
  29: 'Freezes & Flashes',
  30: 'Throwing',
  31: 'Being Thrown',
  32: 'Stunned',
  33: '???',
  34: 'Offensive-Crouch Launcher'
};

/**
 * @description Character Decimal ID to string.
 */
export const NAME_TABLE_OBJ =
{
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
  58: 'Servbot'
};

export const MIN_MAX_ADDRESSES =
  [
    'P1_A_X_Gravity',
    'P1_A_X_Position_Arena',
    'P1_A_X_Position_From_Enemy',
    'P1_A_X_Position_Screen',
    'P1_A_Y_Gravity',
    'P1_A_Y_Position_Arena',
    'P1_A_Y_Position_From_Enemy',
    'P1_A_Y_Position_Screen',
    'P1_A_Y_Velocity',
    'P1_B_X_Gravity',
    'P1_B_X_Position_Arena',
    'P1_B_X_Position_From_Enemy',
    'P1_B_X_Position_Screen',
    'P1_B_Y_Gravity',
    'P1_B_Y_Position_Arena',
    'P1_B_Y_Position_From_Enemy',
    'P1_B_Y_Position_Screen',
    'P1_B_Y_Velocity',
    'P1_C_X_Gravity',
    'P1_C_X_Position_Arena',
    'P1_C_X_Position_From_Enemy',
    'P1_C_X_Position_Screen',
    'P1_C_Y_Gravity',
    'P1_C_Y_Position_Arena',
    'P1_C_Y_Position_From_Enemy',
    'P1_C_Y_Position_Screen',
    'P1_C_Y_Velocity',
    'P2_A_X_Gravity',
    'P2_A_X_Position_Arena',
    'P2_A_X_Position_From_Enemy',
    'P2_A_X_Position_Screen',
    'P2_A_Y_Gravity',
    'P2_A_Y_Position_Arena',
    'P2_A_Y_Position_From_Enemy',
    'P2_A_Y_Position_Screen',
    'P2_A_Y_Velocity',
    'P2_B_X_Gravity',
    'P2_B_X_Position_Arena',
    'P2_B_X_Position_From_Enemy',
    'P2_B_X_Position_Screen',
    'P2_B_Y_Gravity',
    'P2_B_Y_Position_Arena',
    'P2_B_Y_Position_From_Enemy',
    'P2_B_Y_Position_Screen',
    'P2_B_Y_Velocity',
    'P2_C_X_Gravity',
    'P2_C_X_Position_Arena',
    'P2_C_X_Position_From_Enemy',
    'P2_C_X_Position_Screen',
    'P2_C_Y_Gravity',
    'P2_C_Y_Position_Arena',
    'P2_C_Y_Position_From_Enemy',
    'P2_C_Y_Position_Screen',
    'P2_C_Y_Velocity',

    // 'P1_A_Bison_214kk_Timer',
    // 'P1_A_Dhalsim_214kk_Timer',
    // 'P1_A_Doom_214kk_Timer',
    // 'P1_A_Iron_Man_214kk_Timer',
    // 'P1_A_Magneto_214kk_Timer',
    // 'P1_A_Megaman_214kk_Timer',
    // 'P1_A_Sentinel_214kk_Timer',
    // 'P1_A_Storm_214kk_Timer',
    // 'P1_A_War_Machine_214kk_Timer',
    // 'P1_B_Bison_214kk_Timer',
    // 'P1_B_Dhalsim_214kk_Timer',
    // 'P1_B_Doom_214kk_Timer',
    // 'P1_B_Iron_Man_214kk_Timer',
    // 'P1_B_Magneto_214kk_Timer',
    // 'P1_B_Megaman_214kk_Timer',
    // 'P1_B_Sentinel_214kk_Timer',
    // 'P1_B_Storm_214kk_Timer',
    // 'P1_B_War_Machine_214kk_Timer',
    // 'P1_C_Bison_214kk_Timer',
    // 'P1_C_Dhalsim_214kk_Timer',
    // 'P1_C_Doom_214kk_Timer',
    // 'P1_C_Iron_Man_214kk_Timer',
    // 'P1_C_Magneto_214kk_Timer',
    // 'P1_C_Megaman_214kk_Timer',
    // 'P1_C_Sentinel_214kk_Timer',
    // 'P1_C_Storm_214kk_Timer',
    // 'P1_C_War_Machine_214kk_Timer',
    // 'P2_A_Bison_214kk_Timer',
    // 'P2_A_Dhalsim_214kk_Timer',
    // 'P2_A_Doom_214kk_Timer',
    // 'P2_A_Iron_Man_214kk_Timer',
    // 'P2_A_Magneto_214kk_Timer',
    // 'P2_A_Megaman_214kk_Timer',
    // 'P2_A_Sentinel_214kk_Timer',
    // 'P2_A_Storm_214kk_Timer',
    // 'P2_A_War_Machine_214kk_Timer',
    // 'P2_B_Bison_214kk_Timer',
    // 'P2_B_Dhalsim_214kk_Timer',
    // 'P2_B_Doom_214kk_Timer',
    // 'P2_B_Iron_Man_214kk_Timer',
    // 'P2_B_Magneto_214kk_Timer',
    // 'P2_B_Megaman_214kk_Timer',
    // 'P2_B_Sentinel_214kk_Timer',
    // 'P2_B_Storm_214kk_Timer',
    // 'P2_B_War_Machine_214kk_Timer',
    // 'P2_C_Bison_214kk_Timer',
    // 'P2_C_Dhalsim_214kk_Timer',
    // 'P2_C_Doom_214kk_Timer',
    // 'P2_C_Iron_Man_214kk_Timer',
    // 'P2_C_Magneto_214kk_Timer',
    // 'P2_C_Megaman_214kk_Timer',
    // 'P2_C_Sentinel_214kk_Timer',
    // 'P2_C_Storm_214kk_Timer',
    // 'P2_C_War_Machine_214kk_Timer',

    'P1_Combo_Meter_Value',
    'P2_Combo_Meter_Value',
  ];

export const FLOATING_POINT_ADDRESSES =
  [
    'X_Gravity',
    'X_Position_Arena',
    'X_Position_From_Enemy',
    'X_Position_Screen',
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
* @description Miscellaneous addresses for which special calculations are not necessary. Example: A_2D_Game_Timer
**/
export const P1P2_ADDRESSES =
  [
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
    'Timer_Secondary'
  ];
/**
* @description Contains the decimal value of each stage as a key, and the color hex code for After Effects to use for it
**/
export const STAGES_OBJ =
{
  0: '2D456DFF', //'Boat1',
  1: 'E1540CFF', //'Desert1',
  2: '6D574FFF', //'Factory',
  3: 'CF461BFF', //'Carnival1',
  4: 'ECE4B9FF', //'Bridge1',
  5: '257B8AFF', //'Cave2',
  6: 'D0C1ACFF', //'Clock2',
  7: 'B764AAFF', //'Raft2',
  8: '263548FF', //'Abyss',
  9: 'C09A71FF', //'Boat2',
  10: '3F5FFFFF', //'Desert2',
  11: '266D04FF', //'Training',
  12: '74566EFF', //'Carnival2',
  13: 'E9797FFF', //'Bridge2',
  14: 'A43812FF', //'Cave1',
  15: '888885FF', //'Clock1',
  16: '8CA7DFFF' //'Raft1'
};
/**
* @description Contains the decimal value of each character, and its alphabetical value in time for an After Effects timer remap. Ex: decimal: 30, second: 4 (Akuma)
**/
export const PORTRAITS_TO_TIME_OBJ =
{
  24: 1,  //Abyss-1
  25: 2,  //Abyss-2
  26: 3,  //Abyss-3
  30: 4,  //Akuma
  21: 5,  //Amingo
  4: 6,   //Anakaris
  31: 7,  //B.B. Hood
  53: 8,  //Blackheart
  23: 9,  //Cable
  36: 10, //Cammy
  11: 11, //Captain America
  56: 12, //Captain Commando
  33: 13, //Charlie
  27: 14, //Chun-Li
  50: 15, //Colossus
  6: 16,  //Cyclops
  35: 17, //Dan
  37: 18, //Dhalsim
  15: 19, //Doctor Doom
  32: 20, //Felicia
  40: 21, //Gambit
  2: 22,  //Guile
  18: 23, //Hayato
  13: 24, //Hulk
  9: 25,  //Iceman
  51: 26, //Iron Man
  17: 27, //Jill
  55: 28, //Jin
  41: 29, //Juggernaut
  39: 30, //Ken
  38: 31, //M.Bison
  44: 32, //Magneto
  22: 33, //Marrow
  28: 34, //Megaman
  3: 35,  //Morrigan
  48: 36, //Omega Red
  8: 37,  //Psylocke
  10: 38, //Rogue
  29: 39, //Roll
  19: 40, //Ruby Heart
  0: 41,  //Ryu
  43: 42, //Sabretooth
  34: 43, //Sakura
  52: 44, //Sentinel
  58: 45, //Servbot
  45: 46, //Shuma-Gorath
  47: 47, //Silver Samurai
  20: 48, //Sonson
  12: 49, //Spider-Man
  49: 50, //Spiral
  42: 51, //Storm
  5: 52,  //Strider Hiryu
  54: 53, //Thanos
  16: 54, //Tron Bonne
  14: 55, //Venom
  46: 56, //War Machine
  7: 57,  //Wolverine (Adamantium)
  57: 58, //Wolverine (Bone)
  1: 59   //Zangief
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

//Names Websafe/Project
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