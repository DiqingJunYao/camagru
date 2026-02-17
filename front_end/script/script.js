document.getElementById("logout").style.display = "none";
document.getElementById("settings").style.display = "none";

import { registerUsers } from "./register.js";

registerUsers();


import { loginUsers } from "./login.js";

loginUsers();

import { settings } from "./settings.js";

settings();

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
