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

const signupBtn = document.getElementById("signup");
const loginBtn = document.getElementById("login");
const inputUsername = document.querySelector(".inputUsername");
const inputPassword = document.querySelector(".inputPassword");
const toggleFormBtn = document.querySelectorAll(".toggleFormBtn");
const dataContainer = document.querySelector(".dataContainer");
const websiteUsername = document.querySelector(".websiteUsername");
const websitePassword = document.querySelector(".websitePassword");
const infoPage = document.querySelector(".infoPage");
const websiteName = document.querySelector(".websiteName");
const addAnotherWebsiteBtn = document.querySelector(".addAnotherWebsiteBtn");
const addWebsiteForm = document.querySelector(".addWebsiteForm");
let newWebsite = document.querySelector(".newWebsite");
let newWebsiteUsername = document.querySelector(".newWebsiteUsername");
let newWebsitePassword = document.querySelector(".newWebsitePassword");
const addWebsiteBtn = document.querySelector(".addWebsiteBtn");

let currentUserId;
let userId;
let userData;

const docRef = doc(db, "users", "tG5N5ZH46uqETnZWkVRP");
const docSnap = await getDoc(docRef);

if (docSnap.exists()) {
  docSnap.data().passwords.forEach((e) => {
    let websiteDiv = document.createElement("div");
    websiteDiv.textContent = e.website;
    websiteDiv.classList.add("website");
    dataContainer.appendChild(websiteDiv);

    websiteDiv.addEventListener("click", () => {
      websiteName.textContent = e.website;
      websiteUsername.value = e.username;
      websitePassword.value = e.password;
      console.log(e);

      dataContainer.classList.toggle("active");
      infoPage.classList.toggle("active");
    });
  });
} else {
  // docSnap.data() will be undefined in this case
  console.log("No such document!");
}

toggleFormBtn.forEach((button) => {
  button.addEventListener("click", () => {
    loginBtn.classList.toggle("active");
    signupBtn.classList.toggle("active");

    toggleFormBtn.forEach((btn) => {
      btn.classList.toggle("active");
    });
  });
});

function clearFields() {
  inputUsername.value = "";
  inputPassword.value = "";
  userId = "";
  userData = "";
}

async function userCheck() {
  let q = query(
    collection(db, "users"),
    where("username", "==", inputUsername.value)
  );

  let querySnapshot = await getDocs(q);

  querySnapshot.forEach((doc) => {
    userId = doc.id;
    userData = doc.data();
  });
}

signupBtn.addEventListener("click", async () => {
  await userCheck();

  if (userData.username == inputUsername.value) {
    alert("user already exists with this username!");
  } else if (!userId) {
    await addDoc(collection(db, "users"), {
      username: inputUsername.value,
      pass: inputPassword.value,
    });
    alert("account created successfully");
  }

  clearFields();
});

loginBtn.addEventListener("click", async () => {
  await userCheck();

  if (userId && userData.pass == inputPassword.value) {
    currentUserId = userId;
    console.log("logged in", currentUserId);
  } else if (!userId) {
    alert("no user exists with this username!");
  } else if (userData.pass != inputPassword.value) {
    alert("password incorrect!");
  }

  clearFields();
});

addAnotherWebsiteBtn.addEventListener("click", () => {
  addWebsiteForm.classList.toggle("active");
});

addWebsiteBtn.addEventListener("click", async () => {
  // Atomically add a new website to the "passwords" array field.
  await updateDoc(docRef, {
    passwords: arrayUnion({
      password: newWebsitePassword.value,
      website: newWebsite.value,
      username: newWebsiteUsername.value,
    }),
  });
});
