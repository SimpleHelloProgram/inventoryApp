// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBXdTUoWU9KPFsN6CaZbqyc0QMjoZaxFAw",
  authDomain: "inventory-managment-925c7.firebaseapp.com",
  projectId: "inventory-managment-925c7",
  storageBucket: "inventory-managment-925c7.appspot.com",
  messagingSenderId: "681593882654",
  appId: "1:681593882654:web:cdc564b18b096647d1860f",
  measurementId: "G-NLVCYCH0EW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app)

export {firestore}