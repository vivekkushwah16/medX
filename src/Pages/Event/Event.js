import React, { useContext, useEffect, useState } from 'react'
import './Event.css'
import Footer from '../../Containers/Footer/Footer'
import Header from '../../Containers/Header/Header'
import { useParams } from 'react-router-dom'
import EventContainer from '../../Containers/EventContainer/EventContainer'
import { eventContext } from '../../Context/Event/EventContextProvider'

export default function Event() {
    let param = useParams()
    let {
        getEvent, getTimelines,
        attachTrendingDataListener, removeTrendingDataListener,
        getPartnerWithUs, countPartnerWithUsAgree,
        sendQuestion } = useContext(eventContext)
    const [eventData, setEventData] = useState({})
    const [agendaData, setAgendaData] = useState({})
    const [trendingData, setTrendingData] = useState({})
    const [partnerWithUsData, setPartnerWithUsData] = useState({})

    useEffect(() => {
        getEventInfo();
        getAgendaInfo();
        getTrending();
        getPartnerWithUsData();
        return () => {
            removeTrendingDataListener()
        }
    }, [])

    const getEventInfo = async () => {
        try {
            const data = await getEvent(param.id, true)
            setEventData(data)
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

    return (
        <section className="wrapper" id="root">
            <div className="topicsBox__wrapper">

                <Header showCertificate={true} showFeedback={true} />
                {
                    eventData &&
                    <EventContainer id={param.id} data={eventData} agendaData={agendaData} trendingData={trendingData} partnerWithUsData={partnerWithUsData} countPartnerWithUsAgree={countPartnerWithUsAgree} sendQuestion={sendQuestion} />
                }
                <Footer />
            </div>
        </section>
    )
}
