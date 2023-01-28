// State Backup Tool for PCSX2
import * as fs from 'fs';
import * as path from 'path';

import {DIR_PCSX2} from '../../Both_Emulator_Resources/JS_Utils/JS_UTIL_paths.js';

const DIR_SSTATES = DIR_PCSX2 + 'sstates\\';
const DIR_STATEBK = DIR_PCSX2 + 'StateBK\\';
const REPLAY_EXT = '.p2m';
const SLEEP_AMOUNT = 1500;
const errStr = 'No replays found in ' + DIR_PCSX2 + ', exiting...';

// Sleep function to block the thread for a specified amount of time
function sleep(ms)
{
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Returns the newest 'p2m' replay file in the DIR_PCSX2
function getNewestReplay()
{
  const files = fs.readdirSync(DIR_PCSX2);
  const replays = files.filter(file => file.endsWith(REPLAY_EXT));
  if (replays.length === 0)
  {
    return 'No replays found in ' + DIR_PCSX2 + ', exiting...'
  }
  const newestReplay = replays.reduce((previousReplayFile, currentReplayFile) =>
    fs.statSync(DIR_PCSX2 + previousReplayFile).mtimeMs > fs.statSync(DIR_PCSX2 + currentReplayFile).mtimeMs
      ? previousReplayFile : currentReplayFile);
  return newestReplay;
}
// If no replays are found, exit the script
if (getNewestReplay() === errStr)
{
  console.log(errStr || '')
  await sleep(SLEEP_AMOUNT)
}
// Make? and Return the new main replay-folder in StateBK using the newest replay name if it doesn't exist
function getAndMakeReplayFolder()
{
  const newestReplay = getNewestReplay();
  const folderName = newestReplay.replace(REPLAY_EXT, '_pcsx2');
  const ReplayfolderPath = path.join(DIR_STATEBK, folderName)
  if (!fs.existsSync(ReplayfolderPath))
  {
    fs.mkdirSync(ReplayfolderPath);
  }
  return ReplayfolderPath;
}

// Make? and increment a folder inside the Main Replay folder and Return it
function getAndMakeIncrementedFolder()
{
  const mainReplayFolder = getAndMakeReplayFolder();
  const folders = fs.readdirSync(mainReplayFolder);
  const folderNumber = folders.length + 1;
  const newFolderName = getNewestReplay().replace('.p2m', '_pcsx2_') + folderNumber.toString().padStart(3, '0');
  const newFolderPath = path.join(mainReplayFolder, newFolderName);
  if (!fs.existsSync(newFolderPath))
  {
    fs.mkdirSync(newFolderPath);
  }
  return newFolderPath;
}

// Copy the newest replay and the contents of sstates to the new folder
function copyReplayAndSstatesToNewFolders()
{
  const newestReplay = getNewestReplay();
  const newFolderPath = getAndMakeIncrementedFolder();
  // Get and copy sstates
  const sstates = fs.readdirSync(DIR_SSTATES);
  const statesLength = sstates.length;
  sstates.forEach(sstate =>
  {
    fs.copyFileSync(path.join(DIR_SSTATES, sstate), path.join(newFolderPath, sstate));
  }
  );
  // Get and copy replay
  fs.copyFileSync(path.join(DIR_PCSX2, newestReplay), path.join(newFolderPath, newestReplay));
  return console.log('Copied ' + getNewestReplay() + ' and ' + statesLength + ' states to ' + newFolderPath);
}

// Run the function and set a timeout in the console
console.log(copyReplayAndSstatesToNewFolders() || ``);
await sleep(SLEEP_AMOUNT);