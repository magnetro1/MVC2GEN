import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';
import {DIR_CSVS, DIR_SORTED_JS, TAIL_TEXT} from './JS_UTIL_paths.js';

function main()
{
  const rl = readline.createInterface(
    {
      input: process.stdin,
      output: process.stdout,
    }
  );

  let FILENAME_NO_EXT = 'Colossus7';

  // rl.question('Enter original CSV name without \'_Original\' or file extension:', (FILENAME_NO_EXT) =>
  // {
  if (FILENAME_NO_EXT.trim().includes("exit")
    || FILENAME_NO_EXT.trim().includes("quit"))
  {
    console.log('Exiting...');
    process.exit();
  }
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
  var allDataArr = [];
  fs.readFileSync(FILE, 'utf8').split('\r\n').map((line, index) =>
  {
    if (index === 0)
    {
      headersArray = line.split(',');
    }
    else
    {
      allDataArr.push(line.split(','));
    } return null;
  });

  // Sorting by the first column's first value (Total_Frames)
  allDataArr.sort((a, b) => a[0] - b[0]);

  /**
   * @description Counts the amount of times a value appears in an array and returns the value that appears the most
   * @param {Number[]} arrayOfNumbers dynamic amount of numbers, depending on the csv file
   * @returns single number value as a string
   */
  function countReplayData(arrayOfNumbers)
  {
    // console.log(arrayOfNumbers[0]);
    // console.log(arrayOfNumbers.length);
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
    // Return the value that appears the most in the object
    /**
     * @description number of times the data value appears. Ex: 4
     */
    let largestOccurrence = 0;

    /**
     * @description Will store the data value that appears the most. Ex: 255
     */
    let largestValueKey = 0;
    for (let key in counterObject)
    {
      if (counterObject[key] > largestOccurrence)
      {
        largestOccurrence = counterObject[key];
        largestValueKey = key;
      }
    }

    // If the occurrence is two and one value is 0 and the other is not, return the next value that is not 0
    // buggy csv capture issue
    if (arrayOfNumbers.length == 2)
    {
      if ((arrayOfNumbers[0] == 0) && (arrayOfNumbers[1] != 0))
      {
        return arrayOfNumbers[1];
      }
      // Opposite
      else if ((arrayOfNumbers[1] == 0) && (arrayOfNumbers[0] != 0))
      {
        return arrayOfNumbers[0];
      }
    }
    console.log(largestValueKey);
    return largestValueKey;
  }


  //Find true data
  const tfObject = {};
  let tempDataArr = [];
  let tempCounter = 0;
  try
  {
    for (let linesIdx = 1; linesIdx < allDataArr.length; linesIdx++) //entries as arrays with values starting at Total_Frames
    {
      if (allDataArr[linesIdx][0] != allDataArr[linesIdx + 1][0] && tempCounter == 0) // we are in a unique line entry based on total_frames
      {
        // console.log(allDataArr[linesIdx][0] + " is not equal to " + allDataArr[linesIdx + 1][0]);
        tfObject[allDataArr[linesIdx][0]] = 1;
        continue
      }
      else if (allDataArr[linesIdx][0] == allDataArr[linesIdx + 1][0])
      {
        // console.log(`${ allDataArr[linesIdx][0] } is equal to ${ allDataArr[linesIdx + 1][0] }`);
        tempDataArr.push(allDataArr[linesIdx + 1][0]);
        tempCounter++
      }
      else if (allDataArr[linesIdx][0] != allDataArr[linesIdx + 1][0] && tempCounter > 0)
      {
        // console.log(`${ allDataArr[linesIdx][0] } is not equal to ${ allDataArr[linesIdx + 1][0] }`);
        tfObject[allDataArr[linesIdx][0]] = tempCounter;
        // console.log(tempDataArr);
        // We have our true number of TF duplicates that we can use for the rest of the data entries.
        // Now, for each header in the headers, we need to pass that amount of data into the countReplayData function
        // and return the value that appears the most.
        for (let header = 0; header < headersArray.length; header++)
        {
          let tempHeaderArr = [];
          for (let tempIdx = 0; tempIdx < tempDataArr.length; tempIdx++)
          {
            tempHeaderArr.push(allDataArr[linesIdx + 1][header]);
          }
          allDataArr[linesIdx][header] = countReplayData(tempHeaderArr);
        }
        //
        // allDataArr[linesIdx][0] = countReplayData(tempDataArr);
        tempDataArr = [];
        tempCounter = 0;
      }
    }
  }
  catch (error)
  {
    console.log('error');
  }
  console.log(allDataArr);

  // Remove headers
  // allDataArr.splice(0, 2);

  const CLIP_LENGTH = Object.keys(tfObject).length;
  // console.log(tfObject);


  +

    //   // Removing duplicates using the first column's value (Total_Frames)
    //   for (let check = 0; check < allDataArray.length - 1; check++) // length-1 because we're checking the next element
    //   {
    //     if ((allDataArray[check + 1][0] === allDataArray[check][0])) // line number is the same
    //     {
    //       allDataArray.splice(check + 1, 1); // remove the next line
    //       check--; // go back to original line in order to check the next line again
    //     }
    //   }

    //   // // Transpose the array by columns
    //   var allArrayStructure = [];
    //   for (let headerIndex = 0; headerIndex < headersArray.length; headerIndex++)
    //   {
    //     allArrayStructure.push([]);
    //   }
    //   // Fill the array of arrays with the data separated by column
    //   for (let rowIdx = 1; rowIdx < allDataArray.length; ++rowIdx) 
    //   {
    //     for (let colIdx = 0; colIdx < headersArray.length; ++colIdx)
    //     {
    //       allArrayStructure[colIdx].push(allDataArray[rowIdx][colIdx]);
    //     }
    //   }
    //   // Make entire file buffer
    //   var stringArray = [];
    //   for (let header in headersArray)
    //   {
    //     stringArray.push(`export const ${ headersArray[header] } = "${ allArrayStructure[header] }";`);
    //   }

    //   // Make Total_Frames info
    //   var missingEntries = [];
    //   for (let i = 0; i < allArrayStructure[0].length - 1; i++) // total frames
    //   {
    //     if (allArrayStructure[0][i + 1] - allArrayStructure[0][i] !== 1)
    //     {
    //       missingEntries.push(`Missing data entry after Total_Frame Number: ${ allArrayStructure[0][i] }\n`);
    //     }
    //   }
    //   if (missingEntries.length > 0)
    //   {
    //     fs.writeFileSync(`${ DIR_SORTED_JS }${ FILENAME_NO_EXT }${ TAIL_TEXT }`,
    //       (`/*\n${ missingEntries }\nFirst entry in Total_Frames: ${ allArrayStructure[0][0] }\nFinal entry in Total_Frames: ${ allArrayStructure[0][allArrayStructure[0].length - 1] }\nTotal_Frames in Clip: ${ allArrayStructure[0].length }\n*/\n`)
    //         .replace(/,/g, ''));
    //     console.log('Missing entries logged.');
    //   }
    //   else
    //   {
    //     fs.writeFileSync(`${ DIR_SORTED_JS }${ FILENAME_NO_EXT }${ TAIL_TEXT }`,
    //       (`/*\nNo missing data entries\nFirst entry in Total_Frames: ${ allArrayStructure[0][0] }\nFinal entry in Total_Frames: ${ allArrayStructure[0][allArrayStructure[0].length - 1] }\nTotal_Frames in Clip: ${ allArrayStructure[0].length }\n*/\n`)
    //         .replace(/,/g, ''));
    //   }
    //   fs.appendFileSync(`${ DIR_SORTED_JS }${ FILENAME_NO_EXT }${ TAIL_TEXT }`,
    //     (`${ stringArray.join('\n') }`));
    rl.close();
  // });
  rl.on('close', () =>
  {
    console.log('Finished');
    process.exit();
  })
}
main()