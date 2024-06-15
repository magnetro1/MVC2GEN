import path from 'path';

/**
 * Retrieves the drive letter from the current working directory path.
 * @returns {string} The drive letter.
 */
export function GetDriveLetter() {
  const currentPath = path.resolve(process.cwd());
  const driveLetter = currentPath[0];
  return driveLetter;
}
