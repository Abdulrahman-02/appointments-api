// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyC61rmHTgU0QWq6UZuEBY0nSOWCBNRL-rI",
    authDomain: "pulse-4b296.firebaseapp.com",
    databaseURL: "https://pulse-4b296-default-rtdb.firebaseio.com",
    projectId: "pulse-4b296",
    storageBucket: "pulse-4b296.appspot.com",
    messagingSenderId: "321737053235",
    appId: "1:321737053235:web:7165046f9cc4303001ff46",
    measurementId: "G-9G109MXYPM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);