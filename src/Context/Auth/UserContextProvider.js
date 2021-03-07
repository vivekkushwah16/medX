import React, { createContext, useState, useEffect } from 'react';
import { auth } from '../../Firebase/firebase';

export const UserContext = createContext();

const UserContextProvider = (props) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        auth.onAuthStateChanged(function (user) {
            if (user) {
                setUser(user)
            } else {
                setUser(null)
            }
        });
    }, [])

    return (
        <>
            <UserContext.Provider value={{ user: user }}>
                {props.children}
            </UserContext.Provider>
        </>
    );
}
export default UserContextProvider;