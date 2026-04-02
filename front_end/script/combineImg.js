function createForm() {
  const newDiv = document.createElement("div");
  newDiv.classList.add("background_overlay");
  document.body.prepend(newDiv);

  const form = document.createElement("form");
  form.classList.add("modal_form");

  const buttonDiv = document.createElement("div");
  buttonDiv.className = "button_div";

  const takePictureButton = document.createElement("button");
  takePictureButton.type = "button";
  takePictureButton.id = "take_picture_button";
  takePictureButton.className = "take_picture_button";
  takePictureButton.textContent = "take a picture to combine";

  const choosePictureButton = document.createElement("button");
  choosePictureButton.type = "button";
  choosePictureButton.id = "choose_picture_button";
  choosePictureButton.className = "choose_picture_button";
  choosePictureButton.textContent = "choose a picture to combine";

  buttonDiv.appendChild(takePictureButton);
  buttonDiv.appendChild(choosePictureButton);

  const closeButton = document.createElement("button");
  closeButton.type = "button";
  closeButton.textContent = "X";
  closeButton.style.position = "absolute";
  closeButton.style.top = "0px";
  closeButton.style.right = "0px";
  closeButton.addEventListener("click", function () {
    document.body.removeChild(newDiv);
  });

  form.appendChild(closeButton);
  form.appendChild(buttonDiv);

  newDiv.appendChild(form);

  newDiv.addEventListener("click", function (event) {
    if (event.target === newDiv) {
      document.body.removeChild(newDiv);
    }
  });
}

async function getStream(video) {
  const stream = await navigator.mediaDevices.getUserMedia({
    video: true,
  });
  video.srcObject = stream;
}

async function upload(blob, bgImgName, topValue, leftValue) {
  const formData = new FormData();

  const filename =
    Date.now() + "-" + Math.random().toString(36).slice(2) + ".jpg";

  formData.append("image", blob, filename);
  formData.append("bgImgName", bgImgName);
  formData.append("topValue", topValue);
  formData.append("leftValue", leftValue);
  fetch("/combine", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        location.reload();
        alert("Image taken successfully");
        console.log("Image uploaded successfully");
      }
    })
    .catch((error) => {
      console.error("Error uploading image:", error);
      alert("An error occurred while uploading the image.");
    });
}

async function captureImg(
  button,
  canvas,
  video,
  bgImgName,
  previewImage,
  bgImgPreview,
  uploadButton,
) {
  button.addEventListener("click", (event) => {
    event.preventDefault();

    const ctx = canvas.getContext("2d");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.style.display = "block";
    canvas.style.maxWidth = "100%";
    canvas.style.height = "auto";

    ctx.drawImage(video, 0, 0);

    previewImage.src = canvas.toDataURL("image/jpeg");

    const shrinkRatio = bgImgPreview.naturalWidth / bgImgPreview.clientWidth;

    initDrag(previewImage, shrinkRatio, bgImgPreview);
    
    uploadButton.addEventListener("click", (e) => {
      e.preventDefault();
      const topValue = previewImage.style.top
      ? parseInt(previewImage.style.top, 10) * shrinkRatio
      : 0;
      const leftValue = previewImage.style.left
      ? parseInt(previewImage.style.left, 10) * shrinkRatio
      : 0;
      canvas.toBlob(async (blob) => {
        await upload(blob, bgImgName, topValue, leftValue);
      }, "image/jpeg");
    });
  });
}

function combineTakingPicture(bgImgName) {
  const takePictureButton = document.getElementById("take_picture_button");
  const form = document.querySelector(".modal_form");
  const buttonDiv = document.querySelector(".button_div");
  takePictureButton.addEventListener("click", (event) => {
    event.preventDefault();
    form.removeChild(buttonDiv);

    const uploadButton = document.createElement("button");
    uploadButton.id = "upload_button_combine";
    uploadButton.type = "submit";
    uploadButton.textContent = "Upload";
    uploadButton.style.zIndex = "999";
    uploadButton.disabled = true;
    
    const previewWrapper = document.createElement("div");
    previewWrapper.style.position = "relative";
    previewWrapper.style.maxWidth = "100%";
    previewWrapper.style.height = "auto";
    previewWrapper.style.display = "inline-block";

    const bgImgPreview = document.createElement("img");
    bgImgPreview.src = `/uploads/${bgImgName}`;
    bgImgPreview.style.maxWidth = "100%";
    bgImgPreview.style.height = "auto";

    const previewImage = document.createElement("img");
    previewImage.id = "previewImage";
    previewImage.style.position = "absolute";
    previewImage.style.top = "50px";
    previewImage.style.left = "50px";
    previewImage.style.cursor = "grab";
    previewImage.style.opacity = "0.7";

    const video = document.createElement("video");
    video.id = "video";
    video.autoplay = true;
    video.playsInline = true;
    video.style.maxWidth = "100%";
    video.style.height = "auto";

    const captureButton = document.createElement("button");
    captureButton.type = "button";
    captureButton.id = "capture";
    captureButton.textContent = "Take a photo";

    const canvas = document.createElement("canvas");
    canvas.id = "canvas";
    canvas.style.display = "none";
    canvas.style.maxWidth = "100%";
    canvas.style.height = "auto";
    

    previewWrapper.appendChild(bgImgPreview);
    previewWrapper.appendChild(previewImage);
    form.appendChild(previewWrapper);
    form.appendChild(video);
    form.appendChild(captureButton);
    form.appendChild(canvas);
    form.appendChild(uploadButton);

    getStream(video);
    captureImg(
      captureButton,
      canvas,
      video,
      bgImgName,
      previewImage,
      bgImgPreview,
      uploadButton,
    );
  });
}

import { initDrag } from "./initDrag.js";

function combineChoosePicture(bgImgName) {
  const choosePictureButton = document.getElementById("choose_picture_button");
  const form = document.querySelector(".modal_form");
  const buttonDiv = document.querySelector(".button_div");

  choosePictureButton.addEventListener("click", (event) => {
    event.preventDefault();
    form.removeChild(buttonDiv);
    const imageInput = document.createElement("input");
    imageInput.type = "file";
    imageInput.id = "imageInput";
    imageInput.name = "imageInput";
    imageInput.accept = "image/*";
    imageInput.style.zIndex = "999";

    const previewWrapper = document.createElement("div");
    previewWrapper.id = "previewWrapper";
    previewWrapper.style.position = "relative";
    previewWrapper.style.maxWidth = "100%";
    previewWrapper.style.height = "auto";
    previewWrapper.style.display = "inline-block";

    const bgImgPreview = document.createElement("img");
    bgImgPreview.src = `/uploads/${bgImgName}`;
    bgImgPreview.style.maxWidth = "100%";
    bgImgPreview.style.height = "auto";

    const previewImage = document.createElement("img");
    previewImage.id = "previewImage";
    previewImage.style.position = "absolute";
    previewImage.style.top = "50px";
    previewImage.style.left = "50px";
    previewImage.style.cursor = "grab";
    previewImage.style.opacity = "0.7";

    const uploadButton = document.createElement("button");
    uploadButton.id = "upload_button_combine";
    uploadButton.type = "submit";
    uploadButton.textContent = "Upload";
    uploadButton.style.zIndex = "999";
    uploadButton.disabled = true;

    previewWrapper.appendChild(previewImage);
    previewWrapper.appendChild(bgImgPreview);
    form.appendChild(previewWrapper);
    form.appendChild(imageInput);
    form.appendChild(uploadButton);

    const shrinkRatio = bgImgPreview.naturalWidth / bgImgPreview.clientWidth;

    imageInput.addEventListener("change", function () {
      const file = this.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
          previewImage.src = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    });
    
    initDrag(previewImage, shrinkRatio, bgImgPreview);
    
    form.addEventListener("submit", async function (event) {
      event.preventDefault(); // stop page reload

      const formData = new FormData(form);
      const topValue = previewImage.style.top
        ? parseInt(previewImage.style.top, 10) * shrinkRatio
        : 0;
      const leftValue = previewImage.style.left
        ? parseInt(previewImage.style.left, 10) * shrinkRatio
        : 0;
      formData.append("bgImgName", bgImgName);
      formData.append("topValue", topValue);
      formData.append("leftValue", leftValue);

      try {
        fetch("/combine", {
          method: "POST",
          body: formData,
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.success) {
              location.reload();
              alert("Image uploaded successfully");
              console.log("Image uploaded successfully");
            } else {
              alert("Failed to upload image");
              console.error("Upload failed:", data.error);
            }
          })
          .catch((error) => {
            alert("An error occurred while uploading the image");
            console.error("Upload failed:", error);
          });
      } catch (err) {
        console.error("Upload failed:", err);
      }
    });
  });
}

function combineImgFunction(bgImgName) {
  createForm();
  combineTakingPicture(bgImgName);
  combineChoosePicture(bgImgName);
}

export function combineImg(bgImgName) {
  fetch("/verify_login")
    .then((response) => response.json())
    .then((data) => {
      if (!data.loggedIn) {
        alert("Please login to create your own img");
        return;
      } else {
        combineImgFunction(bgImgName);
      }
    })
    .catch((error) => {
      console.error("this is the error:", error);
    });
}
