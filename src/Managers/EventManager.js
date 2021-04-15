import { EVENT_COLLECTION, LIKES_COLLECTION, PARTNERWITHUSAGREE_COLLECTION, PARTNERWITHUS_COLLECTION, TIMELINE_COLLECTION, TRENDINGITEM_COLLECTION } from "../AppConstants/CollectionConstants";
import { LikeType } from "../AppConstants/TypeConstant";
import firebase, { firestore } from "../Firebase/firebase";
var uniqid = require('uniqid');

let trendingListenerRef = null;
let eventListenerRef = null;

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
                    activeTimelineId: null,
                    activeCertificate: true,
                    likes: 0,
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
                        timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
                        date: new Date().getTime(),
                    })
                    transcation.update(timelineRef, {
                        likes: firebase.firestore.FieldValue.increment(1)
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
                        likes: firebase.firestore.FieldValue.increment(-1)
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
    attachTimelineListener: (eventId, callback) => {
        window.eventTimeline = firestore.collection(TIMELINE_COLLECTION).where('eventId', '==', eventId).onSnapshot(snapshot => {
            if (snapshot.empty) {
                if (callback) {
                    callback([])
                }
                return
            }
            let _data = snapshot.docs.map(doc => doc.data())
            if (callback) {
                callback(_data)
            }
            return
        }, err => {
            if (callback) {
                callback(null, err)
            }
        })
    },
    removeTimelineListener: () => {
        if (window.eventTimeline) {
            window.eventTimeline()
        }
    },
    getEventWithId: (eventId) => {
        return new Promise(async (res, rej) => {
            try {
                const ref = firestore.collection(EVENT_COLLECTION).doc(eventId)
                let doc = await ref.get()
                if (!doc.exists) {
                    let err = {
                        code: 'NotValidId',
                        message: "No EventId Found"
                    }
                    throw (err)
                }
                res(doc.data())
            } catch (error) {
                rej(error)
            }
        })
    },
    addTrendingItem: (eventId, type, title = "", description = "", link, thumbnailUrl = "", disabled = true) => {
        return new Promise(async (res, rej) => {
            try {
                let itemId = uniqid('trending-')
                await firestore.collection(TRENDINGITEM_COLLECTION).doc(itemId).set({
                    itemId,
                    type,
                    title: title ? title : "",
                    description: description ? description : "",
                    eventId,
                    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                    link,
                    thumbnailUrl: thumbnailUrl ? thumbnailUrl : "",
                    disabled
                })
                res(itemId);
            } catch (error) {
                rej(error)
            }
        })
    },
    removeTrendingItem: (itemId) => {
        return new Promise(async (res, rej) => {
            try {
                await firestore.collection(TRENDINGITEM_COLLECTION).doc(itemId).delete()
                res();
            } catch (error) {
                rej(error)
            }
        })
    },
    disableTrendingItem: (itemId) => {
        return new Promise(async (res, rej) => {
            try {
                await firestore.collection(TRENDINGITEM_COLLECTION).doc(itemId).update({
                    disabled: true
                })
                res();
            } catch (error) {
                rej(error)
            }
        })
    },
    enableTrendingItem: (itemId) => {
        return new Promise(async (res, rej) => {
            try {
                await firestore.collection(TRENDINGITEM_COLLECTION).doc(itemId).update({
                    disabled: false
                })
                res();
            } catch (error) {
                rej(error)
            }
        })
    },
    getTrending: (eventId) => {
        return new Promise(async (res, rej) => {
            try {
                const ref = firestore.collection(TRENDINGITEM_COLLECTION).where('eventId', '==', eventId)
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
    attachTrendingListener: (eventId, callback) => {
        trendingListenerRef = firestore.collection(TRENDINGITEM_COLLECTION).where('eventId', '==', eventId).onSnapshot(snapshot => {
            if (snapshot.empty) {
                if (callback) {
                    callback([])
                }
                return
            }
            let _data = snapshot.docs.map(doc => doc.data())
            if (callback) {
                callback(_data)
            }
            return
        }, err => {
            if (callback) {
                callback(null, err)
            }
        })
    },
    removeTrendingListener: () => {
        if (trendingListenerRef) { trendingListenerRef() }
    },
    addPartnerWithUs: (eventId, title = "", description = "", subTitle = "", subDesciption = "", thumbnailUrl = "") => {
        return new Promise(async (res, rej) => {
            try {
                let id = uniqid('partnerWithUs-')
                await firestore.collection(PARTNERWITHUS_COLLECTION).doc(id).set({
                    id,
                    title: title ? title : "",
                    description: description ? description : "",
                    subTitle: subTitle ? subTitle : "",
                    subDesciption: subDesciption ? subDesciption : "",
                    eventId,
                    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                    thumbnailUrl: thumbnailUrl ? thumbnailUrl : "",
                    disabled: false
                })
                res(id);
            } catch (error) {
                rej(error)
            }
        })
    },
    getPartnerWithUs: (eventId) => {
        return new Promise(async (res, rej) => {
            try {
                const ref = firestore.collection(PARTNERWITHUS_COLLECTION).where('eventId', '==', eventId)
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
    addPartnerWithUsInput: (eventId, id, userId) => {
        return new Promise(async (res, rej) => {
            try {
                const partnerDocRef = firestore.collection(PARTNERWITHUS_COLLECTION).doc(id)
                const LikeRef = firestore.collection(PARTNERWITHUSAGREE_COLLECTION).doc(`${userId}+${id}`)
                await firestore.runTransaction(async transcation => {
                    let doc = await transcation.get(partnerDocRef)
                    let likeDoc = await transcation.get(LikeRef)
                    if (likeDoc.exists) {
                        let err = {
                            code: 'AlreadyAgreed',
                            message: "Already counted you in."
                        }
                        throw (err)
                    }
                    if (!doc.exists) {
                        let err = {
                            code: 'NotValidId',
                            message: "No partnerWithUs Data Found"
                        }
                        throw (err)
                    }
                    transcation.set(LikeRef, {
                        id: `${userId}+${id}`,
                        targetId: id,
                        user: userId,
                        eventId: eventId,
                        timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
                        date: new Date().getTime(),
                    })
                    transcation.update(partnerDocRef, {
                        agreedCount: firebase.firestore.FieldValue.increment(1)
                    })
                })
                res();
            } catch (error) {
                rej(error)
            }
        })
    },
    checkForAlreadyAgreedPartner: (id, uid) => {
        return new Promise(async (res, rej) => {
            try {
                const LikeRef = firestore.collection(PARTNERWITHUSAGREE_COLLECTION).doc(`${uid}+${id}`)
                await firestore.runTransaction(async transcation => {
                    const doc = await transcation.get(LikeRef)
                    if (doc.exists) {
                        res(doc.data())
                    }
                    else {
                        res(null)
                    }
                })
            } catch (error) {
                rej(error)
            }
        })
    },
    addEventDataListener: (eventId, callback) => {
        try {
            const ref = firestore.collection(EVENT_COLLECTION).doc(eventId)
            ref.onSnapshot(doc => {
                if (!doc.exists) {
                    let err = {
                        code: 'NotValidId',
                        message: "No EventId Found"
                    }
                    throw (err)
                }
                if (callback) { callback(doc.data()) }
            })
        } catch (error) {
            if (callback) { callback(null, error) }
        }
    },
    removeEventDataListener: () => {
        if (eventListenerRef) {
            eventListenerRef();
        }
    },
    addLike: (eventId, userId) => {
        return new Promise(async (res, rej) => {
            try {
                const docRef = firestore.collection(EVENT_COLLECTION).doc(eventId)
                const LikeRef = firestore.collection(LIKES_COLLECTION).doc(`${userId}+${eventId}`)
                let id = uniqid('like-')
                const like = await firestore.runTransaction(async transcation => {
                    let doc = await transcation.get(docRef)
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
                        targetId: eventId,
                        type: LikeType.EVENT_LIKE,
                        user: userId,
                        timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
                        date: new Date().getTime(),
                    })
                    transcation.update(docRef, {
                        likes: firebase.firestore.FieldValue.increment(1)
                    })

                    return doc.data().likes ? doc.data().likes + 1 : 1
                })
                res(like);
            } catch (error) {
                rej(error)
            }
        })
    },
    removeLike: (eventId, userId) => {
        return new Promise(async (res, rej) => {
            try {
                const docRef = firestore.collection(EVENT_COLLECTION).doc(eventId)
                const LikeRef = firestore.collection(LIKES_COLLECTION).doc(`${userId}+${eventId}`)
                const count = await firestore.runTransaction(async transcation => {
                    let likeDoc = await transcation.get(LikeRef)
                    if (!likeDoc.exists) {
                        let err = {
                            code: 'NoSuchLikeFound',
                            message: "NoSuchLikeFound"
                        }
                        throw (err)
                    }
                    let mainDoc = await transcation.get(docRef)
                    transcation.delete(LikeRef)
                    transcation.update(docRef, {
                        likes: firebase.firestore.FieldValue.increment(-1)
                    })
                    console.log(mainDoc.data())
                    return mainDoc.data().likes ? mainDoc.data().likes - 1 : 0
                })
                res(count);
            } catch (error) {
                rej(error)
            }
        })
    },
}

export default EventManager;