// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAfdoQwFotZcoaohFycqcaVXJp-q7m0B3A",
  authDomain: "hackathon-lpu.firebaseapp.com",
  projectId: "hackathon-lpu",
  storageBucket: "hackathon-lpu.appspot.com",
  messagingSenderId: "566499491213",
  appId: "1:566499491213:web:e0a4cd8056f5d7097cd1c4"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
