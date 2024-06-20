import fs from 'fs';

function testPathExists(pathVariable, variableName) {
  if (fs.existsSync(pathVariable)) {
    console.log(`${variableName}: ${pathVariable}`);
  } else {
    console.log(`${variableName}: Path does not exist`);
  }
}

testPathExists(DIR_MAIN_TRUNK, 'DIR_MAIN_TRUNK');
testPathExists(DIR_RESOURCES, 'DIR_RESOURCES');
testPathExists(DIR_BOTH_EMULATOR_RESOURCES, 'DIR_BOTH_EMULATOR_RESOURCES');
testPathExists(DIR_JS_UTILS, 'DIR_JS_UTILS');
testPathExists(DIR_CSVS, 'DIR_CSVS');
testPathExists(DIR_EXPORT_TO_AE, 'DIR_EXPORT_TO_AE');
testPathExists(DIR_DEMUL_CT_FILES, 'DIR_DEMUL_CT_FILES');
testPathExists(DIR_PCSX2_CT_FILES, 'DIR_PCSX2_CT_FILES');
