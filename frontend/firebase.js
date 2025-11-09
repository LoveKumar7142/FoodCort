// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API,
  authDomain: "foodcort-site.firebaseapp.com",
  projectId: "foodcort-site",
  storageBucket: "foodcort-site.firebasestorage.app",
  messagingSenderId: "990167711909",
  appId: "1:990167711909:web:abb0c6cb66cdc7afa9cd4c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


const auth = getAuth(app)

export {app,auth}