// Might need images to make this stuff easier to understand.
// Stage Lookup to determine color
// Manual Lookup Function // Needs complete target-address. Ex: "P1_A_Health_Big"
const mnlLookup = function(address)
{
	let dataPath = comp("PathString").layer("MainPathString")("Text")("Source Text");
	let assemble = dataPath + address + '.js'
	$.evalFile(assemble); // $.evals an external file containing a variable called "string"
	let check = string.split(",")[timeToFrames(time)];
	if	( isNaN( check ) ) 
		{ return 0 }
	return check;
}
//Get stage value
stageResult = mnlLookup("Stage_Selector");
//Object to map colors to address values. 
const stagesTable = 
{
	0	: hexToRgb("0x142030"),	//"Boat1"
	1	: hexToRgb("0xE1540C"),	//"Desert1"
	2	: hexToRgb("0x6D574F"),	//"Factory"
	3	: hexToRgb("0xCF461B"),	//"Carnival1"
	4	: hexToRgb("0xECE4B9"),	//"Bridge1"
	5	: hexToRgb("0x257B8A"),	//"Cave2"
	6	: hexToRgb("0xD0C1AC"),	//"Clock2"
	7	: hexToRgb("0xB764AA"),	//"Raft2"
	8	: hexToRgb("0x263548"), //"Abyss"
	9	: hexToRgb("0xC09A71"),	//"Boat2"
	10	: hexToRgb("0x3F5FFF"),	//"Desert2"
	11	: hexToRgb("0x266D04"),	//"Training"
	12	: hexToRgb("0x74566E"),	//"Carnival2"
	13	: hexToRgb("0xE9797F"),	//"Bridge2"
	14	: hexToRgb("0xA43812"),	//"Cave1"
	15	: hexToRgb("0x888885"),	//"Clock1"
	16	: hexToRgb("0x8CA7DF"),	//"Raft1"
} 
//Set UI color depending on the value
if 		( stageResult == 0 ) { stagesTable[0] } 
else if	( stageResult == 1 ) { stagesTable[1] }
else if	( stageResult == 2 ) { stagesTable[2] }
else if	( stageResult == 3 ) { stagesTable[3] }
else if	( stageResult == 4 ) { stagesTable[4] }
else if	( stageResult == 5 ) { stagesTable[5] }
else if	( stageResult == 6 ) { stagesTable[6] }
else if	( stageResult == 7 ) { stagesTable[7] }
else if	( stageResult == 8 ) { stagesTable[8] }
else if	( stageResult == 9 ) { stagesTable[9] }
else if	( stageResult == 10 ) { stagesTable[10] }
else if	( stageResult == 11 ) { stagesTable[11] }
else if	( stageResult == 12 ) { stagesTable[12] }
else if	( stageResult == 13 ) { stagesTable[13] }
else if	( stageResult == 14 ) { stagesTable[14] }
else if	( stageResult == 15 ) { stagesTable[15] }
else if	( stageResult == 16 ) { stagesTable[16] }
else { value }