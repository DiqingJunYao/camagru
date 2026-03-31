async function getStream(video) {
  const stream = await navigator.mediaDevices.getUserMedia({
    video: true,
  });
  video.srcObject = stream;
}

async function uploadImage(blob) {
  const formData = new FormData();

  const filename =
    Date.now() + "-" + Math.random().toString(36).slice(2) + ".jpg";

  formData.append("image", blob, filename);
  fetch("/upload", {
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
	});
}

async function captureImg(button, canvas, video) {
  button.addEventListener("click", () => {
    const ctx = canvas.getContext("2d");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    ctx.drawImage(video, 0, 0);

    // Convert to blob
    canvas.toBlob(async (blob) => {
      await uploadImage(blob);
    }, "image/jpeg");
  });
}
function takePictureFunction() {
  const mainContainerGallery = document.querySelector(
    ".main_container_gallery",
  );
  mainContainerGallery.innerHTML = "";
  const video = document.createElement("video");
  video.id = "video";
  video.autoplay = true;
  
  const captureButton = document.createElement("button");
  captureButton.id = "capture";
  captureButton.textContent = "Take a photo";
  
  const canvas = document.createElement("canvas");
  canvas.id = "canvas";
  canvas.style.display = "none";
  
  mainContainerGallery.appendChild(video);
  mainContainerGallery.appendChild(captureButton);
  mainContainerGallery.appendChild(canvas);
  
  getStream(video);
  captureImg(captureButton, canvas, video);
}

export function takePicture() {
  document.getElementById("take_picture").addEventListener("click", () => {
    fetch("/verify_login")
    .then((response) => response.json())
    .then((data) => {
      if (!data.loggedIn) {
        alert("Please login to take a picture");
        return;
      } else {
        takePictureFunction();
      }
    })
    .catch((error) => {
      console.error("this is the error:", error);
    });
  });
}
