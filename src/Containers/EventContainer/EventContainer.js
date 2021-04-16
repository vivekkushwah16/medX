import React, { useContext, useEffect, useState, useRef, useMemo } from 'react'
import { isMobileOnly } from 'react-device-detect'
import ReactPlayer from 'react-player'
import { CERTIFICATE_CLICK, DOWNLOAD_CERTIFICATE, FEEDBACK_CLICK, POLL_INTERACTION, QNA_INTERATCION, SESSION_ATTENDED } from '../../AppConstants/AnalyticsEventName'
import { MediaModalType } from '../../AppConstants/ModalType'
import { MonthName } from '../../AppConstants/Months'
import Certificate from '../../Components/Certificate/Certificate'
import CommunityBox from '../../Components/CommunityBox/CommunityBox'
import About from '../../Components/Event/About/About'
import AgendaTab from '../../Components/Event/AgendaTab/AgendaTab'
import EventMenu from '../../Components/Event/EventMenu'
import PartnerWithUs from '../../Components/Event/PartnerWithUs/PartnerWithUs'
import Trending from '../../Components/Event/Trending/Trending'
import { AnalyticsContext } from '../../Context/Analytics/AnalyticsContextProvider'
import { UserContext } from '../../Context/Auth/UserContextProvider'
import { MediaModalContext } from '../../Context/MedialModal/MediaModalContextProvider'
import swal from 'sweetalert'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAward, faTasks } from '@fortawesome/free-solid-svg-icons'

const menuItemsId = {
    About: 'About',
    Agenda: 'Agenda',
    Trending: 'Trending',
    Polls: 'Polls',
    Partner_with_us: 'Partner_with_us'
}

const menuItems = [
    { id: menuItemsId.About, name: 'Faculty', className: '' },
    { id: menuItemsId.Agenda, name: 'Agenda', className: '' },
    { id: menuItemsId.Trending, name: 'Trending', className: '' },
    { id: menuItemsId.Polls, name: 'Q&A', className: 'hide-on-desktop' },
    { id: menuItemsId.Partner_with_us, name: 'Partner with us', className: '' },
]

// custom hook for getting previous value 
export function usePrevious(value) {
    const ref = useRef();
    useEffect(() => {
        ref.current = value;
    });
    return ref.current;
}

const TIME_BETWEEN_CLOUDFUNCTION_HIT = 1 * 60 * 1000;

export default function EventContainer(props) {
    //#region  decalaration
    const { id, data, agendaData: _initalAgendaData, trendingData, partnerWithUsData, countPartnerWithUsAgree, sendQuestion, likedEvent, handleEventLikeButton } = props;
    const [activeMenu, setActiveMenu] = useState(menuItems[0])
    const [activePollPanel, setPollPanelActive] = useState(true)
    const [likeButtonEnabled, makeLikeButtonEnabled] = useState(true)
    const { showMediaModal } = useContext(MediaModalContext)
    const [agendaData, setAgendaData] = useState(null);
    const [agendaDates, setAgendaDates] = useState([]);
    const [cureentAgendaDate, setCureentAgendaDate] = useState(null);

    const { user, userInfo } = useContext(UserContext)
    const { addGAWithUserInfo, addCAWithUserInfo, updateUserStatus } = useContext(AnalyticsContext)
    let firstTime = useMemo(() => true, []);

    //#endregion

    const addClickAnalytics = (eventName) => {
        addGAWithUserInfo(eventName, { eventId: id })
        addCAWithUserInfo(`/${eventName}`, true, { eventId: id }, true)
    }

    const addItemClickAnalytics = (eventName, id, itemId, title, type) => {
        addGAWithUserInfo(eventName, { eventId: id, itemId, title, type })
        addCAWithUserInfo(`/${eventName}/${user.uid}_${itemId}`, false, { eventId: id, itemId, title, type }, true)
    }

    const QNASendAnalytics = () => {
        if (data.activeTimelineId) {
            addGAWithUserInfo(QNA_INTERATCION, { eventId: id, timelineId: data.activeTimelineId })
            addCAWithUserInfo(`/${QNA_INTERATCION}/${user.uid}_${data.activeTimelineId}`, false, { eventId: id, timelineId: data.activeTimelineId }, true)
        } else {
            addGAWithUserInfo(QNA_INTERATCION, { eventId: id })
            addCAWithUserInfo(`/${QNA_INTERATCION}/${user.uid}_${id}`, false, { eventId: id }, true)
        }
    }

    const PollInteractionAnalytics = (pollId, optionId) => {
        if (data.activeTimelineId) {
            addGAWithUserInfo(POLL_INTERACTION, { eventId: id, timelineId: data.activeTimelineId, pollId, optionId })
            addCAWithUserInfo(`/${POLL_INTERACTION}/${user.uid}_${pollId}`, false, { eventId: id, timelineId: data.activeTimelineId, pollId, optionId }, true)
        } else {
            addGAWithUserInfo(POLL_INTERACTION, { eventId: id, pollId, optionId })
            addCAWithUserInfo(`/${POLL_INTERACTION}/${user.uid}_${pollId}`, false, { eventId: id, pollId, optionId }, true)
        }
    }

    const sendSessionAnalytics = (initalTimelineValue) => {
        console.log({ timelineId: initalTimelineValue })
        addGAWithUserInfo(SESSION_ATTENDED, { eventId: id, timelineId: initalTimelineValue })
        addCAWithUserInfo(`/${SESSION_ATTENDED}/${user.uid}_${initalTimelineValue}`, false, { eventId: id, timelineId: initalTimelineValue }, true)
    }

    const initalTimelineValue = usePrevious(data.activeTimelineId)

    //#region maintain timespent 
    const calcaulateLastTimespent = () => {
        return Math.round((new Date().getTime() - window.session_CurrentHit_StartTimestamp) / 1000)
    }

    const startTimespentCalculation = () => {
        updateUserStatus(id, data.activeTimelineId, 0)
        window.session_CurrentHit_StartTimestamp = new Date().getTime()
        window.sessionTimerRef = setInterval(() => {
            // console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')
            let currentHitTimespent = calcaulateLastTimespent()
            // console.log('updateUserStatus()', id, data.activeTimelineId, currentHitTimespent)
            updateUserStatus(id, data.activeTimelineId, currentHitTimespent)
            // console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')
            window.session_CurrentHit_StartTimestamp = new Date().getTime()
            window.session_CurrentHit_timelineId = data.activeTimelineId
        }, TIME_BETWEEN_CLOUDFUNCTION_HIT);
    }

    const stopTimespentCalculation = (startNew = false, previousId) => {
        if (window.sessionTimerRef) {
            clearInterval(window.sessionTimerRef)
            // console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')
            let currentHitTimespent = calcaulateLastTimespent()
            if (!startNew) {
                // console.log(props)
                // console.log('Close-updateUserStatus(1)', id, window.session_CurrentHit_timelineId, currentHitTimespent)
                updateUserStatus(id, window.session_CurrentHit_timelineId, currentHitTimespent)
                window.session_CurrentHit_StartTimestamp = null
            } else {
                // console.log('Close-updateUserStatus(2)', id, previousId, currentHitTimespent)
                updateUserStatus(id, previousId, currentHitTimespent)

                startTimespentCalculation();
            }
            // console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')
        }
    }
    //#endregion

    useEffect(() => {
        console.log(initalTimelineValue, data)
        if (data && data.activeTimelineId) {
            let activeTimelineId = data.activeTimelineId
            if (initalTimelineValue) {
                if (initalTimelineValue !== activeTimelineId) {
                    sendSessionAnalytics(activeTimelineId)
                    stopTimespentCalculation(true, initalTimelineValue)
                }
            } else {
                sendSessionAnalytics(activeTimelineId)
                startTimespentCalculation();
            }
        } else {
            console.log("No Active timeline");
        }
    }, [data])

    useEffect(() => {
        return (() => {
            stopTimespentCalculation();
        })
    }, [])

    useEffect(() => {
        if (_initalAgendaData)
            processAgendaData(_initalAgendaData)
    }, [_initalAgendaData])

    const processAgendaData = (data) => {
        let newData = {}
        data.sort(function (a, b) { return a.startTime - b.startTime });
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
        console.log(firstTime, ';;;x;x;x');
        if (firstTime) {
            setCureentAgendaDate(dates[0])
            firstTime = false
        }
        setAgendaDates(dates)
        setAgendaData(newData)
    }

    const handleDateChange = (date, event) => {
        if (event) { event.preventDefault() }
        setCureentAgendaDate(date);
    }

    return (
        <div className="eventBox">
            {
                !activePollPanel && !isMobileOnly &&
                <a href="#" className="eventBox__sidebar-btn active" onClick={(e) => {
                    e.preventDefault();
                    addClickAnalytics(`${menuItemsId.Polls}_click`)
                    setPollPanelActive(true)
                }}>Q&amp;A / Polls</a>
            }

            <div className="container" style={activePollPanel && !isMobileOnly ? { maxWidth: 'unset' } : {}}>
                <div className={`d-flex row d-sm-block  ${activePollPanel && !isMobileOnly ? 'eventBox__inner' : ''}`}>
                    <div className="eventBox__left col">
                        <div className="eventBox__video">
                            <ReactPlayer
                                playing={true}
                                url={data.videoUrl}
                                volume={0.85}
                                controls={true}
                                width='100%'
                                height={isMobileOnly ? '40vh' : '60vh'}
                                playsinline={true}

                            ></ReactPlayer>
                            {/* <img src="assets/images/video3.jpg" alt="" /> */}
                        </div>
                        <div className="pd-t30 pd-b10 d-flex align-items-start justify-content-between">
                            {/* mx-w600 */}
                            <div className="eventBox_video_titleBox ">
                                <h1 className="eventBox__title mg-b30">
                                    {data.title}
                                </h1>
                                {
                                    data.description &&
                                    <p className="eventBox__desc">
                                        {data.description}
                                        <br></br>
                                    </p>
                                }
                                {/* <h4 className="eventBox__subtitle mg-b40">200 LIVE Viewers</h4> */}
                            </div>

                            <div className="eventBox_btn_box" style={{ display: "flex", flexDirection: 'column' }}>
                                <a href="#" className={`like-btn eventBox__like-btn ${likedEvent ? 'like-btn--active' : ''}`}
                                    onClick={(e) => {
                                        if (likeButtonEnabled) {
                                            makeLikeButtonEnabled(false)
                                            handleEventLikeButton(e, () => {
                                                makeLikeButtonEnabled(true)
                                            })
                                        }
                                    }}>
                                    <i className="icon-like"></i>{data.likes}
                                </a>
                                {
                                    isMobileOnly &&
                                    <>
                                        <button className="btn btn-secondary btn-sm mg-b10 mg-t10 font-18 " onClick={() => {
                                            if (!data.activeCertificate)
                                                swal("Event in progress", "Please collect your certificate at the end of the event on 17th April!");
                                            else {
                                                showMediaModal(MediaModalType.Component, { component: Certificate, data: { addClickAnalytics: () => { addClickAnalytics(DOWNLOAD_CERTIFICATE) } } })
                                                addClickAnalytics(CERTIFICATE_CLICK)
                                            }
                                        }}><FontAwesomeIcon icon={faAward} /></button>
                                        <button className="btn btn-secondary btn-sm mg-b10 font-18 " onClick={() => {
                                            addClickAnalytics(FEEDBACK_CLICK);
                                            showMediaModal(MediaModalType.PDF, '/feedback/index.html')
                                        }}>
                                            <FontAwesomeIcon icon={faTasks} />
                                        </button>


                                    </>
                                }

                            </div>

                        </div>
                        {/* {
                            data.description &&
                            <p className="eventBox__desc mg-b40">
                                {data.description}
                                <br></br>
                            </p>
                        } */}
                        {/* {
                            isMobileOnly &&
                            <div className="pd-t5 pd-b5 d-flex align-items-start justify-content-between">
                                <button className="btn btn-secondary" onClick={() => {
                                    if (props.disableFeedback)
                                        swal("Event in progress", "Please collect your certificate at the end of the event on 17th April!");
                                    else {
                                        showMediaModal(MediaModalType.Component, { component: Certificate, data: { addClickAnalytics: () => { addClickAnalytics(DOWNLOAD_CERTIFICATE) } } })
                                        addClickAnalytics(CERTIFICATE_CLICK)
                                    }
                                }}>Get your certificate</button>
                                <button className="btn btn-secondary" onClick={() => {
                                    addClickAnalytics(FEEDBACK_CLICK);
                                    showMediaModal(MediaModalType.PDF, '/feedback/index.html')
                                }}>Feedback</button>
                            </div>
                        } */}
                        <div className="eventBox__tabs-wrapper">
                            <EventMenu menuItems={menuItems} activeMenu={activeMenu} setActiveMenu={(item) => {
                                addClickAnalytics(`${item.id}_click`)
                                setActiveMenu(item)
                            }} />

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
                                <Trending data={trendingData} addAnalytics={addItemClickAnalytics} />
                            }

                            {
                                activeMenu.id === menuItemsId.Polls &&
                                <div id="tab4" className="eventBox__tabs-content active">
                                    <CommunityBox
                                        sendQuestion={(eventId, ques) => {
                                            QNASendAnalytics();
                                            sendQuestion(eventId, ques, data.activeTimelineId)
                                        }}
                                        noticeboard={data.noticeboard}
                                        id={id}
                                        pollAnalytics={(pollId, optionId) => {
                                            PollInteractionAnalytics(pollId, optionId);
                                        }} />
                                </div>
                            }

                            {
                                partnerWithUsData &&
                                <PartnerWithUs eventId={id} data={partnerWithUsData} countIn={countPartnerWithUsAgree} isActive={activeMenu.id === menuItemsId.Partner_with_us} />
                            }


                        </div>
                    </div>
                    {
                        !isMobileOnly &&
                        <div className={`eventBox__right  show-on-desktop col ${activePollPanel ? 'active' : ''}`}>
                            <CommunityBox
                                sendQuestion={(eventId, ques) => {
                                    QNASendAnalytics();
                                    sendQuestion(eventId, ques, data.activeTimelineId)
                                }}
                                noticeboard={data.noticeboard}
                                id={id} showCloseButton={false}
                                pollAnalytics={(pollId, optionId) => {
                                    PollInteractionAnalytics(pollId, optionId);
                                }}
                                handleCloseBtn={(e) => { e.preventDefault(); setPollPanelActive(false) }}
                            />
                        </div>
                    }
                </div>
            </div>
        </div >
    )
}
