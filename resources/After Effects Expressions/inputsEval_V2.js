// InputLookup to grab multiple rows of inputsDEC // Needs complete address. Ex: "P1_Input_DEC"
const fnInputLookup = function(address)
{
	let dataPath = comp("PathString").layer("MainPathString")("Text")("Source Text");
	let assemble = dataPath + address + '.js';
	$.evalFile(assemble); // $.evals an external file containing a variable called "string"
	let check = string.split(",");
	let frame = [timeToFrames(time)];
	let result = check[frame];
	let fnStr = "";
	
	try 
	{
		for ( i = 11 ; i > frame.length ; i--)
		{
			fnStr += check[ frame -i + 3 ] + ","
		}
	
		let inputSplit = fnStr.split(',');
	
		if ( !isNaN(inputSplit) )
			{ 
				return 0
			}
		return inputSplit
	}
	catch(e)
	{ 
		return 0 
	}
}
//Convert Decimal-input values to Font/Notation.
//KV Conversion
var buttonConversion = 
{ 
	"6" : 1024, 	// 6 = right
	"4" : 2048, 	// 4 = left
	"2" : 4096, 	// 2 = down
	"8" : 8192, 	// 8 = up
	"u" : 512, 		// LP = u
	"j" : 64,		// LK = j
	"i" : 256,		// HP = i
	"k" : 32,		// HK = k
	"o" : 128,		// A1 = o
	"l" : 16,		// A2 = l
	"(" : 32768, 	// START = (
	")" : 2,		// SELECT = )
};


//P1 &'ing
var inputsDECP1 = fnInputLookup("P1_Input_DEC");
var inputsFinalP1 = "";

for ( let i = 0; i < inputsDECP1.length ; i++ )
{
	for ( let b = 0 ; b < Object.entries(buttonConversion).length ; b++ ) 
	{
		if ( ( inputsDECP1[i] & Object.values(buttonConversion)[b] ) != 0 )
		{ 
			inputsFinalP1 += Object.keys(buttonConversion)[b]
		}
	}
	inputsFinalP1 += "\r"
}
//Fix diagonals
P1_Final = inputsFinalP1
	.replace( /24/gi , '1' )
	.replace( /84/gi , '7' )
	.replace( /26/gi , '3' )
	.replace( /86/gi , '9' )
	.replace( /48/gi , '7' )
	.replace( /68/gi , '9' )


//P2 &'ing
var inputsDECP2 = fnInputLookup("P2_Input_DEC");
var inputsFinalP2 = "";

for ( let i = 0; i < inputsDECP2.length ; i++ )
{
	for ( let b = 0 ; b < Object.entries(buttonConversion).length ; b++ ) 
	{
		if ( ( inputsDECP2[i] & Object.values(buttonConversion)[b] ) != 0 )
		{ 
			inputsFinalP2 += Object.keys(buttonConversion)[b]
		}
	}
	inputsFinalP2 += "\r"
}
//Fix diagonals
P2_Final = inputsFinalP2
	.replace( /24/gi , '1' )
	.replace( /84/gi , '7' )
	.replace( /26/gi , '3' )
	.replace( /86/gi , '9' )
	.replace( /48/gi , '7' )
	.replace( /68/gi , '9' )

P1_Final + "\r" + P2_Final //Using a return-carriage to separate the inputs; need to add position property change to have them display right