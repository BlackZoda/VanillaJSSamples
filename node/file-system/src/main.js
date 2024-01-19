const chokidar = require("chokidar");
const fsPromises = require("node:fs/promises");
const { createFile, deleteFile } = require("./crud");
const { getFileName, getFileObject } = require("./fileUtils");

async function main(OPT, CMD) {
  cmdFile = await fsPromises.open(OPT.cmdFile, "r");

  cmdFile.on("change", async (cmdFileInput) => {
    cmdFileInput = cmdFileInput.toLowerCase();

    if (cmdFileInput.includes(CMD.createFile)) {
      const fileName = getFileName(cmdFileInput, CMD.createFile);
      const fileObj = await getFileObject(OPT.outputDir, fileName);
      await createFile(fileObj);
    }

    if (cmdFileInput.includes(CMD.deleteFile)) {
      const fileName = getFileName(cmdFileInput, CMD.deleteFile);
      const file = await getFileObject(OPT.outputDir, fileName);
      deleteFile(file);
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
