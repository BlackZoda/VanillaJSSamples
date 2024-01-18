// alternative to fs.watch
const chokidar = require("chokidar");
const fsPromises = require("node:fs/promises");

async function main() {
  commandFile = await fsPromises.open("./commands.txt", "r");

  commandFile.on("change", (path) => {
    console.log(`${path} changed!`);
  });

  try {
    chokidar.watch("./commands.txt").on("change", async (path) => {
      commandFile.emit("change", path);

      const buffer = Buffer.alloc((await commandFile.stat()).size);

      const fileProps = {
        buffer: buffer,
        offset: 0, // location at which we want to start filling our buffer
        length: buffer.byteLength, // bytes we want to read
        position: 0, // positon that we start reading the file from
      };

      // reading the whole content
      const content = await commandFile.read(
        fileProps.buffer,
        fileProps.offset,
        fileProps.length,
        fileProps.position,
      );

      console.log(content);
    });

    await new Promise(() => {});
  } catch (e) {
    console.error(e);
  } finally {
    await commandFile.close();
  }
}

main();
