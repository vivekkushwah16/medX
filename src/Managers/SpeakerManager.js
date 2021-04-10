import { SPEAKERS_COLLECTION } from "../AppConstants/CollectionConstants";
import firebase, { firestore } from "../Firebase/firebase";
var uniqid = require('uniqid');

//social { facebook: '', twitter: '', linkedIn: ''}
const SpeakerManager = {
    makeSpeaker: (name, designation, profileLine = [], photoURL = '', social = {}) => {
        return new Promise(async (res, rej) => {
            try {
                let id = uniqid('speaker-')
                await firestore.collection(SPEAKERS_COLLECTION).doc(id).set({
                    id,
                    name,
                    designation,
                    profileLine,
                    photoURL,
                    social,
                })
                res(id);
            } catch (error) {
                rej(error)
            }
        })
    },
    getSpeaker: (speakerId) => {
        return new Promise(async (res, rej) => {
            try {
                const doc = await firestore.collection(SPEAKERS_COLLECTION).doc(speakerId).get()
                if (!doc.exists) {
                    let err = { code: 'InvalidSpeakerId', message: 'Invalid Speaker Id found.' }
                    throw err;
                }
                res(doc.data());
            } catch (error) {
                rej(error)
            }
        })
    }, 
    completelyUpdateSpeaker: (id, name = null, designation = null, profileLine = [], photoURL = null,social = {}) => {
        return new Promise(async (res, rej) => {
            try {
                const docRef = firestore.collection(SPEAKERS_COLLECTION).doc(id)
                await firestore.runTransaction(async transcation => {
                    let doc = await transcation.get(docRef)
                    if (!doc.exists) {
                        let err = {
                            code: 'NotValidId',
                            message: "No videoID Found"
                        }
                        throw (err)
                    }
                    let oldData = doc.data()
                    transcation.update(docRef, {
                        name: name ? name : oldData.name,
                        designation: designation ? designation : oldData.designation,
                        profileLine: profileLine ? profileLine : oldData.profileLine,
                        photoURL: photoURL ? photoURL : oldData.photoURL,
                        social: social ? social : oldData.social,
                    })
                })
                res();
            } catch (error) {
                rej(error)
            }
        })
    },
}

export default SpeakerManager;