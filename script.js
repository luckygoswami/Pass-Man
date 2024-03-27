"use strict";

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import {
  getFirestore,
  addDoc,
  collection,
  query,
  where,
  getDocs,
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
const username = document.querySelector(".username");
const password = document.querySelector(".password");

signupBtn.addEventListener("click", async () => {
  await addDoc(collection(db, "users"), {
    username: username.value,
    pass: password.value,
  });

  username.value = "";
  password.value = "";
});

loginBtn.addEventListener("click", async () => {
  const q = query(collection(db, "users"), where("username", "==", username.value));

  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    console.log(doc.id, " => ", doc.data());

    if (password.value == doc.data().pass) {
      console.log("you are logged in");
    } else {
      console.log("error login");
    }
  });
});
