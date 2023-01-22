// Static Stuff
var allFontsList = [   // 32 Fonts

  // X-Men Children of the Atom
  'COTAWINRegular',
  'COTAWINType2',
  'COTAWINType3',
  'COTAWINType4',
  'COTAWINType5',
  'COTAWINType6',
  'COTAWINType7',
  // Capcom vs SNK 2
  'CVS2500Regular',
  // Marvel Super Heroes
  'MSHRegular',
  'MSHType2',
  'MSHType3',
  'MSHType4',
  // Marvel Super Heroes vs Street Fighter
  'MVCMVSFRegular',
  'MVCMVSFType0',
  'MVCMVSFType1',
  'MVCMVSFType3',
  'MVCMVSFType4',
  'MVCMVSFType6',
  // Marvel vs Capcom 1
  'MvC1Font1MvC1Type2',
  'MvC1Font1Type3',
  'MvC1Font1Type4',
  'MvC1Type1Regular',
  // Marvel vs Capcom 2
  'MvC2Font1Regular',
  'MvC2FontType2',
  'MvC2FontType3',
  'MvC2Type4',
  // Street Fighter Alpha 3
  'SFA3Name1Regular',
  'SFA3Name2Regular',
  // X-Men vs Street Fighter
  'XvSFRegular',
  'XvSFType2',
  'XvSFType3',
  'XvSFType4',
];
var charList = [
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
]

var loremIpsum = '0123456789-' + '\r' + 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' + '\r' + 'abcdefghijklmnopqrstuvwxyz' + '\r' + '~!@#$%^&*()_=+[]{};:",<.>/?\''
for (var i = 0; i < allFontsList.length; i++)
{
  var textEntry = allFontsList[i] //prompt("Enter text", "Will be used for Content and FileName");

  var newDocument = app.documents.add(2020, 2050, 72, textEntry, NewDocumentMode.RGB, DocumentFill.TRANSPARENT);

  var layers = newDocument.artLayers;
  var newLayer = layers.add();

  newLayer.name = textEntry;
  newLayer.kind = LayerKind.TEXT;

  var textItem = newLayer.textItem;
  // adjust text appearance
  textItem.contents = loremIpsum;
  textItem.font = allFontsList[i];
  textItem.size = 50;
  // set image on left side
  textItem.justification = Justification.LEFT;
  textItem.position = [/*newDocument.width * .5*/ 0, (newDocument.height * .5 + 70)];
  app.activeDocument.trim(TrimType.TRANSPARENT, true, true, true, true);
  // delete bottom layer (Layer 1)
  layers[1].remove();
  try
  {
    var outputFolder = 'H:/'
    // var saveFilePSD = new File(new File(outputFolder + '/' + textEntry + '.psd'));
    // SavePSD(saveFilePSD);
    var saveFilePNG = new File(new File(outputFolder + '/' + textEntry + '.png'));
    SavePNG(saveFilePNG);
  } catch (error)
  {
    alert("The source document is unsaved!");
  }


  function SavePSD(saveFilePSD)
  {
    psdSaveOptions = new PhotoshopSaveOptions();
    psdSaveOptions.embedColorProfile = true;
    psdSaveOptions.alphaChannels = true;
    psdSaveOptions.layers = true;
    psdSaveOptions.annotations = true;
    psdSaveOptions.spotColors = true;
    // Save As (false)
    app.activeDocument.saveAs(saveFilePSD, psdSaveOptions, true, Extension.LOWERCASE);
    // Save As Copy (true)
    //app.activeDocument.saveAs(saveFilePSD, psdSaveOptions, true, Extension.LOWERCASE);
    app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);
  }

  function SavePNG(saveFilePNG)
  {
    pngSaveOptions = new PNGSaveOptions();
    pngSaveOptions.interlaced = false;
    pngSaveOptions.compression = 0;;
    // Save As (false)
    app.activeDocument.saveAs(saveFilePNG, pngSaveOptions, true, Extension.LOWERCASE);
    // Save As Copy (true)
    //app.activeDocument.saveAs(saveFilePNG, pngSaveOptions, true, Extension.LOWERCASE);
    app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);
  }
}





// Make Paragraph Text
/*
// create a new doc
var docRef = app.documents.add();

// create a new layer and set the layer to text
var textLayer = docRef.artLayers.add();
textLayer.kind = LayerKind.TEXT;

var textColor = new RGBColor;
textColor.hexValue = "FF0000";

var ti = textLayer.textItem;

//set the properties of the text field
ti.kind = TextType.PARAGRAPHTEXT; // TextType.PARAGRAPHTEXT || TextType.POINTTEXT
ti.contents = 'Lorem Ipsum';
ti.size = 24;
ti.color.rgb = textColor;
ti.position = Array(0, 0);
ti.width = docRef.width;
ti.height = docRef.height;
*/