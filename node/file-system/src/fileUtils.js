const path = require("node:path");
const fsPromises = require("node:fs/promises");

const getFileNames = (cmdFileInput, command) => {
  const cmds = cmdFileInput.substring(command.length + 1).trimEnd();

  return command === "rename file"
    ? cmds.split(" ")
    : command === "overwrite file"
      ? cmds.split(" ")[0]
      : cmds;
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
