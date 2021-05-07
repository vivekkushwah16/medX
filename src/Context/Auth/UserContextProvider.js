import React, { createContext, useState, useEffect } from 'react';
import { BACKSTAGE_COLLECTION, MEDIAMETADATA_COLLECTION, NOTICEBOARD_COLLECTION, PLATFORM_BACKSTAGE_DOC } from '../../AppConstants/CollectionConstants';
import { MediaType } from '../../AppConstants/TypeConstant';
import firebase, { analytics, auth, database, getUserProfile, firestore } from '../../Firebase/firebase';
import VideoManager from '../../Managers/VideoManager';

export const UserContext = createContext();

const UserContextProvider = (props) => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('userAuth')));
    const [initalCheck, setInitalCheck] = useState(false)
    const [userInfo, setuserInfo] = useState(false)
    const [mediaMetaData, setMediaMetaData] = useState({})

    useEffect(() => {
        // firestore.collection(BACKSTAGE_COLLECTION).doc(PLATFORM_BACKSTAGE_DOC).onSnapshot((doc) => {
        //     if (!doc.exists) {
        //         console.log("backstagePlatform doc not exists")
        //     }
        //     const data = doc.data()
        //     localStorage.setItem('platformData', JSON.stringify(data))
        //     setPlatformData(data)
        // })

        auth.onAuthStateChanged(async (user) => {
            if (user) {
                console.log(user)
                window.user = user
                localStorage.setItem('userAuth', JSON.stringify(user))
                setUser(user)
                setInitalCheck(true)
                analytics.setUserId(user.uid)
                addUserLoginAnalytics(user.uid)
                // const userInfo = await getUserProfile(user.uid)
                // console.log(userInfo)
                // setuserInfo(userInfo)
            } else {
                localStorage.removeItem('userAuth')
                setUser(null)
                setInitalCheck(true)
            }
        });
    }, [])

    const addUserLoginAnalytics = async (uid) => {
        const userInfo = await getUserProfile(uid)
        setuserInfo(userInfo)
        console.log(userInfo);
        let _data = {
            userId: uid,
            profession: userInfo.profession,
            speciality: userInfo.speciality,
            country: userInfo.country,
            state: userInfo.state,
            city: userInfo.city,
            date: new Date()
        }
        analytics.logEvent("user_login", _data)
        // /user_login/${uid}_${new Date().getTime()}
        await database.ref(`/user_login/${uid}`).update({
            ..._data,
            email: userInfo.email,
            phoneNumber: userInfo.phoneNumber,
            firstName: userInfo.firstName,
            lastName: userInfo.lastName,
            loginTimestamp: firebase.database.ServerValue.TIMESTAMP
        })
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

    const isVerifiedUser = () => {
        return new Promise(async (res, rej) => {
            try {
                if (!userInfo) {
                    const __userInfo = await getUserProfile(user.uid)
                    setuserInfo(__userInfo)
                    res(__userInfo.verified)
                } else {
                    res(userInfo.verified)
                }
            } catch (error) {
                rej(error)
            }
        })
    }

    const forceUpdateUserInfo = async () => {
        return new Promise(async (res, rej) => {
            try {
                const __userInfo = await getUserProfile(user.uid)
                setuserInfo(__userInfo)
                res()
            } catch (error) {
                rej(error)
            }
        })
    }

    return (
        <>
            <UserContext.Provider value={{ user: user, initalCheck, userInfo, getVideoMetaData, setVideoMetaData, mediaMetaData, isVerifiedUser, forceUpdateUserInfo }}>
                {props.children}
            </UserContext.Provider>
        </>
    );
}

export default UserContextProvider;