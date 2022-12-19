import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';
const DIR_MAIN_FILES = path.join(process.cwd(), '/main_files/');
const DIR_CSVS = path.join(process.cwd(), '/main_files/CSV_to_JS/');

const rl = readline.createInterface(
  {
    input: process.stdin,
    output: process.stdout,
  }
);

rl.question('Enter original CSV name without extension:', (FILENAME_NO_EXT) =>
{
  if (FILENAME_NO_EXT.trim().includes("_Original"))
  {
    FILENAME_NO_EXT = FILENAME_NO_EXT.replace("_Original", "");
    if (!fs.existsSync(path.join(`${ DIR_CSVS }${ FILENAME_NO_EXT }_Original.csv`)))
    {
      console.log("Original CSV file not found.")
      rl.close();
    }
    else
    {
      console.log("Removed '_Original' from filename");
    }
  }
  else if (FILENAME_NO_EXT.trim().includes("_F"))
  {
    console.log('Use the Original CSV file, not _F');
    process.exit();
  }
  else if (!fs.existsSync(path.join(`${ DIR_CSVS }${ FILENAME_NO_EXT }_Original.csv`)))
  {
    console.log('File does not exist! Exiting.');
    process.exit();
  }
  else
  {
    FILENAME_NO_EXT = FILENAME_NO_EXT
    console.log('Processing...');
  }

  const FILE = path.join(DIR_CSVS, `${ FILENAME_NO_EXT }_Original.csv`); // Working with _Original

  var headersArray = [];
  var allDataArray = [];
  fs.readFileSync(FILE, 'utf8').split('\r\n').map((line, index) =>
  {
    if (index === 0)
    {
      headersArray = line.split(',');
    }
    else
    {
      allDataArray.push(line.split(',')); // ideally, check if each line is the same length as the headerArray
    } return null;
  },
  );
  // Sorting by the first column's first value (Total_Frames)
  allDataArray.sort((a, b) => a[0] - b[0]);

  // Removing duplicates using the first column's value (Total_Frames)
  for (let check = 0; check < allDataArray.length - 1; check++) // length-1 because we're checking the next element
  {
    if ((allDataArray[check + 1][0] === allDataArray[check][0])) // line number is the same
    {
      allDataArray.splice(check + 1, 1); // remove the next line
      check--; // go back to original line in order to check the next line again
    }
  }

  // Transpose the array by columns
  var allArrayStructure = [];
  for (let headerIndex = 0; headerIndex < headersArray.length; headerIndex++)
  {
    allArrayStructure.push([]);
  }
  // Fill the array of arrays with the data separated by column
  for (let rowIdx = 1; rowIdx < allDataArray.length; ++rowIdx) 
  {
    for (let colIdx = 0; colIdx < headersArray.length; ++colIdx)
    {
      allArrayStructure[colIdx].push(allDataArray[rowIdx][colIdx]);
    }
  }

  // Write the Sorted_Node.JS file for the clip data
  var stringArray = [];
  fs.writeFileSync(`${ DIR_MAIN_FILES }${ FILENAME_NO_EXT }_Sorted_Node.js`, '');

  for (let header in headersArray)
  {
    stringArray.push(`export const ${ headersArray[header] } = "${ allArrayStructure[header] }";`);
  }
  fs.appendFileSync(`${ DIR_MAIN_FILES }${ FILENAME_NO_EXT }_Sorted_Node.js`, stringArray.join('\n'));

  // Write missing data entries to a file

  var missingEntries = [];
  for (let i = 0; i < allArrayStructure[0].length - 1; i++)
  {
    if (allArrayStructure[0][i + 1] - allArrayStructure[0][i] !== 1)
    {
      missingEntries.push(`Missing data entry after Total_Frame #: ${ allArrayStructure[0][i] }\n`);
    }
  }
  if (missingEntries.length > 0)
  {
    fs.writeFileSync((`${ DIR_MAIN_FILES }${ FILENAME_NO_EXT }_Missing_Frames.txt`),
      (`${ missingEntries }\nFinal entry in Total_Frames: ${ allArrayStructure[0][allArrayStructure[0].length - 1] }\nTotal_Frames in Clip: ${ allArrayStructure[0].length }`)
        .replace(/,/g, ''));
    console.log('Missing entries logged.');
  }
  else
  {
    fs.writeFileSync((`${ DIR_MAIN_FILES }${ FILENAME_NO_EXT }_Missing_Frames.txt`),
      (`No missing data entries\nFinal entry in Total_Frames: ${ allArrayStructure[0][allArrayStructure[0].length - 1] }\nTotal_Frames in Clip: ${ allArrayStructure[0].length }`)
        .replace(/,/g, ''));
    console.log('No missing data entries');
  }
  rl.close();
});
rl.on('close', () =>
{
  console.log('Finished');
  process.exit();
});