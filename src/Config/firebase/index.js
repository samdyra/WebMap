import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
// import * as dotenv from "dotenv"; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
// dotenv.config();

export const firebaseConfig = {
  apiKey: "AIzaSyC43U76NDegnMEQ9joYceabfoQSjGvSdSQ",
  authDomain: "interviewproject-5c712.firebaseapp.com",
  projectId: "interviewproject-5c712",
  storageBucket: "interviewproject-5c712.appspot.com",
  messagingSenderId: "971308937279",
  appId: "1:971308937279:web:5920d64c8cf60e2567888a",
  measurementId: "G-7C2BZR91LW"
};

const app = initializeApp(firebaseConfig);

export const storage = getStorage(app);
export const db = getFirestore(app);
export const auth = getAuth(app);
