import { currentUsername, setCurrentUsername } from "./login.js";

export function settings() {
  document.getElementById("settings").addEventListener("click", function () {
    const newDiv = document.createElement("div");
    newDiv.id = "background_div";
    newDiv.classList.add("background_overlay");
    document.body.prepend(newDiv);

    const form = document.createElement("form");
    form.id = "uploadForm";
    form.classList.add("modal_form");

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

    const openCommentEmail = document.createElement("button");
    openCommentEmail.id = "openCommentEmail";
    openCommentEmail.textContent = "Receive Email When comment";

    const closeCommentEmail = document.createElement("button");
    closeCommentEmail.id = "closeCommentEmail";
    closeCommentEmail.textContent = "Don't Receive Email When comment";

    const submitButton = document.createElement("button");
    submitButton.id = "submit_button";
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
    form.appendChild(openCommentEmail);
    form.appendChild(closeCommentEmail);
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
    fetch("/get_user_info", {
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
        if (data.emailStatus === 1) {
          openCommentEmail.style.display = "none";
        } else {
          closeCommentEmail.style.display = "none";
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("An error occurred while fetching user info.");
      });

    openCommentEmail.addEventListener("click", (event) => {
      event.preventDefault();
      fetch("/open_comment_email")
        .then((response) => {
          response.json().then((data) => {
            if (data.success) {
              alert("Open comment email successfully!");
              document.body.removeChild(newDiv);
            } else {
              alert("failed to open the comment email.");
            }
          });
        })
        .catch((error) => {
          alert("failed to open the comment email.");
          console.error("Error:", error);
        });
    });

    closeCommentEmail.addEventListener("click", (event) => {
      event.preventDefault();
      fetch("/close_comment_email")
        .then((response) => {
          response.json().then((data) => {
            if (data.success) {
              alert("Close comment email successfully!");
              document.body.removeChild(newDiv);
            } else {
              alert("failed to close the comment email.");
            }
          });
        })
        .catch((error) => {
          alert("failed to close the comment email.");
          console.error("Error:", error);
        });
    });

    submitButton.addEventListener("click", function (event) {
      event.preventDefault();
      const newUsername = usernameInput.value.replace(/</g, "&lt;").replace(/>/g, "&gt;");
      const newEmail = emailInput.value.replace(/</g, "&lt;").replace(/>/g, "&gt;");
      const newPassword = passwordInput.value.replace(/</g, "&lt;").replace(/>/g, "&gt;");
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) {
        alert("Please enter a valid email address.");
        return;
      }
      if (newPassword.length < 6) {
        alert("Password must be at least 6 characters long.");
        return;
      }
      if (newPassword.length > 20) {
        alert("Password must be no more than 20 characters long.");
        return;
      }
      if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(newPassword)) {
        alert(
          "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character.",
        );
        return;
      }
      fetch("/update_settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentUsername,
          currentEmail,
          username: newUsername,
          email: newEmail,
          password: newPassword,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            alert("Settings updated successfully!");
            document.body.removeChild(newDiv);
            setCurrentUsername(newUsername || currentUsername);
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
