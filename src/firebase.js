
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCS7Q0h6-Pc-kB1Dqa-WlB2LdaLnl4zaY4",
  authDomain: "bau-vision25.firebaseapp.com",
  projectId: "bau-vision25",
  storageBucket: "bau-vision25.appspot.com",
  messagingSenderId: "399020543777",
  appId: "1:399020543777:web:7011999a6514a2c4043860"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
