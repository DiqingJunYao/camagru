function createImg(galleryCardWrapper, item) {
  const img = document.createElement("img");
  img.src = item.src;
  img.alt = "this is the png";
  galleryCardWrapper.appendChild(img);
}

function createButtons(galleryCardWrapper, item) {
  const cardButtons = document.createElement("div");
  cardButtons.className = "card-buttons";
  const cardLike = document.createElement("button");
  cardLike.className = "card-like";
  cardLike.textContent = `heart ${item.likes || 0}`;
  const commentButton = document.createElement("button");
  commentButton.id = "comment-button";
  commentButton.className = "card-comment-button";
  commentButton.textContent = "comments";
  cardButtons.appendChild(cardLike);
  cardButtons.appendChild(commentButton);
  galleryCardWrapper.appendChild(cardButtons);
}

function createComments(galleryCardWrapper, item) {
  const cardComments = document.createElement("div");
  cardComments.className = "card-comments";
  for (const comment of item.comments) {
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
  }
  galleryCardWrapper.appendChild(cardComments);
}

function fetchData() {
  fetch("/test.json", {
    method: "GET",
  })
    .then((response) => response.json())
    .then((data) => {
      const galleryContainer = document.querySelector(".main-side-gallery");
      const resultArray = Object.values(data);
      if (resultArray.length % cardPerPage === 0) {
        maxPage = resultArray.length / cardPerPage;
      } else {
        maxPage = Math.floor(resultArray.length / cardPerPage) + 1;
      }
      maxPage = Math.ceil(resultArray.length / cardPerPage);
      for (
        counter = (page - 1) * cardPerPage;
        counter < page * cardPerPage && counter < resultArray.length;
        counter++
      ) {
        const galleryCardWrapper = document.createElement("div");
        galleryCardWrapper.className = "gallery-card-wrapper";
        createImg(galleryCardWrapper, resultArray[counter]);
        createButtons(galleryCardWrapper, resultArray[counter]);
        createComments(galleryCardWrapper, resultArray[counter]);
        galleryContainer.appendChild(galleryCardWrapper);
      }
    })
    .catch((error) => {
      console.error("Error fetching test data:", error);
    });
  if (page === 1) {
    document.getElementById("previous-page").style.display = "none";
  } else if (page > 1) {
    document.getElementById("previous-page").style.display = "block";
  }
  if (page === maxPage) {
    document.getElementById("next-page").style.display = "none";
  } else if (page < maxPage) {
    document.getElementById("next-page").style.display = "block";
  }
  console.log("Current page:", page);
}

let page = 1;
let counter = 0;
let maxPage = 0;
let cardPerPage = 2;
export function sideBarGallery() {
  fetchData();
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

  document
    .getElementById("previous-page")
    .addEventListener("click", function () {
      if (page > 1) {
        page--;
        document.querySelector(".main-side-gallery").innerHTML = "";
        fetchData();
      }
    });
  document.getElementById("next-page").addEventListener("click", function () {
    page++;

    document.querySelector(".main-side-gallery").innerHTML = "";
    fetchData();
  });
  document.getElementById("page-1").addEventListener("click", function () {
    page = 1;
    document.querySelector(".main-side-gallery").innerHTML = "";
    fetchData();
  });
  document.getElementById("last-page").addEventListener("click", function () {
    page = maxPage;
    document.querySelector(".main-side-gallery").innerHTML = "";
    fetchData();
  });
}
