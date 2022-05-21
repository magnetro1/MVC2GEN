// Prints P1_x value ( edit lines 4 & 5, ex: "P1_Point: ")
var masterEval = thisComp.layer("MasterEvalFunction").text.sourceText; //hidden string that contains info
// Regex to capture entire row
var P1Exp = /(P1_Point: )(.*)(\r|\n)/g;
var P2Exp = /(P2_Point: )(.*)(\r|\n)/g;
var Px_ValueExp = /^(.+?)\s/g; // captures 'Px_Point: '
// Match Px_Point row up to return/new line
var P1Str = String(masterEval.match(P1Exp));
var P2Str = String(masterEval.match(P2Exp));
// Removes 'Px_Point: ', splits the names and prints the first value
var P1Output = P1Str.replace(Px_ValueExp , '').split(',')[0];
var P2Output = P2Str.replace(Px_ValueExp , '').split(',')[0];

P1Output + '\r' + P2Output
