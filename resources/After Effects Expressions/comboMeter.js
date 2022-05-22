//Expression applied to the text layer that shows the combo meter value (P1 and P2 only-values)
//Common Variables
var cVars = { 
	dataPath : comp("PathString").layer("MainPathString")("Text")("Source Text"),
	ext : ".js" ,
	getStr : function(Px , address)
	{
		let assemble = this.dataPath + Px + address + this.ext;
		$.evalFile(assemble);
		return string.split( "," );
	},
}

// Manual Lookup Function // Needs complete target-address. Ex: "P1_A_Health_Big"
const mnlLookup = function(address)
{ 
	let assemble = cVars.dataPath + address + cVars.ext;
	$.evalFile(assemble); // $.evals an external file containing a variable called "string"
	let check = string.split(",")[timeToFrames(time)];
	if	( isNaN( check ) ) 
		{ return 0 }
	return check;
}


P1_Combo = mnlLookup("P1_Combo_Meter_Value")
P2_Combo = mnlLookup("P2_Combo_Meter_Value")

if ( P1_Combo >= 2 ) { P1_Combo = P1_Combo } else { P1_Combo = '' }
if ( P2_Combo >= 2 ) { P2_Combo = P2_Combo } else { P2_Combo = '' }

P1_Combo + '\r' + P2_Combo
