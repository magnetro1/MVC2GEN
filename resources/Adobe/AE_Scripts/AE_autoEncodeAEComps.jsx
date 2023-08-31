/* eslint-disable */ // XD
//! Make sure AME is set to CineformARGB!
//! Use '\\' instead of '/' for AME!
var dataPath = "H:\\Git\\MVC2GEN\\resources\\Both_Emulator_Resources\\JS_Utils\\exportToAE"; //⭐
// Output path for the video files
// var videoPath = "D:\\MvC2-F\\Openers\\Assets\\Clips\\fromAE\\"; // Openers
var videoPath = "D:\\MvC2-F\\Storm_Modified_AirDash\\Assets\\Clips\\fromAE\\"; //⭐

var getDataArr = new Folder(dataPath).getFiles();
$.writeln(getDataArr);

for (var fldr = 0; fldr < getDataArr.length; fldr++) {
  var folderName = getDataArr[fldr].toString().replace(/^\/([a-z])/, "$1:") // removes the first '/' and replaces it with the drive letter
  if (folderName.match(/\./g)) {
    $.writeln('Skipping File: ' + folderName);
    continue;
  }
  var fileName = getDataArr[fldr].toString().split("/").pop();
  $.writeln('Data: ' + fileName);
  // Set the path into the text layer
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
  myComp.workAreaStart = 0;
  var totalSecondsInFile = totalFramesInFile / myComp.frameRate; // 60fps translation to seconds.
  $.writeln('Total Seconds: ' + Math.round(totalSecondsInFile));
  // Set the composition's work area duration to the total seconds in the file
  myComp.workAreaDuration = totalSecondsInFile;

  // Push to AME
  var rqItem = app.project.renderQueue.items.add(myComp);
  var module = rqItem.outputModule(1);
  // Name output file after the fileName from myPaths array
  module.file = File(videoPath + fileName);
  module.applyTemplate("CineformRGBA"); // doesn't do anything?
  app.project.renderQueue.queueInAME(false); // auto-starts the render
  $.sleep(2400);
}
