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

// Initializer
const loginSection = document.getElementById("loginSection");
const registerSection = document.getElementById("registerSection");
const homeSection = document.getElementById("homeSection");
const homeContent = document.getElementById("homeContent");
const loginForm = document.getElementById("login");
const registerForm = document.getElementById("register");
const btnRegisterOnLoginForm = document.getElementById(
  "btnRegisterOnLoginForm"
);
const btnLoginOnRegisterForm = document.getElementById(
  "btnLoginOnRegisterForm"
);
const btnLogout = document.getElementById("btnLogout");
const btnLoginWithGoogle = document.getElementById("btnGoogle");
const btnLoginWithGithub = document.getElementById("btnGithub");
const btnLoginWithPhone = document.getElementById("btnPhone");
// Phone Modal
const modalLoginWithPhone = document.getElementById("phoneModal");
// Phone Modal - Validation
const modalLoginWithPhoneVerification = document.getElementById(
  "phoneModalVerification"
);
const validatatePhoneForm = document.getElementById("formModalVerification");
const btnLoginWithPhoneVerification = document.getElementById(
  "btnPhoneVerification"
);
const btnLoginWithPhoneVerificationDismiss = document.getElementById(
  "btnPhoneVerificationCancel"
);

// Phone Modal - Success
const modalLoginWithPhoneVerificationOK = document.getElementById(
  "phoneModalVerificationOk"
);
const btnLoginWithPhoneVerificationOk = document.getElementById(
  "btnPhoneVerificationOk"
);

const appVerifier = window.recaptchaVerifier;

onAuthStateChanged(auth, (user) => {
  if (user) {
    loginSection.style.display = "none";
    registerSection.style.display = "none";
    homeSection.style.display = "block";

    const displayName = user.displayName;
    const email = user.email;
    const photoURL = user.photoURL;
    const emailVerified = user.emailVerified;

    // The user's ID, unique to the Firebase project. Do NOT use
    // this value to authenticate with your backend server, if
    // you have one. Use User.getToken() instead.
    const uid = user.uid;

    homeContent.innerHTML = uid;

    console.log({
      displayName,
      email,
      photoURL,
      emailVerified,
      uid,
    });
  } else {
    loginSection.style.display = "block";
    registerSection.style.display = "none";
    homeSection.style.display = "none";
    modalLoginWithPhone.style.display = "none";
    modalLoginWithPhoneVerification.style.display = "none";
    modalLoginWithPhoneVerificationOK.style.display = "none";
  }
});

loginForm.addEventListener("submit", async (e) => {
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

registerForm.addEventListener("submit", async (e) => {
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

btnLogout.addEventListener("click", async () => {
  await signOut(auth);
  console.log("User sudah berhasil signOut");
});

btnLoginWithGoogle.addEventListener("click", async () => {
  const response = signInWithPopup(auth, googleProvider);
  console.log(response);
});

btnLoginWithGithub.addEventListener("click", async () => {
  const response = signInWithPopup(auth, githubProvider);
  console.log(response);
});

btnLoginWithPhone.addEventListener("click", async () => {
  modalLoginWithPhone.style.display = "flex";
  modalLoginWithPhoneVerification.style.display = "block";
  modalLoginWithPhoneVerificationOK.style.display = "none";
});

btnRegisterOnLoginForm.addEventListener("click", (e) => {
  e.preventDefault();

  loginSection.style.display = "none";
  registerSection.style.display = "block";
  homeSection.style.display = "none";
});

btnLoginOnRegisterForm.addEventListener("click", (e) => {
  e.preventDefault();

  loginSection.style.display = "block";
  registerSection.style.display = "none";
  homeSection.style.display = "none";
});

validatatePhoneForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Get data
  const data = Object.fromEntries(new FormData(e.target).entries());

  // console.log(data);

  const confirmationResult = await signInWithPhoneNumber(
    auth,
    data["phone-modal-verification-number"],
    appVerifier
  );

  window.confirmationResult = confirmationResult;

  const code = prompt("What is the response code?");
  const userCredential = confirmationResult.confirm(code);

  console.log(userCredential);
});

btnLoginWithPhoneVerificationDismiss.addEventListener("click", () => {
  modalLoginWithPhone.style.display = "none";
  modalLoginWithPhoneVerification.style.display = "none";
  modalLoginWithPhoneVerificationOK.style.display = "none";
});

btnLoginWithPhoneVerificationOk.addEventListener("click", () => {
  modalLoginWithPhone.style.display = "none";
  modalLoginWithPhoneVerification.style.display = "none";
  modalLoginWithPhoneVerificationOK.style.display = "none";
});
