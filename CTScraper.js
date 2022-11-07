// Scrape a Cheat Engine XML file for the address description of the table
import fs from 'fs';
import path from 'path';
import {UNUSED_ADDRESSES} from './main_files/staticData.js';

const RESOURCES_DIR = path.join(process.cwd(), '/resources/');
const CE_DIR = `${ RESOURCES_DIR }PCSX2RR_and_CheatEngine/`;
const CT_FILE_PREFIX = 'pcsx2_entelechy_';
const CT_FILE_SUFFIX = '.CT';
// Get files from directory
var allFileNames = [];
fs.readdirSync(CE_DIR).forEach((file) =>
{
  allFileNames.push(file);
});

// Get the newest CT file
var regexForCTFileNumber = /(<?_)(\d+)\.CT/m; // has to be multi-line to match the end of the string
var CTFileNumbersArray = [];
for (let i = 0; i < allFileNames.length; i++)
{
  if (regexForCTFileNumber.test(allFileNames[i]))
  {
    allFileNames[i] = regexForCTFileNumber.exec(allFileNames[i])[2];
    CTFileNumbersArray.push(allFileNames[i]);
  }
}
var FindNewestCTFile = Math.max(...CTFileNumbersArray);

const MAIN_CT_FILE = `${ CT_FILE_PREFIX }${ FindNewestCTFile }${ CT_FILE_SUFFIX }`;
// Read the CT file
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
    for (let i = 0; i < 4; i++)
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
// Sort the array by name
// cheatEntryArray.sort();
var cheatEntryArrayFixedSet = [...new Set(cheatEntryArray)];
// Remove unused addresses from the array
for (let k = 0; k < 5; k++) // duplicate entry across XML safeguard
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
// // Write the addresses to a file
// fs.writeFileSync(`${ CE_DIR }${ CT_FILE_PREFIX }${ FindNewestCTFile }_addresses.txt`, (`${ cheatEntryArrayFixedSet }`)
//     .replace(/,/gmi, '\n')
//     , 'utf8'); 

var dataObject = {

  arr_State_ROM_09_ChoiceE: [[], [], []],
}

for (let j = 0; j < 3; j++)
{
  for (let i = 0; i < 10; i++)
  {
    dataObject.arr_State_ROM_09_ChoiceE[j].push(i);
  }
}
console.log(dataObject);