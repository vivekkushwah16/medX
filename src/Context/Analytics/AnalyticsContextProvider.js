import React, { createContext, useContext } from 'react'
import firebase, { analytics, database } from '../../Firebase/firebase';
import { UserContext } from '../Auth/UserContextProvider'

export const AnalyticsContext = createContext()

export default function AnalyticsContextProvider(props) {
    const { user, userInfo } = useContext(UserContext);
    console.log("Analytics context update ", userInfo)

    async function addGAWithUserInfo(eventName, data = {}) {
        try {
            console.log(eventName, data, userInfo);
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
            console.log(baseData)
            analytics.logEvent(eventName, { ...baseData, ...data })
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

    return (
        <AnalyticsContext.Provider value={{ addGAWithUserInfo, addCAWithUserInfo }}>
            {props.children}
        </AnalyticsContext.Provider>
    )
}
