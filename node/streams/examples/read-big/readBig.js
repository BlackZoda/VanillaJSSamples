const fsPromises = require("node:fs/promises");

async function main() {
  console.time("read");
  const fileHandleRead = await fsPromises.open("src.txt", "r");
  const fileHandleWrite = await fsPromises.open("dest.txt", "w");

  const streamRead = fileHandleRead.createReadStream({
    highWaterMark: 64 * 1024,
  });

  const streamWrite = fileHandleWrite.createWriteStream();

  let split = "";

  streamRead.on("data", (chunk) => {
    const numbers = chunk.toString("utf8").split("  ");

    if (Number(numbers[0]) !== Number(numbers[1]) - 1) {
      if (split) numbers[0] = split + numbers[0];
    }

    if (
      Number(numbers[numbers.length - 2]) + 1 !==
      Number(numbers[numbers.length - 1])
    ) {
      split = numbers.pop();
    }

    numbers.forEach((number) => {
      const n = Number(number);

      if (n % 2 === 0) {
        if (!streamWrite.write(` ${n} `)) {
          streamRead.pause();
        }
      }
    });
  });

  streamWrite.on("drain", () => {
    streamRead.resume();
  });

  streamRead.on("end", () => {
    console.log("Reading completed.");
    console.timeEnd("read");
  });
}

main();
