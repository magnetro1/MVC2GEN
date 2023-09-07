// Documenation:
/*
This script creates custom titles
as PNG or PSD files using special
fonts in Photoshop.

All functions are called at the bottom.

There are three Font-Objects:
  FONTS_ALL: contains all game-fonts
  FONTS_MAIN: contains one chosen main font for each game
  FONTS_SUB: contains one chosen sub font for each game

There are two types of dynamic text functions
that write text from a string variable:
  writePointText() : GLOBAL_POINT_TEXT
  writeParagraphText() : GLOBAL_PARAGRAPH_TEXT

However, there are also duplicate functions
that write contents from respective arrays FOR EACH font:
  writePointTextForArrayAndGame() : GLOBAL_POINT_ARRAY
  writeParagraphTextForArrayAndGame() : GLOBAL_PARAGRAPH_ARRAY
As well as functions that write array contents for ONLY ONE font:
  writePointTextForArray()
  writeParagraphTextForArray()

There are two reference functions that create
a preset list of PNGs with prefilled text:
  FONTS:
    createAllFontsReference():
      creates a PNG for each font in FONTS_ALL
      using a preset string of letters, numbers and symbols
  CHARACTERS:
    createAllCharacterTitles
      creates a PNG title for each character name
      using the 'main' font of one game
    createAllCharacterTitlesForEachGame():
      creates a PNG title for each character name
      for each game using mainFont from the FONTS_MAIN object
*/

// Static Stuff
var CHARS_ALL = [
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
var FONTS_ALL = {
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
  'XVSF_05': 'XvSFType5',
};
// 'Main' fonts for point-text/titles
var FONTS_MAIN = {
  'COTA': FONTS_ALL['COTA_04'],
  'CVS2': FONTS_ALL['CVS2_01'],
  'MSH': FONTS_ALL['MSH_01'],
  'MVC1': FONTS_ALL['MVC1_04'],
  'MVC2': FONTS_ALL['MVC2_01'],
  'MVSF': FONTS_ALL['MVSF_03'],
  'SFA3': FONTS_ALL['SFA3_01'],
  'XVSF': FONTS_ALL['XVSF_01'],
};
// 'Sub' fonts for paragraph-text
var FONTS_SUB = {
  'COTA': FONTS_ALL['COTA_02'],
  'CVS2': FONTS_ALL['CVS2_01'],
  'MSH': FONTS_ALL['MSH_03'],
  'MVSF': FONTS_ALL['MVSF_01'],
  'MVC1': FONTS_ALL['MVC1_01'],
  'MVC2': FONTS_ALL['MVC2_04'],
  'SFA3': FONTS_ALL['SFA3_02'],
  'XVSF': FONTS_ALL['XVSF_05'],
};
var GLOBAL_OUTPUT_FOLDER = '';

var GLOBAL_POINT_TEXT =
  '';

var GLOBAL_PARAGRAPH_TEXT =
  '';
var GLOBAL_POINT_ARRAY = [
  '',
];
var GLOBAL_PARAGRAPH_ARRAY = [
  '',
];
// Helper Functions
/**
 * @description Creates a the main GLOBAL_OUTPUT_FOLDER
 * directory if it doesn't exist
*/
function existsOutputFolder() {
  var myFolder = new Folder(GLOBAL_OUTPUT_FOLDER);
  if (!myFolder.exists) {
    myFolder.create();
  }
}
/**
 * @description Returns a string of the current date
 * @returns {string} dateStamp
*/
function getDateStamp() {
  var date = new Date();
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var day = date.getDate();
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var seconds = date.getSeconds();
  var milliseconds = date.getMilliseconds();


  function padNumber(number) {
    if (number < 10) {
      return '0' + number.toString();
    }
    else {
      return number.toString();
    }
  }

  var dateStamp =
    year.toString()
    + '_'
    + padNumber(month)
    + '_'
    + padNumber(day)
    + '_'
    + padNumber(hours)
    + '_'
    + padNumber(minutes)
    + '_'
    + padNumber(seconds)
    + '_'
    + padNumber(milliseconds);
  return dateStamp;
}

/**
 * @description Returns the game name from the font name
 * @param {string} fnFont active font name value from a font object
 * @returns {string} currentGameName
 * @example 'COTA_01' returns 'COTA'
 */
function getGameNameFromFont(fnFont) {
  var currentGameName = '';
  for (var key in FONTS_MAIN) {
    if (FONTS_MAIN[key] == fnFont) {
      currentGameName = key;
    }
  }
  return currentGameName;
}

// Save Functions
/**
 * @param {string} fnPntOrPar 'PNT' || 'PAR'
 * @param {string} fnExt 'PNG' || 'PSD'
 * @param {string} fnFont font name from font objects
 * @description Saves the current document as a PNG or PSD
*/
function savePointOrParagraphFile(fnPntOrPar, fnExt, fnFont) {
  var currentFont = '';
  for (var key in FONTS_ALL) {
    if (FONTS_ALL[key] == fnFont) {
      currentFont = key;
    }
  }
  var targetFolderAndFile = new File(
    new File(
      GLOBAL_OUTPUT_FOLDER
      + '/'
      + fnPntOrPar
      + '_'
      + currentFont
      + '_'
      + fnFont
      + '_'
      + getDateStamp()
      + '.'
      + fnExt
    )
  );
  if (fnExt == 'PNG' || fnExt == 'png') {
    SavePNG(targetFolderAndFile);
  }
  else if (fnExt == 'PSD' || fnExt == 'psd') {
    SavePSD(targetFolderAndFile);
  }
}
/**
 * @param {string} PSDFileName contains pre-made folder and document info
 */
function SavePSD(PSDFileName) {
  psdSaveOptions = new PhotoshopSaveOptions();
  psdSaveOptions.embedColorProfile = true;
  psdSaveOptions.alphaChannels = true;
  psdSaveOptions.layers = true;
  psdSaveOptions.annotations = true;
  psdSaveOptions.spotColors = true;
  app.activeDocument.saveAs(
    PSDFileName,
    psdSaveOptions,
    false,
    Extension.LOWERCASE
  );
  app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);
}
/**
 * @param {string} PNGFileName contains pre-made folder and document info
 */
function SavePNG(PNGFileName) {
  pngSaveOptions = new PNGSaveOptions();
  pngSaveOptions.interlaced = false;
  pngSaveOptions.compression = 0;;
  app.activeDocument.saveAs(
    PNGFileName,
    pngSaveOptions,
    true,
    Extension.LOWERCASE
  );
  app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);
}
// Main Functions - Reference
/**
 * @description Creates a PNG for each font, 
 * filled with letters, numbers and symbols.
 */
function createAllFontsReference() {
  existsOutputFolder()
  var loremIpsum =
    '0123456789-'
    + '\r'
    + 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    + '\r'
    + 'abcdefghijklmnopqrstuvwxyz'
    + '\r'
    + '-`~!@#$%^&*()_=+[]{};:",<.>/?\'';

  for (var allFont in FONTS_ALL) {
    var fontIDX = FONTS_ALL[allFont]
    var newDocument = app.documents.add(
      2020,
      2050,
      72,
      fontIDX,
      NewDocumentMode.RGB,
      DocumentFill.TRANSPARENT
    );
    var layers = newDocument.artLayers;
    var newLayer = layers.add();

    newLayer.name = fontIDX;
    newLayer.kind = LayerKind.TEXT;

    var textItem = newLayer.textItem;
    textItem.contents = loremIpsum;
    textItem.font = fontIDX;
    textItem.size = 50;
    textItem.justification = Justification.LEFT;
    textItem.position = [0, (newDocument.height * .5)];
    app.activeDocument.trim(TrimType.TRANSPARENT, true, true, true, true);
    layers[1].remove();
    // Get game title instead of font for our folder name
    var gameName = getGameNameFromFont(fontIDX);
    // Write PNG
    var AllFontsReferenceFolder =
      GLOBAL_OUTPUT_FOLDER
      + '/'
      + '_createAllFontsReference'
      + '/';
    var myFolder = new Folder(AllFontsReferenceFolder);
    if (!myFolder.exists) {
      myFolder.create();
    }
    var myPNGFile = new File(
      new File(
        AllFontsReferenceFolder
        + '/'
        + 'REF'
        + '_'
        + allFont
        + '_'
        + fontIDX
        + '.'
        + 'png'
      )
    );
    SavePNG(myPNGFile);
  }
}

/**
 * @param {string} fnFont get font name from font objects
 * @description Creates a PNG for each character name
 * using the 'main' font of the game
 */
function createAllCharacterTitles(fnFont) {
  existsOutputFolder()
  for (var charIDX = 0; charIDX < CHARS_ALL.length; charIDX++) {
    var characterName = CHARS_ALL[charIDX];
    var newDocument = app.documents.add(
      4000,
      4000,
      72,
      characterName,
      NewDocumentMode.RGB,
      DocumentFill.TRANSPARENT
    );
    var layers = newDocument.artLayers;
    var newLayer = layers.add();
    newLayer.name = characterName;
    newLayer.kind = LayerKind.TEXT;
    var textItem = newLayer.textItem;
    // adjust text appearance
    textItem.contents = characterName;
    textItem.font = fnFont;
    textItem.size = 200;
    // set image on left side
    textItem.justification = Justification.LEFT;
    textItem.position = [0, (newDocument.height * .5)]; // centered
    app.activeDocument.trim(TrimType.TRANSPARENT, true, true, true, true);
    layers[1].remove();

    // Get game title instead of font for our folder name
    var gameName = getGameNameFromFont(fnFont);
    // Write Folder
    var AllCharacterTitlesFolder =
      GLOBAL_OUTPUT_FOLDER
      + '/'
      + '_createAllCharacterTitles'
      + '/'
      + gameName
      + '/';
    var myFolder = new Folder(AllCharacterTitlesFolder);
    if (!myFolder.exists) {
      myFolder.create();
    }
    // Save the file
    var myPNGFile = new File(
      new File(
        AllCharacterTitlesFolder
        + 'REF'
        + '_'
        + gameName
        + '_'
        + characterName
        + '.'
        + 'png'
      )
    );
    SavePNG(myPNGFile);
  }
}

// Main Functions - Dynamic - Single
/**
 * @param {string} fnFont font name from FONTS_MAIN, etc.
 * @param {number} fnSize font size of point text
 * @param {number} fnTracking tracking between letters
 * @param {string} fnExt set PNG || PSD
 * @param {boolean} promptOrNot set true for prompt 
 * || false for GLOBAL_POINT_TEXT
 */
function writePointText(fnFont, fnSize, fnTracking, fnExt, promptOrNot) {
  existsOutputFolder()
  var newDocument = app.documents.add(
    4000,
    4000,
    72,
    'name',
    NewDocumentMode.RGB,
    DocumentFill.TRANSPARENT
  );
  var layers = newDocument.artLayers;
  var newLayer = layers.add();
  newLayer.name = 'name';
  newLayer.kind = LayerKind.TEXT;
  var pointTextItem = newLayer.textItem;
  if (promptOrNot == true) {
    var promptAnswer = prompt(
      'Enter text', 'Used as content and file name');
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
  pointTextItem.tracking = fnTracking; // space between letters
  app.activeDocument.trim(TrimType.TRANSPARENT, true, true, true, true);
  // delete bottom layer (Layer 1)
  layers[1].remove();

  savePointOrParagraphFile('PNT', fnExt, fnFont)
}

/**
 * @param {string} fnFont get font name from fontsAllObj
 * @param {number} fnSize set font size of point text
 * @param {number} fnTracking tracking between letters
 * @param {string} fnExt set PNG || PSD
 * @param {boolean} promptOrNot set true for prompt 
 * || set false to use GLOBAL_PARAGRAPH_TEXT contents
 */
function writeParagraphText(fnFont, fnSize, fnTracking, fnExt, promptOrNot) {
  existsOutputFolder()
  var addDocument = app.documents.add(
    1920,
    1080,
    72,
    'Temp',
    NewDocumentMode.RGB,
    DocumentFill.TRANSPARENT
  );
  var addLayer = addDocument.artLayers.add();
  addLayer.kind = LayerKind.TEXT;

  var paragraphTextItem = addLayer.textItem;
  // set the properties of the text field
  paragraphTextItem.kind = TextType.PARAGRAPHTEXT;

  if (promptOrNot == true) {
    var promptAnswer = prompt(
      'Enter text', 'Used as content and file name');
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
  paragraphTextItem.tracking = fnTracking; // space between letters
  paragraphTextItem.autoLeadingAmount = 150; // line spacing
  paragraphTextItem.useAutoLeading = true;
  paragraphTextItem.baselineShift = -30; // shift the whole text up or down

  savePointOrParagraphFile('PAR', fnExt, fnFont)
}

// Main Functions - Dynamic - Arrays For ONE Font
/**
* @description Write point-style text files
* for each array entry for one font
*/
function writePointTextForArray(fnFont, fnSize, fnTracking, fnExt, promptOrNot) {
  for (var i = 0; i < GLOBAL_POINT_ARRAY.length; i++) {
    GLOBAL_POINT_TEXT = GLOBAL_POINT_ARRAY[i]
    writePointText(fnFont, fnSize, fnTracking, fnExt, promptOrNot);
  }
}
/**
* @description Write paragraph-style text files
* for each array entry for one subFont
*/
function writeParagraphTextForArray(fnFont, fnSize, fnTracking, fnExt, promptOrNot) {
  for (var text in GLOBAL_PARAGRAPH_ARRAY) {
    GLOBAL_PARAGRAPH_TEXT = GLOBAL_PARAGRAPH_ARRAY[text]
    writeParagraphText(fnFont, fnSize, fnTracking, fnExt, promptOrNot)
  }
}

// Main Functions - Dynamic - Arrays For EACH Font
/**
* @description Write point-style text files
* for each array entry for each mainFont
*/
function writePointTextForArrayAndGame() {
  for (var i = 0; i < GLOBAL_POINT_ARRAY.length; i++) {
    GLOBAL_POINT_TEXT = GLOBAL_POINT_ARRAY[i]
    for (var mainFont in FONTS_MAIN) {
      writePointText(FONTS_MAIN[mainFont], 72, -75, 'png', false);
    }
  }
}

function writeParagraphTextForArrayAndGame() {
  for (var text in GLOBAL_PARAGRAPH_ARRAY) {
    GLOBAL_PARAGRAPH_TEXT = GLOBAL_PARAGRAPH_ARRAY[text]
    for (var subFont in FONTS_SUB) {
      writeParagraphText(FONTS_SUB[subFont], 80, -125, 'png', false);
    }
  }
}

/**
* @description Write titles for each character for each mainFont
*/
function createAllCharacterTitlesForEachGame() {
  for (var mainFont in FONTS_MAIN) {
    createAllCharacterTitles(FONTS_MAIN[mainFont], 'png');
  }
}

// Globals
GLOBAL_OUTPUT_FOLDER = 'I:/fontTests';

GLOBAL_POINT_TEXT =
  "";

GLOBAL_PARAGRAPH_TEXT =
  "";
GLOBAL_POINT_ARRAY = [
  "",
];
GLOBAL_PARAGRAPH_ARRAY = [
  "",
];

// Call Stuff 📞

// Reference
// createAllFontsReference()
// createAllCharacterTitles(FONTS_MAIN['COTA'])
// createAllCharacterTitlesForEachGame() // takes a while

// Dynamic Single String
// writePointText(FONTS_MAIN['XVSF'], 72, -50, 'png', false)
// writeParagraphText(FONTS_SUB['COTA'], 72, 0, 'png', false)

// Dynamic Arrays FOR ONE font
// writePointTextForArray(FONTS_MAIN['XVSF'], 72, 0, 'png', false)
writeParagraphTextForArray(FONTS_SUB['XVSF'], 15, 0, 'png', false)

// Dynamic Arrays FOR EACH font
// writePointTextForArrayAndGame()
// writeParagraphTextForArrayAndGame()
