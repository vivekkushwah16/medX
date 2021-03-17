import React, { createContext, useState, useEffect } from 'react';
import { auth } from '../../Firebase/firebase';

export const UserContext = createContext();

const UserContextProvider = (props) => {
    const [user, setUser] = useState(localStorage.getItem('userAuth'));
    const [initalCheck, setInitalCheck] = useState(false)

    useEffect(() => {
        auth.onAuthStateChanged(function (user) {
            if (user) {
                localStorage.setItem('userAuth', JSON.stringify(user))
                setUser(user)
                setInitalCheck(true)
            } else {
                localStorage.removeItem('userAuth')
                setUser(null)
                setInitalCheck(true)
            }
        });
    }, [])

    return (
        <>
            <UserContext.Provider value={{ user: user, initalCheck }}>
                {props.children}
            </UserContext.Provider>
        </>
    );
}
export default UserContextProvider;