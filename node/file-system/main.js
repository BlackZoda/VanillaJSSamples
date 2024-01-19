// alternative to fs.watch
const chokidar = require("chokidar");
const fsPromises = require("node:fs/promises");
const path = require("node:path");

async function main() {
  const CMDS = {
    createFile: "create file",
  };

  commandFile = await fsPromises.open("./commands.txt", "r");

  commandFile.on("change", (filePath) => {
    console.log(`${filePath} changed!`);
  });

  try {
    chokidar.watch("./commands.txt").on("change", async (filePath) => {
      commandFile.emit("change", filePath);

      const buffer = Buffer.alloc((await commandFile.stat()).size);

      const fileProps = {
        buffer: buffer,
        offset: 0, // location at which we want to start filling our buffer
        length: buffer.byteLength, // bytes we want to read
        position: 0, // positon that we start reading the file from
      };

      // reading the whole content
      await commandFile.read(
        fileProps.buffer,
        fileProps.offset,
        fileProps.length,
        fileProps.position,
      );

      const command = buffer.toString("utf8");

      // create file:
      // create file <filePath>
      command.toLowerCase().includes(CMDS.createFile);
      if (command.toLowerCase().includes(CMDS.createFile)) {
        const fileName = command
          .substring(CMDS.createFile.length + 1)
          .trimEnd();
        console.log("fileName length: ", fileName.length);
        console.log("fileName content: ", JSON.stringify(fileName));
        createFile(fileName);
      }
      // TODO: delete file <path>

      // TODO: read file <path>

      // TODO: update file<path>
    });

    await new Promise(() => {});
  } catch (e) {
    console.error(e);
  } finally {
    await commandFile.close();
  }
}

main();

async function createFile(fileName) {
  const filePath = path.join(__dirname, "output", fileName);
  let existingFile;

  try {
    existingFile = await fsPromises.open(filePath, "r");
    console.log(`The file ${fileName} already exist.`);
    existingFile.close();
  } catch (e) {
    const newFile = await fsPromises.open(filePath, "w");
    console.log(`The file ${fileName} was created!`);
    newFile.close();
  }
}
