document.getElementById("logout").style.display = "none";
document.getElementById("settings").style.display = "none";

import { registerUsers } from "./register.js";

registerUsers();


import { loginLogoutUsers } from "./login.js";

loginLogoutUsers();

import { settings } from "./settings.js";

settings();

import { verifyLoginStatus } from "./login.js";

verifyLoginStatus();
