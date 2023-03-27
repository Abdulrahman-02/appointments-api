const express = require('express');
const bodyParser = require('body-parser');
const firebase = require('firebase-admin');

const app = express();

// Initialize Firebase
const serviceAccount = require('./serviceAccountKey.json');
firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
    databaseURL: 'https://pulse-4b296-default-rtdb.firebaseio.com'
});

const db = firebase.database();
const appointmentRef = db.ref('appointments').push({
    type: 'Blood Donation',
    date: '2023-03-31T09:00:00',
    donorFirstName: 'John',
    donorLastName: 'Doe',
    donorDOB: '1990-01-01',
    donorEmail: 'johndoe@example.com',
    donorMobile: '555-1234',
    hospitalId: 'abc125',
    userId: '1234567'
});

// Log the unique key that Firebase generated for the new appointment
console.log('New appointment key:', appointmentRef.key);