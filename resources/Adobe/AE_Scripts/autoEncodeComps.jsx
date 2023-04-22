/* eslint-disable */ // XD

// NEEDS '\\' instead of '/' for AME!
var aePath = "D:\\MvC2-F\\Openers\\Assets\\Clips\\Data\\exportToAE";
var myPaths = new Folder(aePath).getFiles();

for (var path = 0; path < myPaths.length; path++) {
  var folderName = myPaths[path].toString().replace(/\/d/g, "D:");
  $.writeln(folderName);
  var fileName = myPaths[path].toString().split("/").pop();

  for (var i = 1; i <= app.project.numItems; i++) {
    if ((app.project.item(i) instanceof CompItem) && (app.project.item(i).name == "PathString")) {
      var myComp = app.project.item(i);
      myComp.layer("MainPathString")("ADBE Text Properties")("ADBE Text Document").setValue(folderName);
      break;
    }
  }

  // Get Normal_Composition comp
  for (var i = 1; i <= app.project.numItems; i++) {
    if ((app.project.item(i) instanceof CompItem) && (app.project.item(i).name == "Normal_Composition")) {
      //Make this composition the active item in the project
      app.project.item(i).openInViewer();
      break;
    }
  }
  // Read the active composition's first layer's source text value
  var myComp = app.project.activeItem;
  // Move the time indicator to the first frame of the composition
  myComp.time = 0;
  // Read the total number of frames in the file and parse it as an integer
  var totalFramesInFile = parseInt(myComp.layer(1).property("Source Text").value); // Reading the FIRST LAYER in Comp.
  $.writeln('Total Frames: ' + totalFramesInFile);
  // Set the composition's work area start time to 0
  myComp.workAreaStart = 0;
  // Convert the totalFramesInFile to seconds using the comp's frame rate
  var totalSecondsInFile = totalFramesInFile / myComp.frameRate;
  $.writeln('Total Seconds: ' + totalSecondsInFile);
  // Set the composition's work area duration to the total seconds in the file
  myComp.workAreaDuration = totalSecondsInFile;

  // Push to AME
  var pathToOutput = aePath;
  var rqItem = app.project.renderQueue.items.add(myComp);
  var module = rqItem.outputModule(1);
  // Name output file after the fileName from myPaths array
  module.file = File(pathToOutput + fileName);
  // set the encoding preset output module to Cineform_RGBA
  module.applyTemplate("CineformRGBA");
  // set the output module to use the last-used settings
  app.project.renderQueue.queueInAME(true);
  // Wait for the file to populate to finish
  $.sleep(2400);
}
