import * as fs from "fs";

export function testDir(dir) {
  // check if the directory exists
  if (fs.existsSync(dir)) {
    console.log("Directory exists:", dir);
    // log the contents of the directory
    const files = fs.readdirSync(dir);
    console.log("Files in directory:", files);
  } else {
    console.log("Directory does not exist:");
  }
}
