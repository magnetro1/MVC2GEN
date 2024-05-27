// State Backup Tool for PCSX2
import * as fs from 'fs';
import * as path from 'path';
import { DIR_PCSX2 } from '../../Both_Emulator_Resources/JS_Utils/JS_UTIL_paths.js';

console.log(DIR_PCSX2);

const DIR_SSTATES = path.join(DIR_PCSX2, 'sstates');
const DIR_STATEBK = path.join(DIR_PCSX2, 'StateBK');
const REPLAY_EXT = '.p2m';
const SLEEP_AMOUNT = 2500;
const ERR_STR = 'No replays found in ' + DIR_PCSX2 + ', exiting...';

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Returns the newest 'p2m' replay file in the DIR_PCSX2
function getNewestReplay() {
  const FILES = fs.readdirSync(DIR_PCSX2);
  const REPLAYS_LIST = FILES.filter(file => file.endsWith(REPLAY_EXT));
  if (REPLAYS_LIST.length === 0) {
    return 'No replays found in ' + DIR_PCSX2 + ', exiting...'
  }
  const NEWEST_REPLAY = REPLAYS_LIST.reduce((previousReplayFile, currentReplayFile) =>

    fs.statSync(DIR_PCSX2 + previousReplayFile).mtimeMs > fs
      .statSync(DIR_PCSX2 + currentReplayFile).mtimeMs
      ? previousReplayFile : currentReplayFile);
  return NEWEST_REPLAY;
}
// console.log(getNewestReplay());

// If no replays are found, exit the script
if (getNewestReplay() === ERR_STR) {
  console.log(ERR_STR || '')
  await sleep(SLEEP_AMOUNT)
}

// Make? and Return the new main replay-folder
// in StateBK using the newest replay name if it doesn't exist
function getAndMakeReplayFolder() {
  const NEWEST_REPLAY = getNewestReplay();
  const FOLDER_NAME = NEWEST_REPLAY.replace(REPLAY_EXT, '_pcsx2');
  const REPLAY_FOLDER_PATH = path.join(DIR_STATEBK, FOLDER_NAME)
  if (!fs.existsSync(REPLAY_FOLDER_PATH) && NEWEST_REPLAY !== ERR_STR) {
    fs.mkdirSync(REPLAY_FOLDER_PATH);
  }
  return REPLAY_FOLDER_PATH;
}
const MAIN_REPLAY_FOLDER = getAndMakeReplayFolder();
// console.log(MAIN_REPLAY_FOLDER);

// Make? and increment a folder inside the Main Replay folder and Return it
function getAndMakeIncrementedFolder() {
  const MAIN_REPLAY_FOLDER = getAndMakeReplayFolder();
  const FOLDERS = fs.readdirSync(MAIN_REPLAY_FOLDER);
  const FOLDER_NUMBER = FOLDERS.length + 1;
  const NEW_FOLDER_NAME = getNewestReplay()
    .replace('.p2m', '_pcsx2_') + FOLDER_NUMBER
      .toString()
      .padStart(3, '0');
  const NEW_FOLDER_PATH = path.join(MAIN_REPLAY_FOLDER, NEW_FOLDER_NAME);
  if (!fs.existsSync(NEW_FOLDER_PATH)) {
    fs.mkdirSync(NEW_FOLDER_PATH);
  }
  return NEW_FOLDER_PATH;
}


// Copy the newest replay and the contents of sstates to the new folder
function copyReplayAndSstatesToNewFolders() {
  const NEWEST_REPLAY = getNewestReplay();
  const NEW_FOLDER_PATH = getAndMakeIncrementedFolder();
  // Get and copy sstates
  const SSTATES = fs.readdirSync(DIR_SSTATES);
  const STATES_LENGTH = SSTATES.length;
  SSTATES.forEach(SSTATE => {
    // if SSTATE ends with this regex: /00[0-9]
    if (SSTATE.match(/00[0-9]/)) {
      fs.copyFileSync(path.join(DIR_SSTATES, SSTATE), path.join(NEW_FOLDER_PATH, SSTATE));
    }
  }
  );


  fs.copyFileSync(path.join(DIR_PCSX2, NEWEST_REPLAY), path.join(NEW_FOLDER_PATH, NEWEST_REPLAY));

  // find the second newest replay folder and get the replay file's size
  if (!NEW_FOLDER_PATH.endsWith('001')) {
    const REPLAY_FOLDERS = fs.readdirSync(MAIN_REPLAY_FOLDER);
    const SECOND_NEWEST_REPLAY_FOLDER = REPLAY_FOLDERS[REPLAY_FOLDERS.length - 2];
    console.log('Second newest replay folder is ' + SECOND_NEWEST_REPLAY_FOLDER);
    const REPLAY_FILES = fs.readdirSync(path.join(MAIN_REPLAY_FOLDER, SECOND_NEWEST_REPLAY_FOLDER));
    const SECOND_NEWEST_REPLAY = REPLAY_FILES.find(file => file.endsWith(REPLAY_EXT));
    // Newest replay
    const STATS = fs.statSync(path.join(DIR_PCSX2, NEWEST_REPLAY));
    const STATS_MDATE = STATS.mtimeMs;

    // Second newest replay
    const STATS2 = fs.statSync(path.join(
      MAIN_REPLAY_FOLDER, SECOND_NEWEST_REPLAY_FOLDER, SECOND_NEWEST_REPLAY
    ));
    const STATS_MDATE2 = STATS2.mtimeMs;

    // Compare the dates of the two replays
    const TIME_DIFFERENCE = STATS_MDATE - STATS_MDATE2;
    // log the difference in minutes and seconds
    const MINUTES = Math.floor(TIME_DIFFERENCE / 60000);
    const SECONDS = ((TIME_DIFFERENCE % 60000) / 1000).toFixed(0);
    console.log('Difference between '
      + NEWEST_REPLAY + ' and '
      + SECOND_NEWEST_REPLAY
      + ' is '
      + MINUTES
      + ' minutes and '
      + SECONDS
      + ' seconds');
    // if the time difference is 0, throw an error
    if (TIME_DIFFERENCE === 0) {
      throw new Error('Replay files have the same date!');
    }
  }
}

// Run the function and set a timeout in the console
console.log(copyReplayAndSstatesToNewFolders() || ``);
await sleep(SLEEP_AMOUNT);
