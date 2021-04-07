import React, { useContext, useEffect, useState } from 'react'
import { isMobileOnly } from 'react-device-detect'
import ReactPlayer from 'react-player'
import { MediaModalType } from '../../AppConstants/ModalType'
import { MonthName } from '../../AppConstants/Months'
import Certificate from '../../Components/Certificate/Certificate'
import CommunityBox from '../../Components/CommunityBox/CommunityBox'
import About from '../../Components/Event/About/About'
import AgendaTab from '../../Components/Event/AgendaTab/AgendaTab'
import EventMenu from '../../Components/Event/EventMenu'
import PartnerWithUs from '../../Components/Event/PartnerWithUs/PartnerWithUs'
import Trending from '../../Components/Event/Trending/Trending'
import { MediaModalContext } from '../../Context/MedialModal/MediaModalContextProvider'

const menuItemsId = {
    About: 'About',
    Agenda: 'Agenda',
    Trending: 'Trending',
    Polls: 'Polls',
    Partner_with_us: 'Partner with us'
}

const menuItems = [
    { id: menuItemsId.About, name: 'About', className: '' },
    { id: menuItemsId.Agenda, name: 'Agenda', className: '' },
    { id: menuItemsId.Trending, name: 'Trending', className: '' },
    { id: menuItemsId.Polls, name: 'Polls', className: 'hide-on-desktop' },
    { id: menuItemsId.Partner_with_us, name: 'Partner with us', className: '' },
]

export default function EventContainer(props) {
    const { id, data, agendaData: _initalAgendaData, trendingData, partnerWithUsData, countPartnerWithUsAgree, sendQuestion, likedEvent, handleEventLikeButton } = props;
    const [activeMenu, setActiveMenu] = useState(menuItems[0])
    const [activePollPanel, setPollPanelActive] = useState(false)
    const [likeButtonEnabled, makeLikeButtonEnabled] = useState(true)
    const { showMediaModal } = useContext(MediaModalContext)

    const [agendaData, setAgendaData] = useState(null);
    const [agendaDates, setAgendaDates] = useState([]);
    const [cureentAgendaDate, setCureentAgendaDate] = useState(null);

    useEffect(() => {
        if (_initalAgendaData)
            processAgendaData(_initalAgendaData)
    }, [_initalAgendaData])


    const processAgendaData = (data) => {
        console.log(data)
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
        console.log(newData)
        setAgendaDates(dates)
        setCureentAgendaDate(dates[0])
        setAgendaData(newData)
    }

    const handleDateChange = (date, event) => {
        if (event) { event.preventDefault() }
        setCureentAgendaDate(date)
    }

    return (
        <div className="eventBox">

            {
                !activePollPanel && !isMobileOnly &&
                <a href="#" class="eventBox__sidebar-btn active" onClick={(e) => {
                    e.preventDefault();
                    setPollPanelActive(true)
                }}>Q&amp;A / Polls</a>
            }

            <div className="container" style={activePollPanel ? { maxWidth: 'unset' } : {}}>
                <div className={`d-flex row d-sm-block  ${activePollPanel ? 'eventBox__inner' : ''}`}>
                    <div className="eventBox__left col">
                        <div className="eventBox__video">
                            <ReactPlayer
                                playing={true}
                                url={'https://vimeo.com/290674467'}
                                volume={0.85}
                                controls={true}
                                width='100%'
                                height={isMobileOnly ? '40vh' : '60vh'}
                                playsinline={true}
                            ></ReactPlayer>
                            {/* <img src="assets/images/video3.jpg" alt="" /> */}
                        </div>
                        <div class="pd-t30 pd-b10 d-flex align-items-start justify-content-between">
                            <div class="mx-w600">
                                <h1 class="eventBox__title mg-b30">{data.title}</h1>
                                {/* <h4 class="eventBox__subtitle mg-b40">200 LIVE Viewers</h4> */}
                            </div>

                            <a href="#" className={`like-btn eventBox__like-btn ${likedEvent ? 'like-btn--active' : ''}`}
                                onClick={(e) => {
                                    if (likeButtonEnabled) {
                                        makeLikeButtonEnabled(false)
                                        handleEventLikeButton(e, () => {
                                            makeLikeButtonEnabled(true)
                                        })
                                    }
                                }}>
                                <i class="icon-like"></i>{data.likes}
                            </a>

                        </div>
                        {
                            isMobileOnly &&
                            <div class="pd-t5 pd-b5 d-flex align-items-start justify-content-between">
                                <button className="btn btn-secondary" onClick={() => showMediaModal(MediaModalType.Component, Certificate)} disabled={props.disableFeedback}>Get your certificate</button>
                                <button className="btn btn-secondary">Feedback</button>
                            </div>
                        }
                        <div className="eventBox__tabs-wrapper">
                            <EventMenu menuItems={menuItems} activeMenu={activeMenu} setActiveMenu={setActiveMenu} />

                            {/* <div className="text-right pd-t20 pd-b20 hide-on-desktop">
                                <a href="#" className={`like-btn ${like.status ? 'like-btn--active' : ''}`} onClick={toggleLike}><i className="icon-like"></i>{like.count}</a>
                            </div> */}

                            {
                                activeMenu.id === menuItemsId.About &&
                                <About data={data} />
                            }

                            {
                                activeMenu.id === menuItemsId.Agenda && agendaData &&
                                <AgendaTab data={agendaData} haveVideo={false}
                                    haveLikeButton={true}
                                    activeTimeline={data.activeTimelineId}
                                    agendaDates={agendaDates}
                                    cureentAgendaDate={cureentAgendaDate}
                                    handleDateChange={handleDateChange}
                                    allData={_initalAgendaData}
                                />
                            }
                            {
                                activeMenu.id === menuItemsId.Trending && trendingData &&
                                <Trending data={trendingData} />
                            }

                            {
                                activeMenu.id === menuItemsId.Polls &&
                                <div id="tab4" class="eventBox__tabs-content active">
                                    <CommunityBox sendQuestion={sendQuestion} id={id} />
                                </div>
                            }

                            {
                                activeMenu.id === menuItemsId.Partner_with_us && partnerWithUsData &&
                                <PartnerWithUs data={partnerWithUsData} countIn={countPartnerWithUsAgree} />
                            }


                        </div>
                    </div>
                    {
                        !isMobileOnly &&
                        <div className={`eventBox__right  show-on-desktop col ${activePollPanel ? 'active' : ''}`}>
                            <CommunityBox sendQuestion={sendQuestion} id={id} showCloseButton={true} handleCloseBtn={(e) => { e.preventDefault(); setPollPanelActive(false) }} />
                        </div>
                    }
                </div>
            </div>
        </div >
    )
}
