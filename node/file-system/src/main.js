const chokidar = require("chokidar");
const fsPromises = require("node:fs/promises");
const { createFile, deleteFile, renameFile } = require("./crud");
const { getFileNames, getFileObject } = require("./fileUtils");
const path = require("node:path");

async function main(OPT, CMD) {
  cmdFile = await fsPromises.open(OPT.cmdFile, "r");

  cmdFile.on("change", async (cmdFileInput) => {
    cmdFileInput = cmdFileInput.toLowerCase();

    if (cmdFileInput.includes(CMD.createFile)) {
      const fileName = getFileNames(cmdFileInput, CMD.createFile)[0];
      const file = await getFileObject(OPT.outputDir, fileName);
      await createFile(file);
    }

    if (cmdFileInput.includes(CMD.deleteFile)) {
      const fileName = getFileNames(cmdFileInput, CMD.deleteFile)[0];
      const file = await getFileObject(OPT.outputDir, fileName);
      await deleteFile(file);
    }

    if (cmdFileInput.includes(CMD.renameFile)) {
      const fileNames = getFileNames(cmdFileInput, CMD.renameFile);
      if (fileNames.length === 2) {
        const oldFileName = fileNames[0];
        const newFileName = fileNames[1];
        const oldFile = await getFileObject(OPT.outputDir, oldFileName);
        const newFile = await getFileObject(OPT.outputDir, newFileName);
        await renameFile(oldFile, newFile);
      } else {
        console.error("Need a target file and new file name to rename");
      }
    }

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
