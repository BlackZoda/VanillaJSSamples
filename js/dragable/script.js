const img = new Image();
img.src = "icon.png";

function dragstartHandler(e) {
  e.dataTransfer.setDragImage(img, 25, 25);
  e.dataTransfer.setData("text/plain", e.target.innerText);
  e.dataTransfer.setData("text/html", e.target.outerHTML);
  e.dataTransfer.setData("text/uri-list", e.target.ownerDocument.location.href);
  console.log(e.dataTransfer.items);
}

window.addEventListener("DOMContentLoaded", () => {
  const element1 = document.getElementById("p1");
  element1.addEventListener("dragstart", dragstartHandler);
});

const dropElement = document.getElementById("drop-target");

dropElement.addEventListener("dragenter", (e) => {
  e.preventDefault();
  console.log("Entered drag zone.");
});

dropElement.addEventListener("dragover", (e) => {
  e.preventDefault();
  console.log("Dragging over tha zone...");
});

function onDrop(e) {
  const data = e.dataTransfer.getData("text/plain");
  e.target.textContent = data;
  e.preventDefault();
}

dropElement.addEventListener("drop", onDrop);
