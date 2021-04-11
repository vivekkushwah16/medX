import React, { createContext, useState } from 'react'

export const MediaModalContext = createContext();


export default function MediaModalContextProvider(props) {
    const [modalDetails, setModalDetails] = useState({});
    const [mediaModalStatus, setMediaModalStatus] = useState(false)

    const showMediaModal = (type, link) => {
        setModalDetails({ type, link })
        setMediaModalStatus(true)
    }

    const closeMediaModal = () => {
        setMediaModalStatus(false)
    }

    return (
        <>
            <MediaModalContext.Provider value={{ showMediaModal, closeMediaModal, mediaModalStatus, modalDetails }}>
                {props.children}
            </MediaModalContext.Provider>
        </>
    )
}
