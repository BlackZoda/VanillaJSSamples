const btnUpload = document.getElementById("file-button");
const divOutput = document.getElementById("div-output");
const fileUploads = document.getElementById("file");

btnUpload.addEventListener("click", (e) => {
  e.preventDefault();

  const endpoint = "http://localhost:8080/upload";
  const file = fileUploads.files[0];
  const fileName = file.name;
  const fileId = uuidv4();
  const fileReader = new FileReader();

  fileReader.onload = async (loadEvent) => {
    const byteLength = loadEvent.target.result.byteLength;
    const chunkSize = 5000;
    const chunkCount = Math.ceil(byteLength / chunkSize);

    console.log(`Byte Length: ${byteLength}`);
    console.log(`Chunk Size: ${chunkSize}`);
    console.log(`Chunk Count: ${chunkCount}`);
    console.log(`File name: ${fileName}`);
    console.log(`File ID: ${fileId}`);

    for (let chunkId = 0; chunkId < chunkCount; chunkId++) {
      const low = chunkId * chunkSize;
      const high = low + chunkSize;
      const chunk = loadEvent.target.result.slice(low, high);

      await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/octet-stream",
          "Content-Length": chunkSize,
          // Custom headers
          "File-Name": fileName,
          "File-Id": fileId,
        },
        body: chunk,
      });
    }
  };

  fileReader.readAsArrayBuffer(file);
});

function uuidv4() {
  return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (c) =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16),
  );
}
