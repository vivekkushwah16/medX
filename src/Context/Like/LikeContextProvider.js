import React, { useState, createContext, useContext } from 'react'
import { LIKES_COLLECTION } from '../../AppConstants/CollectionConstants';
import { LikeType } from '../../AppConstants/TypeConstant';
import { firestore } from '../../Firebase/firebase';
import EventManager from '../../Managers/EventManager';
import VideoManager from '../../Managers/VideoManager';
import { UserContext } from '../Auth/UserContextProvider';

export const likeContext = createContext({});

export default function LikeContextProvider(props) {
    const { user } = useContext(UserContext)
    const [likeData, setLikeData] = useState({});

    const getLike = (tagetId) => {
        return new Promise(async (res, rej) => {
            try {
                if (!user) { res(false) }

                if (likeData.hasOwnProperty(tagetId)) {
                    // console.log(likeData[tagetId],tagetId);
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
                        const count = await VideoManager.addLike(tagetId, user.uid)
                        res(count)
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
                    default:
                        res(false)
                }
            } catch (error) {
                rej(error)
            }
        })
    }

    return (
        <likeContext.Provider value={{ getLike, addLike, removeLike }}>
            {props.children}
        </likeContext.Provider>
    )
}
