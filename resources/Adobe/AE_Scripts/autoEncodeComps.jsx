/* eslint-disable */ // XD

// NEEDS '\\' instead of '/' for AME!
var myPaths =
  [
    "H:\\Git\\MVC2GEN\\resources\\Both_Emulator_Resources\\JS_Utils\\exportToAE\\Opener_1_pcsx2_Original",
    "H:\\Git\\MVC2GEN\\resources\\Both_Emulator_Resources\\JS_Utils\\exportToAE\\Opener_2_pccsx2_Original",
    "H:\\Git\\MVC2GEN\\resources\\Both_Emulator_Resources\\JS_Utils\\exportToAE\\Opener_3_pccsx2_Original",
    "H:\\Git\\MVC2GEN\\resources\\Both_Emulator_Resources\\JS_Utils\\exportToAE\\Opener_4_pccsx2__Original",
    "H:\\Git\\MVC2GEN\\resources\\Both_Emulator_Resources\\JS_Utils\\exportToAE\\Opener_5_pccsx2__Original",
    "H:\\Git\\MVC2GEN\\resources\\Both_Emulator_Resources\\JS_Utils\\exportToAE\\Opener_6_pcsx2_Original",
    "H:\\Git\\MVC2GEN\\resources\\Both_Emulator_Resources\\JS_Utils\\exportToAE\\Opener_7_pcsx2_Original",
    "H:\\Git\\MVC2GEN\\resources\\Both_Emulator_Resources\\JS_Utils\\exportToAE\\Opener_8_pcsx2_Original",
    "H:\\Git\\MVC2GEN\\resources\\Both_Emulator_Resources\\JS_Utils\\exportToAE\\Opener_9_pcsx2_Original",
    "H:\\Git\\MVC2GEN\\resources\\Both_Emulator_Resources\\JS_Utils\\exportToAE\\Opener_10_pcsx2_Original",
    "H:\\Git\\MVC2GEN\\resources\\Both_Emulator_Resources\\JS_Utils\\exportToAE\\Opener_11_pcsx2_Original",
    "H:\\Git\\MVC2GEN\\resources\\Both_Emulator_Resources\\JS_Utils\\exportToAE\\Opener_12_pcsx2_Original",
    "H:\\Git\\MVC2GEN\\resources\\Both_Emulator_Resources\\JS_Utils\\exportToAE\\Opener_13_pcsx2_Original",
    "H:\\Git\\MVC2GEN\\resources\\Both_Emulator_Resources\\JS_Utils\\exportToAE\\Opener_14_pcsx2_Original",
    "H:\\Git\\MVC2GEN\\resources\\Both_Emulator_Resources\\JS_Utils\\exportToAE\\Opener_15_pcsx2_Original",
    "H:\\Git\\MVC2GEN\\resources\\Both_Emulator_Resources\\JS_Utils\\exportToAE\\Opener_16_pcsx2_Original",
    "H:\\Git\\MVC2GEN\\resources\\Both_Emulator_Resources\\JS_Utils\\exportToAE\\Opener_17_pcsx2_Original",
    "H:\\Git\\MVC2GEN\\resources\\Both_Emulator_Resources\\JS_Utils\\exportToAE\\Opener_18_pcsx2_Original",
    "H:\\Git\\MVC2GEN\\resources\\Both_Emulator_Resources\\JS_Utils\\exportToAE\\Opener_19_pcsx2_Original",
    "H:\\Git\\MVC2GEN\\resources\\Both_Emulator_Resources\\JS_Utils\\exportToAE\\Opener_20_pcsx2_Original",
    "H:\\Git\\MVC2GEN\\resources\\Both_Emulator_Resources\\JS_Utils\\exportToAE\\Opener_21_pcsx2_Original",
    "H:\\Git\\MVC2GEN\\resources\\Both_Emulator_Resources\\JS_Utils\\exportToAE\\Opener_22_pcsx2_Original",
    "H:\\Git\\MVC2GEN\\resources\\Both_Emulator_Resources\\JS_Utils\\exportToAE\\Opener_23_pcsx2_Original",
    "H:\\Git\\MVC2GEN\\resources\\Both_Emulator_Resources\\JS_Utils\\exportToAE\\Opener_24_pcsx2_Original",
    "H:\\Git\\MVC2GEN\\resources\\Both_Emulator_Resources\\JS_Utils\\exportToAE\\Opener_25_pcsx2_Original",
    "H:\\Git\\MVC2GEN\\resources\\Both_Emulator_Resources\\JS_Utils\\exportToAE\\Opener_26_pcsx2_Original",
    "H:\\Git\\MVC2GEN\\resources\\Both_Emulator_Resources\\JS_Utils\\exportToAE\\Opener_27_pcsx2_Original",
    "H:\\Git\\MVC2GEN\\resources\\Both_Emulator_Resources\\JS_Utils\\exportToAE\\Opener_28_pcsx2_Original",
    "H:\\Git\\MVC2GEN\\resources\\Both_Emulator_Resources\\JS_Utils\\exportToAE\\Opener_29_pcsx2_Original",
    "H:\\Git\\MVC2GEN\\resources\\Both_Emulator_Resources\\JS_Utils\\exportToAE\\Opener_30_pcsx2_Original",
  ];
for (var path = 0; path < myPaths.length; path++) {
  // Get file name from the path list of each item in the array
  var fileName = myPaths[path].split("\\").pop();
  // Get PathString comp
  $.writeln('Path: ' + myPaths[path])

  for (var i = 1; i <= app.project.numItems; i++) {
    if ((app.project.item(i) instanceof CompItem) && (app.project.item(i).name == "PathString")) {
      var myComp = app.project.item(i);
      myComp.layer("MainPathString")("ADBE Text Properties")("ADBE Text Document").setValue(myPaths[path])
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
  var pathToOutput = "H:\\Git\\MVC2GEN\\resources\\Adobe\\AE_Scripts\\";
  var rqItem = app.project.renderQueue.items.add(myComp);
  var module = rqItem.outputModule(1);
  // Name output file after the fileName from myPaths array
  module.file = File(pathToOutput + fileName);
  // set the encoding preset output module to Cineform_RGBA
  module.applyTemplate("CineformRGBA");
  // set the output module to use the last-used settings
  app.project.renderQueue.queueInAME(true);
  // Wait for the file to populate to finish
  $.sleep(2000);
}
