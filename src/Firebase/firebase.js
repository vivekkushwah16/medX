import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/database';
import 'firebase/analytics';
import 'firebase/functions';

import { PROFILE_COLLECTION } from '../AppConstants/CollectionConstants';

const firebaseConfig = {
    apiKey: "AIzaSyBjSPRUgzyQhITpWHb9FdzMMuLS45Zsd9s",
    authDomain: "cipla-impact.firebaseapp.com",
    databaseURL: "https://cipla-impact-default-rtdb.firebaseio.com",
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
export const cloudFunction = firebase.app().functions('asia-south1')
// export const cloudFunction = firebase.functions().useEmulator("localhost", 4000);

export const logout = () => {
    firebase.auth().signOut()
        .then(function () {
            // Sign-out successful.
        }).catch(function (error) {
            // An error happened.
        });
}

export const getUserProfile = (uid) => {
    return new Promise(async (res, rej) => {
        try {
            const doc = await firestore.collection(PROFILE_COLLECTION).doc(uid).get()
            if (doc.exists) {
                res(doc.data())
            } else {
                res({})
            }
        } catch (error) {
            rej(error)
        }
    })
}

export const copyFromRealtoFirestore = () => {
    try {
        //1. read from db first
        const path = '/user_registered'
        database.ref(path).once('value', (async snapShot => {
            if (snapShot.exists()) {
                const val = snapShot.val()
                const regIds = Object.keys(val)
                for (let i = 0; i < regIds.length; i++) {
                    let regId = regIds[i]
                    let value = val[regId]
                    //2. check if entry have a valid movile number
                    if (value.hasOwnProperty('phoneNumber')) {
                        //3. QUERY FIRESTORE    
                        const _docRef = firestore.collection(PROFILE_COLLECTION).where("phoneNumber", "==", value['phoneNumber'])
                        //4.prepare date
                        const dateTimestamp = new Date(value.date).getTime()
                        //5. update date
                        const query = await _docRef.get()
                        if (!query.empty) {
                            let _doc_id = query.docs[0].id
                            await firestore.collection(PROFILE_COLLECTION).doc(_doc_id).update({
                                date: dateTimestamp
                            })
                        }
                        console.log(dateTimestamp, value.phoneNumber, "Updated")
                    }
                }
            }
        }), (err) => {

        })
    } catch (error) {
        console.log(error)
    }
}
