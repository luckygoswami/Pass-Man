"use strict";

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import {
  getFirestore,
  addDoc,
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
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
let userId;
let userData;

function clearFields() {
  inputUsername.value = "";
  inputPassword.value = "";
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
    console.log("user already exists with this username", userData);
  } else if (!userId) {
    await addDoc(collection(db, "users"), {
      username: inputUsername.value,
      pass: inputPassword.value,
    });
    console.log("user added to db");
  }

  clearFields();

  userId = "";
  userData = "";
});

loginBtn.addEventListener("click", async () => {
  await userCheck();

  if (userId && userData.pass == inputPassword.value) {
    console.log("logged in", userData);
  } else if (!userId) {
    console.log("no user exists");
  } else if (userData.pass != inputPassword.value) {
    console.log("pass incorrect");
  }

  clearFields();

  userId = "";
  userData = "";
});
