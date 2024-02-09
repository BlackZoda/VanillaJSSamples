const fsPromises = require("node:fs/promises");
const { pipeline } = require("node:stream");
const path = require("node:path");

async function main() {
  const readFileHandle = await fsPromises.open(
    path.join(__dirname, "text.txt"),
    "r",
  );

  const writeFileHandle = await fsPromises.open(
    path.join(__dirname, "copy.txt"),
    "w",
  );

  const readStream = readFileHandle.createReadStream({
    highWaterMark: 64 * 1024,
  });

  const writeStream = writeFileHandle.createWriteStream();

  /* readStream.on("data", (chunk) => {
    if (!writeStream.write(chunk)) {
      readStream.pause();
    }
  });

  writeStream.on("drain", () => {
    readStream.resume();
  }); */

  /* console.log(readStream.readableFlowing);
  readStream.pipe(writeStream);
  console.log(readStream.readableFlowing);
  readStream.unpipe(writeStream);
  console.log(readStream.readableFlowing);
  readStream.pipe(writeStream);
  console.log(readStream.readableFlowing); */

  pipeline(readStream, writeStream, (err) => {
    console.error(err);
  });
}

main();
