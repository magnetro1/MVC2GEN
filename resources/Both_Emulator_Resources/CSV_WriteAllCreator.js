// Create AA Script for Cheat Engine to write all values to a CSV file
// Figure out if PCSX2 or Demul
// Read all values frm the latest CT file
// Ensure no duplicates
// Push entire AA Script to clipboard for pasting into Cheat Engine

// CLOSE CHEAT ENGINE BEFORE RUNNING !

import * as fs from 'fs';
import * as path from 'path';
import clipboard from 'clipboardy';

import {
  filterCTFile,
} from './openCT.js';

import {
  DIR_DEMUL_CT_FILES,
  DIR_PCSX2_CT_FILES,
} from './JS_TOOLS/Utils/Paths.js';

const EMULATOR_VALUE = 'pcsx2'; // 'pcsx2' or 'demul' // !Main switch for PCSX2 or Demul

let useDC = false; // for WriteAllStrings
let usePCSX2 = false; // for WriteAllStrings
let desiredFile; // full path and filename of CT file

function getDesiredFile(emulator) { // 'pcsx2' or 'demul'
  let desiredPath;
  let desiredFile;
  let fullPathAndFile;
  // Get the desired file with the full path
  if (emulator === 'pcsx2') {
    desiredPath = DIR_PCSX2_CT_FILES;
    desiredFile = filterCTFile(desiredPath)
    fullPathAndFile = path.join(desiredPath, desiredFile);
    usePCSX2 = true;
    // console.log(fullPathAndFile)
  } else if (emulator === 'demul') {
    desiredPath = DIR_DEMUL_CT_FILES;
    desiredFile = filterCTFile(desiredPath)
    fullPathAndFile = path.join(desiredPath, desiredFile);
    useDC = true;
    // console.log(fullPathAndFile)
  } else {
    console.log('Invalid emulator');
  }
  console.log(`Opening file: ${desiredFile}`);
  return fullPathAndFile
}

desiredFile = getDesiredFile(EMULATOR_VALUE); // 'pcsx2' or 'demul'

// Read all values from the latest CT file
async function readCTFile(file) {
  if (!file) {
    throw new Error('No file provided');
  }

  let read = '';

  // Read the file as a stream to handle large files efficiently
  await new Promise((resolve, reject) => {
    const stream = fs.createReadStream(file, { encoding: 'utf-8' });

    stream.on('data', (chunk) => {
      read += chunk;
    });

    stream.on('end', resolve);
    stream.on('error', reject);
  });

  return read;
}

// Store the entire CT file as a string
const READ_CT = await readCTFile(desiredFile);
if (!readCTFile) {
  console.log('No CT file read');
}
// console.log(READ_CT);

let ALL_ARRAY = ['Total_Frames']; // !Needs to be first for legacy reasons across MVC2GEN

// Regex for the 2 sections of our file that we care about
// the ID numbers are unique to the sections we want
const scvRegex = /<Description>"Specific_Character_Values"<\/Description>([\s\S]*?)<Description>"Main"<\/Description>/g; // Starts at SCV and ends at Main
const mainRegex = /<Description>"Main"<\/Description>([\s\S]*?)<Description>"header_copy"<\/Description>/g; // Starts at Main and ends at Timer_Secondary ## TODO: Write a valid HTML comment-stopping point, or something that CHEAT ENGINE will be OK with, and will not overwrite later on-save operations. This way we don't use an arbitrary address point (but it's ok so far)
//////////////////////////////////////////////
// // Test mainRegex and console.log the result
// let testSCV = scvRegex.exec(READ_CT);
// let testMain = mainRegex.exec(READ_CT);
// let testSCVString = testSCV[1];
// let testMainString = testMain[1];
// console.log(testSCVString);
// if (testSCV) {
//   console.log(testSCV[1]);
// }
// if (testMain) {
//   console.log(testMain[1]);
// }
//////////////////////////////////////////////


// Per-Entry Regex
const descriptionRegex = /<Description>(.*?)<\/Description>/g;
const addressRegex = /<Address>([0-9A-Fa-f]{8})<\/Address>/g; // 8 hex characters

// Clean the Description value for our array
function fixDescriptionValue(str) {
  return str.replace('<Description>', '').replace('</Description>', '').replace(/"/g, '');
}

/**
 * Extracts descriptions from a table section and adds them to an array.
 * @param {RegExp} tableSection - The regular expression representing the table section-chunk to use.
 * @param {Array} array - The array to which the extracted descriptions will be added.
 */
function extractDescriptions(tableSection, array) {
  let values = tableSection.exec(READ_CT);
  // console.log(values[1])

  if (values) {
    // console.log('Values found');
    let valuesSplitByID = values[1].split('<ID>');
    for (let i = 0; i < valuesSplitByID.length; i++) {
      let descriptionMatch = valuesSplitByID[i].match(descriptionRegex);
      let addressMatch = valuesSplitByID[i].match(addressRegex);
      if (descriptionMatch && addressMatch) {
        let str = fixDescriptionValue(descriptionMatch[0]);
        array.push(str);
      }
    }
  } else {
    // console.log('No values found');
  }
}

// Specific Character Values (SCV)
extractDescriptions(scvRegex, ALL_ARRAY);

// Main
extractDescriptions(mainRegex, ALL_ARRAY);


// Check for duplicates
let seen = new Set();
let duplicates = ALL_ARRAY.filter((element) => {
  if (seen.has(element)) {
    return true;
  }
  seen.add(element);
  return false;
});

if (duplicates.length > 0) {
  console.log('Duplicates found: ', duplicates);
}
else {
  console.log('No duplicates found');
}

// Begin Building the AA Script

// fill in text depending on PCSX2 or Demul
let pcsx2Pointer = `"pcsx2.exe+271A324"`;
let demulPointer = `0x2C3496B0`;

//[ENABLE]
// {$lua}
let writeAllString01 =
  `--startREGEX
-- Variables and Functions
local outPath = "F:\\\\MvC2DataAll_Original.csv"

local _starting_new_write_flag = false
local contScript = true
local data_table = {}

`
// Use PCSX2 or Demul TF Pointer
let fillString01 = '';
if (usePCSX2) {
  fillString01 = pcsx2Pointer
}
else if (useDC) {
  fillString01 = demulPointer
}

let writeAllString02 =
  `function readTF()
	local tfPointer = (${fillString01})
  totalFrameNumber = readInteger(tfPointer)
	return(totalFrameNumber)
end

`

let writeAllString03 =
  `function csv_write(path, data)
	local separator = ","
	local file_handle = assert(io.open(path, "a"))
	local output_string = ""
	if _starting_new_write_flag == false then
	  for i = 0, #data, 1 do
      if i &lt; #data then -- the "less-than" symbol has to be written in HTML format when using CSV_WriteAllCreator!
        output_string = output_string .. data[i].desc .. separator
      else
        output_string = output_string .. data[i].desc
      end
    end
	  _starting_new_write_flag = true
	  file_handle:write(output_string)
	  file_handle:write("\\n")
	  output_string = ""
	end
	for i = 0, #data, 1 do
	  if i &lt; #data then -- the "less-than" symbol has to be written in HTML format when using CSV_WriteAllCreator!
		  output_string = output_string .. data[i].val .. separator
	  else
		  output_string = output_string .. data[i].val
	  end
	end
	file_handle:write(output_string)
	file_handle:write("\\n")
	file_handle:close()
	return true
end

currentFrame = readTF()

-- Main Script
address_list = getAddressList()

-- Lua Capture Data Script:
`
// make giant strings
let vString = ''; // first
let dataString = ''; // second

for (let i = 0; i < ALL_ARRAY.length; i++) {
  let vStr = `v${i} = address_list.getMemoryRecordByDescription("${ALL_ARRAY[i]}") \n`;
  vString += vStr;
  let dataStr = `data_table[${i}] = { desc = v${i}.Description, val = v${i}.Value } \n`;
  dataString += dataStr;
}

// vString goes here

let writeAllString04 = `

v0_prev = v0.Value

-- Condition Loop
while (currentFrame ~= v0.Value) and contScript do
  while v0.Value == v0_prev do
    if isKeyPressed(VK_HOME) then
      contScript = false
      break
    end
  end

`

// dataString goes here

let writeAllString05 =
  `
  v0_prev = v0.Value
  csv_write(outPath, data_table)
end
--stopREGEX
`
// { $asm }
//[DISABLE]

let writeAllString =
  writeAllString01
  + writeAllString02
  + writeAllString03
  + vString
  + writeAllString04
  + dataString
  + writeAllString05;

// clipboard.writeSync(writeAllString);
// console.log(`AA Script copied to clipboard.${ desiredFile } 's writeAllArray length: ${ALL_ARRAY.length}`);

// console.log(writeAllString);

// Find and replace everything between startREGEX and stopREGEX

async function writeCTFile(file, data) {
  await new Promise((resolve, reject) => {
    fs.writeFile(file, data, 'utf-8', (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

let startREGEX = /--startREGEX/g;
let stopREGEX = /--stopREGEX/g;

let startREGEXMatch = writeAllString.match(startREGEX);
let stopREGEXMatch = writeAllString.match(stopREGEX);

if (startREGEXMatch && stopREGEXMatch) {
  let startREGEXIndex = READ_CT.indexOf(startREGEXMatch[0]);
  let stopREGEXIndex = READ_CT.indexOf(stopREGEXMatch[0]) + stopREGEXMatch[0].length;

  // Replace the content between the markers
  let entireFile = READ_CT.substring(0, startREGEXIndex)
    + writeAllString
    + READ_CT.substring(stopREGEXIndex);

  console.log(entireFile);

  // Write the modified content back to the file
  await writeCTFile(desiredFile, entireFile);
  console.log(`Successfully updated the file: ${desiredFile}`);
} else {
  console.error('Markers not found in the file.');
}
