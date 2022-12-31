import * as fs from 'fs';
import * as path from 'path';
const DIR_CSVS = path.join(process.cwd(), '/main_files/CSV_to_JS/Combo_Sentinel10_Original.csv');
const DIR_MAIN_FILES = path.join(process.cwd(), '/main_files/');
var headersArray = [];
var allDataArray = [];
fs.readFileSync(DIR_CSVS, 'utf8').split('\r\n').map((line, index) =>
{
  if (index === 0)
  {
    headersArray = line.split(',');
  }
  else
  {
    allDataArray.push(line.split(',')); // ideally, check if each line is the same length as the headerArray
  } return null;
});
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
for (let rowIdx = 1; rowIdx < allDataArray.length; rowIdx++) 
{
  for (let colIdx = 0; colIdx < headersArray.length; colIdx++)
  {
    allArrayStructure[colIdx].push(allDataArray[rowIdx][colIdx]);
  }
}
// Write the Sorted_Node.JS file for the clip data
var stringArray = [];
for (let header in headersArray)
{
  stringArray.push(`export const ${ headersArray[header] } = '${ allArrayStructure[header] }';`);
}
// console.log(stringArray[0]);
fs.writeFileSync(`Combo_Sentinel10A_Sorted_Node.js`, stringArray.join('\n'), 'utf-8'); 