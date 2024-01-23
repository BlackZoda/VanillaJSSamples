const chokidar = require("chokidar");
const fsPromises = require("node:fs/promises");
const {
  createFile,
  deleteFile,
  renameFile,
  readFile,
  overwriteFile,
  appendFile,
} = require("./crud");
const { getFileNames, getFileInfo, getNewContent } = require("./fileUtils");

async function main(OPT, CMD) {
  cmdFile = await fsPromises.open(OPT.cmdFile, "r");

  cmdFile.on("change", async (cmdFileInput) => {
    // command template for creating a new file in commands.txt:
    // create file newfile.txt
    if (cmdFileInput.includes(CMD.createFile)) {
      const fileName = getFileNames(cmdFileInput, CMD, CMD.createFile);
      const fileInfo = await getFileInfo(OPT.outputDir, fileName);
      await createFile(fileInfo);
    }

    // command template for deleting a file in commands.txt:
    // delete file filenametodelete.txt
    if (cmdFileInput.includes(CMD.deleteFile)) {
      const fileName = getFileNames(cmdFileInput, CMD, CMD.deleteFile);
      const fileInfo = await getFileInfo(OPT.outputDir, fileName);
      await deleteFile(fileInfo);
    }

    // command template for renaiming a file in commands.txt:
    // rename file oldfilename.txt newfilename.txt
    if (cmdFileInput.includes(CMD.renameFile)) {
      const fileNames = getFileNames(cmdFileInput, CMD, CMD.renameFile);
      console.log(fileNames);
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

    // command template for reading a file in commands.txt:
    // read file filename.txt
    if (cmdFileInput.includes(CMD.readFile)) {
      const fileName = getFileNames(cmdFileInput, CMD, CMD.readFile);
      const fileInfo = await getFileInfo(OPT.outputDir, fileName);
      await readFile(fileInfo);
    }

    // command template for overwriting the content of a file in command.txt:
    // overwrite file <path> {content}
    if (cmdFileInput.includes(CMD.overwriteFile)) {
      const fileName = getFileNames(cmdFileInput, CMD, CMD.overwriteFile);
      const newContent = await getNewContent(cmdFileInput);
      const fileInfo = await getFileInfo(OPT.outputDir, fileName);
      await overwriteFile(fileInfo, newContent);
    }

    // TODO: append file <path> {content}
    if (cmdFileInput.includes(CMD.appendFile)) {
      const fileName = getFileNames(cmdFileInput, CMD, CMD.appendFile);
      const newContent = await getNewContent(cmdFileInput);
      const fileInfo = await getFileInfo(OPT.outputDir, fileName);
      await appendFile(fileInfo, newContent);
    }
  });

  // watcher...
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
