export function initDrag(sticker, shrinkRatio, bgImgPreview) {
  let isDragging = false;
  let offsetX = 0;
  let offsetY = 0;

  sticker.addEventListener("click", (e) => {
    if (sticker.style.width === "") {
      sticker.style.width = sticker.naturalWidth / shrinkRatio + "px";
      sticker.style.height = "auto";
	  const width = parseFloat(sticker.style.width);
      if (width > bgImgPreview.clientWidth) {
        alert(
          "The sticker is too large for the background image. Please choose a smaller sticker.",
        );
        sticker.style.width = "";
        sticker.style.height = "";
        const uploadButton = document.getElementById("upload_button_combine");
        if (uploadButton) {
          uploadButton.disabled = true;
        }
        return;
      } else {
        const uploadButton = document.getElementById("upload_button_combine");
        if (uploadButton) {
          uploadButton.disabled = false;
        }
      }
      return;
    }
    isDragging = !isDragging;
    offsetX = e.clientX - sticker.offsetLeft;
    offsetY = e.clientY - sticker.offsetTop;
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
    sticker.style.left = x + "px";
    sticker.style.top = y + "px";
  });
}
