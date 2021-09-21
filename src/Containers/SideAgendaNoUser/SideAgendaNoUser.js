import React, { useContext } from 'react'
import { isMobileOnly } from 'react-device-detect'
import { WATCHTRAILER_ANALYTICS_EVENT } from '../../AppConstants/AnalyticsEventName'
import { MediaModalType } from '../../AppConstants/ModalType'
import Agenda from '../../Components/Event/Agenda/Agenda'
import AgendaNavBar from '../../Components/Event/AgendaNavBar/AgendaNavBar'
import WaveAnim from '../../Components/WaveAnim/WaveAnim'
import { MediaModalContext } from '../../Context/MedialModal/MediaModalContextProvider'

export default function SideAgendaNoUser(props) {
    const { agendaData, agendaDates, currentDate, handleDateChange, tabs, currentTab, tabsName, ToggleTab } = props
    const { showMediaModal } = useContext(MediaModalContext)
    return (
        <>
            <header className="headerBox">
                <div className="container-small">
                    <div className="d-flex align-items-center justify-content-between">
                        <div className="headerBox__left">
                            <a href="#" className="headerBox__logo4">
                                <img src="/assets/images/logos/ciplamed-logo.png" alt="" />
                            </a>
                        </div>
                        <img src={`https://storage.googleapis.com/cipla-impact.appspot.com/${props.event}/eventLogo.png?updated=1`} alt="" className="cipla-res" style={{
                            position: 'relative'
                        }} />
                    </div>
                </div>
            </header>

            <div className="login2Box__left" style={{
                backgroundImage: `url("https://storage.googleapis.com/cipla-impact.appspot.com/${props.event}/WithAgenda_MainBG.jpg?x=x")`,
                backgroundPosition: 'top',
                backgroundSize: "contain",
                backgroundRepeat: "repeat-x",
                backgroundColor: `${props.eventData?.regStyle?.registerationBGColor ? props.eventData.regStyle.registerationBGColor : 'inherit'}`,
                backgroundBlendMode: "multiply",
            }}>
                <div className="bannerBox" style={{ marginTop: '2rem' }}>
                    <div className="bannerBox__inner bannerBox__inner--small bannerBox__inner4 gradient-bg1">
                        <div className="bannerBox__slide">
                            <div className="container-small">
                                <div className="d-flex justify-content-between">
                                    <div className="bannerBox__left">
                                        <img className="bannerBox__pic mg-b35"
                                            src={`https://storage.googleapis.com/cipla-impact.appspot.com/${props.event}/${isMobileOnly ? 'WithAgenda_Mobile_Registration_heading_left.png' : 'WithAgenda_Registeration_heading_left.png'}?updated=${Math.random() * 100}`}
                                            alt="header_left" />
                                        {/* <h1 className="bannerBox__subtitle mg-b10">A State-of-the-Art Academic Feast</h1> */}
                                        {/* <p className="bannerBox__desc mg-b35">with the Leaders in Respiratory Medicine</p> */}

                                        {
                                            props.eventData.watchTrailer &&
                                            props.eventData.watchTrailer.enabled &&
                                            props.eventData.watchTrailer.link &&
                                            <a href="#" class="btn btn-secondary--outline bannerBox__btn mg-b20" style={{ fontSize: "1.1rem" }}
                                                onClick={(e) => {
                                                    showMediaModal(MediaModalType.Videos, props.eventData.watchTrailer.link)
                                                    // addGAWithUserInfo(WATCHTRAILER_ANALYTICS_EVENT, { eventId: props.event })
                                                    // addCAWithUserInfo(`/${WATCHTRAILER_ANALYTICS_EVENT}`, true, { eventId: props.event }, true)
                                                }}>

                                                {
                                                    // isMobileOnly ? 'Trailer' : 
                                                    <>Watch Trailer&nbsp;<i className="icon-play" style={{ fontSize: "1rem" }}></i></>
                                                }
                                            </a>
                                        }

                                        <div className="d-flex d-sm-block justify-content-between">
                                            {
                                                props.eventData.faculty &&
                                                props.eventData.faculty.enabled &&
                                                props.eventData.faculty.link &&
                                                <a href="#" className="btn btn-secondary bannerBox__btn d-flex align-items-center" onClick={(e) => showMediaModal(MediaModalType.PDF, `/web/viewer.html?file=${encodeURIComponent(props.eventData.faculty.link)}`)}>Know Your Faculty </a>
                                            }
                                            {/* <a href="#" className="btn btn-secondary bannerBox__btn mg-r20 d-flex align-items-center" onClick={(e) => showMediaModal(MediaModalType.Videos, 'https://player.vimeo.com/video/528854507')}>Watch Trailer <i className="icon-play mg-l10"></i></a> */}
                                        </div>
                                    </div>
                                    <div className="bannerBox__right">

                                        <img className="bannerBox__pic"
                                            src={`https://storage.googleapis.com/cipla-impact.appspot.com/${props.event}/${isMobileOnly && props.eventData.useSeparateImages ? 'WithAgenda_Mobile_Registration_heading_right.png' : 'WithAgenda_Registeration_heading_right.png'}?updated=${Math.random() * 100}`}
                                            alt="" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* <WaveAnim /> */}
                    </div>
                </div>
                <AgendaNavBar className={"hide-on-tablet"} dates={agendaDates} currentDate={currentDate} handleClick={handleDateChange} stickyOnScroll={true} />
                <ul className="mobile-tabs">
                    {
                        Object.keys(tabs).map(tabKey => (
                            <li className={`${currentTab === tabs[tabKey] ? 'active' : ''} ${tabs[tabKey] === 2 ? 'd-none' : ''}`}><a href="#" onClick={(e) => ToggleTab(e, tabs[tabKey])}><span>{tabsName[tabs[tabKey]]}</span></a></li>
                        ))
                    }
                </ul>
                {
                    agendaData && currentTab !== 0 && currentDate && agendaDates &&
                    <Agenda dates={agendaDates} currentDate={currentDate} data={agendaData} haveVideo={false} haveLikeButton={false} handleDateChange={handleDateChange} ></Agenda>
                }
            </div>
        </>
    )
}
