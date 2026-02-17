document.getElementById("logout").style.display = "none";
document.getElementById("settings").style.display = "none";

import { registerUsers } from "./register.js";

registerUsers();


import { loginUsers } from "./login.js";

loginUsers();

document.getElementById("logout").addEventListener("click", function () {
  alert("Logged out successfully!");
  document.getElementById("logout").style.display = "none";
  document.getElementById("settings").style.display = "none";
  document.getElementById("login").style.display = "inline";
  document.getElementById("register").style.display = "inline";
});
