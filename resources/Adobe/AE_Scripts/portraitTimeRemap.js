//TimeRemap expression to set time based on the character value
//P1
var masterEval = thisComp.layer("MasterEvalFunction").text.sourceText;
var P1Exp = /(P1_Point_ID_2: )(.*)(\r|\n)/g;
var Px_ValueExp = /^(.+?)\s/g;

var P1Str = String(masterEval.match(P1Exp));
var P1Output = P1Str.replace(Px_ValueExp , '').split(',')[0];
//P2
// var masterEval = thisComp.layer("MasterEvalFunction").text.sourceText;
// var P2Exp = /(P2_Point_ID_2: )(.*)(\r|\n)/g;
// var Px_ValueExp = /^(.+?)\s/g;

// var P2Str = String(masterEval.match(P2Exp));
// var P2Output = P2Str.replace(Px_ValueExp , '').split(',')[0];

// Object containing character ID_2 value keys and timeRemap values.
//Decimal value : Time (second) value
var portraitsDecToTime = 
{
	24	:	1,  //Abyss-1
	25	:	2,  //Abyss-2
	26	:	3,  //Abyss-3
	30	:	4,  //Akuma
	21	:	5,  //Amingo
	4	:	6,  //Anakaris
	31	:	7,  //B.B. Hood
	53	:	8,  //Blackheart
	23	:	9,  //Cable
	36	:	10, //Cammy
	11	:	11, //Captain America
	56	:	12, //Captain Commando
	33	:	13, //Charlie
	27	:	14, //Chun-Li
	50	:	15, //Colossus
	6	:	16, //Cyclops
	35	:	17, //Dan
	37	:	18, //Dhalsim
	15	:	19, //Doctor Doom
	32	:	20, //Felicia
	40	:	21, //Gambit
	2	:	22, //Guile
	18	:	23, //Hayato
	13	:	24, //Hulk
	9	:	25, //Iceman
	51	:	26, //Iron Man
	17	:	27, //Jill
	55	:	28, //Jin
	41	:	29, //Juggernaut
	39	:	30, //Ken
	38	:	31, //M.Bison
	44	:	32, //Magneto
	22	:	33, //Marrow
	28	:	34, //Megaman
	3	:	35, //Morrigan
	48	:	36, //Omega Red
	8	:	37, //Psylocke
	10	:	38, //Rogue
	29	:	39, //Roll
	19	:	40, //Ruby Heart
	0	:	41, //Ryu
	43	:	42, //Sabretooth
	34	:	43, //Sakura
	52	:	44, //Sentinel
	58	:	45, //Servbot
	45	:	46, //Shuma-Gorath
	47	:	47, //Silver Samurai
	20	:	48, //Sonson
	12	:	49, //Spider-Man
	49	:	50, //Spiral
	42	:	51, //Storm
	5	:	52, //Strider Hiryu
	54	:	53, //Thanos
	16	:	54, //Tron Bonne
	14	:	55, //Venom
	46	:	56, //War Machine
	7	:	57, //Wolverine (Adamantium)
	57	:	58, //Wolverine (Bone)
	1	:	59, //Zangief
}

Object.values(portraitsDecToTime) [ parseInt( P1Output /*or P2Output*/ ) ];