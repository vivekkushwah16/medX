import React, { createContext, useState, useEffect } from 'react';
import { analytics, auth, database, getUserProfile } from '../../Firebase/firebase';

export const UserContext = createContext();

const UserContextProvider = (props) => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('userAuth')));
    const [initalCheck, setInitalCheck] = useState(false)
    const [userInfo, setuserInfo] = useState(false)


    useEffect(() => {
        auth.onAuthStateChanged(function (user) {
            if (user) {
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

    return (
        <>
            <UserContext.Provider value={{ user: user, initalCheck, userInfo }}>
                {props.children}
            </UserContext.Provider>
        </>
    );
}
export default UserContextProvider;