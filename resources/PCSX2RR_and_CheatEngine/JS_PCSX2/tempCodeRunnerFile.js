
// // const DIR_PCSX2 = 'C:/Users/davil/OneDrive/L3/Emulators/PCSX2RR/';
// const DIR_SSTATES = DIR_PCSX2 + 'sstates/';
// const DIR_STATEBK = DIR_PCSX2 + 'StateBK/';
// const REPLAY_EXT = '.p2m';
// const SLEEP_AMOUNT = 1500;
// const errStr = 'No replays found in ' + DIR_PCSX2 + ', exiting...';

// function sleep(ms) {
//   return new Promise(resolve => setTimeout(resolve, ms));
// }

// // Returns the newest 'p2m' replay file in the DIR_PCSX2
// function getNewestReplay() {
//   const files = fs.readdirSync(DIR_PCSX2);
//   const replaysList = files.filter(file => file.endsWith(REPLAY_EXT));
//   if (replaysList.length === 0) {
//     return 'No replays found in ' + DIR_PCSX2 + ', exiting...'
//   }
//   const newestReplay = replaysList.reduce((previousReplayFile, currentReplayFile) =>

//     fs.statSync(DIR_PCSX2 + previousReplayFile).mtimeMs > fs
//       .statSync(DIR_PCSX2 + currentReplayFile).mtimeMs
//       ? previousReplayFile : currentReplayFile);
//   return newestReplay;
// }
// // console.log(getNewestReplay());

// // If no replays are found, exit the script
// if (getNewestReplay() === errStr) {
//   console.log(errStr || '')
//   await sleep(SLEEP_AMOUNT)
// }
// // Make? and Return the new main replay-folder
// // in StateBK using the newest replay name if it doesn't exist
// function getAndMakeReplayFolder() {
//   const newestReplay = getNewestReplay();
//   const folderName = newestReplay.replace(REPLAY_EXT, '_pcsx2');
//   const ReplayfolderPath = path.join(DIR_STATEBK, folderName)
//   if (!fs.existsSync(ReplayfolderPath) && newestReplay !== errStr) {
//     fs.mkdirSync(ReplayfolderPath);
//   }
//   return ReplayfolderPath;
// }
// // store main replay folder in a variable
// const mainReplayFolder = getAndMakeReplayFolder();
// // console.log(mainReplayFolder);
// // Make? and increment a folder inside the Main Replay folder and Return it
// function getAndMakeIncrementedFolder() {
//   const mainReplayFolder = getAndMakeReplayFolder();
//   const folders = fs.readdirSync(mainReplayFolder);
//   const folderNumber = folders.length + 1;
//   const newFolderName = getNewestReplay()
//     .replace('.p2m', '_pcsx2_') + folderNumber
//       .toString()
//       .padStart(3, '0');
//   const newFolderPath = path.join(mainReplayFolder, newFolderName);
//   if (!fs.existsSync(newFolderPath)) {
//     fs.mkdirSync(newFolderPath);
//   }
//   return newFolderPath;
// }


// // Copy the newest replay and the contents of sstates to the new folder
// function copyReplayAndSstatesToNewFolders() {
//   const newestReplay = getNewestReplay();
//   const newFolderPath = getAndMakeIncrementedFolder();
//   // Get and copy sstates
//   const sstates = fs.readdirSync(DIR_SSTATES);
//   const statesLength = sstates.length;
//   sstates.forEach(sstate => {
//     fs.copyFileSync(path.join(DIR_SSTATES, sstate), path.join(newFolderPath, sstate));
//   }
//   );


//   fs.copyFileSync(path.join(DIR_PCSX2, newestReplay), path.join(newFolderPath, newestReplay));

//   // find the second newest replay folder and get the replay file's size
//   if (!newFolderPath.endsWith('001')) {
//     const replayFolders = fs.readdirSync(mainReplayFolder);
//     const secondNewestReplayFolder = replayFolders[replayFolders.length - 2];
//     console.log('Second newest replay folder is ' + secondNewestReplayFolder);
//     const replayFiles = fs.readdirSync(path.join(mainReplayFolder, secondNewestReplayFolder));
//     const secondNewestReplay = replayFiles.find(file => file.endsWith(REPLAY_EXT));
//     // Newest replay
//     const stats = fs.statSync(path.join(DIR_PCSX2, newestReplay));
//     const statsMDate = stats.mtimeMs;

//     // Second newest replay
//     const stats2 = fs.statSync(path.join(
//       mainReplayFolder, secondNewestReplayFolder, secondNewestReplay
//     ));
//     const statsMDate2 = stats2.mtimeMs;

//     // Compare the dates of the two replays
//     const timeDifference = statsMDate - statsMDate2;
//     // log the difference in minutes and seconds
//     const minutes = Math.floor(timeDifference / 60000);
//     const seconds = ((timeDifference % 60000) / 1000).toFixed(0);
//     console.log('Difference between '
//       + newestReplay + ' and '
//       + secondNewestReplay
//       + ' is '
//       + minutes
//       + ' minutes and '
//       + seconds
//       + ' seconds');
//   }
// }

// // Run the function and set a timeout in the console
// console.log(copyReplayAndSstatesToNewFolders() || ``);
// await sleep(SLEEP_AMOUNT);
