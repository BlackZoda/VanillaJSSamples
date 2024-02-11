const fsPromises = require("node:fs/promises");
const fs = require("node:fs");

// Execution Time: 40 sec
// RAM: 50 MB
// CPU: 100% (one core)
async function promiseMill() {

  console.time("many");
  for (let i = 1; i <= 10 ** 6; i++) {
    await fileHandle.write(`${i} `);
  }
  console.timeEnd("many");
  fileHandle.close();
}

// Execution Time: 6 sec
// RAM: 25 MB
// CPU: 100%
function callbackMill() {
  const fileHandle = fs.open("million.txt", "w", (err, fd) => {
    console.time("many");
    for (let i = 1; i <= 10 ** 6; i++) {
      fs.writeSync(fd, `${i} `);
    }
    console.timeEnd("many");

    fs.close(fd);
  });
}

// Execution Time: 6.5 sec
// RAM: 25 MB
// CPU: 100%
function callbackBufferMill() {
  const fileHandle = fs.open("million.txt", "w", (err, fd) => {
    console.time("many");
    const buff = Buffer.from(`x `, "utf8");
    for (let i = 1; i <= 10 ** 6; i++) {
      fs.writeSync(fd, buff);
    }
    console.timeEnd("many");

    fs.close(fd);
  });
}

// DON'T DO IT THIS WAY - blasts memory
// drain the internal buffer of the write stream
// Execution Time: < 1 sec
// RAM: 200 MB
// CPU: 100%
async function streamMill() {
  const fileHandle = await fsPromises.open("million.txt", "w");
  const stream = fileHandle.createWriteStream();
  console.time("many");
  for (let i = 1; i <= 10 ** 6; i++) {
    const buff = Buffer.from(`${i} `, "utf8");
    stream.write(buff);
  }
  console.timeEnd("many");
  fileHandle.close();
}

// Fixed for memory usage, checking "drain" event
async function streamMill2() {
  console.time("many");
  const fileHandle = await fsPromises.open("million.txt", "w");
  const stream = fileHandle.createWriteStream();

  let i = 0;
  let iterations = 10 ** 6;
  const writeMany = () => {
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

  writeMany();

  // resume loop once the internal stream buffer is empty
  stream.on("drain", () => {
    writeMany();
  });

  stream.on("finish", () => {
    console.timeEnd("many");
    fileHandle.close();
  });
}

streamMill2();
