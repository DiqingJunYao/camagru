export function initDrag(sticker, shrinkRatio) {
  let isDragging = false;
  let offsetX = 0;
  let offsetY = 0;

  sticker.addEventListener("click", (e) => {
	console.log("sticker.style.width", sticker.style.width);
	if (sticker.style.width === "") {
		sticker.style.width = sticker.naturalWidth / shrinkRatio + "px";
		sticker.style.height = "auto";
		return;
	}
    isDragging = !isDragging;
	console.log("what is e.clientX and e.clientY?", e.clientX, e.clientY);
	console.log("what is sticker.offsetLeft and sticker.offsetTop?", sticker.offsetLeft, sticker.offsetTop);
	offsetX = e.clientX - sticker.offsetLeft;
	offsetY = e.clientY - sticker.offsetTop;
	console.log("click", offsetX, offsetY);
    if (isDragging) {
      sticker.style.cursor = "grabbing";
    } else {
      sticker.style.cursor = "grab";
    }
  });

  document.addEventListener("mousemove", (e) => {
    if (!isDragging) return;

    let x = e.clientX - offsetX;
    let y = e.clientY - offsetY;

    // limit inside container
    // const maxX = container.clientWidth - sticker.clientWidth;
    // const maxY = container.clientHeight - sticker.clientHeight;
	// console.log("mousemove", x, y, maxX, maxY);

    // x = Math.max(0, Math.min(x, maxX));
    // y = Math.max(0, Math.min(y, maxY));

    sticker.style.left = x + "px";
    sticker.style.top = y + "px";
  });
}
