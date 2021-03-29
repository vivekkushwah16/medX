import { POLLRESPONSE_COLLECTION, POLL_COLLECTION } from '../AppConstants/CollectionConstants';
import { POLL_STATES } from '../AppConstants/PollStates';
import firebase, { firestore } from '../Firebase/firebase';

var uniqid = require('uniqid');
let pollListenerRef = null
export const PollManager = {
    addPollQuestion: (eventId, index, question, options = []) => {
        return new Promise(async (res, rej) => {
            try {
                let id = uniqid('poll-')
                let docRef = firestore.collection(POLL_COLLECTION).doc(id)
                let optionsObject = options.map((option, index) => ({ id: index, value: option, response: 0 }))

                await docRef.set({
                    options: optionsObject,
                    question: question,
                    index: index,
                    eventId,
                    state: POLL_STATES.showQuestion,
                    totalResponse: 0,
                    id,
                })
                res(id)
            } catch (error) {
                rej(error)
            }
        })
    },
    getPollQuestion: (eventId) => {
        return new Promise(async (res, rej) => {
            try {
                const ref = firestore.collection(POLL_COLLECTION).where('eventId', '==', eventId)
                const query = await ref.get()
                if (query.empty) {
                    res([]);
                }
                let _data = query.docs.map(doc => doc.data())
                res(_data);
            } catch (error) {
                rej(error)
            }
        })
    },
    getPollResponse: (pollId, userId) => {
        return new Promise(async (res, rej) => {
            try {
                const ref = firestore.collection(POLLRESPONSE_COLLECTION).doc(`${userId}+${pollId}`)
                const doc = await ref.get()
                if (doc.exists) {
                    res(doc.data().option);
                } else {
                    res(null);
                }
            } catch (error) {
                rej(error)
            }
        })
    },
    attachPollListener: (eventId, callback = () => console.log("noFunFound")) => {
        const ref = firestore.collection(POLL_COLLECTION).where('eventId', '==', eventId)
        pollListenerRef = ref.onSnapshot(query => {
            if (query.empty) {
                callback([]);
            }
            let _data = query.docs.map(doc => doc.data())
            callback(_data);
        }, err => {
            callback(null, err)
        })
    },
    removePollListener: () => {
        if (pollListenerRef) {
            pollListenerRef()
        }
    },
    addResponse: (eventId, pollId, userId, option) => {
        return new Promise(async (res, rej) => {
            try {
                const pollRef = firestore.collection(POLL_COLLECTION).doc(pollId)
                const responseRef = firestore.collection(POLLRESPONSE_COLLECTION).doc(`${userId}+${pollId}`)
                let id = uniqid('response-')
                await firestore.runTransaction(async transcation => {
                    let doc = await transcation.get(pollRef)
                    let responseDoc = await transcation.get(responseRef)
                    if (responseDoc.exists) {
                        let err = {
                            code: 'AlreadyResponded',
                            message: "Already responded to the current poll."
                        }
                        throw (err)
                    }
                    if (!doc.exists) {
                        let err = {
                            code: 'NotValidId',
                            message: "No Poll Found"
                        }
                        throw (err)
                    }
                    let _option = { ...option }
                    delete _option.response
                    transcation.set(responseRef, {
                        id: id,
                        targetId: pollId,
                        user: userId,
                        eventId: eventId,
                        timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
                        option: _option
                    })

                    const options = doc.data().options
                    options[option.id] = {
                        ...options[option.id],
                        response: parseInt(options[option.id].response) + 1,
                    }
                    transcation.update(pollRef, {
                        options: options,
                        totalResponse: firebase.firestore.FieldValue.increment(1)
                    })
                })
                res();
            } catch (error) {
                rej(error)
            }
        })
    },
    changeAllPollState: (eventId, state = POLL_STATES.hide) => {
        return new Promise(async (res, rej) => {
            try {
                const pollColl = firestore.collection(POLL_COLLECTION)
                const docRef = firestore.collection(POLL_COLLECTION).where('eventId', '==', eventId)
                await firestore.runTransaction(async transcation => {
                    let query = await transcation.get(docRef)
                    if (query.empty) {
                        let er = { code: 'EmptyPoll', message: 'No Poll Found' }
                        throw er
                    }
                    const docIds = query.docs.map(doc => doc.id)
                    for (let i = 0; i < docIds.length; i++) {
                        await pollColl.doc(docIds[i]).update({
                            state,
                        })
                    }
                })
                res();
            } catch (error) {
                rej(error)
            }
        })
    }
}