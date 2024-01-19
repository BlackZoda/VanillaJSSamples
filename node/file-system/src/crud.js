const fsPromises = require("node:fs/promises");

const createFile = async (fileInfo) => {
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
};

const deleteFile = async (fileInfo) => {
  if (fileInfo.exists) {
    try {
      await fsPromises.rm(fileInfo.path);
      console.log(`The file ${fileInfo.name} was deleted!`);
    } catch (e) {
      console.error(e);
    }
  } else {
    fileDoesntExist(fileInfo.name);
  }
};

const renameFile = async (oldFileInfo, newFileInfo) => {
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
    fileDoesntExist(fileInfo.name);
  }
};

const readFile = async (fileInfo) => {
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
    fileDoesntExist(fileInfo.name);
  }
};

overwriteFile = async (fileInfo, content) => {
  if (fileInfo.exists) {
    try {
      console.log("New content:", content);
      const fileHandle = await fsPromises.open(fileInfo.path, "w");
      await fileHandle.write(content + "\n");
      console.log(`Overwrote the file ${fileInfo.name}.`);
      await fileHandle.close();
    } catch (e) {
      fileDoesntExist(fileInfo.name);
    }
  } else {
    fileDoesntExist(fileInfo.name);
  }
};

appendFile = async (fileInfo, content) => {
  if (fileInfo.exists) {
    try {
      console.log("New content:", content);
      const fileHandle = await fsPromises.open(fileInfo.path, "a");
      await fileHandle.write(content + "\n");
      console.log(`Appended to the file ${fileInfo.name}.`);
      await fileHandle.close();
    } catch (e) {
      fileDoesntExist(fileInfo.name);
    }
  } else {
    fileDoesntExist(fileInfo.name);
  }
};

function fileDoesntExist(fileName) {
  console.log(`The file ${fileName} doesn't exist.`);
}

module.exports = {
  createFile,
  deleteFile,
  renameFile,
  readFile,
  overwriteFile,
  appendFile,
};
