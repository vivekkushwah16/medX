import React, { createContext, useState, useEffect } from 'react'
import { EVENTDATA_COOKIES, TIMELINEDATA_COOKIES } from '../../AppConstants/CookiesNames';
import EventManager from '../../Managers/EventManager';
import { getCookies, saveCookies } from '../../utils/cookiesManager';

export const eventContext = createContext([]);

function getCookiesFromData(name) {
    const value = getCookies(name)
    if (value === "") {
        return {}
    }
    return JSON.parse(value)
}

function setDataInCookies(name, data) {
    saveCookies(name, data, 2);
}

export default function EventContextProvider(props) {
    const [eventData, setEventData] = useState(getCookiesFromData(EVENTDATA_COOKIES))
    const [timelineData, setTimelineData] = useState(getCookiesFromData(TIMELINEDATA_COOKIES))

    const getEvent = async (eventId) => {
        const eventIds = Object.keys(eventData)
        if (eventIds.indexOf(eventId) !== -1) {
            return eventData[eventId]
        } else {
            const _data = await EventManager.getEventWithId(eventId)
            let newData = { ...eventData, [eventId]: _data }
            setEventData(newData)
            setDataInCookies(EVENTDATA_COOKIES, newData)
            return _data;
        }
    }

    const getTimelines = async (eventId) => {
        const eventIds = Object.keys(timelineData)
        if (eventIds.indexOf(eventId) !== -1) {
            return timelineData[eventId]
        } else {
            const _data = await EventManager.getAgenda(eventId)
            let newData = { ...timelineData, [eventId]: _data }
            setTimelineData(newData)
            setDataInCookies(TIMELINEDATA_COOKIES, newData)
            return _data;
        }
    }

    return (
        <eventContext.Provider value={{ getEvent, getTimelines }}>
            {props.children}
        </eventContext.Provider>
    )
}
