import fs from 'fs';
import path from 'path';

/**
 * Checks if a file exists in a given directory.
 * @param {string} dir - The directory path.
 * @param {string} file - The file name.
 * @returns {boolean} - Returns true if the file exists, false otherwise.
 */
export function CheckFileExists(dir, file) {
  const filePath = path.join(dir, file);
  return fs.existsSync(filePath);
}
