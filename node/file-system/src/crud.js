const fsPromises = require("node:fs/promises");

async function createFile(file) {
  if (file.exists) {
    console.log(`The file ${file.name} already exists.`);
  } else {
    const newFile = await fsPromises.open(file.path, "w");
    console.log(`The file ${file.name} was created!`);
    newFile.close();
  }
}

async function deleteFile(file) {
  if (file.exists) {
    await fsPromises.rm(file.path);
    console.log(`The file ${file.name} was deleted!`);
  } else {
    console.log(`The file ${file.name} doesn't exist.`);
  }
}

module.exports = { createFile, deleteFile };
