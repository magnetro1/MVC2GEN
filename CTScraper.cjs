// Scrape a Cheat Engine XML file for the address description of the table
const fs = require('fs');
const path = require('path');
const {UNUSED_ADDRESSES} = require("./main_files/staticData");
const RESOURCES_DIR = path.join(process.cwd(), '/resources/');
const CE_DIR = `${ RESOURCES_DIR }PCSX2RR_and_CheatEngine/CheatTables.BK/`;
const CT_FILE_PREFIX = 'pcsx2_entelechy_';
const CT_FILE_SUFFIX = '.CT';
// Get files from directory
var allFileNames = [];
fs.readdirSync(CE_DIR).forEach((file) =>
{
  allFileNames.push(file);
});

// Find the newest CT file using fs.stats
var newestCTFile = '';
var newestCTFileDate = 0;
fs.readdirSync(CE_DIR).forEach((file) =>
{
  if (file.match(/^pcsx2_entelechy/g) && file.match(/\.CT$/))
  {
    var stats = fs.statSync(`${ CE_DIR }${ file }`);
    if (stats.mtimeMs > newestCTFileDate)
    {
      newestCTFileDate = stats.mtimeMs;
      newestCTFile = file;
      // console.log(newestCTFile);
    }
  }
});

// // // Get the newest CT file using file number
// // var regexForCTFileNumber = /(<?_)(\d+)\.CT/m; // has to be multi-line to match the end of the string
// // var CTFileNumbersArray = [];
// // for (let i = 0; i < allFileNames.length; i++)
// // {
// //   if (regexForCTFileNumber.test(allFileNames[i]))
// //   {
// //     allFileNames[i] = regexForCTFileNumber.exec(allFileNames[i])[2];
// //     CTFileNumbersArray.push(allFileNames[i]);
// //   }
// // }
// // var FindNewestCTFile = Math.max(...CTFileNumbersArray);

const MAIN_CT_FILE = `${ newestCTFile }`; // Stats method

// file number method // needs granular file name building
// const MAIN_CT_FILE = `${ CT_FILE_PREFIX }${ FindNewestCTFile }${ CT_FILE_SUFFIX }`;

const READ_CT_FILE = fs.readFileSync(`${ CE_DIR }${ MAIN_CT_FILE }`.toString(), 'utf8');
var readFlag = false;
var regexCTDescription = /(?<=<Description>)"(.*)"(?=<\/Description>)/m;
var regexCTAddress = /(?<=<Address>)(.*)(?=<\/Address>)/m;
var cheatEntryArray = [];
var cheatTableBuffer = fs.readFileSync(`${ CE_DIR }${ MAIN_CT_FILE }`, 'utf8').split('\r\n')
for (let line = 0; line < cheatTableBuffer.length; line++)
{
  if (cheatTableBuffer[line].includes('<ID>6636</ID>')) // Reached Total_Frames
  {
    readFlag = true;
  }
  if (cheatTableBuffer[line].match(regexCTDescription) && readFlag)
  {
    for (let i = 1; i < 4; i++)
    {
      if (cheatTableBuffer[line + i].match(regexCTAddress))
      {
        cheatEntryArray.push(cheatTableBuffer[line].match(regexCTDescription)[1]);
      }
    }
    if (cheatTableBuffer[line].includes('Versus_Score'))
    {
      readFlag = false;
    }
  }
}

// Remove unused addresses from the array
var cheatEntryArrayFixedSet = [...new Set(cheatEntryArray)];
for (let k = 0; k < 5; k++) // duplicate entry across CT file safeguard
{
  for (let i = 0; i < cheatEntryArrayFixedSet.length; i++)
  {
    for (let j = 0; j < UNUSED_ADDRESSES.length; j++)
    {
      if (cheatEntryArrayFixedSet[i] == UNUSED_ADDRESSES[j])
      {
        cheatEntryArrayFixedSet.splice(i, 1);
      }
    }
  }
}

// Write the addresses to the main CT file
var mainScriptVarCreator = '';
var mainScriptVarMiddleText =
  `v0_prev = v0.Value

-- Condition Loop
while (currentFrame ~= v0.Value) and contScript do
  while v0.Value == v0_prev do
    if isKeyPressed(VK_HOME) then
      contScript = false
      break
    end
  end
`;
var mainScriptVarCaller = '';
var txtSlot = 0;
// Create the Lua Buffer
for (let i = 0; i < cheatEntryArrayFixedSet.length; i++)
{
  mainScriptVarCreator += `v${ i } = address_list.getMemoryRecordByDescription("${ cheatEntryArrayFixedSet[i] }")\n`;
  mainScriptVarCaller += `\tdata_table[${ i }] = {desc = v${ i }.Description,val = v${ i }.Value}\n`;
}

var textToWrite = `\n\n// Lua Capture Data Script:\n\n${ mainScriptVarCreator }\n${ mainScriptVarMiddleText }\n${ mainScriptVarCaller }`;
var regexForPreviousLuaScript = /(?<=--startREGEX)(.|\r\n|)*?(.|\r|)*?(.|\n|)*?(?=--stopREGEX)/gm; // new line catcher
var CTFileWithNewLuaScript = READ_CT_FILE.replace(regexForPreviousLuaScript, textToWrite);

// Does my file contain regexForPreviousLuaScript?
if (regexForPreviousLuaScript.test(READ_CT_FILE))
{
  // Does my file contain the textToWrite?
  if (READ_CT_FILE.includes(textToWrite))
  {
    console.log('No new CT file was made.');
  }
  else if (!READ_CT_FILE.includes(textToWrite))
  {
    let fileNumber = MAIN_CT_FILE.match(/(?<=_)(\d+)/)[0];
    let fileNamePlusOne = parseInt(fileNumber) + 1;
    var CTFileNamePlusOne = `${ CT_FILE_PREFIX }${ fileNamePlusOne }${ CT_FILE_SUFFIX }`;
    fs.writeFileSync(`${ CE_DIR }${ CTFileNamePlusOne }`, CTFileWithNewLuaScript, 'utf8');
    txtSlot = 1;
    console.log(`A new CT file was created with the name: ${ CTFileNamePlusOne }`);
  }
}
else
{
  console.log('No match for REGEX entry and stopping points inside of file!');
};

// Write the addresses to a TXT file
if (txtSlot == 1)
{
  fs.writeFileSync(`${ CE_DIR }${ CTFileNamePlusOne }_addresses.txt`, ((`${ cheatEntryArrayFixedSet }`)
    .replace(/,/gmi, '\n') + textToWrite)
    , 'utf8');
  console.log(txtSlot);
}
else if (txtSlot == 0)
{
  fs.writeFileSync(`${ CE_DIR }${ newestCTFile }_addresses.txt`, ((`${ cheatEntryArrayFixedSet }`)
    .replace(/,/gmi, '\n') + textToWrite)
    , 'utf8');
  console.log(txtSlot);
}
setTimeout(() =>
{
  console.log('Done!');
}, 2000);