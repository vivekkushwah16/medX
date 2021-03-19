import { EVENT_COLLECTION, LIKES_COLLECTION, VIDEO_COLLECTION } from '../AppConstants/CollectionConstants';
import { videoSortFilter } from '../AppConstants/Filter';
import { LikeType } from '../AppConstants/TypeConstant';
import firebase, { firestore } from "../Firebase/firebase";
var uniqid = require('uniqid');

// videoTimestamp = [{time:'', title:''}]
//speakers = ['speakersId1',]
const VideoManager = {
    addVideo: (title, description, videoUrl, thumnailUrl, speakers = [], tags = [], videoTimestamp = []) => {
        return new Promise(async (res, rej) => {
            try {
                let eventId = uniqid('video-')
                await firestore.collection(VIDEO_COLLECTION).doc(eventId).set({
                    title,
                    description,
                    thumnailUrl,
                    videoUrl,
                    like: 0,
                    views: 0,
                    videoTimestamp: videoTimestamp,
                    id: eventId,
                    tags: tags,
                    speakers: speakers,
                    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                })
                res(eventId);
            } catch (error) {
                rej(error)
            }
        })
    },
    updateVideo: (videoId, title = null, description = null, videoUrl = null) => {
        return new Promise(async (res, rej) => {
            try {
                const docRef = firestore.collection(VIDEO_COLLECTION).doc(videoId)
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
    addVideoSpeaker: (videoId, speakerId) => {
        return new Promise(async (res, rej) => {
            try {
                const docRef = firestore.collection(VIDEO_COLLECTION).doc(videoId)
                await firestore.runTransaction(async transcation => {
                    let doc = await transcation.get(docRef)
                    if (!doc.exists) {
                        let err = {
                            code: 'NotValidId',
                            message: "No videoID Found"
                        }
                        throw (err)
                    }
                    transcation.update(docRef, {
                        speakers: firebase.firestore.FieldValue.arrayUnion(speakerId)
                    })
                })
                res();
            } catch (error) {
                rej(error)
            }
        })
    },
    removeVideoSpeaker: (videoId, speakerId) => {
        return new Promise(async (res, rej) => {
            try {
                const docRef = firestore.collection(VIDEO_COLLECTION).doc(videoId)
                await firestore.runTransaction(async transcation => {
                    let doc = await transcation.get(docRef)
                    if (!doc.exists) {
                        let err = {
                            code: 'NotValidId',
                            message: "No videoID Found"
                        }
                        throw (err)
                    }
                    transcation.update(docRef, {
                        speakers: firebase.firestore.FieldValue.arrayRemove(speakerId)
                    })
                })
                res();
            } catch (error) {
                rej(error)
            }
        })
    },
    addLike: (videoId, userId, eventId) => {
        return new Promise(async (res, rej) => {
            try {
                const docRef = firestore.collection(VIDEO_COLLECTION).doc(videoId)
                const LikeRef = firestore.collection(LIKES_COLLECTION).doc(`${userId}+${videoId}`)
                let id = uniqid('like-')
                await firestore.runTransaction(async transcation => {
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
                        type: LikeType.VIDEO_LIKE,
                        user: userId,
                        eventId: eventId,
                        timeStamp: firebase.firestore.FieldValue.serverTimestamp()
                    })
                    transcation.update(docRef, {
                        likes: firebase.firestore.FieldValue.increment(1)
                    })
                })
                res();
            } catch (error) {
                rej(error)
            }
        })
    },
    removeLike: (videoId, userId) => {
        return new Promise(async (res, rej) => {
            try {
                const docRef = firestore.collection(VIDEO_COLLECTION).doc(videoId)
                const LikeRef = firestore.collection(LIKES_COLLECTION).doc(`${userId}+${videoId}`)
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
                    transcation.update(docRef, {
                        likes: firebase.firestore.FieldValue.increment(-1)
                    })
                })
                res();
            } catch (error) {
                rej(error)
            }
        })
    },
    addView: (videoId) => {
        return new Promise(async (res, rej) => {
            try {
                const docRef = firestore.collection(VIDEO_COLLECTION).doc(videoId)
                await firestore.runTransaction(async transcation => {
                    let doc = await transcation.get(docRef)
                    if (!doc.exists) {
                        let err = {
                            code: 'NotValidId',
                            message: "No EventId Found"
                        }
                        throw (err)
                    }
                    transcation.update(docRef, {
                        views: firebase.firestore.FieldValue.increment(1)
                    })
                })
                res();
            } catch (error) {
                rej(error)
            }
        })
    },
    addTag: (videoId, tag) => {
        return new Promise(async (res, rej) => {
            try {
                const ref = firestore.collection(VIDEO_COLLECTION).doc(videoId)
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
    removeTag: (videoId, tag) => {
        return new Promise(async (res, rej) => {
            try {
                const ref = firestore.collection(EVENT_COLLECTION).doc(videoId)
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
    updateVideoTimestamp: (videoId, videoTimestamp) => {
        return new Promise(async (res, rej) => {
            try {
                const docRef = firestore.collection(VIDEO_COLLECTION).doc(videoId)
                await firestore.runTransaction(async transcation => {
                    let doc = await transcation.get(docRef)
                    if (!doc.exists) {
                        let err = {
                            code: 'NotValidId',
                            message: "No videoID Found"
                        }
                        throw (err)
                    }
                    transcation.update(docRef, {
                        videoTimestamp: videoTimestamp
                    })
                })
                res();
            } catch (error) {
                rej(error)
            }
        })
    },
    getVideoWithTag: (tag = [], limit = 10, docRefToStartFrom = null, filter = videoSortFilter.date) => {
        return new Promise(async (res, rej) => {
            try {
                let docRef = firestore
                    .collection(VIDEO_COLLECTION)

                const lowerCasedTag = tag.map(t => t.toLowerCase())

                if (tag.length > 0) {
                    docRef = docRef.where('tags', 'array-contains-any', lowerCasedTag)
                }

                console.log(filter)
                // switch (filter) {
                //     case videoSortFilter.date:
                //         docRef = docRef.orderBy('timeStamp');
                //         break;
                //     case videoSortFilter.AtoZ:
                //         docRef = docRef.orderBy('name', 'asc');
                //         break;
                //     case videoSortFilter.ZtoA:
                //         docRef = docRef.orderBy('name', 'desc');
                //         break;
                //     default:
                //         docRef = docRef.orderBy('timeStamp')
                // }


                if (docRefToStartFrom !== null)
                    docRef = docRef.startAfter(docRefToStartFrom)

                docRef = docRef.limit(limit)
                const query = await docRef.get()
                console.log(query)
                if (query.empty) {
                    res([]);
                }
                let _data = []
                query.docs.forEach(doc => {
                    _data.push(doc.data())
                })
                res(_data);
            } catch (error) {
                rej(error)
            }
        })
    },
    getVideoWithId: (videoId) => {
        return new Promise(async (res, rej) => {
            try {
                const ref = firestore.collection(VIDEO_COLLECTION).doc(videoId)
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

export default VideoManager;