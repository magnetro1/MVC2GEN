import * as fs from "fs"
import * as path from "path"
const DIR_CSVs = path.join(process.cwd(), `/main_files/CSV_to_JS`);
const FILE_ROM100 = path.join(DIR_CSVs, `Magneto_ROM100_Original.csv`);
// const FILE_ROM100 = path.join(DIR_CSVs, `Magneto_ROM100_F.csv`);

var headersArray = []; // 559 entries
var allDataArray = []; // 16,750 lines
fs.readFileSync(FILE_ROM100, 'utf8').split(`\r\n`).map((line, index) =>
{
  if (index === 0)
  {
    headersArray = line.split(`,`);
  }
  else
  {
    allDataArray.push(line.split(`,`)); //ideally, check if each line is the same length as the headerArray
  }
})

//Sorting by the first column's value (Total_Frames)
allDataArray.sort(
  (a, b) => a[0] - b[0]
);
//Removing duplicates using the first column's value (Total_Frames)
for (let check = 0; check < allDataArray.length - 1; check++)
{
  if (allDataArray[check + 1][0] == allDataArray[check][0]) // line number is the same
  {
    allDataArray.splice(check + 1, 1); // remove the next line
    check--; // look at the same line again
  }
}

// Transpose the array
var out = [];
for (let j = 0; j < headersArray.length; j++)
{
  out.push(new Array());
}
for (let rowIdx = 1; rowIdx < allDataArray.length; ++rowIdx) // for each row (16k lines)
{
  for (let colIdx = 0; colIdx < headersArray.length; ++colIdx) // for each column in the current row (559 entries)
  {
    out[colIdx].push(allDataArray[rowIdx][colIdx]);
    // -*-----
    // --*-----
    // ---*----
  }
}
console.log(out);