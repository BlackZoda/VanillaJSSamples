const fsPromises = require("node:fs/promises");

async function createFile(fileInfo) {
  if (fileInfo.exists) {
    console.log(`The file ${fileInfo.name} already exists.`);
  } else {
    try {
      const fileHandle = await fsPromises.open(fileInfo.path, "w");
      console.log(`The file ${fileInfo.name} was created!`);
      fileHandle.close();
    } catch (e) {
      console.error(e.message);
    }
  }
}

async function deleteFile(fileInfo) {
  if (fileInfo.exists) {
    try {
      await fsPromises.rm(fileInfo.path);
      console.log(`The file ${fileInfo.name} was deleted!`);
    } catch (e) {
      console.error(e);
    }
  } else {
    console.log(`The file ${fileInfo.name} doesn't exist.`);
  }
}

async function renameFile(oldFileInfo, newFileInfo) {
  if (oldFileInfo.exists) {
    try {
      await fsPromises.rename(oldFileInfo.path, newFileInfo.path);
      console.log(
        `The file ${oldFileInfo.name} was renamed to ${newFileInfo.name}`,
      );
    } catch (e) {
      console.error(e);
    }
  } else {
    console.log(`The file ${oldFileInfo.name} doesn't exist.`);
  }
}

async function readFile(fileInfo) {
  if (fileInfo.exists) {
    try {
      const fileHandle = await fsPromises.open(fileInfo.path, "r");
      const content = await fileHandle.readFile();
      console.log(content.toString().trim());
      await fileHandle.close();
    } catch (e) {
      console.error(e.message);
    }
  } else {
    console.log(`The file ${fileInfo.name} doesn't exist.`);
  }
}

module.exports = { createFile, deleteFile, renameFile, readFile };
