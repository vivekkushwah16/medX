import React, { useContext } from 'react'
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
                                <img src="/assets/images/cipla-logo.png" alt="" />
                            </a>
                        </div>

                    </div>
                </div>
            </header>

            <div className="login2Box__left">
                <div className="bannerBox">
                    <div className="bannerBox__inner bannerBox__inner--small bannerBox__inner4 gradient-bg1">
                        <div className="bannerBox__slide">
                            <div className="container-small">
                                <div className="d-flex justify-content-between">
                                    <div className="bannerBox__left">
                                        <h1 className="bannerBox__subtitle mg-b10">A State-of-the-Art Academic Feast</h1>
                                        <p className="bannerBox__desc mg-b35">with the Leaders in Respiratory Medicine</p>
                                        <div className="d-flex d-sm-block justify-content-between">
                                            <a href="#" className="btn btn-secondary bannerBox__btn mg-r20 d-flex align-items-center" onClick={(e) => showMediaModal(MediaModalType.PDF, '/assets/pdf/KNOW_YOUR_SPEAKERS.pdf')}>Know Your Speakers </a>
                                            {/* <a href="#" className="btn btn-secondary bannerBox__btn mg-r20 d-flex align-items-center" onClick={(e) => showMediaModal(MediaModalType.Videos, 'https://player.vimeo.com/video/528854507')}>Watch Trailer <i className="icon-play mg-l10"></i></a> */}
                                        </div>
                                    </div>
                                    <div className="bannerBox__right">

                                        <img className="bannerBox__pic" src="/assets/images/impact-logo3.png" alt="" />
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
                    agendaData && currentTab !== 0 &&
                    <Agenda dates={agendaDates} currentDate={currentDate} data={agendaData} haveVideo={false} haveLikeButton={false} handleDateChange={handleDateChange} ></Agenda>
                }
            </div>
        </>
    )
}
