app.beginUndoGroup("Opactiy Expression");
var myLayer = app.project.activeItem.selectedLayers[0];
	try {
		myLayer.property("ADBE Transform Group").property("ADBE Opacity").expression = "fadeFrames = 30;" + "\n" + 
				"dur = framesToTime(fadeFrames);" + "\n" + 
				"fadeIn = ease(time, inPoint, inPoint+ dur, 0, 100);" + "\n" + 
				"fadeOut = ease(time, outPoint, outPoint - dur, 0, 100);" + "\n" +
				"fadeIn - fadeOut";
	} catch (err) {}
app.endUndoGroup();