app.beginUndoGroup("Add Markers & Effects");
    //Select Layer
var myLayer = app.project.activeItem.selectedLayers[0];
    //Create Markers
var myMarkerVal1 = new MarkerValue("Start");
myLayer.property("Marker").setValueAtTime(0, myMarkerVal1);

var myMarkerVal2 = new MarkerValue("End");
myLayer.property("Marker").setValueAtTime(5, myMarkerVal2);
    // Add Effects
         myLayer.property("ADBE Effect Parade").addProperty("ADBE Point Control");
		myLayer.property("ADBE Effect Parade").property(1).name = "inPoint";
		myLayer.property("ADBE Effect Parade").property(1).property("ADBE Point Control-0001").setValue([1440,1080]);
		myLayer.property("ADBE Effect Parade").addProperty("ADBE Point Control");
		myLayer.property("ADBE Effect Parade").property(2).name = "outPoint";
		myLayer.property("ADBE Effect Parade").property(2).property("ADBE Point Control-0001").setValue([1440,1080]);
		myLayer.property("ADBE Transform Group").property("ADBE Position").setValue([1440,1080,0]);
        
    // Apply expressions to properties
	try {
		myLayer.property("ADBE Transform Group").property("ADBE Position").expression = "startMarker = thisLayer.marker.key(1).time;" + "\n" + 
				"endMarker = thisLayer.marker.key(2).time;" + "\n" + 
				"xIn = effect(\"inPoint\")(\"Point\")[0]" + "\n" + 
				"yIn = effect(\"inPoint\")(\"Point\")[1]" + "\n" + 
				"xOut = effect(\"outPoint\")(\"Point\")[0]" + "\n" + 
				"yOut = effect(\"outPoint\")(\"Point\")[1]" + "\n" + 
				"x = ease (time, startMarker, endMarker, xIn, xOut);" + "\n" + 
				"y = ease (time, startMarker, endMarker, yIn, yOut);" + "\n" + 
				"[x,y]";
	} catch (err) {}
    
app.endUndoGroup(); 