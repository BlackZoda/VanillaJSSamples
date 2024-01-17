const fs = require("node:fs");

const content = fs.readFileSync("./data/text.txt");

console.log(content);
