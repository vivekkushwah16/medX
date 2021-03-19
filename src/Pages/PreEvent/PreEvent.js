import React, { useContext, useState, useEffect } from 'react'
import { logout } from '../../Firebase/firebase';
import AgendaCard from '../../Components/AgendaCard/AgendaCard';
import VideoModal from '../../Components/VideoModal/VideoModal'
import { eventContext } from '../../Context/Event/EventContextProvider';
import Agenda from '../../Components/Event/Agenda/Agenda';


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
                    <div class="headerBox">
                        <div class="d-flex align-items-center justify-content-between">
                            <div class="headerBox__left">
                            </div>
                            <div class="headerBox__right headerBox__right--nogap">
                                <button class="btn btn-secondary"><i class="icon-invite"></i> Invite your friends</button>
                                <div class="notification">
                                    <a class="notification__btn" href="#"><i class="icon-bell"></i></a>
                                    <ul class="notification__dropdown">
                                        <li><a href="#">Lorem ipsum dolor set amet, Lorem ipsum dolor set amet.</a></li>
                                        <li><a href="#">Lorem ipsum dolor set amet, Lorem ipsum dolor set amet.</a></li>
                                        <li><a href="#">Lorem ipsum dolor set amet, Lorem ipsum dolor set amet.</a></li>
                                        <li><a href="#">Lorem ipsum dolor set amet, Lorem ipsum dolor set amet.</a></li>
                                    </ul>
                                </div>
                                <div class="headerBox__profile">
                                    <a class="profile__user" href="#"><img src="assets/images/user.png" alt="" /></a>
                                    <ul class="profile__dropdown">
                                        <li><a href="#">Profile</a></li>
                                        <li><a href="#" onClick={() => logout()}>Logout</a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* BannerBox */}
                    <div class="bannerBox">
                        <div class="bannerBox__inner bannerBox__inner2 gradient-bg4">
                            <div class="bannerBox__slide">
                                <div class="bannerBox__left">
                                    <h1 class="bannerBox__maintitle">50+ Eminent Speakers</h1>
                                    <p class="bannerBox__subtitle mg-b70">Two days of engaging<br />sessions</p>
                                    <p class="bannerBox__date mg-b40">9<sup>th</sup> &amp; 10<sup>th</sup> April 2021</p>
                                    <div class="d-flex">
                                        <a href="#" class="btn btn-secondary bannerBox__btn mg-r20">Add to Calender</a>
                                        <a href="#" class="btn btn-secondary--outline bannerBox__btn" onClick={() => startVideo()}>WATCH TRAILER</a>
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
                    <footer class="footerBox">
                        <ul>
                            <li class="active"><a href="#">
                                <i class="icon-home"></i>
                            Home</a>
                            </li>
                            <li><a href="#">
                                <i class="icon-search"></i>
                            Search</a>
                            </li>
                            <li><a href="#">
                                <i class="icon-notifications2"></i>
                            Notification</a>
                            </li>
                            <li><a href="#">
                                <i class="icon-profile"></i>
                            Profile</a>
                            </li>
                        </ul>
                    </footer>
                </div>
            </section>
        </>
    )
}

export default PreEvent
