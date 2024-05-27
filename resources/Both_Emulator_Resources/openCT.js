import * as fs from 'fs';
import { exec } from 'child_process';
import { DIR_DEMUL_CT_FILES, DIR_PCSX2_CT_FILES, CT_EXT } from './JS_UTILS/JS_UTIL_paths.js';
import { main } from '../Both_Emulator_Resources/promptForOpen.js';


// Function to get the newest CT file and open it
async function openNewestCTFile(pcsx2OrDemul) {
  const directory = pcsx2OrDemul === 'pcsx2' ? DIR_PCSX2_CT_FILES : DIR_DEMUL_CT_FILES;

  const files = fs.readdirSync(directory);
  const cheatTables = files.filter((file) => file.endsWith(CT_EXT));

  if (cheatTables.length === 0) {
    console.log(`No cheat tables found in directory: ${directory}`);
    return;
  }

  const newestFile = cheatTables.reduce((previous, current) => {
    let prevTime = fs.statSync(`${directory}/${previous}`).mtimeMs;
    let currTime = fs.statSync(`${directory}/${current}`).mtimeMs;
    return prevTime > currTime ? previous : current;
  });

  console.log(`Opening the newest file: ${newestFile} in directory: ${directory}`);

  exec(`${directory}/${newestFile}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error opening file: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`Error output: ${stderr}`);
      return;
    }
    // console.log(`Success output: ${stdout}`);
  });
}
openNewestCTFile('pcsx2'); // TODO figure out how to call the function based on the CT file you want to open
openNewestCTFile('demul');


// async function mainFunction() {
//   // Check for command line arguments
//   const args = process.argv.slice(2);
//   let pcsx2OrDemul = args[0];

//   // If no argument provided, prompt the user
//   if (!pcsx2OrDemul) {
//     pcsx2OrDemul = await main('Please enter either "pcsx2" or "demul": ');
//   }

//   // Validate input
//   if (pcsx2OrDemul !== 'pcsx2' && pcsx2OrDemul !== 'demul') {
//     console.log('Invalid input. Please enter either "pcsx2" or "demul".');
//     return;
//   }

//   // Call the function to open the newest CT file
//   await openNewestCTFile(pcsx2OrDemul);
// }
