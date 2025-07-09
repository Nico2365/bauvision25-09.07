
// firebase.js – Firebase Initialisierung
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCS7Q0h6-Pc-kB1Dqa-WlB2LdaLnl4zaY4",
  authDomain: "bau-vision25.firebaseapp.com",
  projectId: "bau-vision25",
  storageBucket: "bau-vision25.appspot.com",
  messagingSenderId: "399020543777",
  appId: "1:399020543777:web:7011999a6514a2c4043860",
  measurementId: "G-4E4XP60LWY"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
