const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const { BlobServiceClient } = require("@azure/storage-blob");
const { BlockBlobClient } = require("@azure/storage-blob");
require("dotenv").config();

const connectionString = process.env.CONNECTION_STRING;
const containerName = process.env.CONTAINER_NAME;

const blobServerClient =
  BlobServiceClient.fromConnectionString(connectionString);
const containerClient = blobServerClient.getContainerClient(containerName);

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
    const chunkId = req.headers["chunk-id"];

    const blobClient = containerClient.getBlockBlobClient(fileId + ".jpg");

    // TODO: Write file to blob storage

    const chunks = [];

    req.on("data", (chunk) => {
      // fs.appendFileSync(`${fileId}_${fileName}`, chunk);
      chunks.push(chunk);
    });

    req.on("end", async () => {
      const buffer = Buffer.concat(chunks);
      const blobClient = containerClient.getBlockBlobClient(fileId + ".jpg");

      console.log(buffer.length);
      // await blobClient.uploadStream(buffer, )
      /* const uploadBlobResponse = await blobClient.upload(buffer, buffer.length);
      console.log(uploadBlobResponse.requestId);
      console.log(uploadBlobResponse._response.status); */

      res.end("Working!");
    });
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
