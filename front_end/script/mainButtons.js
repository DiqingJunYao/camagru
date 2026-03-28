export function createButtons(galleryCardWrapper, item) {
  const cardButtons = document.createElement("div");
  cardButtons.className = "card_buttons";
  const cardLike = document.createElement("button");
  if (item.likedByUser) {
    cardLike.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" class="like-icon">
			  <path d="M12 21s-6.7-4.35-10-9C-1 7 2 3 6 3c2.5 0 4 1.5 6 4 2-2.5 3.5-4 6-4 4 0 7 4 4 9-3.3 4.65-10 9-10 9z"
				fill="red"/>
			</svg>`;
    cardLike.className = "liked";
  } else {
    cardLike.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" class="like-icon">
          <path d="M12 21s-6.7-4.35-10-9C-1 7 2 3 6 3c2.5 0 4 1.5 6 4 2-2.5 3.5-4 6-4 4 0 7 4 4 9-3.3 4.65-10 9-10 9z"
            fill="none" stroke="black"/>
        </svg>`;
    cardLike.className = "card_like";
  }
  const commentButton = document.createElement("button");
  commentButton.id = "comment_button";
  commentButton.className = "card_comment_button";
  commentButton.textContent = "comments";
  const addCommentButton = document.createElement("button");
  addCommentButton.id = "add_comment_button";
  addCommentButton.className = "add_comment_button";
  addCommentButton.textContent = "add comments";
  cardButtons.appendChild(cardLike);
  cardButtons.appendChild(commentButton);
  cardButtons.appendChild(addCommentButton);
  galleryCardWrapper.appendChild(cardButtons);
}

let commentCounter = 0;
let commentPage = 1;
let commentMaxPage = 0;
let commentPerPage = 5;

function loadMoreButton(cardComments, item) {
  if (commentPage >= commentMaxPage) return;
  const loadMoreButton = document.createElement("button");
  loadMoreButton.textContent = "Load More";
  loadMoreButton.id = "load_more_button";
  loadMoreButton.className = "load_more_button";
  cardComments.appendChild(loadMoreButton);
  loadMoreButton.addEventListener("click", () => {
    document.querySelector("#load_more_button").remove();
    commentPage++;
    loadComments(cardComments, item);
  });
}

function loadComments(cardComments, item) {
  for (
    commentCounter = (commentPage - 1) * commentPerPage;
    commentCounter < commentPage * commentPerPage &&
    commentCounter < item.comments.length;
    commentCounter++
  ) {
    const commentDiv = document.createElement("div");
    commentDiv.className = "comment";
    const nameDiv = document.createElement("div");
    nameDiv.className = "name";
    nameDiv.textContent = item.comments[commentCounter].name;
    const contextDiv = document.createElement("div");
    contextDiv.className = "comment_context";
    contextDiv.textContent = item.comments[commentCounter].context;
    commentDiv.appendChild(nameDiv);
    commentDiv.appendChild(contextDiv);
    cardComments.appendChild(commentDiv);
  }
  loadMoreButton(cardComments, item);
}

export function createComments(galleryCardWrapper, item) {
  commentPage = 1;
  const cardComments = document.createElement("div");
  cardComments.className = "card_comments";
  commentMaxPage =
    item.comments.length % commentPerPage === 0
      ? Math.floor(item.comments.length / commentPerPage)
      : Math.floor(item.comments.length / commentPerPage) + 1;
  loadComments(cardComments, item);
  galleryCardWrapper.appendChild(cardComments);
}
