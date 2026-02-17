document.getElementById("logout").style.display = "none";
document.getElementById("settings").style.display = "none";

import { registerUsers } from "./register.js";

registerUsers();


import { loginLogoutUsers } from "./login.js";

loginLogoutUsers();

import { settings } from "./settings.js";

settings();

function verifyLoginStatus() {
  fetch("verify-login", {
    method: "GET",
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.loggedIn) {
        document.getElementById("logout").style.display = "inline";
        document.getElementById("settings").style.display = "inline";
        document.getElementById("login").style.display = "none";
        document.getElementById("register").style.display = "none";
      } else {
        document.getElementById("logout").style.display = "none";
        document.getElementById("settings").style.display = "none";
        document.getElementById("login").style.display = "inline";
        document.getElementById("register").style.display = "inline";
      }
    })
    .catch((error) => {
      console.error("Error verifying login status:", error);
    });
}

verifyLoginStatus();
