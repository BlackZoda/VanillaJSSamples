const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");
const url = require("url");

const server = http.createServer((req, res) => {
  if (req.url !== "/upload" && req.method === "GET") {
    const filePath = path.join(
      __dirname,
      "public",
      req.url === "/" ? "index.html" : req.url,
    );

    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404, { "content-type": "text/plain" });
        return res.end("404 Not Found");
      }
      const ext = path.extname(filePath);
      const contentType =
        {
          ".html": "text/html",
          ".js": "text/javascript",
          ".css": "text/css",
        }[ext] || "text/plain";

      res.writeHead(200, { "Content-Type": contentType });

      res.end(data);
    });
  }

  if (req.url.startsWith("/upload") && req.method === "POST") {
    const parsedUrl = url.parse(req.url, true);
    const fileName = parsedUrl.query.fileName;

    const fileStream = fs.createWriteStream(fileName, { flags: "a" });

    req.on("data", (chunk) => {
      fileStream.write(chunk);
    });

    req.on("end", () => {
      fileStream.end();
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end("Yohoo! File is uploaded!");
    });
  }
});

server.listen(8080, () => {
  console.log("Server running on port 8080");
});
