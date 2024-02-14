const file = document.getElementById("file");
const upload = document.getElementById("upload");
const uploadStatus = document.getElementById("status");

upload.addEventListener("click", () => {
  uploadStatus.innerHTML = "uploading...";

  const selectedFile = file.files[0];
  const fileReader = new FileReader();

  console.log("selected file:", selectedFile);

  fileReader.readAsArrayBuffer(selectedFile);

  console.log("file reader:", fileReader);

  fileReader.onload = async (event) => {
    const content = event.target.result;
    const CHUNK_SIZE = 5000;
    const totalChunks = Math.ceil(content.byteLength / CHUNK_SIZE);

    const fileName = Math.random().toString(36).slice(-6) + file.files[0].name;

    console.log("uploading...");

    for (let chunk = 0; chunk < totalChunks; chunk++) {
      console.log(`Uploading chunk ${chunk + 1}...`);
      const CHUNK = content.slice(chunk * CHUNK_SIZE, (chunk + 1) * CHUNK_SIZE);
      console.log(`${fileName}: ${CHUNK}`);
      const endpoint = `/upload?fileName=${fileName}`;
      console.log(endpoint);

      await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/octet-stream",
          "Content-Length": CHUNK.length,
        },
        body: CHUNK,
      });

      console.log(`Chunk ${chunk + 1} uploaded...`);
    }

    uploadStatus.innerHTML = "uploaded!!!";
  };
});
