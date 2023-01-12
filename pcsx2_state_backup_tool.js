// State Backup Tool for PCSX2
import * as fs from 'fs';
import * as path from 'path';

import {PCSX2_DIR} from './paths_aliases.js';

const SSTATES_DIR = PCSX2_DIR + 'sstates\\';
const STATEBK_DIR = PCSX2_DIR + 'StateBK\\';
const REPLAY_EXT = '.p2m';
const SLEEP_AMOUNT = 3500;
const errStr = 'No replays found in ' + PCSX2_DIR + ', exiting...';

// Sleep function to block the thread for a specified amount of time
function sleep(ms)
{
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Returns the newest 'p2m' replay file in the PCSX2_DIR or a error string if none are found
function getNewestReplay()
{
  const files = fs.readdirSync(PCSX2_DIR);
  const replays = files.filter(file => file.endsWith(REPLAY_EXT));
  if (replays.length === 0)
  {
    return 'No replays found in ' + PCSX2_DIR + ', exiting...'
  }
  const newestReplay = replays.reduce((previousReplayFile, currentReplayFile) =>
    fs.statSync(PCSX2_DIR + previousReplayFile).mtimeMs > fs.statSync(PCSX2_DIR + currentReplayFile).mtimeMs
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
  const ReplayfolderPath = path.join(STATEBK_DIR, folderName)
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
  const sstates = fs.readdirSync(SSTATES_DIR);
  const statesLength = sstates.length;
  sstates.forEach(sstate =>
  {
    fs.copyFileSync(path.join(SSTATES_DIR, sstate), path.join(newFolderPath, sstate));
  }
  );
  // Get and copy replay
  fs.copyFileSync(path.join(PCSX2_DIR, newestReplay), path.join(newFolderPath, newestReplay));
  return console.log('Copied ' + getNewestReplay() + ' and ' + statesLength + ' states to ' + newFolderPath);
}

// Run the function and set a timeout in the console
// console.log(getNewestReplay() || ``);
console.log(copyReplayAndSstatesToNewFolders() || ``);
await sleep(SLEEP_AMOUNT);