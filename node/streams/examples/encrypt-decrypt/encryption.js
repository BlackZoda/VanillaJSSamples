const { Transform } = require("node:stream");
const fsPromises = require("node:fs/promises");

class Encrypt extends Transform {
  _transform(chunk, encoding, callback) {
    for (let i = 0; i < chunk.length; ++i) {
      if (chunk[i] !== 255) chunk[i] = chunk[i] + 1;
    }
    this.push(chunk);
  }
}

const main = async () => {
  const readFileHandle = await fsPromises.open("read.txt", "r");
  const writeFileHandle = await fsPromises.open("write.txt", "w");

  const readStream = readFileHandle.createReadStream();
  const writeStream = writeFileHandle.createWriteStream();

  const encrypt = new Encrypt();

  readStream.pipe(encrypt).pipe(writeStream);
};

main();

// encryption / decryption => crypto
// compression => zlib
// hashing / salting => crypto
// encoding / decoding => buffer text-encoding/decoding
