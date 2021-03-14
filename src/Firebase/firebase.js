import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/database';
import 'firebase/analytics';

const firebaseConfig = {
    apiKey: "AIzaSyBjSPRUgzyQhITpWHb9FdzMMuLS45Zsd9s",
    authDomain: "cipla-impact.firebaseapp.com",
    projectId: "cipla-impact",
    storageBucket: "cipla-impact.appspot.com",
    messagingSenderId: "1009487366735",
    appId: "1:1009487366735:web:1d55b85d23d818bcac383a",
    measurementId: "G-JJY7JWKTV3"
};

firebase.initializeApp(firebaseConfig);

export default firebase;

export const firestore = firebase.firestore();
export const database = firebase.database();
export const analytics = firebase.analytics();
export const auth = firebase.auth();