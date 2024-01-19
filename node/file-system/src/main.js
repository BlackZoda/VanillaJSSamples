const chokidar = require("chokidar");
const fsPromises = require("node:fs/promises");
const { createFile, deleteFile, renameFile, readFile } = require("./crud");
const { getFileNames, getFileInfo } = require("./fileUtils");

async function main(OPT, CMD) {
  cmdFile = await fsPromises.open(OPT.cmdFile, "r");

  cmdFile.on("change", async (cmdFileInput) => {
    cmdFileInput = cmdFileInput.toLowerCase();

    if (cmdFileInput.includes(CMD.createFile)) {
      const fileName = getFileNames(cmdFileInput, CMD.createFile)[0];
      const file = await getFileInfo(OPT.outputDir, fileName);
      await createFile(file);
    }

    if (cmdFileInput.includes(CMD.deleteFile)) {
      const fileName = getFileNames(cmdFileInput, CMD.deleteFile)[0];
      const fileInfo = await getFileInfo(OPT.outputDir, fileName);
      await deleteFile(fileInfo);
    }

    if (cmdFileInput.includes(CMD.renameFile)) {
      const fileNames = getFileNames(cmdFileInput, CMD.renameFile);
      if (fileNames.length === 2) {
        const oldFileName = fileNames[0];
        const newFileName = fileNames[1];
        const oldFileInfo = await getFileInfo(OPT.outputDir, oldFileName);
        const newFileInfo = await getFileInfo(OPT.outputDir, newFileName);
        await renameFile(oldFileInfo, newFileInfo);
      } else {
        console.error("Need a target file and new file name to rename");
      }
    }

    // TODO: read file <path>
    if (cmdFileInput.includes(CMD.readFile)) {
      const fileName = getFileNames(cmdFileInput, CMD.readFile)[0];
      const fileInfo = await getFileInfo(OPT.outputDir, fileName);
      await readFile(fileInfo);
    }

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
