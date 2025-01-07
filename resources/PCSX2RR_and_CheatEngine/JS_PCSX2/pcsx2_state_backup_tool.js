import * as fs from 'fs';
import * as path from 'path';
import { DIR_PCSX2 } from '../../Both_Emulator_Resources/JS_TOOLS/Utils/getEmulatorDirectories.js';
import colors from '../../Both_Emulator_Resources/colors.js';

const DIR_SSTATES = path.join(DIR_PCSX2, 'sstates');
const DIR_STATEBK = path.join(DIR_PCSX2, 'StateBK');
const REPLAY_EXT = '.p2m';
const SLEEP_AMOUNT = 3500;
const ERR_STR = 'No replays found in ' + DIR_PCSX2 + ', exiting...';

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Returns the newest 'p2m' replay file in the DIR_PCSX2
function getNewestReplay() {
  const FILES = fs.readdirSync(DIR_PCSX2);
  const REPLAYS_LIST = FILES.filter(file => file.endsWith(REPLAY_EXT));
  if (REPLAYS_LIST.length === 0) {
    return ERR_STR;
  }
  const NEWEST_REPLAY = REPLAYS_LIST.reduce((prevRep, currRep) => {
    const oldTime = fs.statSync(path.join(DIR_PCSX2, prevRep)).mtimeMs;
    const newTime = fs.statSync(path.join(DIR_PCSX2, currRep)).mtimeMs;
    return oldTime > newTime ? prevRep : currRep;
  });

  return NEWEST_REPLAY;
}

// If no replays are found, exit the script
if (getNewestReplay() === ERR_STR) {
  console.log(colors.fg.red + ERR_STR + colors.reset);
  await sleep(SLEEP_AMOUNT);
  process.exit(0);
}

// Make and return the new main replay-folder
// in StateBK using the newest replay name if it doesn't exist
// Function to make and return the new main replay-folder 
// in StateBK using the newest replay name if it doesn't exist
function getAndMakeReplayFolder() {
  const NEWEST_REPLAY = getNewestReplay();
  const FOLDER_NAME = NEWEST_REPLAY.replace(REPLAY_EXT, '_pcsx2');
  const REPLAY_FOLDER_PATH = path.join(DIR_STATEBK, FOLDER_NAME);

  // Check if the folder doesn't exist and create it
  if (!fs.existsSync(REPLAY_FOLDER_PATH) && NEWEST_REPLAY !== ERR_STR) {
    fs.mkdirSync(REPLAY_FOLDER_PATH);

    // Highlight folder creation message with bright cyan
    console.log(colors.bright + colors.fg.cyan
      + 'Created: ' + REPLAY_FOLDER_PATH + colors.reset);

    // Highlight the newest replay information with bright cyan
    console.log(colors.bright + colors.fg.cyan
      + 'Newest replay is: ' + NEWEST_REPLAY + colors.reset);
  }

  return REPLAY_FOLDER_PATH;
}

const MAIN_REPLAY_FOLDER = getAndMakeReplayFolder();

// Make and increment a folder inside the Main Replay folder and return it
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

// Function to copy the newest replay and the contents of sstates to the new folder
function copyReplayAndSstatesToNewFolders() {
  const NEWEST_REPLAY = getNewestReplay();
  const NEW_FOLDER_PATH = getAndMakeIncrementedFolder();

  // Get and copy sstates
  const SSTATES = fs.readdirSync(DIR_SSTATES);
  SSTATES.forEach(SSTATE => {
    if (SSTATE.match(/00[0-9]/)) { // Match files ending with 00[0-9]
      fs.copyFileSync(path.join(DIR_SSTATES, SSTATE), path.join(NEW_FOLDER_PATH, SSTATE));
    }
  });
  fs.copyFileSync(path.join(DIR_PCSX2, NEWEST_REPLAY), path.join(NEW_FOLDER_PATH, NEWEST_REPLAY));

  // Handle the second newest replay folder
  if (!NEW_FOLDER_PATH.endsWith('001')) {
    const REPLAY_FOLDERS = fs.readdirSync(MAIN_REPLAY_FOLDER);
    const SECOND_NEWEST_REPLAY_FOLDER = REPLAY_FOLDERS[REPLAY_FOLDERS.length - 2];

    // Highlight second newest replay folder information with bright cyan
    console.log(colors.bright + colors.fg.cyan
      + 'Second newest replay folder is ' + SECOND_NEWEST_REPLAY_FOLDER + colors.reset
    );

    const REPLAY_FILES = fs.readdirSync(path.join(MAIN_REPLAY_FOLDER, SECOND_NEWEST_REPLAY_FOLDER));
    const SECOND_NEWEST_REPLAY = REPLAY_FILES.find(file => file.endsWith(REPLAY_EXT));

    // Newest replay statistics
    const STATS = fs.statSync(path.join(DIR_PCSX2, NEWEST_REPLAY));
    const STATS_MDATE = STATS.mtimeMs;

    // Second newest replay statistics
    const STATS2 = fs.statSync(path.join(MAIN_REPLAY_FOLDER, SECOND_NEWEST_REPLAY_FOLDER, SECOND_NEWEST_REPLAY));
    const STATS_MDATE2 = STATS2.mtimeMs;

    // Calculate the time difference between replays
    const TIME_DIFFERENCE = STATS_MDATE - STATS_MDATE2;
    const HOURS = Math.floor(TIME_DIFFERENCE / 3600000);
    const MINUTES = Math.floor(TIME_DIFFERENCE / 60000);
    const SECONDS = ((TIME_DIFFERENCE % 60000) / 1000).toFixed(0);

    // Highlight the time difference between replays with bright cyan
    console.log(colors.bright + colors.fg.cyan
      + 'Difference between ' + NEWEST_REPLAY
      + ' and ' + SECOND_NEWEST_REPLAY
      + ' is ' + HOURS
      + ' hours ' + MINUTES
      + ' minutes and ' + SECONDS
      + ' seconds' + colors.reset);

    if (TIME_DIFFERENCE === 0) {
      throw new Error(colors.fg.red + 'Replay files have the same date!' + colors.reset);
    }
  }
}

// Run the function and set a timeout in the console
console.log(copyReplayAndSstatesToNewFolders() || ``);
await sleep(SLEEP_AMOUNT);
