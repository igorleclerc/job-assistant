// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCqvHYzr-gi88jG8cWxIDxMrXs7IHe0IR0",
  authDomain: "job-assitant.firebaseapp.com",
  projectId: "job-assitant",
  storageBucket: "job-assitant.firebasestorage.app",
  messagingSenderId: "681134500297",
  appId: "1:681134500297:web:15b47d1b7e3897b6306018",
  measurementId: "G-3M5T6WYK50"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics only on client side
let analytics = null;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

export const db = getFirestore(app);

export { app, analytics };