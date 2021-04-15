import { QNA_COLLECTION } from "../AppConstants/CollectionConstants";
import firebase, { firestore } from "../Firebase/firebase";
var uniqid = require('uniqid');
const QNAManager = {
    sendQnAQuestion: (userId, eventId, question, activeTimelineId) => {
        return new Promise(async (res, rej) => {
            try {
                let id = uniqid('qna-')
                let docRef = firestore.collection(QNA_COLLECTION).doc(id)
                await docRef.set({
                    userId,
                    eventId,
                    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                    date: new Date().getTime(),
                    question: question,
                    timelineId: activeTimelineId
                })
                res()
            } catch (error) {
                rej(error)
            }
        })
    },
    getQnaQuestion: (eventId) => {
        return new Promise(async (res, rej) => {
            try {
                let docRef = firestore.collection(QNA_COLLECTION).where('eventId', '==', eventId)
                const query = await docRef.get()
                if (query.empty) {
                    res([])
                }
                let _data = query.docs.map(doc => doc.data())
                res(_data)
            } catch (error) {
                rej(error)
            }
        })
    }
}

export default QNAManager;