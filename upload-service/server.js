const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const server = http.createServer((req, res) => {
  if (req.url === "/upload") {
    // TODO: Add validation
    // TODO: Add idempotency

    res.writeHead(200, {
      "Content-Type": "text/plain",
    });

    // Custom headers
    // TODO: Change custom headers to query string or in body
    const fileName = req.headers["file-name"];
    const fileId = req.headers["file-id"];

    // TODO: Write file to blob storage
    req.on("data", (chunk) => {
      fs.appendFileSync(`${fileId}_${fileName}`, chunk);
      console.log(`Chunk length received: ${chunk.length}`);
    });

    res.end("Working!");
  }

  if (req.url !== "/upload") {
    const filePath = path.join(
      __dirname,
      "public",
      req.url === "/" ? "index.html" : req.url,
    );

    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404, { "Content-Type": "text/plain" });
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
});

const PORT = 8080;

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
