import { openNewestCTFile } from './openCT.js'
const DIR_CT_FILES = import.meta.url
  .replace('file:///', '')
  .replace('openNewestDemulCTFile.js', '');

openNewestCTFile('demul');
