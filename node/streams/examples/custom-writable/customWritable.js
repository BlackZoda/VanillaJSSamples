const { Writable } = require("node:stream");
const fs = require("node:fs");

class FileWriteStream extends Writable {
  constructor({ highWaterMark, fileName }) {
    super({ highWaterMark });

    this.fileName = fileName;
    this.fd = null;
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
    console.log(this.fd);
    callback(); // drain event - don't emit events from child classes
  }

  // _final() {}

  // _destroy() {}
}

const stream = new FileWriteStream({
  highWaterMark: 1800,
  fileName: "test.txt",
});

stream.write(Buffer.from("example string"));
// stream.end(Buffer.from("last write"));
