const btnUpload = document.getElementById("file-button");
const divOutput = document.getElementById("div-output");
const file = document.getElementById("file");

btnUpload.addEventListener("click", (e) => {
  e.preventDefault();

  divOutput.innerText = "Hi";
});
