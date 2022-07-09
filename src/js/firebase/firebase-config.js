import { initializeApp } from "firebase/app";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCHkgA3cxu1eyZ_8qHW-ErzrXc8yY7X9Wo",
  authDomain: "thesis-kit-aeli.firebaseapp.com",
  projectId: "thesis-kit-aeli",
  storageBucket: "thesis-kit-aeli.appspot.com",
  messagingSenderId: "867821689092",
  appId: "1:867821689092:web:e0a606385f5e8cfee39851"
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);
