const EMU_FOLDERS = ['PCSX2RR', 'DEMUL'];
const EMU_EXES = ['pcsx2.exe', 'demul.exe'];

let tempPSCSX2 = '';
let tempDEMUL = '';

/*
The for...of loop: only need to access the elements of
BASE_DIRS sequentially.
The i-loop: access elements of EMU_FOLDERS and
EMU_EXES array at the same index.
*/
// Define the base directories of each machine
let driveLetter = getDriveLetter();
const BASE_DIRS = [
  [driveLetter + ':', 'OneDrive', 'DesktopPC', 'Emulators'],
  [driveLetter + ':', 'Users', 'davil', 'OneDrive', 'L2', 'Emulators'],
  [driveLetter + ':', 'Users', 'davil', 'OneDrive', 'L3', 'Emulators'],
];
for (const baseDir of BASE_DIRS) {
  for (let i = 0; i < EMU_FOLDERS.length; i++) {
    const EMULATOR_DIR = path.join(...baseDir, EMU_FOLDERS[i]);
    if (CheckFileExists(EMULATOR_DIR, EMU_EXES[i])) {
      if (i === 0) { // if true and if i is 0, then it's PCSX2
        tempPSCSX2 = EMULATOR_DIR;
      } else {
        tempDEMUL = EMULATOR_DIR;
      }
    }
  }
}

export const DIR_PCSX2 = tempPSCSX2;
export const DIR_DEMUL = tempDEMUL;

// console.log(DIR_PCSX2);
// console.log(DIR_DEMUL);
