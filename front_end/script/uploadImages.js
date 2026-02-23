function createUploadForm() {
	const newDiv = document.createElement("div");
    newDiv.id = "background_div";
    document.body.insertBefore(newDiv, document.body.firstChild);
    newDiv.style.position = "fixed";
    newDiv.style.top = "0";
    newDiv.style.left = "0";
    newDiv.style.width = "100%";
    newDiv.style.height = "100%";
    newDiv.style.backgroundColor = "rgba(0, 0, 0, 0.5)";

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

	form.appendChild(imageInput);
	form.appendChild(uploadButton);

	const closeButton = document.createElement("button");
    closeButton.type = "button";
    closeButton.textContent = "X";
    closeButton.style.position = "absolute";
    closeButton.style.top = "10px";
    closeButton.style.right = "10px";
    closeButton.addEventListener("click", function () {
      document.body.removeChild(newDiv);
    });

	newDiv.appendChild(form);

	newDiv.addEventListener("click", function (event) {
      if (event.target === newDiv) {
        document.body.removeChild(newDiv);
      }
    });


}

export function uploadImages() {
  document.getElementById("upload_images").addEventListener("click", () => {
    let loggedIn = false;
    fetch("/verify_login")
      .then((response) => response.json())
      .then((data) => {
        if (!data.loggedIn) {
          loggedIn = false;
          alert("Please login to upload the images");
          return;
        }
      });
    if (!loggedIn) {
      return;
    }

	createUploadForm();
  });
}
