const path = require("node:path");
const fsPromises = require("node:fs/promises");

const getFileNames = (cmdFileInput, CMD, currentCmd) => {
  const extractedCmds = cmdFileInput.substring(currentCmd.length + 1).trimEnd();

  return currentCmd === CMD.renameFile
    ? extractedCmds.split(" ").slice(0, 2)
    : currentCmd === CMD.overwriteFile || CMD.appendFile
      ? extractedCmds.split(" ")[0]
      : extractedCmds;
};

async function getFileInfo(dir, fileName) {
  const filePath = path.join(dir, fileName);
  let fileExists = false;

  try {
    const file = await fsPromises.open(filePath);
    await file.close(filePath);
    fileExists = true;
  } catch (e) {}

  return {
    name: fileName,
    dir,
    path: filePath,
    exists: fileExists,
  };
}

async function getNewContent(cmdFileInput) {
  const re = /\{([^}]+)\}/;
  const match = cmdFileInput.match(re);
  if (match) {
    return match[1];
  } else {
    return "";
  }
}

module.exports = { getFileNames, getFileInfo, getNewContent };
