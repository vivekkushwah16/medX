import React from 'react'
import ReactPlayer from 'react-player'
import SpeakerProfile from '../SpeakerProfile.js/SpeakerProfile'
import { SpeakerProfileType } from '../../AppConstants/SpeakerProfileType'
import './VideoPopup.css'


function VideoPopup(props) {
    const { videoData, closeVideoPop } = props
    return (

        <div className="modalBox modalBox--large"  >
            <div className="modalBox__inner">
                <div className="modalBox__header">
                    <h3 className="modalBox__title"></h3>
                    <button className="modalBox__close-link" onClick={closeVideoPop}>CLOSE</button>
                </div>
                <div className="modalBox__body">
                    <div className="modalBox__video">
                        <ReactPlayer
                            playing={true}
                            url={videoData.videoUrl}
                            volume={0.85}
                            controls={true}
                            width='100%'
                            height='100%'
                        ></ReactPlayer>
                        {/* <img src="assets/images/video2.jpg" alt="" /> */}
                    </div>

                    <div className="videodetailBox">
                        <div className="videodetailBox__right">
                            <div className="d-flex justify-content-between mg-b40">
                                <button className="like-btn"><i className="icon-like"></i> 232</button>
                                <button className="like-btn">Download PDF</button>
                            </div>
                            <div className="timelineBox">
                                <div className="timelineBox-item">
                                    <span className="timelineBox-item-left">00:01 - 01:22</span>
                                    <span className="timelineBox-item-right">Introduction</span>
                                </div>
                                <div className="timelineBox-item">
                                    <span className="timelineBox-item-left">01:23 - 02:12</span>
                                    <span className="timelineBox-item-right">Importance of Testing for DRTB</span>
                                </div>
                                <div className="timelineBox-item">
                                    <span className="timelineBox-item-left">01:23 - 02:12</span>
                                    <span className="timelineBox-item-right">Importance of Testing for DRTB</span>
                                </div>
                                <div className="timelineBox-item">
                                    <span className="timelineBox-item-left">01:23 - 02:12</span>
                                    <span className="timelineBox-item-right">Importance of Testing for DRTB</span>
                                </div>
                            </div>
                        </div>

                        <div className="videodetailBox__left">
                            <h2 className="videodetailBox__title">{videoData.title}</h2>
                            <p className="videodetailBox__desc">{videoData.views} Views - 7th Jan, 2020</p>
                            <p className="videodetailBox__desc">{videoData.description}</p>
                            {/* <p className="videodetailBox__desc"><a href="javascript:void(0)">Show Less</a></p> */}
                            {
                                videoData.speakers &&
                                <>
                                <h4 className="videodetailBox__subtitle">SPEAKERS</h4>
                            
                                <div className="videodetailBox__profiles">
                                {
                                    videoData.speakers.map(speaker =>
                                        <SpeakerProfile type={SpeakerProfileType.BANNER_PROFILE} id={speaker} />
                                    )
                                }
                                </div>
                                </>
                            }
                                {/* <a href="#" className="bannerBox__profile mg-b50">
                                    <img className="bannerBox__profile-pic" src="assets/images/user.png" alt="" />
                                    <div className="bannerBox__profile-text">
                                        <p className="bannerBox__profile-title">Dr Jc halley</p>
                                        <p className="bannerBox__profile-subtitle">MBBS, Aligarh University</p>
                                    </div>
                                </a>
                                <a href="#" className="bannerBox__profile mg-b50">
                                    <img className="bannerBox__profile-pic" src="assets/images/user.png" alt="" />
                                    <div className="bannerBox__profile-text">
                                        <p className="bannerBox__profile-title">Dr Jc halley</p>
                                        <p className="bannerBox__profile-subtitle">MBBS, Aligarh University</p>
                                    </div>
                                </a> */}
                            <h4 className="videodetailBox__subtitle">More Videos</h4>

                            <div className="videodetailBox__list">
                                <div className="maincardBox__card maincardBox__card--large">
                                    <div className="maincardBox__card-menu">
                                        <button className="maincardBox__card-menu-btn"><i className="icon-dots"></i></button>
                                        <ul className="maincardBox__card-menu-dropdown">
                                            <li><a href="#">Edit</a></li>
                                            <li><a href="#">Delete</a></li>
                                        </ul>
                                    </div>
                                    <div className="maincardBox__card-left">
                                        <div className="maincardBox__card-video" style={{backgroundImage: "url(assets/images/video-thumb.jpg)"}}>
                                            <a href="javascript:void(0)" className="maincardBox__card-video__play"><i className="icon-play"></i></a>
                                        </div>
                                    </div>
                                    <div className="maincardBox__card-right">
                                        <h4 className="mg-b15 maincardBox__card-title">Panel Discussion on Drug resistant TB</h4>
                                        <p className="mg-b25 maincardBox__card-desc">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Neque est maecenas id arcu. </p>
                                    </div>
                                </div>
                                <div className="maincardBox__card maincardBox__card--large">
                                    <div className="maincardBox__card-menu">
                                        <button className="maincardBox__card-menu-btn"><i className="icon-dots"></i></button>
                                        <ul className="maincardBox__card-menu-dropdown">
                                            <li><a href="#">Edit</a></li>
                                            <li><a href="#">Delete</a></li>
                                        </ul>
                                    </div>
                                    <div className="maincardBox__card-left">
                                        <div className="maincardBox__card-video" style={{backgroundImage: "url(assets/images/video-thumb.jpg)"}}>
                                            <a href="javascript:void(0)" className="maincardBox__card-video__play"><i className="icon-play"></i></a>
                                        </div>
                                    </div>
                                    <div className="maincardBox__card-right">
                                        <h4 className="mg-b15 maincardBox__card-title">Panel Discussion on Drug resistant TB</h4>
                                        <p className="mg-b25 maincardBox__card-desc">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Neque est maecenas id arcu. </p>
                                    </div>
                                </div>
                                <div className="maincardBox__card maincardBox__card--large">
                                    <div className="maincardBox__card-menu">
                                        <button className="maincardBox__card-menu-btn"><i className="icon-dots"></i></button>
                                        <ul className="maincardBox__card-menu-dropdown">
                                            <li><a href="#">Edit</a></li>
                                            <li><a href="#">Delete</a></li>
                                        </ul>
                                    </div>
                                    <div className="maincardBox__card-left">
                                        <div className="maincardBox__card-video" style={{backgroundImage: "url(assets/images/video-thumb.jpg)"}}>
                                            <a href="javascript:void(0)" className="maincardBox__card-video__play"><i className="icon-play"></i></a>
                                        </div>
                                    </div>
                                    <div className="maincardBox__card-right">
                                        <h4 className="mg-b15 maincardBox__card-title">Panel Discussion on Drug resistant TB</h4>
                                        <p className="mg-b25 maincardBox__card-desc">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Neque est maecenas id arcu. </p>
                                    </div>
                                </div>
                                <div className="maincardBox__card maincardBox__card--large">
                                    <div className="maincardBox__card-menu">
                                        <button className="maincardBox__card-menu-btn"><i className="icon-dots"></i></button>
                                        <ul className="maincardBox__card-menu-dropdown">
                                            <li><a href="#">Edit</a></li>
                                            <li><a href="#">Delete</a></li>
                                        </ul>
                                    </div>
                                    <div className="maincardBox__card-left">
                                        <div className="maincardBox__card-video" style={{backgroundImage: "url(assets/images/video-thumb.jpg)"}}>
                                            <a href="javascript:void(0)" className="maincardBox__card-video__play"><i className="icon-play"></i></a>
                                        </div>
                                    </div>
                                    <div className="maincardBox__card-right">
                                        <h4 className="mg-b15 maincardBox__card-title">Panel Discussion on Drug resistant TB</h4>
                                        <p className="mg-b25 maincardBox__card-desc">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Neque est maecenas id arcu. </p>
                                    </div>
                                </div>
                                <div className="maincardBox__card maincardBox__card--large">
                                    <div className="maincardBox__card-menu">
                                        <button className="maincardBox__card-menu-btn"><i className="icon-dots"></i></button>
                                        <ul className="maincardBox__card-menu-dropdown">
                                            <li><a href="#">Edit</a></li>
                                            <li><a href="#">Delete</a></li>
                                        </ul>
                                    </div>
                                    <div className="maincardBox__card-left">
                                        <div className="maincardBox__card-video" style={{backgroundImage: "url(assets/images/video-thumb.jpg)"}}>
                                            <a href="javascript:void(0)" className="maincardBox__card-video__play"><i className="icon-play"></i></a>
                                        </div>
                                    </div>
                                    <div className="maincardBox__card-right">
                                        <h4 className="mg-b15 maincardBox__card-title">Panel Discussion on Drug resistant TB</h4>
                                        <p className="mg-b25 maincardBox__card-desc">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Neque est maecenas id arcu. </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default VideoPopup
