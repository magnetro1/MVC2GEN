//elbouda's derivation of Dan Ebbert's animation-if-x-value expression 😩
time - (function(f)
{
	while(f--) 
		if(thisComp.layer("MasterEvalFunction").text.sourceText.valueAtTime(framesToTime(f+1)).includes("P2_Being_Hit: 0")) //can be any value
	    return framesToTime(f+1);
})(timeToFrames(time)) || time-time;