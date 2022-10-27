import * as fs from "fs"
import * as path from "path"
import * as childprocess from "child_process"

const DIR_CSVs = path.join(process.cwd(), `/main_files/CSV_to_JS`);
const FILE_ROM100 = path.join(DIR_CSVs, `Magneto_ROM100_F.csv`);
const READCSV = fs.readFileSync(FILE_ROM100, 'utf8');
const READ_HEADERS = READCSV.split(`\n`)[0].split(`,`);
const HEADERS_LENGTH = READCSV.split(`\n`)[0].split(`,`).length;
const CLIP_LENGTH = READCSV.split(`\n`).length;

var headersArray = [];
var totalFramesArray = [];

for (let i = 0; i < READ_HEADERS.length; i++)
{
    headersArray.push(READ_HEADERS[i]);
}
for (let i = 1; i < CLIP_LENGTH; i++)
{
    totalFramesArray.push(READCSV.split(`\n`)[i].split(',')[0]);
}
// console.log(HEADERS_LENGTH);
