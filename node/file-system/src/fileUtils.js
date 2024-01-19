const path = require("node:path");
const fsPromises = require("node:fs/promises");

const getFileName = (cmdFileInput, command) => {
  return cmdFileInput.substring(command.length + 1).trimEnd();
};

async function validateFile(dir, fileName) {
  const filePath = path.join(dir, fileName);
  let fileExists = false;

  try {
    const file = await fsPromises.open(filePath);
    await file.close(filePath);
    fileExists = true;
  } catch (e) {
    console.error(e.message);
  }

  return {
    name: fileName,
    path: filePath,
    exists: fileExists,
  };
}

module.exports = { getFileName, validateFile };
