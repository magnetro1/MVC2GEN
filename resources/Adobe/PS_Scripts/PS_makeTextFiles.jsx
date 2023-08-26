// Static Stuff
var allCharListArray = [
  'Abyss-A',
  'Abyss-B',
  'Abyss-C',
  'Akuma',
  'Amingo',
  'Anakaris',
  'B.B. Hood',
  'Blackheart',
  'Cable',
  'Cammy',
  'Captain America',
  'Captain Commando',
  'Charlie',
  'Chun-Li',
  'Colossus',
  'Cyclops',
  'Dan',
  'Dhalsim',
  'Doctor Doom',
  'Felicia',
  'Gambit',
  'Guile',
  'Hayato',
  'Hulk',
  'Iceman',
  'Iron Man',
  'Jill',
  'Jin',
  'Juggernaut',
  'Ken',
  'M.Bison',
  'Magneto',
  'Marrow',
  'Megaman',
  'Morrigan',
  'Omega Red',
  'Psylocke',
  'Rogue',
  'Roll',
  'Ruby Heart',
  'Ryu',
  'Sabretooth',
  'Sakura',
  'Sentinel',
  'Servbot',
  'Shuma-Gorath',
  'Silver Samurai',
  'Sonson',
  'Spider-Man',
  'Spiral',
  'Storm',
  'Strider Hiryu',
  'Thanos',
  'Tron Bonne',
  'Venom',
  'War Machine',
  'Wolverine-B',
  'Wolverine',
  'Zangief',
];
var fontsAllObj = {
  'COTA_01': 'COTAWINRegular',
  'COTA_02': 'COTAWINType2',
  'COTA_03': 'COTAWINType3',
  'COTA_04': 'COTAWINType4',
  'COTA_05': 'COTAWINType5',
  'COTA_06': 'COTAWINType6',
  'COTA_07': 'COTAWINType7',
  'CVS2_01': 'CVS2500Regular',
  'MSH_01': 'MSHRegular',
  'MSH_02': 'MSHType2',
  'MSH_03': 'MSHType3',
  'MSH_04': 'MSHType4',
  'MVSF_01': 'MVCMVSFRegular',
  'MVSF_02': 'MVCMVSFType0',
  'MVSF_03': 'MVCMVSFType1',
  'MVSF_04': 'MVCMVSFType3',
  'MVSF_05': 'MVCMVSFType4',
  'MVSF_06': 'MVCMVSFType6',
  'MVC1_01': 'MvC1Font1MvC1Type2',
  'MVC1_02': 'MvC1Font1Type3',
  'MVC1_03': 'MvC1Font1Type4',
  'MVC1_04': 'MvC1Type1Regular',
  'MVC2_01': 'MvC2Font1Regular',
  'MVC2_02': 'MvC2FontType2',
  'MVC2_03': 'MvC2FontType3',
  'MVC2_04': 'MvC2Type4',
  'SFA3_01': 'SFA3Name1Regular',
  'SFA3_02': 'SFA3Name2Regular',
  'XVSF_01': 'XvSFRegular',
  'XVSF_02': 'XvSFType2',
  'XVSF_03': 'XvSFType3',
  'XVSF_04': 'XvSFType4',
};
// "Main" fonts for point-text/titles
var fontsMainObj = {
  'COTA': 'COTAWINType4',
  'CVS2': 'CVS2500Regular',
  'MSH': 'MSHRegular',
  'MVC1': 'MvC1Type1Regular',
  // 'MVC2': 'MvC2FontType1',
  'MVC2': 'MvC2FontType2',
  'MVSF': 'MVCMVSFType1',
  'SFA3': 'SFA3Name1Regular',
  'XVSF': 'XvSFRegular',
};
// "Sub" fonts for paragraph-text
var fontsSubOneObj = {
  'COTA': 'COTAWINType2',
  'CVS2': 'CVS2500Regular',
  'MSH': 'MSHType3',
  'MVSF': 'MVCMVSFRegular',
  'MVC1': 'MvC1Font1MvC1Type2',
  'MVC2': 'MvC2Type4',
  'SFA3': 'SFA3Name2Regular',
  'XVSF': 'XvSFType5',
};

// Global Variables
// var GLOBAL_OUTPUT_FOLDER = 'H:/Git/MVC2GEN/resources/After Effects Projects+/Tutorial_3/AdobeScripts/Photoshop';
var GLOBAL_OUTPUT_FOLDER = 'I:/';
var GLOBAL_PARAGRAPH_TEXT = '';
var GLOBAL_POINT_TEXT = '';
var GLOBAL_POINT_ARRAY = '';
var GLOBAL_PARAGRAPH_ARRAY = '';

// Get the date for names
function getDateStamp() {
  var date = new Date();
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var day = date.getDate();
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var seconds = date.getSeconds();

  var dateStamp = year.toString() + '-'
    + month.toString() + '-'
    + day.toString() + '-'
    + hours.toString() + '-'
    + minutes.toString() + '-'
    + seconds.toString();
  return dateStamp;
}
/**
 * @description Creates a PNG for each font, filled with letters, numbers and symbols.
 */
function createFontReferencePNGs() {
  var loremIpsum = '0123456789-' + '\r'
    + 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' + '\r'
    + 'abcdefghijklmnopqrstuvwxyz' + '\r'
    + '`~!@#$%^&*()_=+[]{};:",<.>/?\'';

  for (var font in fontsAllObj) {
    var iterativeEntry = fontsAllObj[font]
    var newDocument = app.documents.add(2020, 2050, 72, iterativeEntry, NewDocumentMode.RGB, DocumentFill.TRANSPARENT);
    var layers = newDocument.artLayers;
    var newLayer = layers.add();

    newLayer.name = iterativeEntry;
    newLayer.kind = LayerKind.TEXT;

    var textItem = newLayer.textItem;
    textItem.contents = loremIpsum;
    textItem.font = iterativeEntry;
    textItem.size = 50;
    textItem.justification = Justification.LEFT;
    textItem.position = [0, (newDocument.height * .5)];
    app.activeDocument.trim(TrimType.TRANSPARENT, true, true, true, true);
    layers[1].remove();

    try {
      // Check if directory exists
      var outputFolder = GLOBAL_OUTPUT_FOLDER + 'fontReference' + '/';
      var folder = new Folder(outputFolder);
      if (!folder.exists) {
        folder.create();
      }
      var saveFilePNG = new File(new File(outputFolder + '/' + iterativeEntry + '.png'));
      if (saveFilePNG.exists) {
        app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);
        continue;
      }
      else {
        SavePNG(saveFilePNG);
      }
    }
    catch (error) {
      alert("The source document is unsaved!");
    }
  }
}

/**
 * @param {string} fnFont get font name from font objects
 * @param {string} fnExt set PNG || PSD
 * @description Creates a PNG for each character name, using the 'main' font of the game
 */
function createAllCharacterTitlesPNGs(fnFont) {
  for (var i = 0; i < allCharListArray.length; i++) {
    var iterativeEntry = allCharListArray[i];
    var newDocument = app.documents.add(4000, 4000, 72, iterativeEntry, NewDocumentMode.RGB, DocumentFill.TRANSPARENT);
    var layers = newDocument.artLayers;
    var newLayer = layers.add();
    newLayer.name = iterativeEntry;
    newLayer.kind = LayerKind.TEXT;
    var textItem = newLayer.textItem;
    // adjust text appearance
    textItem.contents = allCharListArray[i];
    textItem.font = fnFont;
    textItem.size = 200;
    // set image on left side
    textItem.justification = Justification.LEFT;
    textItem.position = [0, (newDocument.height * .5)];
    app.activeDocument.trim(TrimType.TRANSPARENT, true, true, true, true);
    // delete bottom layer (Layer 1)
    layers[1].remove();
    var fnExt = 'png';

    // Switch the value of funcFont to the key of the object
    var tempKeyStr = '';
    for (var key in fontsMainObj) {
      if (fontsMainObj[key] == fnFont) {
        tempKeyStr = key;
      }
    }
    // Check if directory exists
    var outputFolder = GLOBAL_OUTPUT_FOLDER + 'characterTitles' + '/' + tempKeyStr + '/';
    var folder = new Folder(outputFolder);
    if (!folder.exists) {
      folder.create();
    }
    // Save the file
    if (fnExt == 'PNG'
      || fnExt == 'png') {
      var saveFilePNG = new File(new File(outputFolder + 'Title_' + iterativeEntry + '_' + tempKeyStr + '.png'));
      SavePNG(saveFilePNG);
    }
    else if (fnExt == 'PSD'
      || fnExt == 'psd') {
      var saveFilePSD = new File(new File(outputFolder + 'Title_' + iterativeEntry + '_' + tempKeyStr + '.psd'));
      SavePSD(saveFilePSD);
    }
  }
}

/**
 *
 * @param {string} fnFont get font name from fontsAllObj
 * @param {number} fnSize set font size of point text
 * @param {string} fnExt set PNG || PSD
 * @param {boolean} promptOrNot set true for prompt || false for GLOBAL_POINT_TEXT
 */
function writePointText(fnFont, fnSize, fnExt, promptOrNot) {
  var newDocument = app.documents.add(4000, 4000, 72, 'name', NewDocumentMode.RGB, DocumentFill.TRANSPARENT);
  var layers = newDocument.artLayers;
  var newLayer = layers.add();
  newLayer.name = 'name';
  newLayer.kind = LayerKind.TEXT;
  var pointTextItem = newLayer.textItem;
  if (promptOrNot == true) {
    var promptAnswer = prompt("Enter text", "Will be used for Content and FileName");
    pointTextItem.contents = promptAnswer
  }
  else if (promptOrNot == false) {
    pointTextItem.contents = GLOBAL_POINT_TEXT;
  }
  pointTextItem.font = fnFont;
  pointTextItem.size = fnSize;
  // set image on left side
  pointTextItem.justification = Justification.LEFT;
  pointTextItem.position = [0, (newDocument.height * .5)];
  app.activeDocument.trim(TrimType.TRANSPARENT, true, true, true, true);
  // delete bottom layer (Layer 1)
  layers[1].remove();
  saveLogic(fnExt, fnFont)
}


/**
 * @param {string} fnFont get font name from fontsAllObj
 * @param {number} fnSize set font size of point text
 * @param {string} fnExt set PNG || PSD
 * @param {boolean} promptOrNot set true for prompt || set false to use GLOBAL_PARAGRAPH_TEXT contents
 */
function writeParagraphText(fnFont, fnSize, fnExt, promptOrNot) {
  var addDocument = app.documents.add(1920, 1080, 72, 'Temp', NewDocumentMode.RGB, DocumentFill.TRANSPARENT); //app.documents.add();
  var addLayer = addDocument.artLayers.add();
  addLayer.kind = LayerKind.TEXT;

  var paragraphTextItem = addLayer.textItem;
  // set the properties of the text field
  paragraphTextItem.kind = TextType.PARAGRAPHTEXT;

  if (promptOrNot == true) {
    var promptAnswer = prompt("Enter text", "Will be used for Content and FileName");
    paragraphTextItem.contents = promptAnswer
  }
  else if (promptOrNot == false) {
    paragraphTextItem.contents = GLOBAL_PARAGRAPH_TEXT;
  }

  paragraphTextItem.font = fnFont;
  paragraphTextItem.size = fnSize;
  paragraphTextItem.position = [0, 0];
  paragraphTextItem.width = addDocument.width;
  paragraphTextItem.height = addDocument.height;
  paragraphTextItem.justification = Justification.LEFT;
  paragraphTextItem.tracking = -50; // space between letters
  paragraphTextItem.autoLeadingAmount = 150; // line spacing
  paragraphTextItem.useAutoLeading = true;
  paragraphTextItem.baselineShift = -30; // shift the text up or down

  saveLogic(fnExt, fnFont)
}


// createAllCharacterTitlesPNGs(mainFontsObj.MVC1)
function saveLogic(fnExt, fnFont) {
  if (fnExt == 'PNG'
    || fnExt == 'png') {
    var saveFilePNG = new File(new File(GLOBAL_OUTPUT_FOLDER + '/' + fnFont + '_' + getDateStamp().toString() + '.png'));
    SavePNG(saveFilePNG);
  }
  else if (fnExt == 'PSD'
    || fnExt == 'psd') {
    var saveFilePSD = new File(new File(GLOBAL_OUTPUT_FOLDER + '/' + fnFont + '_' + getDateStamp().toString() + '.psd'));
    SavePSD(saveFilePSD);
  }
}

function SavePSD(saveFilePSD) {
  psdSaveOptions = new PhotoshopSaveOptions();
  psdSaveOptions.embedColorProfile = true;
  psdSaveOptions.alphaChannels = true;
  psdSaveOptions.layers = true;
  psdSaveOptions.annotations = true;
  psdSaveOptions.spotColors = true;
  app.activeDocument.saveAs(saveFilePSD, psdSaveOptions, false, Extension.LOWERCASE);
  app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);
}

function SavePNG(saveFilePNG) {
  pngSaveOptions = new PNGSaveOptions();
  pngSaveOptions.interlaced = false;
  pngSaveOptions.compression = 0;;
  // Save As Copy (true)
  app.activeDocument.saveAs(saveFilePNG, pngSaveOptions, true, Extension.LOWERCASE);
  app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);
}

// Write point-style text files for a list in ALL fonts
function writeTextLoop() {
  for (var i = 0; i < GLOBAL_POINT_ARRAY.length; i++) {
    GLOBAL_POINT_TEXT = GLOBAL_POINT_ARRAY[i]
    for (var subFont in fontsMainObj) {
      writePointText(fontsMainObj[subFont], 72, 'png', false);
    }
  }
}

// Write paragraph text for ALL fonts
function writeParagraphTextLoop() {
  for (var text in GLOBAL_PARAGRAPH_ARRAY) {
    GLOBAL_PARAGRAPH_TEXT = GLOBAL_PARAGRAPH_ARRAY[text]
    for (var subFont in fontsSubOneObj) {
      writeParagraphText(fontsSubOneObj[subFont], 100, 'png', false);
    }
  }
}
// CreateAllCharacterTitles for all fonts
function createAllCharacterTitlesPNGsLoop() {
  for (var subFont in fontsMainObj) {
    createAllCharacterTitlesPNGs(fontsMainObj[subFont]);
  }
}


GLOBAL_POINT_ARRAY = [
  'Magnetro vs MikeZ',
  'Mario vs Sonic',
];

GLOBAL_PARAGRAPH_ARRAY = [
  'make loren ipsum text for paragraph text',
  'Lorem Ipsum psum.'
];

// Font Objects Available
/*
  fontsAllObj
  fontsMainObj
  fontsSubOneObj
*/

//Call Stuff 📞

// Dynamic Stuff
// writeParagraphTextLoop()
writeTextLoop()

// Static-Reference Stuff
// createFontReferencePNGs()
// createAllCharacterTitlesPNGsLoop()


// writePointText(fontsSubOneObj.COTA, 72, 'png', false);
