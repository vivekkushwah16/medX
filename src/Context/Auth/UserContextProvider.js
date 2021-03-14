import React, { createContext, useState, useEffect } from 'react';
import { auth } from '../../Firebase/firebase';

export const UserContext = createContext();

const UserContextProvider = (props) => {
    const [user, setUser] = useState(null);
    const [initalCheck, setInitalCheck] = useState(false)

    useEffect(() => {
        auth.onAuthStateChanged(function (user) {
            if (user) {
                setUser(user)
                setInitalCheck(true)
            } else {
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