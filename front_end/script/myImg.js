function myImgFunction() {
  fetch("/my_images")
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        const mainContainerGallery = document.querySelector(
          ".main_container_gallery",
        );
        mainContainerGallery.innerHTML = "";

        const myImgWrapper = document.createElement("div");
        myImgWrapper.classList.add("my_img_wrapper");

        mainContainerGallery.appendChild(myImgWrapper);

        data.images.forEach((image) => {
			const imgWrapper = document.createElement("div");
			imgWrapper.classList.add("my_img");
          const imgElement = document.createElement("img");
          imgElement.src = image;
          const imageName = image.split("/").pop();
          imgElement.addEventListener("click", () => {
            window.open(`/uploads/${imageName}`, "_blank");
          });
          const deleteButton = document.createElement("button");
          deleteButton.textContent = "Delete";
          deleteButton.addEventListener("click", () => {
            if (confirm("Are you sure you want to delete this image?")) {
              fetch(`/delete_image/${imageName}`, {
                method: "DELETE",
              })
                .then((response) => response.json())
                .then((data) => {
                  if (data.success) {
                    alert("Image deleted successfully");
                    myImgFunction();
                  } else {
                    alert("Failed to delete image");
                    console.error("Delete failed:", data.error);
                  }
                })
                .catch((error) => {
                  console.error("Error:", error);
                });
            }
          });
		  imgWrapper.appendChild(imgElement);
		  imgWrapper.appendChild(deleteButton);
		  myImgWrapper.appendChild(imgWrapper);
        });
      } else {
        alert("Failed to load your images");
        console.error("Load failed:", data.error);
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

export function myImg() {
  document.getElementById("my_images").addEventListener("click", () => {
    fetch("/verify_login")
      .then((response) => response.json())
      .then((data) => {
        if (!data.loggedIn) {
          alert("Please login to view your own images");
          return;
        } else {
          myImgFunction();
        }
      })
      .catch((error) => {
        console.error("this is the error:", error);
      });
  });
}
