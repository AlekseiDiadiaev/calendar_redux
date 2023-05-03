import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";

const firebaseConfig ={
    apiKey: "AIzaSyAAMNDqSSSMnRPhtn99CkAz65_Z6vAO8HU",
    authDomain: "calendar-plan-aledya.firebaseapp.com",
    projectId: "calendar-plan-aledya",
    storageBucket: "calendar-plan-aledya.appspot.com",
    messagingSenderId: "801974474571",
    appId: "1:801974474571:web:77dec4044c93717b6f7ace"
  };

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth();