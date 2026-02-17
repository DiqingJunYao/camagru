document.getElementById("logout").style.display = "none";

document.getElementById("register").addEventListener("click", function () {
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

  const emailLabel = document.createElement("label");
  emailLabel.textContent = "Email:";
  const emailInput = document.createElement("input");
  emailInput.type = "email";
  emailInput.name = "email";

  const submitButton = document.createElement("button");
  submitButton.id = "submit-button";
  submitButton.type = "submit";
  submitButton.textContent = "Register";

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
  form.appendChild(emailLabel);
  form.appendChild(emailInput);
  form.appendChild(document.createElement("br"));
  form.appendChild(submitButton);
  form.appendChild(closeButton);

  newDiv.appendChild(form);

  newDiv.addEventListener("click", function (event) {
    if (event.target === newDiv) {
      document.body.removeChild(newDiv);
    }
  });

  function registerUser(username, password, email) {
    fetch("register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password, email }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Response from server:", data);
        if (data.success) {
          alert(
            "Registration successful! Please check your email to verify your account. Or your account might be erased after two days if you don't verify it.",
          );
          document.body.removeChild(newDiv);
        } else {
          alert("Registration failed: " + data.message);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("An error occurred during registration.");
      });
  }

  document
    .getElementById("submit-button")
    .addEventListener("click", function (event) {
      event.preventDefault();
      const username = usernameInput.value;
      const password = passwordInput.value;
      const email = emailInput.value;
      console.log("Username:", username);
      console.log("Password:", password);
      console.log("Email:", email);
      registerUser(username, password, email);
    });
});

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
        console.log("Response from server:", data);
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
        console.log("Response from server:", data);
        if (data.success) {
          alert("Login successful!");
          document.getElementById("logout").style.display = "inline";
          document.getElementById("login").style.display = "none";
          document.getElementById("register").style.display = "none";
          document.body.removeChild(newDiv);
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
      loginUser(username, password);
    });
});

document.getElementById("logout").addEventListener("click", function () {
  alert("Logged out successfully!");
  document.getElementById("logout").style.display = "none";
  document.getElementById("login").style.display = "inline";
  document.getElementById("register").style.display = "inline";
});
