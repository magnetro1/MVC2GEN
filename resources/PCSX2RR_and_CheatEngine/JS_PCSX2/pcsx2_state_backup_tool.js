import * as fs from 'fs/promises';
import * as path from 'path';
import { DIR_PCSX2 } from '../../Both_Emulator_Resources/JS_TOOLS/Utils/getEmulatorDirectories.js';
import colors from '../../Both_Emulator_Resources/colors.js';

class ReplayBackupManager {
  static REPLAY_EXT = '.p2m';
  static SLEEP_AMOUNT = 3500;

  constructor() {
    this.dirPcsx2 = DIR_PCSX2;
    this.dirSstates = path.join(this.dirPcsx2, 'sstates');
    this.dirStateBk = path.join(this.dirPcsx2, 'StateBK');
  }

  async sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getNewestReplay() {
    try {
      const files = await fs.readdir(this.dirPcsx2);
      const replaysList = files.filter(file => file.endsWith(ReplayBackupManager.REPLAY_EXT));

      if (replaysList.length === 0) {
        throw new Error(`No replays found in ${this.dirPcsx2}`);
      }

      const replaysWithStats = await Promise.all(
        replaysList.map(async (replay) => {
          const stats = await fs.stat(path.join(this.dirPcsx2, replay));
          return { name: replay, time: stats.mtimeMs };
        })
      );

      return replaysWithStats.reduce((prev, curr) =>
        prev.time > curr.time ? prev : curr
      ).name;

    } catch (error) {
      throw new Error(`Failed to get newest replay: ${error.message}`);
    }
  }

  async getAndMakeReplayFolder() {
    try {
      const newestReplay = await this.getNewestReplay();
      const folderName = newestReplay.replace(ReplayBackupManager.REPLAY_EXT, '_pcsx2');
      const replayFolderPath = path.join(this.dirStateBk, folderName);

      const exists = await fs.access(replayFolderPath)
        .then(() => true)
        .catch(() => false);

      if (!exists) {
        await fs.mkdir(replayFolderPath);
        console.log(colors.bright + colors.fg.cyan +
          `Created: ${replayFolderPath}
Newest replay is: ${newestReplay}` + colors.reset);
      }

      return replayFolderPath;
    } catch (error) {
      throw new Error(`Failed to create replay folder: ${error.message}`);
    }
  }

  async getAndMakeIncrementedFolder() {
    try {
      const mainReplayFolder = await this.getAndMakeReplayFolder();
      const folders = await fs.readdir(mainReplayFolder);
      const folderNumber = folders.length + 1;

      const newestReplay = await this.getNewestReplay();
      const newFolderName = `${newestReplay.replace('.p2m', '_pcsx2_')}${String(folderNumber).padStart(3, '0')}`;
      const newFolderPath = path.join(mainReplayFolder, newFolderName);

      const exists = await fs.access(newFolderPath)
        .then(() => true)
        .catch(() => false);

      if (!exists) {
        await fs.mkdir(newFolderPath);
      }

      return newFolderPath;
    } catch (error) {
      throw new Error(`Failed to create incremented folder: ${error.message}`);
    }
  }

  async copyReplayAndSstatesToNewFolders() {
    try {
      const newestReplay = await this.getNewestReplay();
      const newFolderPath = await this.getAndMakeIncrementedFolder();

      // Copy save states
      const sstates = await fs.readdir(this.dirSstates);
      const copyPromises = sstates
        .filter(sstate => /00[0-9]$/.test(sstate))
        .map(sstate =>
          fs.copyFile(
            path.join(this.dirSstates, sstate),
            path.join(newFolderPath, sstate)
          )
        );

      // Copy replay file
      copyPromises.push(
        fs.copyFile(
          path.join(this.dirPcsx2, newestReplay),
          path.join(newFolderPath, newestReplay)
        )
      );

      await Promise.all(copyPromises);

      // Handle comparison with previous replay if not the first one
      if (!newFolderPath.endsWith('001')) {
        await this.compareWithPreviousReplay(newestReplay, newFolderPath);
      }

    } catch (error) {
      throw new Error(`Failed to copy files: ${error.message}`);
    }
  }

  async compareWithPreviousReplay(newestReplay, newFolderPath) {
    const mainReplayFolder = await this.getAndMakeReplayFolder();
    const replayFolders = await fs.readdir(mainReplayFolder);
    const secondNewestFolder = replayFolders[replayFolders.length - 2];

    console.log(colors.bright + colors.fg.cyan +
      `Second newest replay folder is ${secondNewestFolder}` + colors.reset);

    const replayFiles = await fs.readdir(path.join(mainReplayFolder, secondNewestFolder));
    const secondNewestReplay = replayFiles.find(file => file.endsWith(ReplayBackupManager.REPLAY_EXT));

    const [newestStats, secondNewestStats] = await Promise.all([
      fs.stat(path.join(this.dirPcsx2, newestReplay)),
      fs.stat(path.join(mainReplayFolder, secondNewestFolder, secondNewestReplay))
    ]);

    const timeDifference = newestStats.mtimeMs - secondNewestStats.mtimeMs;

    if (timeDifference === 0) {
      throw new Error(colors.fg.red + 'Replay files have the same date!' + colors.reset);
    }

    const hours = Math.floor(timeDifference / 3600000);
    const minutes = Math.floor((timeDifference % 3600000) / 60000);
    const seconds = Math.floor((timeDifference % 60000) / 1000);

    console.log(colors.bright + colors.fg.cyan +
      `Difference between ${newestReplay} and ${secondNewestReplay} is ` +
      `${hours} hours ${minutes} minutes and ${seconds} seconds` + colors.reset);
  }
}

async function main() {
  try {
    const backupManager = new ReplayBackupManager();
    await backupManager.copyReplayAndSstatesToNewFolders();
    console.log(colors.bright + colors.fg.green + 'Backup completed successfully!' + colors.reset);
  } catch (error) {
    console.error(colors.fg.red + error.message + colors.reset);
  }

  // After all operations and logs are complete, keep the window open
  console.log(colors.fg.yellow + '\nClosing in 3 seconds...' + colors.reset);
  await new ReplayBackupManager().sleep(3000);
}

// Use process.on('exit') to ensure the script doesn't exit prematurely
process.on('exit', () => {
  console.log(colors.reset);  // Reset colors before exit
});

// Handle any uncaught errors to ensure they're visible
process.on('uncaughtException', (err) => {
  console.error(colors.fg.red + 'Unexpected error: ' + err.message + colors.reset);
  console.log(colors.fg.yellow + '\nClosing in 3 seconds...' + colors.reset);
  setTimeout(() => process.exit(1), 3000);
});

main().catch(err => {
  console.error(colors.fg.red + 'Fatal error: ' + err.message + colors.reset);
  console.log(colors.fg.yellow + '\nClosing in 3 seconds...' + colors.reset);
  setTimeout(() => process.exit(1), 3000);
});
