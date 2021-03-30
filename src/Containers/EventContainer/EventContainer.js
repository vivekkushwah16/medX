import React, { useState } from 'react'
import ReactPlayer from 'react-player'
import CommunityBox from '../../Components/CommunityBox/CommunityBox'
import About from '../../Components/Event/About/About'
import AgendaTab from '../../Components/Event/AgendaTab/AgendaTab'
import EventMenu from '../../Components/Event/EventMenu'
import PartnerWithUs from '../../Components/Event/PartnerWithUs/PartnerWithUs'
import Trending from '../../Components/Event/Trending/Trending'

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
    const { id, data, agendaData, trendingData, partnerWithUsData, countPartnerWithUsAgree, sendQuestion } = props;
    const [activeMenu, setActiveMenu] = useState(menuItems[0])
    const like = { count: 20, status: true }
    const toggleLike = (value) => {
        console.log(value)
    }

    return (
        <div className="eventBox">
            <div className="container">
                <div className="d-flex row d-sm-block">
                    <div className="eventBox__left col">
                        <div className="eventBox__video">
                            <ReactPlayer
                                playing={true}
                                url={'https://vimeo.com/290674467'}
                                volume={0.85}
                                controls={true}
                                width='100%'
                                height='50vh'
                            ></ReactPlayer>
                            {/* <img src="assets/images/video3.jpg" alt="" /> */}
                        </div>
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
                                <AgendaTab data={agendaData} haveVideo={false} haveLikeButton={true} />
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

                    <div className="eventBox__right show-on-desktop col">
                        <CommunityBox sendQuestion={sendQuestion} id={id} />
                    </div>
                </div>
            </div>
        </div>
    )
}
