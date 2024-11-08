// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDtfTeJvf_dlfBBtfKpU3M2VT3Uy8KFYGQ",
    authDomain: "locamat-859e2.firebaseapp.com",
    projectId: "locamat-859e2",
    storageBucket: "locamat-859e2.firebasestorage.app",
    messagingSenderId: "933914608813",
    appId: "1:933914608813:web:248eb8fa12f6ef53deb224"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export {db,auth};