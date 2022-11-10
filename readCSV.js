import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';
const rl = readline.createInterface(
  {
    input: process.stdin,
    output: process.stdout,
  }
);
rl.question('Enter the name of the file to read (without the extension): ', (FILENAME_NO_EXT) =>
{
  // FILENAME_NO_EXT
  const DIR_MAIN_FILES = path.join(process.cwd(), '/main_files/');
  const DIR_CSVS = path.join(process.cwd(), '/main_files/CSV_to_JS');
  const FILE = path.join(DIR_CSVS, `${ FILENAME_NO_EXT }_Original.csv`); // Working with _Original
  // const FILE_ROM100 = `${ NAME_NO_EXT }_F.csv`; // Working with _F

  let headersArray = [];
  var allDataArray = [];
  fs.readFileSync(FILE, 'utf8').split('\r\n').map(
    (line, index) =>
    {
      if (index === 0)
      {
        headersArray = line.split(',');
      } else
      {
        allDataArray.push(line.split(',')); // ideally, check if each line is the same length as the headerArray
      } return null;
    },
  );
  // Sorting by the first column's value (Total_Frames)
  allDataArray.sort((a, b) => a[0] - b[0]);

  // Removing duplicates using the first column's value (Total_Frames)
  for (let check = 0; check < allDataArray.length - 1; check++) // length-1 because we're checking the next element
  {
    if (((allDataArray[check + 1][0] === allDataArray[check][0]))) // line number is the same
    {
      allDataArray.splice(check + 1, 1); // remove the next line
      check--; // go back to original line
    }
  }

  // Transpose the array by columns
  var out = [];
  // Create the array of arrays
  for (let j = 0; j < headersArray.length; j++)
  {
    out.push([]);
  }
  // Fill the array of arrays with the data separated by column
  for (let rowIdx = 1; rowIdx < allDataArray.length; ++rowIdx) // for each row/line, which contains the data for each column
  {
    for (let colIdx = 0; colIdx < headersArray.length; ++colIdx) // for each column in the current row
    {
      out[colIdx].push(allDataArray[rowIdx][colIdx]);
    }
  }
  // Write the Sorted_Node.JS file for the clip data
  var stringArray = [];
  fs.writeFileSync(`${ DIR_MAIN_FILES }${ FILENAME_NO_EXT }_Sorted_Node.js`, '');

  for (let i = 0; i < headersArray.length; i++)
  {
    stringArray.push(`export const ${ headersArray[i] } = "${ out[i] }";`);
  }
  fs.appendFileSync(`${ DIR_MAIN_FILES }${ FILENAME_NO_EXT }_Sorted_Node.js`, stringArray.join('\n'));

  // Write missing data entries to a file
  function writeMissingEntries()
  {
    var missingEntries = [];
    for (let i = 0; i < out[0].length - 1; i++)
    {
      if (out[0][i + 1] - out[0][i] !== 1)
      {
        missingEntries.push(`Missing data entry after Total_Frame #: ${ out[0][i] }\n`);
      }
    }
    fs.writeFileSync((`${ DIR_MAIN_FILES }${ FILENAME_NO_EXT }_Missing_Frames.txt`), (`${ missingEntries }\nFinal entry in Total_Frames: ${ out[0][out[0].length - 1] }\nTotal_Frames in Clip: ${ out[0].length }`)
      .replace(/,/g, ''));
  }
  writeMissingEntries();
  rl.close();
});
// const FILENAME_NO_EXT = 'Magneto_ROM100';
