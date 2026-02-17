import { currentUsername } from "./login.js";

export function settings() {
  document.getElementById("settings").addEventListener("click", function () {
    const newDiv = document.createElement("div");
    newDiv.id = "background-div";
    document.body.insertBefore(newDiv, document.body.firstChild);
    newDiv.style.position = "fixed";
    newDiv.style.top = "0";
    newDiv.style.left = "0";
    newDiv.style.width = "100%";
    newDiv.style.height = "100%";
    newDiv.style.backgroundColor = "rgba(0, 0, 0, 0.5)";

    const form = document.createElement("form");
    form.style.position = "absolute";
    form.style.top = "50%";
    form.style.left = "50%";
    form.style.width = "300px";
    form.style.display = "flex";
    form.style.flexDirection = "column";
    form.style.alignItems = "center";
    form.style.transform = "translate(-50%, -50%)";
    form.style.backgroundColor = "#fff";
    form.style.padding = "20px";
    form.style.borderRadius = "5px";

    const usernameLabel = document.createElement("label");
    usernameLabel.textContent = "New Username:";
    const usernameInput = document.createElement("input");
    usernameInput.type = "text";
    usernameInput.name = "username";

    const emailLabel = document.createElement("label");
    emailLabel.textContent = "New Email:";
    const emailInput = document.createElement("input");
    emailInput.type = "email";
    emailInput.name = "email";

	const passwordLabel = document.createElement("label");
	passwordLabel.textContent = "New Password:";
	const passwordInput = document.createElement("input");
	passwordInput.type = "password";
	passwordInput.name = "password";

    const submitButton = document.createElement("button");
    submitButton.id = "submit-button";
    submitButton.type = "submit";
    submitButton.textContent = "Update Settings";

    const closeButton = document.createElement("button");
    closeButton.type = "button";
    closeButton.textContent = "X";
    closeButton.style.position = "absolute";
    closeButton.style.top = "10px";
    closeButton.style.right = "10px";
    closeButton.addEventListener("click", function () {
      document.body.removeChild(newDiv);
    });

    form.appendChild(usernameLabel);
    form.appendChild(usernameInput);
    form.appendChild(document.createElement("br"));
    form.appendChild(emailLabel);
    form.appendChild(emailInput);
    form.appendChild(document.createElement("br"));
	form.appendChild(passwordLabel);
	form.appendChild(passwordInput);
	form.appendChild(document.createElement("br"));
    form.appendChild(submitButton);
    form.appendChild(closeButton);

    newDiv.appendChild(form);

    newDiv.addEventListener("click", function (event) {
      if (event.target === newDiv) {
        document.body.removeChild(newDiv);
      }
    });

	let currentEmail = "";
	fetch("/get-user-info", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ username: currentUsername }),
	})
	.then((response) => response.json())
	.then((data) => {
		if (data.success) {
			currentEmail = data.email;
			usernameInput.placeholder = currentUsername;
			emailInput.placeholder = currentEmail;
		} else {
			alert("Error fetching user info: " + data.error);
		}
	})
	.catch((error) => {
		console.error("Error:", error);
		alert("An error occurred while fetching user info.");
	});

	document.getElementById("submit-button").addEventListener("click", function (event) {
		event.preventDefault();
		const newUsername = usernameInput.value;
		const newEmail = emailInput.value;
		const newPassword = passwordInput.value;
		console.log("Updating settings for:");
		console.log("New Username:", typeof newUsername, newUsername.length, newUsername);
		console.log("New Email:", typeof newEmail, newEmail.length, newEmail);
		console.log("New Password:", typeof newPassword, newPassword.length, newPassword);
		fetch("/update-settings", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ currentUsername, currentEmail, username: newUsername, email: newEmail, password: newPassword }),
		})
		.then((response) => response.json())
		.then((data) => {
			if (data.success) {
				alert("Settings updated successfully!");
				document.body.removeChild(newDiv);
			} else {
				alert("Error updating settings: " + data.error);
			}
		})
		.catch((error) => {
			console.error("Error:", error);
			alert("An error occurred while updating settings.");
		});
	});
  });
}
