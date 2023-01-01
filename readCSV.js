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

rl.question('Enter original CSV name without \'_Original\' or file extension:', (FILENAME_NO_EXT) =>
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
  // const FILE = path.join(DIR_CSVS, `Colossus7_Original.csv`); // Working with _Original

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
  });

  // Sorting by the first column's first value (Total_Frames)
  allDataArray.sort((a, b) => a[0] - b[0]);

  function countReplayData(arrayOfNumbers)
  {
    // Count the values in the arrays and store them in an object
    let counterObject = {};
    for (let i = 0; i < arrayOfNumbers.length; i++)
    {
      if (counterObject[arrayOfNumbers[i]] == undefined)
      {
        counterObject[arrayOfNumbers[i]] = 1;
      }
      else
      {
        counterObject[arrayOfNumbers[i]]++;
      }
    }
    // Return the largest value in the object
    let largestValue = 0;
    let largestValueKey = 0;
    for (let key in counterObject)
    {
      if (counterObject[key] > largestValue)
      {
        largestValue = counterObject[key];
        largestValueKey = key;
      }
    }
    if (arrayOfNumbers.length == 2)
    {
      if ((arrayOfNumbers[0] == 0) && (arrayOfNumbers[1] != 0))
      {
        console.log(arrayOfNumbers);
        return arrayOfNumbers[1];
      }
    }
    return largestValueKey;
  }


  var tempDataArr = [];
  for (let totalLines = 1; totalLines < allDataArray.length - 1; totalLines++)
  {
    if (allDataArray[totalLines][0] == allDataArray[totalLines + 1][0]) // we are in a duplicate line entry based on total_frames
    {
      for (let headerValue = 0; headerValue < headersArray.length; headerValue++)
      {
        if (allDataArray[totalLines][headerValue] != allDataArray[totalLines + 1][headerValue])
        {
          tempDataArr[0] = (allDataArray[totalLines][headerValue]);
          tempDataArr[1] = (allDataArray[totalLines + 1][headerValue]);

          if (allDataArray[totalLines][0] == allDataArray[totalLines + 2][0])
          {
            tempDataArr[2] = (allDataArray[totalLines + 2][headerValue]);
            if (allDataArray[totalLines][0] == allDataArray[totalLines + 3][0])
            {
              tempDataArr[3] = (allDataArray[totalLines + 3][headerValue]);
              allDataArray[totalLines][headerValue] = countReplayData(tempDataArr);
              tempDataArr = [];
              continue
            }
            allDataArray[totalLines][headerValue] = countReplayData(tempDataArr);
            tempDataArr = [];
            continue
          }
          allDataArray[totalLines][headerValue] = countReplayData(tempDataArr);
          // console.log(countReplayData(tempDataArr));
          // console.log(allDataArray[totalLines][headerValue]);
          tempDataArr = [];
          continue

        }
        tempDataArr = []
      }
    }
  }

  // Removing duplicates using the first column's value (Total_Frames)
  for (let check = 0; check < allDataArray.length - 1; check++) // length-1 because we're checking the next element
  {
    if ((allDataArray[check + 1][0] === allDataArray[check][0])) // line number is the same
    {
      allDataArray.splice(check + 1, 1); // remove the next line
      check--; // go back to original line in order to check the next line again
    }
  }

  // // Transpose the array by columns
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
  // Make entire file buffer
  var stringArray = [];
  for (let header in headersArray)
  {
    stringArray.push(`export const ${ headersArray[header] } = "${ allArrayStructure[header] }";`);
  }

  // Make Total_Frames info
  var missingEntries = [];
  for (let i = 0; i < allArrayStructure[0].length - 1; i++) // total frames
  {
    if (allArrayStructure[0][i + 1] - allArrayStructure[0][i] !== 1)
    {
      missingEntries.push(`Missing data entry after Total_Frame Number: ${ allArrayStructure[0][i] }\n`);
    }
  }
  if (missingEntries.length > 0)
  {
    fs.writeFileSync(`${ DIR_MAIN_FILES }${ FILENAME_NO_EXT }_Sorted_Node.js`,
      (`/*\n${ missingEntries }\nFirst entry in Total_Frames: ${ allArrayStructure[0][0] }\nFinal entry in Total_Frames: ${ allArrayStructure[0][allArrayStructure[0].length - 1] }\nTotal_Frames in Clip: ${ allArrayStructure[0].length }\n*/\n`)
        .replace(/,/g, ''));
    console.log('Missing entries logged.');
  }
  else
  {
    fs.writeFileSync(`${ DIR_MAIN_FILES }${ FILENAME_NO_EXT }_Sorted_Node.js`,
      (`/*\nNo missing data entries\nFirst entry in Total_Frames: ${ allArrayStructure[0][0] }\nFinal entry in Total_Frames: ${ allArrayStructure[0][allArrayStructure[0].length - 1] }\nTotal_Frames in Clip: ${ allArrayStructure[0].length }\n*/\n`)
        .replace(/,/g, ''));
  }
  fs.appendFileSync(`${ DIR_MAIN_FILES }${ FILENAME_NO_EXT }_Sorted_Node.js`,
    (`${ stringArray.join('\n') }`));

  rl.close();
});
rl.on('close', () =>
{
  console.log('Finished');
  process.exit();
});
