const fsPromises = require("node:fs/promises");
const path = require("path");

async function createFile(outputDir, fileName) {
  try {
    const filePath = path.join(outputDir, fileName);
    let existingFile;
    if (filePath) {
      try {
        existingFile = await fsPromises.open(filePath, "r");
        console.log(`The file ${fileName} already exist.`);
        existingFile.close();
      } catch (e) {
        const newFile = await fsPromises.open(filePath, "w");
        console.log(`The file ${fileName} was created!`);
        newFile.close();
      }
    }
  } catch (e) {
    console.error(e.message);
  }
}

module.exports = { createFile };
