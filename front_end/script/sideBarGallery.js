export function sideBarGallery() {
  fetch("/test.json", {
    method: "GET",
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Data received:", data);
    })
    .catch((error) => {
      console.error("Error fetching test data:", error);
    });
}
