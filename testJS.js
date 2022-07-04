import * as fs from 'fs';
import * as path from 'path';
const dirPath = path.join(process.cwd(), `/exportToAE/testPath}`);

fs.mkdirSync(dirPath);

fs.writeFile(`${dirPath}/'Test.js`, 'Helpcontent', (err) => { });