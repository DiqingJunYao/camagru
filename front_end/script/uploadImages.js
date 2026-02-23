function createUploadForm() {
  const newDiv = document.createElement("div");
  newDiv.id = "background_div";
  newDiv.classList.add("background-overlay");
  document.body.prepend(newDiv);

  const form = document.createElement("form");
  form.id = "uploadForm";
  form.style.position = "absolute";
  form.style.top = "50%";
  form.style.left = "50%";
  form.style.width = "300px";
  form.style.display = "flex";
  form.style.flexDirection = "column";
  form.style.alignItems = "center";
  form.style.transform = "translate(-50%, -50%)";
  form.style.backgroundColor = "#fff";
  form.style.padding = "20px";
  form.style.borderRadius = "5px";

  const imageInput = document.createElement("input");
  imageInput.type = "file";
  imageInput.id = "imageInput";
  imageInput.name = "imageInput";
  imageInput.accept = "image/*";

  const uploadButton = document.createElement("button");
  uploadButton.type = "submit";
  uploadButton.textContent = "Upload";

  const closeButton = document.createElement("button");
  closeButton.type = "button";
  closeButton.textContent = "X";
  closeButton.style.position = "absolute";
  closeButton.style.top = "10px";
  closeButton.style.right = "10px";
  closeButton.addEventListener("click", function () {
    document.body.removeChild(newDiv);
  });

  form.appendChild(imageInput);
  form.appendChild(uploadButton);
  form.appendChild(closeButton);

  newDiv.appendChild(form);

  newDiv.addEventListener("click", function (event) {
    if (event.target === newDiv) {
      document.body.removeChild(newDiv);
    }
  });
}

export function uploadImages() {
  document.getElementById("upload_images").addEventListener("click", () => {
    fetch("/verify_login")
      .then((response) => response.json())
      .then((data) => {
        if (!data.loggedIn) {
          alert("Please login to upload the images");
          return;
        } else {
          createUploadForm();
        }
      });
  });
}
