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

function PreEvent() {
    const { showMediaModal } = useContext(MediaModalContext)
    const [agendaData, setAgendaData] = useState([]);
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
            setAgendaData(data)
        })
    }

    const startVideo = () => {
        showMediaModal(MediaModalType.Videos, 'https://player.vimeo.com/video/528854507')
        // setVideoModalVisible(true)
    }

    return (
        <>
            <section class="wrapper" id="root">
                <div class="topicsBox__wrapper">
                    {/* Header */}
                    <Header />

                    {/* BannerBox */}
                    <div class="bannerBox">
                        <div class="bannerBox__inner bannerBox__inner2 gradient-bg4">
                            <div class="bannerBox__slide">
                                <div class="bannerBox__left">
                                    {/* <h1 class="bannerBox__maintitle"> </h1> */}
                                    <p class="bannerBox__subtitle mg-b70">Do tune in on 16th April 2021 for 2 days of cutting-edge academic feast with experts in Respiratory Medicine</p>
                                    <p class="bannerBox__date mg-b40">16<sup>th</sup> April 2021</p>
                                    <div class="d-flex">
                                        <AddToCalendar />
                                        <a href="#" class="btn btn-secondary--outline bannerBox__btn mg-l20" onClick={() => {
                                            startVideo()
                                            addGAWithUserInfo(WATCHTRAILER_ANALYTICS_EVENT, { eventId: 'event-kmde59n5' })
                                            addCAWithUserInfo(WATCHTRAILER_ANALYTICS_EVENT, true, { eventId: 'event-kmde59n5' }, true)
                                        }}>WATCH TRAILER</a>
                                    </div>
                                </div>
                                <div class="bannerBox__right">
                                    <img class="bannerBox__pic" src="assets/images/logos/impact-logo.png" alt="" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tab box */}

                    <div class="tabBox tabBox--new">
                        {
                            agendaData &&
                            <Agenda data={agendaData} haveVideo={true} haveLikeButton={true} startVideo={startVideo} />
                        }
                    </div>

                    {/* footer box */}
                    {/* <Footer /> */}
                </div>
            </section>
        </>
    )
}

export default PreEvent
