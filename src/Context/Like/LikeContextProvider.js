import React, { useState, createContext, useContext } from 'react'
import { LIKES_COLLECTION, RATING_COLLECTION } from '../../AppConstants/CollectionConstants';
import { LikeType } from '../../AppConstants/TypeConstant';
import { firestore } from '../../Firebase/firebase';
import EventManager from '../../Managers/EventManager';
import VideoManager from '../../Managers/VideoManager';
import { UserContext } from '../Auth/UserContextProvider';

export const likeContext = createContext({});

export default function LikeContextProvider(props) {
    const { user } = useContext(UserContext)
    const [likeData, setLikeData] = useState({});
    const [RatingData, setRatingData] = useState({});


    const getLike = (tagetId) => {
        return new Promise(async (res, rej) => {
            try {
                if (!user) { res(false) }

                if (likeData.hasOwnProperty(tagetId)) {
                    res(likeData[tagetId])
                } else {
                    const doc = await firestore.collection(LIKES_COLLECTION).doc(`${user.uid}+${tagetId}`).get()
                    if (doc.exists) {
                        setLikeData({ ...likeData, [tagetId]: true })
                        res(true)
                    } else {
                        setLikeData({ ...likeData, [tagetId]: false })
                        res(false)
                    }
                }
            } catch (error) {
                rej(error)
            }
        })

    }

    const getRating = (tagetId) => {
        return new Promise(async (res, rej) => {
            try {
                if (!user) { res(false) }

                if (RatingData.hasOwnProperty(tagetId)) {
                    res(RatingData[tagetId])
                } else {
                    const doc = await firestore.collection(RATING_COLLECTION).doc(`${user.uid}+${tagetId}`).get()
                    if (doc.exists) {
                        setRatingData({ ...RatingData, [tagetId]: doc.data().rating })
                        res(doc.data().rating)
                    } else {
                        setRatingData({ ...RatingData, [tagetId]: 0 })
                        res(0)
                    }
                }
            } catch (error) {
                rej(error)
            }
        })
    }

    const updateRating = (tagetId, eventId, rating) => {
        return new Promise(async (res, rej) => {
            try {
                if (!user) { return false }
                const ref = firestore.collection(RATING_COLLECTION).doc(`${user.uid}+${tagetId}`)
                await firestore.runTransaction(async transcation => {
                    const doc = transcation.get(ref)
                    if (!doc.exits) {
                        transcation.set(ref, {
                            tagetId: tagetId,
                            eventId: eventId,
                            rating: rating,
                            userId: user.uid
                        })
                    } else {
                        transcation.update(ref, {
                            tagetId: tagetId,
                            eventId: eventId,
                            rating: rating,
                            userId: user.uid
                        })
                    }
                })
                res()
            } catch (error) {
                rej(error)
            }
        });
    }

    const addLike = async (tagetId, eventId, likeType) => {
        return new Promise(async (res, rej) => {
            try {
                if (!user) { return false }
                switch (likeType) {
                    case LikeType.TIMELINE_LIKE:
                        await EventManager.addTimelineLike(tagetId, user.uid, eventId)
                        res(true)
                        break;
                    case LikeType.VIDEO_LIKE:
                        let count = await VideoManager.addLike(tagetId, user.uid)
                        res(count)
                        break;
                    case LikeType.EVENT_LIKE:
                        let _count = await EventManager.addLike(tagetId, user.uid)
                        res(_count)
                        break;
                    default:
                        res(false)
                }
            } catch (error) {
                rej(error)
            }
        });
    }

    const removeLike = async (tagetId, eventId, likeType) => {
        return new Promise(async (res, rej) => {
            try {
                if (!user) { return false }
                switch (likeType) {
                    case LikeType.TIMELINE_LIKE:
                        await EventManager.removeTimelineLike(tagetId, user.uid)
                        res(true)
                        break;
                    case LikeType.VIDEO_LIKE:
                        const count = await VideoManager.removeLike(tagetId, user.uid)
                        res(count)
                        break;
                    case LikeType.EVENT_LIKE:
                        let _count = await EventManager.removeLike(tagetId, user.uid)
                        res(_count)
                        break;
                    default:
                        res(false)
                }
            } catch (error) {
                rej(error)
            }
        })
    }

    return (
        <likeContext.Provider value={{ getLike, addLike, removeLike, getRating, updateRating }}>
            {props.children}
        </likeContext.Provider>
    )
}
