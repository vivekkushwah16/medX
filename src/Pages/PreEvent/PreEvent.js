import React, { useContext, useState, useEffect } from 'react'
import VideoModal from '../../Components/VideoModal/VideoModal'
import { eventContext } from '../../Context/Event/EventContextProvider';
import Agenda from '../../Components/Event/Agenda/Agenda';
import Header from '../../Containers/Header/Header';
import AddToCalendar from '../../Components/AddToCalendar/AddToCalendar';
import Footer from '../../Containers/Footer/Footer';

function PreEvent() {
    const [showVideoModal, setVideoModalVisible] = useState(false);
    const [agendaData, setAgendaData] = useState([]);
    const { attachTimelineListener, removeTimelineListener } = useContext(eventContext)

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
            console.log(data)
            setAgendaData(data)
        })
    }

    const startVideo = () => {
        setVideoModalVisible(true)
    }

    return (
        <>

            {
                showVideoModal &&
                <VideoModal link={'https://player.vimeo.com/video/184520235'} close={() => { setVideoModalVisible(false) }}></VideoModal>
            }
            <section class="wrapper" id="root">
                <div class="topicsBox__wrapper">
                    {/* Header */}
                    <Header />

                    {/* BannerBox */}
                    <div class="bannerBox">
                        <div class="bannerBox__inner bannerBox__inner2 gradient-bg4">
                            <div class="bannerBox__slide">
                                <div class="bannerBox__left">
                                    <h1 class="bannerBox__maintitle">50+ Eminent Speakers</h1>
                                    <p class="bannerBox__subtitle mg-b70">Two days of engaging<br />sessions</p>
                                    <p class="bannerBox__date mg-b40">9<sup>th</sup> &amp; 10<sup>th</sup> April 2021</p>
                                    <div class="d-flex">
                                        <AddToCalendar />
                                        <a href="#" class="btn btn-secondary--outline bannerBox__btn mg-l20" onClick={() => startVideo()}>WATCH TRAILER</a>
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
                   <Footer />
                </div>
            </section>
        </>
    )
}

export default PreEvent
