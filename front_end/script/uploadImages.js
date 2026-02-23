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
	
  });
}
