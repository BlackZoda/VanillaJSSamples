const fsPromises = require("node:fs/promises");

async function createFile(file) {
  if (file.exists) {
    console.log(`The file ${file.name} already exists.`);
  } else {
    try {
      const newFile = await fsPromises.open(file.path, "w");
      console.log(`The file ${file.name} was created!`);
      newFile.close();
    } catch (e) {
      console.error(e.message);
    }
  }
}

async function deleteFile(file) {
  if (file.exists) {
    try {
      await fsPromises.rm(file.path);
      console.log(`The file ${file.name} was deleted!`);
    } catch (e) {
      console.error(e);
    }
  } else {
    console.log(`The file ${file.name} doesn't exist.`);
  }
}

async function renameFile(oldFile, newFile) {
  if (oldFile.exists) {
    try {
      await fsPromises.rename(oldFile.path, newFile.path);
      console.log(`The file ${oldFile.name} was renamed to ${newFile.name}`);
    } catch (e) {
      console.error(e);
    }
  } else {
    console.log(`The file ${oldFile.name} doesn't exist.`);
  }
}

module.exports = { createFile, deleteFile, renameFile };
