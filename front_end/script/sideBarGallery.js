export function sideBarGallery() {
  fetch("/test.json", {
    method: "GET",
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Data received:", data);
      const galleryContainer = document.querySelector(".main-side");
      Object.values(data).forEach((item) => {
        const galleryCardWrapper = document.createElement("div");
        galleryCardWrapper.className = "gallery-card-wrapper";
        const img = document.createElement("img");
        img.src = item.src;
        img.alt = "this is the png";
        galleryCardWrapper.appendChild(img);
        const cardButtons = document.createElement("div");
        cardButtons.className = "card-buttons";
        const cardLike = document.createElement("div");
        cardLike.className = "card-like";
        cardLike.textContent = `heart ${item.likes || 0}`;
        const commentButton = document.createElement("div");
        commentButton.id = "comment-button";
        commentButton.className = "card-comment-button";
        commentButton.textContent = "comments";
        cardButtons.appendChild(cardLike);
        cardButtons.appendChild(commentButton);
        galleryCardWrapper.appendChild(cardButtons);
        const cardComments = document.createElement("div");
        cardComments.className = "card-comments";
        item.comments.forEach((comment) => {
          const commentDiv = document.createElement("div");
          commentDiv.className = "comment";
          const nameDiv = document.createElement("div");
          nameDiv.className = "name";
          nameDiv.textContent = comment.name;
          const contextDiv = document.createElement("div");
          contextDiv.className = "comment-context";
          contextDiv.textContent = comment.context;
          commentDiv.appendChild(nameDiv);
          commentDiv.appendChild(contextDiv);
          cardComments.appendChild(commentDiv);
        });
        galleryCardWrapper.appendChild(cardComments);
        galleryContainer.appendChild(galleryCardWrapper);
      });
    })
    .catch((error) => {
      console.error("Error fetching test data:", error);
    });

  const galleryContainer = document.querySelector(".main-side");
  galleryContainer.addEventListener("click", function (event) {
    if (event.target.classList.contains("card-comment-button")) {
      const cardComments = event.target.parentElement.nextElementSibling;
      const style = getComputedStyle(cardComments).display;
      if (style === "none") {
        cardComments.style.display = "flex";
      } else {
        cardComments.style.display = "none";
      }
    }
  });
}
