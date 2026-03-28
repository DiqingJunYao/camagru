function createAddCommentForm(fileName) {
  const newDiv = document.createElement("div");
  newDiv.id = "background_div";
  newDiv.classList.add("background_overlay");
  document.body.prepend(newDiv);

  const form = document.createElement("form");
  form.id = "addCommentForm";
  form.classList.add("modal_form");

  const commentLabel = document.createElement("label");
  commentLabel.textContent = "comment: ";
  const commentInput = document.createElement("input");
  commentInput.type = "text";
  commentInput.name = "context";
  commentInput.placeholder = "leave the comment here.";

  const closeButton = document.createElement("button");
  closeButton.type = "button";
  closeButton.textContent = "X";
  closeButton.style.position = "absolute";
  closeButton.style.top = "10px";
  closeButton.style.right = "10px";
  closeButton.addEventListener("click", function () {
    document.body.removeChild(newDiv);
  });

  const submitButton = document.createElement("button");
  submitButton.id = "submit_button";
  submitButton.type = "submit";
  submitButton.textContent = "Add Comment";

  form.appendChild(commentLabel);
  form.appendChild(commentInput);
  form.appendChild(submitButton);
  form.appendChild(closeButton);

  newDiv.appendChild(form);

  newDiv.addEventListener("click", function (event) {
    if (event.target === newDiv) {
      document.body.removeChild(newDiv);
    }
  });

  submitButton.addEventListener("click", (event) => {
    event.preventDefault();
    const commentContext = commentInput.value;
    if (!commentContext || commentContext === "") {
      alert("Please input something");
      return;
    }
    console.log(fileName);
    fetch("/add_comment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ fileName, context: commentContext }),
    }).then((response) => response.json().then((data) => {
		if (data.success) {
			alert("comment successful");
			document.body.removeChild(newDiv);
		} else {
			alert("Publish comment failed: " + data.message);
		}
	}))
	.catch((error) => {
		console.error("Error:", error);
	});
  });
}

export function addCommentsButton(fileName) {
  fetch("/verify_login")
    .then((response) => response.json())
    .then((data) => {
      if (!data.loggedIn) {
        alert("Please login to leave the comments");
        return;
      } else {
        createAddCommentForm(fileName);
      }
    })
    .catch((error) => {
      console.error("this is the error:", error);
    });
}
