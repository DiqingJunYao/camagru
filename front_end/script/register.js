export function registerUsers() {
  document.getElementById("register").addEventListener("click", function () {
    const newDiv = document.createElement("div");
    newDiv.id = "background_div";
    newDiv.classList.add("background_overlay");
    document.body.prepend(newDiv);

    const form = document.createElement("form");
    form.id = "uploadForm";
    form.classList.add("modal_form");

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
    submitButton.id = "submit_button";
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
      .getElementById("submit_button")
      .addEventListener("click", function (event) {
        event.preventDefault();
        const username = usernameInput.value;
        const password = passwordInput.value;
        const email = emailInput.value;
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          alert("Please enter a valid email address.");
          return;
        }
        if (password.length < 8) {
          alert("Password must be at least 8 characters long.");
          return;
        }
        if (password.length > 20) {
          alert("Password must be no more than 20 characters long.");
          return;
        }
        if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(password)) {
          alert("Password must contain at least one uppercase letter, one lowercase letter, one number and one special character.");
          return;
        }
        if (!username || !password || !email) {
          alert("Please fill in all fields to register.");
          return;
        }
        username = username.replace(/</g, "&lt;").replace(/>/g, "&gt;");
        password = password.replace(/</g, "&lt;").replace(/>/g, "&gt;");
        email = email.replace(/</g, "&lt;").replace(/>/g, "&gt;");
        registerUser(username, password, email);
      });
  });
}
