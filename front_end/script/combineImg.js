async function getStream(video) {
  const stream = await navigator.mediaDevices.getUserMedia({
    video: true,
  });
  video.srcObject = stream;
}

async function uploadImage(blob, bgImgName, topValue, leftValue) {
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

async function captureImg(button, canvas, video, bgImgName, topValueInput, leftValueInput) {
  button.addEventListener("click", (event) => {
    event.preventDefault();

    const ctx = canvas.getContext("2d");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.style.display = "block";
    canvas.style.maxWidth = "100%";
    canvas.style.height = "auto";

    ctx.drawImage(video, 0, 0);
	const topValue = parseInt(topValueInput.value, 10) || 0;
	const leftValue = parseInt(leftValueInput.value, 10) || 0;
	console.log("Top value:", topValue);
	console.log("Left value:", leftValue);

    // Convert to blob
    canvas.toBlob(async (blob) => {
      await uploadImage(blob, bgImgName, topValue, leftValue);
    }, "image/jpeg");
  });
}

function combineImgFunction(bgImgName) {
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

  takePictureButton.addEventListener("click", (event) => {
    event.preventDefault();
    form.removeChild(buttonDiv);

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

	const topLabel = document.createElement("label");
    topLabel.textContent = "Top:";
    const topValueInput = document.createElement("input");
    topValueInput.type = "number";
    topValueInput.name = "topValue";

	const leftLabel = document.createElement("label");
    leftLabel.textContent = "Left:";
    const leftValueInput = document.createElement("input");
    leftValueInput.type = "number";
    leftValueInput.name = "leftValue";

	form.appendChild(video);
	form.appendChild(captureButton);
	form.appendChild(canvas);
	form.appendChild(topLabel);
	form.appendChild(topValueInput);
	form.appendChild(leftLabel);
	form.appendChild(leftValueInput);

	getStream(video);
    captureImg(captureButton, canvas, video, bgImgName, topValueInput, leftValueInput);
  });
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
