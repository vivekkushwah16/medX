import React, { createContext, useState, useEffect } from 'react';
import { MEDIAMETADATA_COLLECTION } from '../../AppConstants/CollectionConstants';
import { MediaType } from '../../AppConstants/TypeConstant';
import { analytics, auth, database, getUserProfile, firestore } from '../../Firebase/firebase';
import VideoManager from '../../Managers/VideoManager';

export const UserContext = createContext();

const UserContextProvider = (props) => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('userAuth')));
    const [initalCheck, setInitalCheck] = useState(false)
    const [userInfo, setuserInfo] = useState(false)
    const [mediaMetaData, setMediaMetaData] = useState({})

    useEffect(() => {
        auth.onAuthStateChanged(function (user) {
            if (user) {
                console.log(user.email)
                localStorage.setItem('userAuth', JSON.stringify(user))
                setUser(user)
                setInitalCheck(true)
                addUserLoginAnalytics(user.uid)
            } else {
                localStorage.removeItem('userAuth')
                setUser(null)
                setInitalCheck(true)
            }
        });
    }, [])

    const addUserLoginAnalytics = async (uid) => {
        const userInfo = await getUserProfile(uid)
        let _data = {
            userId: uid,
            country: userInfo.country,
            state: userInfo.state,
            city: userInfo.city,
            date: new Date()
        }
        analytics.logEvent("user_login", _data)
        await database.ref(`/user_login/${uid}_${new Date().getTime()}`).update(_data)
        setuserInfo(userInfo)
    }

    const getVideoMetaData = async (mediaId) => {
        return new Promise((res, rej) => {
            try {
                const mediaMetaIds = Object.keys(mediaMetaData)
                if (mediaMetaIds.indexOf(mediaId) !== -1) {
                    if (!mediaMetaData[mediaId]) {
                        let data = getMediaDoc(mediaId)
                        res(data);
                    }
                    //found in old data
                    res(mediaMetaData[mediaId]);

                } else {
                    let data = getMediaDoc(mediaId)
                    res(data);
                }
            } catch (error) {
                rej(error)
            }
        })

    }

    const setVideoMetaData = async (videoId, lastKnownTimestamp, duration) => {
        return new Promise((res, rej) => {
            try {
                VideoManager.setVideoLastKnownTimestamp(videoId, user.uid, lastKnownTimestamp, duration)
                setMediaMetaData({
                    ...mediaMetaData,
                    [videoId]:
                    {
                        videoId: videoId,
                        userId: user.uid,
                        type: MediaType.VIDEO_MEDIA,
                        lastKnownTimestamp: lastKnownTimestamp,
                        duration: duration
                    }
                })
                res()
            } catch (error) {
                rej(error)
            }
        })
    }

    const getMediaDoc = async (mediaId) => {
        let docId = `${mediaId}_${user.uid}`
        let ref = firestore.collection(MEDIAMETADATA_COLLECTION).doc(docId)
        const doc = await ref.get()
        let data = {}
        if (doc.exists) {
            data = doc.data()
        }
        // console.log(data)
        let newData = { ...mediaMetaData, [mediaId]: data }
        setMediaMetaData(newData)
        return data;
    }

    return (
        <>
            <UserContext.Provider value={{ user: user, initalCheck, userInfo, getVideoMetaData, setVideoMetaData, mediaMetaData}}>
                {props.children}
            </UserContext.Provider>
        </>
    );
}

export default UserContextProvider;