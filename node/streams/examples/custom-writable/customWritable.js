const { Writable } = require("node:stream");
const fs = require("node:fs");

class FileWriteStream extends Writable {
  constructor({ highWaterMark, fileName }) {
    super({ highWaterMark });

    this.fileName = fileName;
    this.fd = null;
    this.chunks = [];
    this.chunkSize = 0;
    this.writesCount = 0;
  }

  // This will run after the constructor,
  // and not call the other methods until
  // we call the callback function
  _construct(callback) {
    fs.open(this.fileName, "w", (err, fd) => {
      if (err) {
        callback(err);
      } else {
        this.fd = fd;
        callback();
      }
    });
  }

  _write(chunk, encoding, callback) {
    this.chunks.push(chunk);
    this.chunkSize += chunk.length;

    if (this.chunkSize > this.writableHighWaterMark) {
      fs.write(this.fd, Buffer.concat(this.chunks), (err) => {
        if (err) {
          return callback(err);
        }
        this.chunks = [];
        this.chunkSize = 0;
        ++this.writesCount;
        callback();
      });
    } else {
      callback();
    }
  }

  _final(callback) {
    fs.write(this.fd, Buffer.concat(this.chunks), (err) => {
      if (err) return callback(err);

      this.chunks = [];
      callback();
    });
  }

  _destroy(error, callback) {
    console.log("Number of writes:", this.writesCount);
    if (this.fd) {
      fs.close(this.fd, (err) => {
        callback(err || error);
      });
    } else {
      callback(error);
    }
  }
}

const stream = new FileWriteStream({
  highWaterMark: 1800,
  fileName: "test.txt",
});

// stream.write(Buffer.from("Example string.\n"));
// stream.end(Buffer.from("Last write.\n"));

stream.on("finish", () => {
  console.log("Stream finished!");
});

async function customStream() {
  console.time("many");
  const stream = new FileWriteStream({ fileName: "test.txt" });

  let i = 0;
  const iterations = 10 ** 6;
  const customStream = () => {
    while (i <= iterations) {
      const buff = Buffer.from(` ${i} `, "utf8");
      if (i >= iterations - 1) {
        return stream.end(buff);
      }
      // stop the loop if stream.write return false
      if (!stream.write(buff)) break;
      i++;
    }
  };

  customStream();

  // resume loop once the internal stream buffer is empty
  stream.on("drain", () => {
    customStream();
  });

  stream.on("finish", () => {
    console.timeEnd("many");
  });
}

customStream();
