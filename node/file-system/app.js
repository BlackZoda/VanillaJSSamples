// alternative to fs.watch
const path = require("node:path");
const main = require("./src/main.js");

const OPT = {
  cmdFile: path.join(__dirname, "commands.txt"),
  outputDir: path.join(__dirname, "output"),
};

const CMD = {
  createFile: "create file",
  readFile: "read file",
  deleteFile: "delete file",
  renameFile: "rename file",
  overwriteFile: "overwrite file",
  appendFile: "append file",
};

main(OPT, CMD);
