import React, { createContext, useState, useEffect } from 'react'
import { EVENT_COLLECTION } from '../../AppConstants/CollectionConstants';
import { EVENTDATA_COOKIES, TIMELINEDATA_COOKIES } from '../../AppConstants/CookiesNames';
import { firestore } from '../../Firebase/firebase';
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

    const getEvent = (eventId, forceNewValue = false) => {
        return new Promise(async (res, rej) => {
            try {
                const eventIds = Object.keys(eventData)
                if (!forceNewValue) {
                    if (eventIds.length > 0) {
                        if (eventIds.indexOf(eventId) !== -1) {
                            res(eventData[eventId])
                            return
                        }
                    }
                }

                const _data = await EventManager.getEventWithId(eventId)
                let newData = { ...eventData, [eventId]: _data }
                setEventData(newData)
                setDataInCookies(EVENTDATA_COOKIES, newData)
                res(_data)
            } catch (error) {
                rej(error)
            }
        })

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

    const attachTimelineListener = (eventId, callback) => {
        EventManager.attachTimelineListener(eventId, callback)
    }

    const removeTimelineListener = () => {
        EventManager.removeTimelineListener()
    }

    return (
        <eventContext.Provider value={{ getEvent, getTimelines, attachTimelineListener, removeTimelineListener }}>
            {props.children}
        </eventContext.Provider>
    )
}
