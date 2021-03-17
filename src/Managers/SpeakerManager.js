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
                res();
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
}

export default SpeakerManager;