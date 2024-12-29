// src/firebase.js
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyDw5k9fLXYn8xvKAwcLYWDx8LpCI-35i9A",
    authDomain: "billofmaterials-e6f68.firebaseapp.com",
    databaseURL: "https://billofmaterials-e6f68-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "billofmaterials-e6f68",
    storageBucket: "billofmaterials-e6f68.firebasestorage.app",
    messagingSenderId: "1018366014169",
    appId: "1:1018366014169:web:2afd2ffcdf4e12a31844c8",
    measurementId: "G-NWKNVF8CM8"
};

const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const database = getDatabase(app);

export { database };
