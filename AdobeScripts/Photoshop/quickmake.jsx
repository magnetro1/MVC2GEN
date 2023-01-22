var allFontsList = [
  'COTAWINRegular',
  'COTAWINType2',
  'COTAWINType3',
  'COTAWINType4',
  'COTAWINType5',
  'COTAWINType6',
  'COTAWINType7',
  'CVS2500Regular',
  'MSHRegular',
  'MSHType2',
  'MSHType3',
  'MSHType4',

  'MVCMVSFRegular',
  'MVCMVSFType0',
  'MVCMVSFType1',

  'MVCMVSFType3',
  'MVCMVSFType4',

  'MVCMVSFType6',

  'MvC1Font1MVC1Type2',
  'MvC1Font1Type3',
  'MvC1Font1Type4',
  'MvC1Type3',

  'MvC2Font1Regular',
  'MvC2FontType2',
  'MvC2FontType3',
  'MvC2Type4',

  'SFA3Name1Regular',
  'SFA3Name2Regular',
  'XvSFFont1Regular',
  'XvSFType2',
  'XvSFType3',
  'XvSFType4',
];
// create a new doc
var docRef = app.documents.add();

// create a new layer and set the layer to text
var textLayer = docRef.artLayers.add();
textLayer.kind = LayerKind.TEXT;

var textColor = new RGBColor;
textColor.hexValue = "FF0000";

var ti = textLayer.textItem;

//set the properties of the text field
ti.kind = TextType.PARAGRAPHTEXT;
ti.contents = 'Lorem Ipsum';
ti.size = 24;
ti.font = 'COTAWINType2';
ti.color.rgb = textColor;
ti.position = Array(0, 0);
ti.width = docRef.width;
ti.height = docRef.height;