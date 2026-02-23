document.getElementById("logout").style.display = "none";
document.getElementById("settings").style.display = "none";

import { registerUsers } from "./register.js";

registerUsers();

import { loginLogoutUsers } from "./login.js";

loginLogoutUsers();

import { settings } from "./settings.js";

settings();

import { verifyLoginStatus, windowLoad } from "./login.js";

verifyLoginStatus();
windowLoad();

import { sideBarGallery } from "./sideBarGallery.js";

sideBarGallery();

import { uploadImages } from "./uploadImages.js";

uploadImages();

// docker exec -it camagru-db-1 mysql -u root -p