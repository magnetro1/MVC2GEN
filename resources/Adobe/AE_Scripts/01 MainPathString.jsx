compCode_NaN_213658();
function compCode_NaN_213658() {

app.beginUndoGroup("PathString");

try {

// Create Compositions
	var pathstring_comp = app.project.items.addComp("PathString", 2880, 2160, 1, 9.84317650984318, 59.9400024414063);
		pathstring_comp.time = 0;
		pathstring_comp.bgColor = [0.18823529411765,0.24705882352941,0.32941176470588];

// Working with comp "PathString", varName "pathstring_comp";
	pathstring_comp.openInViewer();
	var mainpathstring = pathstring_comp.layers.addText("F:\\New Folder\\Dhalsim Revisited\\00_Dhalsim_Revisited_Template\\Output");
		mainpathstring.name = "MainPathString";
		mainpathstring.label = 14;
		mainpathstring.startTime = -0.11665832499166;
		mainpathstring.outPoint = 58.8833416750083;
		mainpathstring.moveToEnd();
		var mainpathstring_TextProp = mainpathstring.property("ADBE Text Properties").property("ADBE Text Document");
		var mainpathstring_TextDocument = mainpathstring_TextProp.value;
			mainpathstring_TextDocument.font = "DejaVuSansMono-Bold";
			mainpathstring_TextDocument.fontSize = 50;
			mainpathstring_TextDocument.applyFill = true;
			mainpathstring_TextDocument.fillColor = [1,1,1];
			mainpathstring_TextDocument.applyStroke = true;
			mainpathstring_TextDocument.strokeColor = [0,0,0];
			mainpathstring_TextDocument.strokeWidth = 0.00999999977648;
			mainpathstring_TextDocument.strokeOverFill = false;
			mainpathstring_TextDocument.justification = ParagraphJustification.CENTER_JUSTIFY;
			mainpathstring_TextDocument.tracking = 0;
			if (parseFloat(app.version) >= 13.2 ) {
				mainpathstring_TextDocument.verticalScale = 1;
				mainpathstring_TextDocument.horizontalScale = 1;
				mainpathstring_TextDocument.baselineShift = 0;
				mainpathstring_TextDocument.tsume = 0;
				// These values are read-only. You have to set them manually in the comp.
				// mainpathstring_TextDocument.fauxBold = false;
				// mainpathstring_TextDocument.fauxItalic = false;
				// mainpathstring_TextDocument.allCaps = false;
				// mainpathstring_TextDocument.smallCaps = false;
				// mainpathstring_TextDocument.superscript = false;
				// mainpathstring_TextDocument.subscript = false;
			}
			mainpathstring_TextProp.setValue(mainpathstring_TextDocument);
		mainpathstring.property("ADBE Transform Group").property("ADBE Anchor Point").setValue([0.29296875,-15.1245107650757,0]);


	// Apply expressions to properties
	try {
		mainpathstring.property("ADBE Text Properties").property("ADBE Text Document").expression = "value + \"\\\\\"";
	} catch (err) {}

pathstring_comp.openInViewer();
} catch(e) {
	alert(e.toString() + "\nError on line: " + e.line.toString());
}
app.endUndoGroup();


}

