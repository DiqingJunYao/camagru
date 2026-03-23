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
          alert("like successful"); //here we can change the outlook.
		  
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
        alert("Please login to leave the comments");
        return;
      } else {
        likeCardFunction(fileName);
      }
    })
    .catch((error) => {
      console.log("this is the error:", error);
    });
}
