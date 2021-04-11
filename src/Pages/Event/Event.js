import React, { useContext, useEffect, useState } from 'react'
import './Event.css'
import Footer from '../../Containers/Footer/Footer'
import Header from '../../Containers/Header/Header'
import { useParams } from 'react-router-dom'
import EventContainer from '../../Containers/EventContainer/EventContainer'
import { eventContext } from '../../Context/Event/EventContextProvider'
import { likeContext } from '../../Context/Like/LikeContextProvider'
import { LikeType } from '../../AppConstants/TypeConstant'
import { isMobileOnly } from 'react-device-detect'
import { AnalyticsContext } from '../../Context/Analytics/AnalyticsContextProvider'
import { database } from '../../Firebase/firebase'
import { SESSION_ATTENDED } from '../../AppConstants/AnalyticsEventName'
import { UserContext } from '../../Context/Auth/UserContextProvider'

export default function Event() {
    let param = useParams()
    let { getTimelines, attachTrendingDataListener, removeTrendingDataListener,
        getPartnerWithUs, countPartnerWithUsAgree,
        sendQuestion, getEventDataListener, removeEventDataListener } = useContext(eventContext)
    const { addGAWithUserInfo, addCAWithUserInfo } = useContext(AnalyticsContext)
    let { getLike, addLike, removeLike, } = useContext(likeContext)
    const { user, userInfo } = useContext(UserContext)
    const [eventData, setEventData] = useState({})
    const [agendaData, setAgendaData] = useState([])
    const [trendingData, setTrendingData] = useState(null)
    const [partnerWithUsData, setPartnerWithUsData] = useState(null)
    const [likedEvent, setLikeEvent] = useState(false)

    useEffect(() => {
        getEventInfo();
        getAgendaInfo();
        getTrending();
        getPartnerWithUsData();

        return () => {
            removeTrendingDataListener()
            removeEventDataListener()
        }
    }, [])

    const getEventInfo = async () => {
        try {
            // const data = await getEvent(param.id, true)
            // setEventData(data)
            getEventDataListener(param.id, (data) => {
                setEventData(data)
            })
            getLike(param.id).then(status => setLikeEvent(status))

        } catch (error) {
            console.log(error)
        }
    }
    const getAgendaInfo = async () => {
        try {
            const data = await getTimelines(param.id)
            setAgendaData(data)
        } catch (error) {
            console.log(error)
        }
    }

    const getTrending = () => {
        try {
            attachTrendingDataListener(param.id, (data) => {
                setTrendingData(data)
            })
        } catch (error) {
            console.log(error)

        }
    }

    const getPartnerWithUsData = async () => {
        try {
            const data = await getPartnerWithUs(param.id)
            setPartnerWithUsData(data)
        } catch (error) {
            console.log(error)
        }
    }

    const handleEventLikeButton = async (event, callback) => {
        if (event) { event.preventDefault(); }
        if (!likedEvent) {
            await addLike(param.id, null, LikeType.EVENT_LIKE)
            setLikeEvent(true)
            if (callback) { callback() }
        } else {
            await removeLike(param.id, null, LikeType.EVENT_LIKE)
            setLikeEvent(false)
            if (callback) { callback() }

        }
    }


    const addClickAnalytics = (eventName) => {
        console.log(userInfo)
        addGAWithUserInfo(eventName, { eventId: param.id })
        addCAWithUserInfo(`/${eventName}`, true, { eventId: param.id }, true)
    }
    return (
        <section className="wrapper" id="root">
            <div className="eventBoxBg"></div>
            <div className="topicsBox__wrapper">
                {
                    isMobileOnly ?
                        <Header showCertificate={false} showFeedback={false} disableFeedback={false} stickyOnScroll={true} />

                        :
                        <Header addClickAnalytics={addClickAnalytics} showCertificate={true} showFeedback={true} disableFeedback={eventData ? !eventData.activeCertificate : false} stickyOnScroll={true} />
                }
                {
                    eventData &&
                    <EventContainer
                        id={param.id}
                        data={eventData} agendaData={agendaData}
                        trendingData={trendingData} partnerWithUsData={partnerWithUsData}
                        countPartnerWithUsAgree={countPartnerWithUsAgree}
                        sendQuestion={sendQuestion}
                        likedEvent={likedEvent}
                        handleEventLikeButton={handleEventLikeButton}
                    />
                }
                {/* <Footer /> */}
            </div>
        </section>
    )
}
