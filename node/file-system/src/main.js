const chokidar = require("chokidar");
const fsPromises = require("node:fs/promises");
const crud = require("./crud.js");

async function main(OPT, CMD) {
  cmdFile = await fsPromises.open(OPT.cmdFile, "r");

  cmdFile.on("change", (command) => {
    command = command.toLowerCase();
    if (command.includes(CMD.createFile)) {
      const fileName = command.substring(CMD.createFile.length + 1).trimEnd();
      crud.createFile(OPT.outputDir, fileName);
    }
    // TODO: delete file <path>

    // TODO: rename file <path> <path>

    // TODO: read file <path>

    // TODO: overwrite file "content" <path>

    // TODO: append file "content" <path>
  });

  try {
    chokidar.watch(OPT.cmdFile).on("change", async (filePath) => {
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

      const command = buffer.toString("utf8");

      cmdFile.emit("change", command);
    });

    await new Promise(() => {});
  } catch (e) {
    console.error(e);
  } finally {
    await cmdFile.close();
  }
}

module.exports = main;
