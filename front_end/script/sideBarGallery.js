function createImg(galleryCardWrapper, item) {
  const img = document.createElement("img");
  img.src = item.src;
  const fileName = item.src.split("/").pop();
  img.setAttribute("data-filename", fileName);
  img.alt = "this is the picture";
  galleryCardWrapper.appendChild(img);
}

function hideTheButtons() {
  document.querySelector("#page_numbers").style.display = "none";
  document.getElementById("previous_page").style.display = "none";
  document.getElementById("next_page").style.display = "none";
  document.getElementById("page_1").style.display = "none";
  document.getElementById("last_page").style.display = "none";
}

import { createButtons, createComments } from "./mainButtons.js";

let lastImgCreateTime = null;
let lastImgId = null;
let firstImgCreateTime = null;
let firstImgId = null;
function fetchDataNoLike(status) {
  const params = new URLSearchParams({
    lastImgCreateTime,
    lastImgId,
    cardPerPage,
    firstImgCreateTime,
    firstImgId,
    status,
  });
  fetch(`/start?${params}` , {
    method: "GET",
  })
    .then((response) => response.json())
    .then((data) => {
      const galleryContainer = document.querySelector(".main_side_gallery");
      const resultArray = Object.values(data);
      if (resultArray.length === 0) {
        hideTheButtons();
      }
      for (const item of resultArray) {
        const galleryCardWrapper = document.createElement("div");
        galleryCardWrapper.className = "gallery_card_wrapper";
        createImg(galleryCardWrapper, item);
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
            createButtons(mainButtonsAndComments, item);
            createComments(mainButtonsAndComments, item);
          });
        galleryContainer.appendChild(galleryCardWrapper);
      }
      if (resultArray.length > 0) {
        const lastItem = resultArray[resultArray.length - 1];
        lastImgCreateTime = lastItem.createTime;
        lastImgId = lastItem.id;
        const firstItem = resultArray[0];
        firstImgCreateTime = firstItem.createTime;
        firstImgId = firstItem.id;
        maxPage = lastItem.maxPage;
      }
    })
    .catch((error) => {
      console.error("Error fetching test data:", error);
    });
}

function fetchDataWithLike(status) {
  const params = new URLSearchParams({
    lastImgCreateTime,
    lastImgId,
    cardPerPage,
    firstImgCreateTime,
    firstImgId,
    status,
  });
  fetch(`/start_with_like?${params}` , {
    method: "GET",
  })
    .then((response) => response.json())
    .then((data) => {
      const galleryContainer = document.querySelector(".main_side_gallery");
      const resultArray = Object.values(data);
      if (resultArray.length === 0) {
        hideTheButtons();
      }
      for (const item of resultArray) {
        const galleryCardWrapper = document.createElement("div");
        galleryCardWrapper.className = "gallery_card_wrapper";
        createImg(galleryCardWrapper, item);
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
            createButtons(mainButtonsAndComments, item);
            createComments(mainButtonsAndComments, item);
          });
        galleryContainer.appendChild(galleryCardWrapper);
      }
      if (resultArray.length > 0) {
        const lastItem = resultArray[resultArray.length - 1];
        lastImgCreateTime = lastItem.createTime;
        lastImgId = lastItem.id;
        const firstItem = resultArray[0];
        firstImgCreateTime = firstItem.createTime;
        firstImgId = firstItem.id;
        maxPage = lastItem.maxPage;
      }
    })
    .catch((error) => {
      console.error("Error fetching test data:", error);
    });
}

function fetchData(status) {
  fetch("/verify_login")
    .then((response) => response.json())
    .then((data) => {
      if (!data.loggedIn) {
        fetchDataNoLike(status);
      } else {
        fetchDataWithLike(status);
      }
    })
    .catch((error) => {
      console.error("this is the error:", error);
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
}

function routerFunction() {
  const mainContainerGallery = document.querySelector(
    ".main_container_gallery",
  );
  mainContainerGallery.addEventListener("click", function (event) {
    if (event.target.classList.contains("card_comment_button")) {
      const cardComments = event.target.parentElement.nextElementSibling;
      const style = getComputedStyle(cardComments).display;
      if (style === "none") {
        cardComments.style.display = "flex";
      } else {
        cardComments.style.display = "none";
      }
    }
    if (event.target.classList.contains("add_comment_button")) {
      const img = mainContainerGallery.querySelector("img");
      addCommentsButton(img.dataset.filename);
    }
    if (event.target.classList.contains("card_like")) {
      const img = mainContainerGallery.querySelector("img");
      likeCard(img.dataset.filename);
    }
    if (event.target.classList.contains("liked")) {
      const img = mainContainerGallery.querySelector("img");
      dislikeCard(img.dataset.filename);
    }
    if (event.target.classList.contains("create_img_with_button")) {
      const img = mainContainerGallery.querySelector("img");
      combineImg(img.dataset.filename);
    }
  });
}

import { addCommentsButton } from "./addComments.js";
import { likeCard } from "./likeCards.js";
import { dislikeCard } from "./dislikeCards.js";
import { combineImg } from "./combineImg.js";

let page = 1;
let maxPage = 0;
let cardPerPage = 2;
export function sideBarGallery() {
  fetchData("first");
  routerFunction();
  document
    .getElementById("previous_page")
    .addEventListener("click", function () {
      if (page > 1) {
        page--;
        document.querySelector(".main_side_gallery").innerHTML = "";
        fetchData("previous");
      }
    });
  document.getElementById("next_page").addEventListener("click", function () {
    page++;
    document.querySelector(".main_side_gallery").innerHTML = "";
    fetchData("next");
  });
  document.getElementById("page_1").addEventListener("click", function () {
    page = 1;
    document.querySelector(".main_side_gallery").innerHTML = "";
    fetchData("first");
  });
  document.getElementById("last_page").addEventListener("click", function () {
    page = maxPage;
    document.querySelector(".main_side_gallery").innerHTML = "";
    fetchData("last");
  });
}
