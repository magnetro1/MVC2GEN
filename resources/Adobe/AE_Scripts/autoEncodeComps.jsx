/* eslint-disable */ // XD

// NEEDS '\\' instead of '/' for AME!
// var dataPath = "H:\\Git\\MVC2GEN\\resources\\Both_Emulator_Resources\\JS_Utils\\exportToAE";
var dataPath = "D:\\MvC2-F\\Openers\\Assets\\Clips\\Data\\exportToAE";
var videoPath = "D:\\MvC2-F\\Openers\\Assets\\Clips\\fromAE";
var getDataArr = new Folder(dataPath).getFiles();

for (var fldr = 0; fldr < getDataArr.length; fldr++) {
  var folderName = getDataArr[fldr].toString().replace(/\/d/g, "D:");
  $.writeln(folderName);
  var fileName = getDataArr[fldr].toString().split("/").pop();

  // Write/Set the path into the text layer
  for (var i = 1; i <= app.project.numItems; i++) {
    if ((app.project.item(i) instanceof CompItem) && (app.project.item(i).name == "PathString")) {
      var myComp = app.project.item(i);
      myComp.layer("MainPathString")("ADBE Text Properties")("ADBE Text Document").setValue(folderName);
      break;
    }
  }

  // Get Normal_Composition comp and make it active.
  for (var i = 1; i <= app.project.numItems; i++) {
    if ((app.project.item(i) instanceof CompItem) && (app.project.item(i).name == "Normal_Composition")) {
      //Make this composition the active item in the project
      app.project.item(i).openInViewer();
      break;
    }
  }
  // Set the Normal_Comp's in/out points

  var myComp = app.project.activeItem;
  myComp.time = 0;
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

  var rqItem = app.project.renderQueue.items.add(myComp);
  var module = rqItem.outputModule(1);
  // Name output file after the fileName from myPaths array
  module.file = File(videoPath + fileName);
  // set the encoding preset output module to Cineform_RGBA
  module.applyTemplate("CineformRGBA");
  // set the output module to use the last-used settings
  app.project.renderQueue.queueInAME(true);
  // Wait for the file to populate to finish
  $.sleep(2400);
}
