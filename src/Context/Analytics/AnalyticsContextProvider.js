import React, { createContext, useContext, useEffect, useState } from 'react'
import { UPDATE_USER_STAUS } from '../../AppConstants/CloudFunctionName';
import { MonthName } from '../../AppConstants/Months';
import firebase, { analytics, cloudFunction, database } from '../../Firebase/firebase';
import { UserContext } from '../Auth/UserContextProvider'
var uniqid = require('uniqid');

export const AnalyticsContext = createContext()

function getSessonId(uid) {
    return uniqid(`${uid}-`)
}

export default function AnalyticsContextProvider(props) {
    const { user, userInfo } = useContext(UserContext);
    const [sessionId, setSessionId] = useState(null)

    useEffect(() => {
        if (user) {
            setSessionId(getSessonId(user.uid))
        } else {
            setSessionId(null)
        }

    }, [user])

    async function addGAWithUserInfo(eventName, data = {}) {
        try {
            // console.log(eventName, data, userInfo);
            if (!userInfo) {
                console.error("No UsrInfo Found")
                return
            }
            let baseData = {
                userId: user.uid,
                profession: userInfo.profession,
                speciality: userInfo.speciality,
                country: userInfo.country,
                state: userInfo.state,
                city: userInfo.city,
                date: new Date(),
                dateTimeStamp: new Date().getTime()
            }
            let wholeData = { ...baseData, ...data }
            // console.log(wholeData)
            analytics.logEvent(eventName, wholeData)
        } catch (error) {
            console.log(error)
        }
    }

    //customIncDetails = {name, value}
    const addCAWithUserInfo = async (path, addUid, data = {}, countInc = false, customIncDetails) => {
        if (!userInfo) {
            console.error("No UsrInfo Found")
            return
        }
        let baseData = {
            userId: user.uid,
            email: userInfo.email,
            phoneNumber: userInfo.phoneNumber,
            firstName: userInfo.firstName,
            lastName: userInfo.lastName,
            profession: userInfo.profession,
            speciality: userInfo.speciality,
            country: userInfo.country,
            state: userInfo.state,
            city: userInfo.city,
            date: new Date()
        }
        if (addUid)
            path += `/${user.uid}`

        if (countInc) {
            baseData = {
                ...baseData,
                count: firebase.database.ServerValue.increment(1)
            }
        }

        if (customIncDetails) {
            baseData = {
                ...baseData,
                [customIncDetails.name]: firebase.database.ServerValue.increment(customIncDetails.value)
            }
        }

        await database.ref(path).update({
            ...baseData,
            ...data,
            timestamp: firebase.database.ServerValue.TIMESTAMP
        })
    }

    //Add Cloud Function based Analytics
    //sessionId , timestamps, date
    const updateUserStatus = async (eventId, timelineId, timespent) => {
        try {
            
            if (!sessionId) {
                console.error("SessionId is null")
                return
            }
            if (!user) {
                console.error("userNotLogged")
                return
            }
            if (!userInfo) {
                console.error("No info about user Found")
                return
            }

            var currentDate = new Date();
            let dateString = `${currentDate.getDate()} ${MonthName[currentDate.getMonth()]} ${currentDate.getFullYear()} 00:00:00`
            // console.log(dateString)
            var dateTimeStamp = new Date(dateString).getTime()
            let _sessionId = sessionId
            if (!_sessionId) {
                _sessionId = getSessonId(user.uid)
                setSessionId(_sessionId)
            }

            let _data = {
                userId: user.uid,
                // basic info
                firstName: userInfo.firstName,
                lastName: userInfo.lastName,
                email: userInfo.email,
                phoneNumber: userInfo.phoneNumber,
                profession: userInfo.profession,
                speciality: userInfo.speciality,
                country: userInfo.country,
                state: userInfo.state,
                city: userInfo.city,
                dateString: `${currentDate.getDate()}-${currentDate.getMonth()+1}-${currentDate.getFullYear()}`,
                //event based info
                eventId, timelineId, timespent,
                timestamp: currentDate.getTime(),
                date: dateTimeStamp,
                sessionId: _sessionId,
            }
            // console.log(_data)
            // dummyFunction(_data, user.uid)
            const cloudRef = cloudFunction.httpsCallable(UPDATE_USER_STAUS)
            cloudRef(JSON.stringify(_data)).then((res) => {
                console.log(res)
            }).catch(err => {
                console.log(err);
            })
            // const res = await cloudRef(JSON.stringify(_data))
            // console.log(res)
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <AnalyticsContext.Provider value={{ addGAWithUserInfo, addCAWithUserInfo, updateUserStatus }}>
            {props.children}
        </AnalyticsContext.Provider>
    )
}
