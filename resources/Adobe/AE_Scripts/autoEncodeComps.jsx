var myPaths =
  [
    "D:\\MvC2-F\\Openers\\Assets\\Clips\\Data\\exportToAE\\Opener_1",
    "D:\\MvC2-F\\Openers\\Assets\\Clips\\Data\\exportToAE\\Opener_2",
    "D:\\MvC2-F\\Openers\\Assets\\Clips\\Data\\exportToAE\\Opener_3",
    "D:\\MvC2-F\\Openers\\Assets\\Clips\\Data\\exportToAE\\Opener_4",
    "D:\\MvC2-F\\Openers\\Assets\\Clips\\Data\\exportToAE\\Opener_5",
    "D:\\MvC2-F\\Openers\\Assets\\Clips\\Data\\exportToAE\\Opener_6",
    "D:\\MvC2-F\\Openers\\Assets\\Clips\\Data\\exportToAE\\Opener_7",
    "D:\\MvC2-F\\Openers\\Assets\\Clips\\Data\\exportToAE\\Opener_8",
    "D:\\MvC2-F\\Openers\\Assets\\Clips\\Data\\exportToAE\\Opener_9",
    "D:\\MvC2-F\\Openers\\Assets\\Clips\\Data\\exportToAE\\Opener_10",
    "D:\\MvC2-F\\Openers\\Assets\\Clips\\Data\\exportToAE\\Opener_11",
    "D:\\MvC2-F\\Openers\\Assets\\Clips\\Data\\exportToAE\\Opener_12",
    "D:\\MvC2-F\\Openers\\Assets\\Clips\\Data\\exportToAE\\Opener_13",
    "D:\\MvC2-F\\Openers\\Assets\\Clips\\Data\\exportToAE\\Opener_14",
    "D:\\MvC2-F\\Openers\\Assets\\Clips\\Data\\exportToAE\\Opener_15",
    "D:\\MvC2-F\\Openers\\Assets\\Clips\\Data\\exportToAE\\Opener_16",
    "D:\\MvC2-F\\Openers\\Assets\\Clips\\Data\\exportToAE\\Opener_17",
    "D:\\MvC2-F\\Openers\\Assets\\Clips\\Data\\exportToAE\\Opener_18",
    "D:\\MvC2-F\\Openers\\Assets\\Clips\\Data\\exportToAE\\Opener_19",
    "D:\\MvC2-F\\Openers\\Assets\\Clips\\Data\\exportToAE\\Opener_20",
    "D:\\MvC2-F\\Openers\\Assets\\Clips\\Data\\exportToAE\\Opener_21",
    "D:\\MvC2-F\\Openers\\Assets\\Clips\\Data\\exportToAE\\Opener_22",
    "D:\\MvC2-F\\Openers\\Assets\\Clips\\Data\\exportToAE\\Opener_23",
    "D:\\MvC2-F\\Openers\\Assets\\Clips\\Data\\exportToAE\\Opener_24",
    "D:\\MvC2-F\\Openers\\Assets\\Clips\\Data\\exportToAE\\Opener_25",
    "D:\\MvC2-F\\Openers\\Assets\\Clips\\Data\\exportToAE\\Opener_26",
    "D:\\MvC2-F\\Openers\\Assets\\Clips\\Data\\exportToAE\\Opener_27",
    "D:\\MvC2-F\\Openers\\Assets\\Clips\\Data\\exportToAE\\Opener_28",
    "D:\\MvC2-F\\Openers\\Assets\\Clips\\Data\\exportToAE\\Opener_29",
    "D:\\MvC2-F\\Openers\\Assets\\Clips\\Data\\exportToAE\\Opener_30",
  ];

for (var path = 0; path < myPaths.length; path++)
{
  // Get file name from the path list of each item in the array
  var fileName = myPaths[path].split("\\").pop();
  // Get PathString comp
  for (var i = 1; i <= app.project.numItems; i++)
  {
    if ((app.project.item(i) instanceof CompItem) && (app.project.item(i).name == "PathString"))
    {
      var myComp = app.project.item(i);
      myComp.layer("MainPathString")("ADBE Text Properties")("ADBE Text Document").setValue(myPaths[path])
      break;
    }
  }

  // Get Normal_Composition comp
  for (var i = 1; i <= app.project.numItems; i++)
  {
    if ((app.project.item(i) instanceof CompItem) && (app.project.item(i).name == "Normal_Composition"))
    {
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
  // Set the composition's work area start time to 0
  myComp.workAreaStart = 0;
  // Convert the totalFramesInFile to seconds using the comp's frame rate
  var totalSecondsInFile = totalFramesInFile / myComp.frameRate;
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
  app.project.renderQueue.queueInAME(false);
  // Wait for the file to populate to finish
  $.sleep(2000);
}