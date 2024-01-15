const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const uploadedChunks = new Set();
const uploadDirectory = path.join(__dirname, "/upload");
const publicDirectory = path.join(__dirname, "/public");
const PORT = 8080;

const server = http.createServer((req, res) => {
  if (req.url === "/upload") {
    // TODO: Add file type validation

    res.writeHead(200, {
      "Content-Type": "text/plain",
    });

    // Custom headers
    // TODO: Change custom headers to query string or in body
    const fileName = req.headers["file-name"];
    const fileId = req.headers["file-id"];
    const chunkId = req.headers["chunk-id"];

    if (!uploadedChunks.has(`${fileId}_${chunkId}`)) {
      // TODO: Write file to blob storage
      req.on("data", (chunk) => {
        fs.appendFileSync(
          path.join(uploadDirectory, `${fileId}_${fileName}`),
          chunk,
        );
        console.log(`Chunk ${chunkId} received. Length: ${chunk.length}`);

        uploadedChunks.add(`${fileId}_${chunkId}`);
      });
    } else {
      console.log(`Chunk ${chunkId} already processed. Skipping.`);
      // TODO: Handle error gracefully
    }

    res.end("File uploaded.");
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

process.on("SIGINT", () => {
  console.log("Server shutting down gracefully...");
  process.exit();
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
