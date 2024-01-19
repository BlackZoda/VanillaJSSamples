const chokidar = require("chokidar");
const fsPromises = require("node:fs/promises");
const path = require("node:path");
const { createFile, deleteFile } = require("./crud.js");

async function main(OPT, CMD) {
  cmdFile = await fsPromises.open(OPT.cmdFile, "r");

  cmdFile.on("change", (cmdFileInput) => {
    cmdFileInput = cmdFileInput.toLowerCase();

    const getFileName = (command) =>
      cmdFileInput.substring(command.length + 1).trimEnd();

    function getFilePath(dir, fileName) {
      try {
        filePath = path.join(dir, fileName);
        return filePath;
      } catch (e) {
        console.error(e.message);
        return null;
      }
    }

    if (cmdFileInput.includes(CMD.createFile)) {
      const fileName = getFileName(CMD.createFile);
      const filePath = getFilePath(OPT.outputDir, fileName);
      createFile(filePath, fileName);
    }

    if (cmdFileInput.includes(CMD.deleteFile)) {
      const fileName = getFileName(CMD.deleteFile);
      const filePath = getFilePath(OPT.outputDir, fileName);
      deleteFile(filePath, fileName);
    }

    // TODO: rename file <path> <path>

    // TODO: read file <path>

    // TODO: overwrite file <path> "content"

    // TODO: append file <path> "content"
  });

  try {
    chokidar.watch(OPT.cmdFile).on("change", async () => {
      const buffer = Buffer.alloc((await cmdFile.stat()).size);

      const fileProps = {
        buffer: buffer,
        offset: 0, // location at which we want to start filling our buffer
        length: buffer.byteLength, // bytes we want to read
        position: 0, // positon that we start reading the file from
      };

      // reading the whole content
      await cmdFile.read(
        fileProps.buffer,
        fileProps.offset,
        fileProps.length,
        fileProps.position,
      );

      const cmdFileInput = buffer.toString("utf8");

      cmdFile.emit("change", cmdFileInput);
    });

    await new Promise(() => {});
  } catch (e) {
    console.error(e);
  } finally {
    await cmdFile.close();
  }
}

module.exports = main;
