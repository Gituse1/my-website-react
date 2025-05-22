// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAmIgsiX_lEJjRogry6DFlTdzTF7t4Hx8I",
  authDomain: "first-site-9f97f.firebaseapp.com",
  projectId: "first-site-9f97f",
  storageBucket: "first-site-9f97f.appspot.com",  
  messagingSenderId: "351512932532",
  appId: "1:351512932532:web:aecedb612d57a527ca67e1",
  measurementId: "G-740CFX3HXK"
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
