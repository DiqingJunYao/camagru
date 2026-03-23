function likeCardFunction(fileName) {
  fetch("/like_card", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fileName }),
  }).then((response) => {
    response
      .json()
      .then((data) => {
        if (data.success) {
          alert("like successful");
		  const likeButton = document.querySelector(".card_like");
		  likeButton.classList.add("liked");
		  likeButton.classList.remove("card_like");
		  likeButton.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" class="like-icon">
			  <path d="M12 21s-6.7-4.35-10-9C-1 7 2 3 6 3c2.5 0 4 1.5 6 4 2-2.5 3.5-4 6-4 4 0 7 4 4 9-3.3 4.65-10 9-10 9z"
				fill="red"/>
			</svg>`;
        } else {
			alert("like failed");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });
}

export function likeCard(fileName) {
  fetch("/verify_login")
    .then((response) => response.json())
    .then((data) => {
      if (!data.loggedIn) {
        alert("Please login to add likes");
        return;
      } else {
        likeCardFunction(fileName);
      }
    })
    .catch((error) => {
      console.log("this is the error:", error);
    });
}
