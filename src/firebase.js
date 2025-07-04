// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDFLgKxBnHe4VFydJ2QnyM9WOF6U_EPfuE",
  authDomain: "fotogram-cms.firebaseapp.com",
  projectId: "fotogram-cms",
  storageBucket: "fotogram-cms.appspot.com",
  messagingSenderId: "474733099172",
  appId: "1:474733099172:web:312a1c9528c9fd47904e31",
  measurementId: "G-TYS6TND43Q"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
