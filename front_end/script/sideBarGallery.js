function createImg(galleryCardWrapper, item) {
  const img = document.createElement("img");
  img.src = item.src;
  img.alt = "this is the png";
  galleryCardWrapper.appendChild(img);
}

import { createButtons, createComments } from "./mainButtons.js";

function fetchData() {
  fetch("/test.json", {
    method: "GET",
  })
    .then((response) => response.json())
    .then((data) => {
      const galleryContainer = document.querySelector(".main_side_gallery");
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
        galleryCardWrapper.className = "gallery_card_wrapper";
        const currentItem = resultArray[counter];
        createImg(galleryCardWrapper, currentItem);
        galleryCardWrapper
          .querySelector("img")
          .addEventListener("click", function () {
            const mainContainer = document.querySelector(
              ".main_container_gallery",
            );
            mainContainer.innerHTML = "";
            mainContainer.appendChild(galleryCardWrapper.cloneNode(true));
            const mainButtonsAndComments = mainContainer.querySelector(
              ".gallery_card_wrapper",
            );
            createButtons(mainButtonsAndComments, currentItem);
            createComments(mainButtonsAndComments, currentItem);
          });
        galleryContainer.appendChild(galleryCardWrapper);
      }
    })
    .catch((error) => {
      console.error("Error fetching test data:", error);
    });
  if (page === 1) {
    document.getElementById("previous_page").style.display = "none";
  } else if (page > 1) {
    document.getElementById("previous_page").style.display = "block";
  }
  if (page === maxPage) {
    document.getElementById("next_page").style.display = "none";
  } else if (page < maxPage) {
    document.getElementById("next_page").style.display = "block";
  }
  console.log("Current page:", page);
}

let page = 1;
let counter = 0;
let maxPage = 0;
let cardPerPage = 2;
export function sideBarGallery() {
  fetchData();
  const galleryContainer = document.querySelector(".main_container");
  galleryContainer.addEventListener("click", function (event) {
    if (event.target.classList.contains("card_comment_button")) {
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
    .getElementById("previous_page")
    .addEventListener("click", function () {
      if (page > 1) {
        page--;
        document.querySelector(".main_side_gallery").innerHTML = "";
        fetchData();
      }
    });
  document.getElementById("next_page").addEventListener("click", function () {
    page++;

    document.querySelector(".main_side_gallery").innerHTML = "";
    fetchData();
  });
  document.getElementById("page_1").addEventListener("click", function () {
    page = 1;
    document.querySelector(".main_side_gallery").innerHTML = "";
    fetchData();
  });
  document.getElementById("last_page").addEventListener("click", function () {
    page = maxPage;
    document.querySelector(".main_side_gallery").innerHTML = "";
    fetchData();
  });
}
