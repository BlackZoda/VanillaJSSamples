const file = document.getElementById("file");
const upload = document.getElementById("upload");
const uploadStatus = document.getElementById("status");

upload.addEventListener("click", () => {
  uploadStatus.innerHTML = "uploading...";
  let fileUploaded = 0;

  for (let fileIndex = 0; fileIndex < file.files.length; fileIndex++) {
    const selectedFile = file.files[fileIndex];
    const fileReader = new FileReader();

    fileReader.readAsArrayBuffer(selectedFile);

    fileReader.onload = async (event) => {
      const content = event.target.result;
      const CHUNK_SIZE = 8000;
      const totalChunks = Math.ceil(content.byteLength / CHUNK_SIZE);

      const fileName =
        Math.random().toString(36).slice(-6) + file.files[0].name;

      console.log("uploading...");

      for (let chunk = 0; chunk < totalChunks; chunk++) {
        const CHUNK = content.slice(
          chunk * CHUNK_SIZE,
          (chunk + 1) * CHUNK_SIZE,
        );
        const endpoint = `/upload?fileName=${fileName}`;

        await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/octet-stream",
            "Content-Length": CHUNK.length,
          },
          body: CHUNK,
        });
      }
      fileUploaded += 1;

      uploadStatus.innerHTML = `file ${fileUploaded} of ${file.files.length} uploaded!`;
    };
  }
});
