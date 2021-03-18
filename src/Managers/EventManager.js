import { EVENT_COLLECTION, LIKES_COLLECTION, TIMELINE_COLLECTION } from "../AppConstants/CollectionConstants";
import { LikeType } from "../AppConstants/TypeConstant";
import firebase, { firestore } from "../Firebase/firebase";
var uniqid = require('uniqid');

const EventManager = {
    addEvent: (title, description = "", videoUrl = "") => {
        return new Promise(async (res, rej) => {
            try {
                let eventId = uniqid('event-')
                await firestore.collection(EVENT_COLLECTION).doc(eventId).set({
                    title,
                    description,
                    videoUrl,
                    id: eventId,
                    tags: [],
                    speakers: [],
                    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                })
                res(eventId);
            } catch (error) {
                rej(error)
            }
        })
    },
    updateEvent: (eventId, title = null, description = null, videoUrl = null) => {
        return new Promise(async (res, rej) => {
            try {
                const docRef = firestore.collection(EVENT_COLLECTION).doc(eventId)
                await firestore.runTransaction(async transcation => {
                    let doc = await transcation.get(docRef)

                    if (!doc.exists) {
                        let err = {
                            code: 'NotValidId',
                            message: "No EventId Found"
                        }
                        throw (err)
                    }
                    let oldData = doc.data()
                    transcation.update(docRef, {
                        title: title ? title : oldData.title,
                        description: description ? description : oldData.description,
                        videoUrl: videoUrl ? videoUrl : oldData.videoUrl,
                    })
                })
                res();
            } catch (error) {
                rej(error)
            }
        })
    },
    addEventTimeLine: (eventId, title = '', description = '', speakerIds = [], startTime, duration = 60) => {
        return new Promise(async (res, rej) => {
            try {
                let id = uniqid('timeline-')
                const docRef = firestore.collection(EVENT_COLLECTION).doc(eventId)
                const timelineRef = firestore.collection(TIMELINE_COLLECTION).doc(id)
                await firestore.runTransaction(async transcation => {
                    let doc = await transcation.get(docRef)
                    if (!doc.exists) {
                        let err = {
                            code: 'NotValidId',
                            message: "No EventId Found"
                        }
                        throw (err)
                    }
                    transcation.set(timelineRef, {
                        title,
                        description,
                        likes: 0,
                        speakers: speakerIds,//[]
                        id: id,
                        startTime: startTime,//timestamp
                        eventId,
                        thumnailUrL: '',
                        videoUrl: '',
                        duration,//in mins
                    })
                })
                res();
            } catch (error) {
                rej(error)
            }
        })
    },
    updateEventTimeLine: (timelineId, title = null, description = null, time = null) => {
        return new Promise(async (res, rej) => {
            try {
                const timelineRef = firestore.collection(TIMELINE_COLLECTION).doc(timelineId)
                await firestore.runTransaction(async transcation => {
                    let doc = await transcation.get(timelineRef)
                    if (!doc.exists) {
                        let err = {
                            code: 'NotValidId',
                            message: "No EventId Found"
                        }
                        throw (err)
                    }
                    let oldData = doc.data()

                    transcation.update(timelineRef, {
                        title: title ? title : oldData.title,
                        description: description ? description : oldData.description,
                        time: time ? time : oldData.time,
                    })
                })
                res();
            } catch (error) {
                rej(error)
            }
        })
    },
    addEventSpeaker: (timelineId, speakerId) => {
        return new Promise(async (res, rej) => {
            try {
                const timelineRef = firestore.collection(TIMELINE_COLLECTION).doc(timelineId)
                await firestore.runTransaction(async transcation => {
                    let doc = await transcation.get(timelineRef)
                    if (!doc.exists) {
                        let err = {
                            code: 'NotValidId',
                            message: "No EventId Found"
                        }
                        throw (err)
                    }
                    transcation.update(timelineRef, {
                        speakers: firebase.firestore.FieldValue.arrayUnion(speakerId)
                    })
                })
                res();
            } catch (error) {
                rej(error)
            }
        })
    },
    removeEventSpeaker: (timelineId, speakerId) => {
        return new Promise(async (res, rej) => {
            try {
                const timelineRef = firestore.collection(TIMELINE_COLLECTION).doc(timelineId)
                await firestore.runTransaction(async transcation => {
                    let doc = await transcation.get(timelineRef)
                    if (!doc.exists) {
                        let err = {
                            code: 'NotValidId',
                            message: "No EventId Found"
                        }
                        throw (err)
                    }
                    transcation.update(timelineRef, {
                        speakers: firebase.firestore.FieldValue.arrayRemove(speakerId)
                    })
                })
                res();
            } catch (error) {
                rej(error)
            }
        })
    },
    addTimelineLike: (timelineId, userId, eventId) => {
        return new Promise(async (res, rej) => {
            try {
                const timelineRef = firestore.collection(TIMELINE_COLLECTION).doc(timelineId)
                const LikeRef = firestore.collection(LIKES_COLLECTION).doc(`${userId}+${timelineId}`)
                let id = uniqid('like-')
                await firestore.runTransaction(async transcation => {
                    let doc = await transcation.get(timelineRef)
                    let likeDoc = await transcation.get(LikeRef)
                    if (likeDoc.exists) {
                        let err = {
                            code: 'AlreadyLiked',
                            message: "This Time has ALready Been Liked"
                        }
                        throw (err)
                    }
                    if (!doc.exists) {
                        let err = {
                            code: 'NotValidId',
                            message: "No EventId Found"
                        }
                        throw (err)
                    }
                    transcation.set(LikeRef, {
                        id: id,
                        targetId: timelineId,
                        type: LikeType.TIMELINE_LIKE,
                        user: userId,
                        eventId: eventId,
                        timeStamp: firebase.firestore.FieldValue.serverTimestamp()
                    })
                    transcation.update(timelineRef, {
                        like: firebase.firestore.FieldValue.increment(1)
                    })
                })
                res();
            } catch (error) {
                rej(error)
            }
        })
    },
    removeTimelineLike: (timelineId, userId) => {
        return new Promise(async (res, rej) => {
            try {
                const timelineRef = firestore.collection(TIMELINE_COLLECTION).doc(timelineId)
                const LikeRef = firestore.collection(LIKES_COLLECTION).doc(`${userId}+${timelineId}`)
                await firestore.runTransaction(async transcation => {
                    let likeDoc = await transcation.get(LikeRef)
                    if (!likeDoc.exists) {
                        let err = {
                            code: 'NoSuchLikeFound',
                            message: "NoSuchLikeFound"
                        }
                        throw (err)
                    }
                    transcation.delete(LikeRef)
                    transcation.update(timelineRef, {
                        like: firebase.firestore.FieldValue.increment(-1)
                    })
                })
                res();
            } catch (error) {
                rej(error)
            }
        })
    },
    addTag: (tag, eventId) => {
        return new Promise(async (res, rej) => {
            try {
                const ref = firestore.collection(EVENT_COLLECTION).doc(eventId)
                await firestore.runTransaction(async transcation => {
                    let doc = await transcation.get(ref)
                    if (!doc.exists) {
                        let err = {
                            code: 'NotValidId',
                            message: "No EventId Found"
                        }
                        throw (err)
                    }
                    transcation.update(ref, {
                        tags: firebase.firestore.FieldValue.arrayUnion(tag.toLowerCase())
                    })
                })
                res();
            } catch (error) {
                rej(error)
            }
        })
    },
    removeTag: (tag, eventId) => {
        return new Promise(async (res, rej) => {
            try {
                const ref = firestore.collection(EVENT_COLLECTION).doc(eventId)
                await firestore.runTransaction(async transcation => {
                    let doc = await transcation.get(ref)
                    if (!doc.exists) {
                        let err = {
                            code: 'NotValidId',
                            message: "No EventId Found"
                        }
                        throw (err)
                    }
                    transcation.update(ref, {
                        tags: firebase.firestore.FieldValue.arrayRemove(tag.toLowerCase())
                    })
                })
                res();
            } catch (error) {
                rej(error)
            }
        })
    },
    getAgenda: (eventId) => {
        return new Promise(async (res, rej) => {
            try {
                const ref = firestore.collection(TIMELINE_COLLECTION).where('eventId', '==', eventId)
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
    getEventWithId: (eventId) => {
        return new Promise(async (res, rej) => {
            try {
                const ref = firestore.collection(EVENT_COLLECTION).doc(eventId)
                await firestore.runTransaction(async transcation => {
                    let doc = await transcation.get(ref)
                    if (!doc.exists) {
                        let err = {
                            code: 'NotValidId',
                            message: "No EventId Found"
                        }
                        throw (err)
                    }
                    res(doc.data())
                })
                res();
            } catch (error) {
                rej(error)
            }
        })
    }
}

export default EventManager;