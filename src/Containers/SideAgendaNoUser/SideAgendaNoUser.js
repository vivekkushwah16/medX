import React, { useContext } from 'react'
import { MediaModalType } from '../../AppConstants/ModalType'
import Agenda from '../../Components/Event/Agenda/Agenda'
import AgendaNavBar from '../../Components/Event/AgendaNavBar/AgendaNavBar'
import { MediaModalContext } from '../../Context/MedialModal/MediaModalContextProvider'

export default function SideAgendaNoUser(props) {
    const { agendaData, agendaDates, currentDate, handleDateChange, tabs, currentTab, tabsName, ToggleTab } = props
    const { showMediaModal } = useContext(MediaModalContext)
    return (
        <>
            <header class="headerBox">
                <div class="container-small">
                    <div class="d-flex align-items-center justify-content-between">
                        <div class="headerBox__left">
                            <a href="#" class="headerBox__logo4">
                                <img src="/assets/images/cipla-logo.png" alt="" />
                            </a>
                        </div>

                    </div>
                </div>
            </header>

            <div className="login2Box__left">
                <div class="bannerBox">
                    <div class="bannerBox__inner bannerBox__inner--small bannerBox__inner4 gradient-bg1">
                        <div class="bannerBox__slide">
                            <div class="container-small">
                                <div class="d-flex justify-content-between">
                                    <div class="bannerBox__left">
                                        <h1 class="bannerBox__subtitle mg-b10">2 days of cutting-edge academic feast </h1>
                                        <p class="bannerBox__desc mg-b35">With 7 International and 14 National Experts in Respiratory Medicine</p>
                                        <div class="d-flex d-sm-block justify-content-between">
                                            {/* <a href="#" class="btn btn-secondary bannerBox__btn mg-r20 d-flex align-items-center" onClick={(e) => showMediaModal(MediaModalType.Videos, 'https://player.vimeo.com/video/528854507')}>Watch Trailer <i class="icon-play mg-l10"></i></a> */}
                                        </div>
                                    </div>
                                    <div class="bannerBox__right">

                                        <img class="bannerBox__pic" src="/assets/images/impact-logo3.png" alt="" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <AgendaNavBar className={"hide-on-tablet"} dates={agendaDates} currentDate={currentDate} handleClick={handleDateChange} stickyOnScroll={true}/>
                <ul className="mobile-tabs">
                    {
                        Object.keys(tabs).map(tabKey => (
                            <li className={`${currentTab === tabs[tabKey] ? 'active' : ''} ${tabs[tabKey] === 2? 'd-none':''}`}><a href="#" onClick={(e) => ToggleTab(e, tabs[tabKey])}><span>{tabsName[tabs[tabKey]]}</span></a></li>
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
