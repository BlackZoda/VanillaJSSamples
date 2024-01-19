const fsPromises = require("node:fs/promises");
const path = require("path");

async function createFile(filePath, fileName) {
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

async function deleteFile(filePath, fileName) {
  try {
    await fsPromises.rm(filePath);
    console.log(`The file ${fileName} was deleted.`);
  } catch (e) {
    console.error(`The file ${fileName} doesn't exist.`);
  }
}

module.exports = { createFile, deleteFile };
