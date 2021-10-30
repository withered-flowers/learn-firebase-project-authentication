// CSS Import
import "./index.css";
import "./style.css";

// Firebase Core
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  GithubAuthProvider,
  GoogleAuthProvider,
  RecaptchaVerifier,
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithPhoneNumber,
  signOut,
} from "firebase/auth";

// Firebase UI
// import * as firebaseui from "firebaseui";
// import "firebaseui/dist/firebaseui.css";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDP7euT-F0deKYhKRNDQaqKW5iwgMqayg8",
  authDomain: "dev-that-can-be-crashed.firebaseapp.com",
  databaseURL: "https://dev-that-can-be-crashed-default-rtdb.firebaseio.com",
  projectId: "dev-that-can-be-crashed",
  storageBucket: "dev-that-can-be-crashed.appspot.com",
  messagingSenderId: "278693263469",
  appId: "1:278693263469:web:8c9f12eddc77cffe44e764",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
const auth = getAuth(app);

// Initialize Firebase Sign-In from Third Party Provider
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

// Custom Script start here
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("Masuk");

    const displayName = user.displayName;
    const email = user.email;
    const photoURL = user.photoURL;
    const emailVerified = user.emailVerified;

    // The user's ID, unique to the Firebase project. Do NOT use
    // this value to authenticate with your backend server, if
    // you have one. Use User.getToken() instead.
    const uid = user.uid;

    console.log({
      displayName,
      email,
      photoURL,
      emailVerified,
      uid,
    });
  } else {
    console.log("User belum masuk");
  }
});

// Set the ReCAPTCHA for Phone SignIn
window.recaptchaVerifier = new RecaptchaVerifier(
  "btnPhone",
  {
    size: "invisible",
    callback: (response) => {
      console.log("Captcha Done");
    },
  },
  auth
);

const appVerifier = window.recaptchaVerifier;

document.getElementById("login").addEventListener("submit", async (e) => {
  e.preventDefault();

  // Get data
  const data = Object.fromEntries(new FormData(e.target).entries());

  const userCredential = await signInWithEmailAndPassword(
    auth,
    data["login-username"],
    data["login-password"]
  );

  const user = userCredential.user;
  console.log(user);
});

document.getElementById("register").addEventListener("submit", async (e) => {
  e.preventDefault();

  // Get data
  const data = Object.fromEntries(new FormData(e.target).entries());

  const userCredential = await createUserWithEmailAndPassword(
    auth,
    data["register-username"],
    data["register-password"]
  );

  const user = userCredential.user;
  console.log(user);
});

document.getElementById("btnLogout").addEventListener("click", async () => {
  await signOut(auth);
  console.log("User sudah berhasil signOut");
});

document.getElementById("btnGoogle").addEventListener("click", async () => {
  const response = signInWithPopup(auth, googleProvider);
  console.log(response);
});

document.getElementById("btnGithub").addEventListener("click", async () => {
  const response = signInWithPopup(auth, githubProvider);
  console.log(response);
});

document.getElementById("btnPhone").addEventListener("click", async () => {
  const confirmationResult = await signInWithPhoneNumber(
    auth,
    "+6282299505050",
    appVerifier
  );

  window.confirmationResult = confirmationResult;

  const code = prompt("What is the response code?");
  const userCredential = confirmationResult.confirm(code);

  console.log(userCredential);
});
