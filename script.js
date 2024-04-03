"use strict";

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import {
  getFirestore,
  addDoc,
  collection,
  query,
  where,
  getDocs,
  getDoc,
  doc,
  onSnapshot,
  updateDoc,
  arrayUnion,
  arrayRemove,
  deleteField,
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBUZdiUck2TeV2BWSZsrIuGDQt06pwl7z4",
  authDomain: "passman-for-personal.firebaseapp.com",
  projectId: "passman-for-personal",
  storageBucket: "passman-for-personal.appspot.com",
  messagingSenderId: "82824984181",
  appId: "1:82824984181:web:915761a75a5f83d54faa3c",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const container = document.querySelector(".container");
const signupBtn = document.getElementById("signup");
const loginBtn = document.getElementById("login");
const logout = document.getElementById("logout");
const inputUsername = document.querySelector(".inputUsername");
const inputPassword = document.querySelector(".inputPassword");
const toggleFormBtn = document.querySelectorAll(".toggleFormBtn");
const toggleForm = document.querySelectorAll(".toggleForm");
const dataContainer = document.querySelector(".dataContainer");
const dataPage = document.querySelector(".dataPage");
const websiteUsername = document.querySelector(".websiteUsername");
const websitePassword = document.querySelector(".websitePassword");
const infoPage = document.querySelector(".infoPage");
const websiteName = document.querySelector(".websiteName");
const addAnotherWebsiteBtn = document.querySelector(".addAnotherWebsiteBtn");
const addWebsiteForm = document.querySelector(".addWebsiteForm");
const websiteForm = document.querySelector(".websiteForm");
const newWebsite = document.querySelector(".newWebsite");
const newWebsiteUsername = document.querySelector(".newWebsiteUsername");
const newWebsitePassword = document.querySelector(".newWebsitePassword");
const addWebsiteBtn = document.querySelector(".addWebsiteBtn");
const infoPageBackBtn = document.querySelector(".infoPage-backBtn");

const editDetailsBtn = document.querySelector(".editDetailsBtn");
const editWebisteForm = document.querySelector(".editWebisteForm");
const editWebsiteInput = document.querySelector(".editWebsite");
const editUsernameInput = document.querySelector(".editUsername");
const editPasswordInput = document.querySelector(".editPassword");
const saveDetailsBtn = document.querySelector(".saveDetails");
const deleteWebsiteBtn = document.querySelector(".deleteWebsiteBtn");

const showPassword = document.querySelector(".showPassword");
const hidePassword = document.querySelector(".hidePassword");

let currentWebsiteIndex;
let currentUserId;
let userId;
let userData;

var invalidUsernameMsg = `Username or password contains invalid characters. 

username can contain: lowercase letter, any digit, special character underscore( _ ), and no spaces allowed

password should contain: atleast one lowercase and one uppercase letter, atleast one digit and no spaces allowed`;

let docRef;

async function loadData() {
  let docSnap = await getDoc(docRef);
  let passwordsArray = docSnap.data().passwords;

  if (docSnap.exists() && passwordsArray) {
    if (passwordsArray.length < 1) {
      dataContainer.innerHTML =
        "<div class='noDataDiv'>no passwords yet to show</div>";
    } else {
      dataContainer.innerHTML = "";

      passwordsArray.forEach((e, index) => {
        let websiteDiv = document.createElement("div");
        websiteDiv.textContent = e.website;
        websiteDiv.classList.add("website");
        dataContainer.appendChild(websiteDiv);

        websiteDiv.addEventListener("click", () => {
          websiteName.textContent = e.website;
          websiteUsername.value = e.username;
          websitePassword.value = e.password;
          currentWebsiteIndex = index;

          dataPage.classList.toggle("active");
          infoPage.classList.toggle("active");
        });
      });
    }
  } else {
    // docSnap.data() will be undefined in this case
    dataContainer.innerHTML =
      "<div class='noDataDiv'>no passwords yet to show</div>";
    console.log("No such document!");
  }
}

toggleFormBtn.forEach((button) => {
  // toggle login and signup buttons
  button.addEventListener("click", () => {
    loginBtn.classList.toggle("active");
    signupBtn.classList.toggle("active");

    // toggle span for login and signup button
    toggleForm.forEach((btn) => {
      btn.classList.toggle("active");
    });
  });
});

function isValidUsernameAndPass(testUsername, testPassword) {
  // Defining a regular expression pattern for valid characters
  var usernamePattern = /^[a-z0-9_]+$/;
  var passwordComplexityRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?!.*\s).{8,}$/; // At least one lowercase letter, one uppercase letter, and one digit without spaces

  // Check if the username matches the pattern
  return (
    usernamePattern.test(testUsername) && passwordComplexityRegex.test(testPassword)
  );
}

function clearFields() {
  inputUsername.value = "";
  inputPassword.value = "";
  userId = undefined;
  userData = undefined;
}

async function userCheck() {
  userId = undefined;
  userData = undefined;

  let q = query(
    collection(db, "users"),
    where("username", "==", inputUsername.value)
  );

  let querySnapshot = await getDocs(q);

  querySnapshot.forEach((doc) => {
    userId = doc.id;
    userData = doc.data();
  });

  if (userId && userData) {
    return { userId, userData };
  } else {
    return false;
  }
}

function validateFields(website, userName, userPassword) {
  if (website.value.trim().length < 1) {
    alert("website name cannot be empty");
    return false;
  } else if (userName.value.trim().length < 1) {
    alert("username cannot be empty");
    return false;
  } else if (userPassword.value.trim().length < 1) {
    alert("password cannot be empty");
    return false;
  } else return true;
}

signupBtn.addEventListener("click", async () => {
  let newUsername = inputUsername.value;
  let newPassword = inputPassword.value;

  if (await userCheck()) {
    alert(
      "another user exists with this username, please try a different username to create an account"
    );
    userId = undefined;
    userData = undefined;
  } else {
    if (isValidUsernameAndPass(newUsername, newPassword)) {
      // executing user registration
      await addDoc(collection(db, "users"), {
        username: newUsername,
        userpass: newPassword,
      });

      alert(
        "account created successfully, please login with new username and password!"
      );

      clearFields();
    } else {
      alert(invalidUsernameMsg);
    }
  }
});

loginBtn.addEventListener("click", async () => {
  let newUsername = inputUsername.value;
  let newPassword = inputPassword.value;

  if (isValidUsernameAndPass(newUsername, newPassword)) {
    if (!(await userCheck())) {
      alert("no user exists with this username, please create an account first!");
    } else {
      userCheck().then(async (result) => {
        if (result.userId && result.userData.userpass == inputPassword.value) {
          currentUserId = result.userId;
          docRef = doc(db, "users", currentUserId);
          container.classList.toggle("active");
          dataPage.classList.toggle("active");
          clearFields();
          await loadData();
        } else if (result.userData.userpass != newPassword) {
          alert("password incorrect!");
        }
      });
    }
  } else {
    alert(invalidUsernameMsg);
  }
});

logout.addEventListener("click", () => {
  docRef = undefined;
  dataContainer.innerHTML = "";

  dataPage.classList.toggle("active");
  container.classList.toggle("active");
});

addAnotherWebsiteBtn.addEventListener("click", () => {
  addWebsiteForm.classList.toggle("active");
});

addWebsiteBtn.addEventListener("click", async () => {
  if (validateFields(newWebsite, newWebsiteUsername, newWebsitePassword)) {
    // Atomically add a new website to the "passwords" array field.
    await updateDoc(docRef, {
      passwords: arrayUnion({
        password: newWebsitePassword.value,
        website: newWebsite.value,
        username: newWebsiteUsername.value,
      }),
    });

    newWebsitePassword.value = "";
    newWebsite.value = "";
    newWebsiteUsername.value = "";

    await loadData();

    addWebsiteForm.classList.toggle("active");
  }
});

// close form on clicking outside the form box
addWebsiteForm.addEventListener("click", (e) => {
  if (e.target == addWebsiteForm) {
    addWebsiteForm.classList.toggle("active");
  }
});

infoPageBackBtn.addEventListener("click", async () => {
  infoPage.classList.toggle("active");
  dataPage.classList.toggle("active");
  togglePasswordVisibility("hide");
  await loadData();
});

editDetailsBtn.addEventListener("click", async () => {
  let docSnap = await getDoc(docRef);

  editWebisteForm.classList.toggle("active");

  editWebsiteInput.value = docSnap.data().passwords[currentWebsiteIndex].website;
  editUsernameInput.value = docSnap.data().passwords[currentWebsiteIndex].username;
  editPasswordInput.value = docSnap.data().passwords[currentWebsiteIndex].password;
});

// close form on clicking outside the form box
editWebisteForm.addEventListener("click", (e) => {
  if (e.target == editWebisteForm) {
    editWebisteForm.classList.toggle("active");
  }
});

saveDetailsBtn.addEventListener("click", async () => {
  let docSnap = await getDoc(docRef);

  if (validateFields(editWebsiteInput, editUsernameInput, editPasswordInput)) {
    await updateDoc(docRef, {
      passwords: arrayUnion({
        password: editPasswordInput.value,
        website: editWebsiteInput.value,
        username: editUsernameInput.value,
      }),
    });

    await updateDoc(docRef, {
      passwords: arrayRemove(docSnap.data().passwords[currentWebsiteIndex]),
    });

    editWebisteForm.classList.toggle("active");

    let newData = await getDoc(docRef);
    let newPasswordArray = newData.data().passwords;
    currentWebsiteIndex = newPasswordArray.length - 1;

    websiteName.textContent = newPasswordArray[newPasswordArray.length - 1].website;
    websiteUsername.value = newPasswordArray[newPasswordArray.length - 1].username;
    websitePassword.value = newPasswordArray[newPasswordArray.length - 1].password;
  }
});

deleteWebsiteBtn.addEventListener("click", async () => {
  let docSnap = await getDoc(docRef);

  await updateDoc(docRef, {
    passwords: arrayRemove(docSnap.data().passwords[currentWebsiteIndex]),
  });

  infoPage.classList.toggle("active");
  dataPage.classList.toggle("active");
  await loadData();
});

function togglePasswordVisibility(type) {
  if (type == "show") {
    websitePassword.type = "text";
    showPassword.style.display = "none";
    hidePassword.style.display = "inline-block";
  } else if (type == "hide") {
    websitePassword.type = "password";
    hidePassword.style.display = "none";
    showPassword.style.display = "inline-block";
  }
}

showPassword.addEventListener("click", () => {
  togglePasswordVisibility("show");
});

hidePassword.addEventListener("click", () => {
  togglePasswordVisibility("hide");
});
