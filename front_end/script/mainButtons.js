export function createButtons(galleryCardWrapper, item) {
  const cardButtons = document.createElement("div");
  cardButtons.className = "card_buttons";
  const cardLike = document.createElement("button");
  cardLike.className = "card_like";
  cardLike.textContent = `heart ${item.likes || 0}`;
  const commentButton = document.createElement("button");
  commentButton.id = "comment_button";
  commentButton.className = "card_comment_button";
  commentButton.textContent = "comments";
  cardButtons.appendChild(cardLike);
  cardButtons.appendChild(commentButton);
  galleryCardWrapper.appendChild(cardButtons);
}

export function createComments(galleryCardWrapper, item) {
  const cardComments = document.createElement("div");
  cardComments.className = "card_comments";
  console.log("item.comments:", item.comments);
  for (const comment of item.comments) {
    const commentDiv = document.createElement("div");
    commentDiv.className = "comment";
    const nameDiv = document.createElement("div");
    nameDiv.className = "name";
    nameDiv.textContent = comment.name;
    const contextDiv = document.createElement("div");
    contextDiv.className = "comment_context";
    contextDiv.textContent = comment.context;
    commentDiv.appendChild(nameDiv);
    commentDiv.appendChild(contextDiv);
    cardComments.appendChild(commentDiv);
  }
  galleryCardWrapper.appendChild(cardComments);
}
