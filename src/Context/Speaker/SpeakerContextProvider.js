import React, { createContext, useState } from "react";
import { SPEAKERDATA_COOKIES } from "../../AppConstants/CookiesNames";
import SpeakerManager from "../../Managers/SpeakerManager";
import { getCookies, saveCookies } from "../../utils/cookiesManager";

export const speakerContext = createContext([]);

function getSpeakerDataFromCookies() {
    const value = getCookies(SPEAKERDATA_COOKIES)
    if (value === "") {
        return {}
    }
    return JSON.parse(value)
}

function setSpeakerDataInCookies(data) {
    saveCookies(SPEAKERDATA_COOKIES, data, 2);
}

export default function SpeakerContextProvider(props) {
    const [speakersData, setSpeakersData] = useState(getSpeakerDataFromCookies())

    const getSpeaker = async (speakerId, forcerRead) => {
        const speakerIds = Object.keys(speakersData)
        if (speakerIds.indexOf(speakerId) !== -1) {
            if(!speakersData[speakerIds]){
                const data = await SpeakerManager.getSpeaker(speakerId)
                let newData = { ...speakersData, [speakerId]: data }
                setSpeakersData(newData)
                setSpeakerDataInCookies(newData)
                return data;
            }
            //found in old data
            return speakersData[speakerIds]
        } else {
            const data = await SpeakerManager.getSpeaker(speakerId)
            // console.log(data)
            let newData = { ...speakersData, [speakerId]: data }
            setSpeakersData(newData)
            setSpeakerDataInCookies(newData)
            return data;
        }
    }

    return (
        <speakerContext.Provider value={{ getSpeaker }}>
            {props.children}
        </speakerContext.Provider>
    )
}
