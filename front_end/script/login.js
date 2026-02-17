export let currentUsername = "";
export function setCurrentUsername(username) {
  currentUsername = username;
  console.log("Current username set to: " + currentUsername);
}

export function loginLogoutUsers() {
  document.getElementById("login").addEventListener("click", function () {
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
    usernameLabel.textContent = "Username:";
    const usernameInput = document.createElement("input");
    usernameInput.type = "text";
    usernameInput.name = "username";

    const passwordLabel = document.createElement("label");
    passwordLabel.textContent = "Password:";
    const passwordInput = document.createElement("input");
    passwordInput.type = "password";
    passwordInput.name = "password";

    const submitButton = document.createElement("button");
    submitButton.id = "submit-button";
    submitButton.type = "submit";
    submitButton.textContent = "Login";

    const forgetPasswordButton = document.createElement("button");
    forgetPasswordButton.type = "button";
    forgetPasswordButton.textContent = "Forget Password?";
    forgetPasswordButton.style.marginTop = "10px";

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
    form.appendChild(passwordLabel);
    form.appendChild(passwordInput);
    form.appendChild(document.createElement("br"));
    form.appendChild(submitButton);
    form.appendChild(closeButton);
    form.appendChild(forgetPasswordButton);

    newDiv.appendChild(form);

    newDiv.addEventListener("click", function (event) {
      if (event.target === newDiv) {
        document.body.removeChild(newDiv);
      }
    });

    forgetPasswordButton.addEventListener("click", function () {
      alert(
        "An email with the temporary password has been sent to your email address, please check your inbox.",
      );
      fetch("forget-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: usernameInput.value }),
      })
        .then((response) => response.json())
        .then((data) => {
          //   console.log("Response from server:", data);
          if (data.success) {
            alert("Temporary password sent to your email successfully!");
          } else {
            alert("Failed to send temporary password: " + data.message);
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          alert("An error occurred while sending temporary password.");
        });
    });

    function loginUser(username, password) {
      fetch("login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      })
        .then((response) => response.json())
        .then((data) => {
          //   console.log("Response from server:", data);
          if (data.success) {
            alert("Login successful!");
            document.getElementById("logout").style.display = "inline";
            document.getElementById("settings").style.display = "inline";
            document.getElementById("login").style.display = "none";
            document.getElementById("register").style.display = "none";
            document.body.removeChild(newDiv);
            currentUsername = username;
          } else {
            alert("Login failed: " + data.message);
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          alert("An error occurred during login.");
        });
    }

    document
      .getElementById("submit-button")
      .addEventListener("click", function (event) {
        event.preventDefault();
        const username = usernameInput.value;
        const password = passwordInput.value;
        if (!username || !password) {
          alert("Please enter both username and password to login.");
          return;
        }
        loginUser(username, password);
      });
  });

  document.getElementById("logout").addEventListener("click", function () {
    alert("Logged out successfully!");
    fetch("logout", {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          document.getElementById("logout").style.display = "none";
          document.getElementById("settings").style.display = "none";
          document.getElementById("login").style.display = "inline";
          document.getElementById("register").style.display = "inline";
        } else {
          alert("Logout failed: " + data.message);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("An error occurred during logout.");
      });
  });
}
