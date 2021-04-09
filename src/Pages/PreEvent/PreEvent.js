import React, { useContext, useState, useEffect } from 'react'
import VideoModal from '../../Components/VideoModal/VideoModal'
import { eventContext } from '../../Context/Event/EventContextProvider';
import Agenda from '../../Components/Event/Agenda/Agenda';
import Header from '../../Containers/Header/Header';
import AddToCalendar from '../../Components/AddToCalendar/AddToCalendar';
import { MediaModalContext } from '../../Context/MedialModal/MediaModalContextProvider';
import { MediaModalType } from '../../AppConstants/ModalType';
import { AnalyticsContext } from '../../Context/Analytics/AnalyticsContextProvider';
import { WATCHTRAILER_ANALYTICS_EVENT } from '../../AppConstants/AnalyticsEventName';
import { MonthName } from '../../AppConstants/Months';
import AgendaNavBar from '../../Components/Event/AgendaNavBar/AgendaNavBar';
import AgendaCard from '../../Components/AgendaCard/AgendaCard';
import './PreEvent.css'

function PreEvent() {
    const { showMediaModal } = useContext(MediaModalContext)
    const [agendaData, setAgendaData] = useState(null);
    const [agendaDates, setAgendaDates] = useState([]);
    const [cureentAgendaDate, setCureentAgendaDate] = useState(null);
    const { attachTimelineListener, removeTimelineListener } = useContext(eventContext)
    const { addGAWithUserInfo, addCAWithUserInfo } = useContext(AnalyticsContext)

    useEffect(() => {
        getAgendaData('event-kmde59n5')
        return () => {
            removeTimelineListener()
        }
    }, [])

    const getAgendaData = async (eventId) => {
        attachTimelineListener(eventId, (data, err) => {
            if (err) {
                console.log(err)
                return
            }
            processAgendaData(data)
            // setAgendaData(data)
        })
    }

    const processAgendaData = (data) => {
        let newData = {}
        data.forEach((timeline) => {
            let date = `${MonthName[new Date(timeline.startTime).getMonth()]} ${new Date(timeline.startTime).getDate()}`
            if (newData.hasOwnProperty(date)) {
                newData = {
                    ...newData,
                    [date]: [...newData[date], timeline]
                }
            } else {
                newData = {
                    ...newData,
                    [date]: [timeline]
                }
            }
        })
        let dates = Object.keys(newData)
        setAgendaDates(dates)
        setCureentAgendaDate(dates[0])
        setAgendaData(newData)
    }

    const startVideo = (link) => {
        console.log(link)
        showMediaModal(MediaModalType.Videos, link)
        // setVideoModalVisible(true)
    }

    const handleDateChange = (date, event) => {
        if (event) { event.preventDefault() }
        setCureentAgendaDate(date)
    }

    return (
        <>
            <section class="wrapper" id="root">
                {/* topicsBox__wrapper */}
                <div class="min-height-full gradient-bg3 ">
                    {/* Header */}
                    <Header />
                    <div class="login2Box__left">

                        {/* BannerBox */}
                        <div class="bannerBox">
                            <div class="bannerBox__inner bannerBox__inner--small bannerBox__inner4 gradient-bg1">
                                <div class="bannerBox__slide">
                                    <div class="container">
                                        <div class="d-flex justify-content-between pd-b10 pd-t60 pd-l60 pd-md-b0 pd-md-t0 pd-md-l0">
                                            <div class="bannerBox__left">
                                                {/* <h1 class="bannerBox__maintitle"> </h1> */}
                                                {/* <p class="bannerBox__subtitle mg-b40">Do tune in on 16th April 2021 for 2 days of cutting-edge academic feast with experts in Respiratory Medicine</p> */}
                                                <p class="bannerBox__subtitle mg-b40">Tune in for a State-of-the-Art Academic Feast with the Leaders in Respiratory Medicine.</p>
                                                <p class="bannerBox__date mg-b30">16-17th April 2021</p>
                                                <div class="d-flex middle-In-mobile">
                                                    <AddToCalendar blueBtn={true} />

                                                    <a href="#" class="btn btn-secondary--outline bannerBox__btn mg-l20"
                                                        onClick={(e) => showMediaModal(MediaModalType.PDF, '/assets/pdf/KNOW_YOUR_SPEAKERS.pdf')}>
                                                        Know Your Speakers
                                                    </a>
                                                    {/* <a href="#" class="btn btn-secondary--outline bannerBox__btn mg-l20" onClick={() => {
                                                        startVideo()
                                                        addGAWithUserInfo(WATCHTRAILER_ANALYTICS_EVENT, { eventId: 'event-kmde59n5' })
                                                        addCAWithUserInfo(WATCHTRAILER_ANALYTICS_EVENT, true, { eventId: 'event-kmde59n5' }, true)
                                                    }}>WATCH TRAILER</a> */}
                                                </div>
                                            </div>
                                            <div class="bannerBox__right">
                                                <img class="bannerBox__pic" src="assets/images/logos/impact-logo3.png" alt="" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <AgendaNavBar containerClass="container" className={"hide-on-tablet"} dates={agendaDates} currentDate={cureentAgendaDate} handleClick={handleDateChange} stickyOnScroll={true} />
                        <AgendaNavBar containerClass="container" className={"show-on-tablet show-on-tablet--flex "} dates={agendaDates} currentDate={cureentAgendaDate} handleClick={handleDateChange} forceAgendaVisibleMobile={true} stickyOnScroll={true} />
                        <div class="maincardBox maincardBox--large maincardBox--mobile-visible">
                            <div class="maincardBox__card-wrapper">
                                <div class="container">
                                    {
                                        agendaData &&
                                        agendaData[cureentAgendaDate].map((timeline, index) => (
                                            <AgendaCard timeline={timeline} haveVideo={true} haveLikeButton={true} handleClick={startVideo} wantHeaderFooter={true} />
                                        ))
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default PreEvent
