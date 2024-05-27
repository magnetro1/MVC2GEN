// openPCSX2_CT.js

import path from 'path';
import { fileURLToPath } from 'url';
import { openNewestCTFile } from './openCT.js'
// Get the directory of the current script
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Change the working directory to the desired path
process.chdir(path.resolve(__dirname, '../../..'));

// what is our current working directory?

console.log(process.cwd());
console.log(__filename);
// Call the function with the desired argument
openNewestCTFile('pcsx2');
