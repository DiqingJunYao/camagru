function dislikeCardFunction(fileName) {
	fetch("/dislike_card", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fileName }),
  }).then((response) => {
    response
      .json()
      .then((data) => {
        if (data.success) {
          alert("Dislike successful");
          const likeButton = document.querySelector(".liked");
          likeButton.classList.remove("liked");
		  likeButton.classList.add("card_like");
          likeButton.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" class="like-icon">
  			<path d="M12 21s-6.7-4.35-10-9C-1 7 2 3 6 3c2.5 0 4 1.5 6 4 2-2.5 3.5-4 6-4 4 0 7 4 4 9-3.3 4.65-10 9-10 9z"
        	fill="none" stroke="black"/>
			</svg>`;
        } else {
          alert("dislike failed");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });
}

export function dislikeCard(fileName) {
	fetch("/verify_login")
    .then((response) => response.json())
    .then((data) => {
      if (!data.loggedIn) {
        alert("Please refresh the page");
        return;
      } else {
        dislikeCardFunction(fileName);
      }
    })
    .catch((error) => {
      console.error("this is the error:", error);
    });
}