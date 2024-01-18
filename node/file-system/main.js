// const fsPromises = require("fs/promises");
const chokidar = require("chokidar");
const fsPromises = require("node:fs/promises");

(async () => {
  chokidar.watch("./commands.txt").on("change", async (path) => {
    console.log("The file was changed.");

    const commandFile = await fsPromises.open("./commands.txt", "r");

    const buffer = Buffer.alloc((await commandFile.stat()).size);

    const fileProps = {
      buffer: buffer,
      offset: 0,
      length: buffer.byteLength,
      position: 0,
    };

    const content = await commandFile.read(
      fileProps.buffer,
      fileProps.offset,
      fileProps.length,
      fileProps.position,
    );

    console.log(content);

    await commandFile.close();
  });
})();

// open => file descriptor to memory => a unique number
