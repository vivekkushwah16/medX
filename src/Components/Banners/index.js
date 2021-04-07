import React from 'react'
import { SpeakerProfileType } from '../../AppConstants/SpeakerProfileType'
import SpeakerProfile from '../../Containers/SpeakerProfile.js/SpeakerProfile'
import AddToCalendar from '../AddToCalendar/AddToCalendar'

//props - mainTitle, subTitle, eventId, enterEvent()
export function LiveEventBanner(props) {
    const { data } = props
    return (
        // bannerBox__inner2 gradient-bg4
        <div className="bannerBox__inner ">
            <div className="bannerBox__slide" style={{ backgroundImage: 'url(/assets/images/banner-bg1.jpg)' }}>
                <div class="container">
                    <div className="bannerBox__left">
                        <h1 className="bannerBox__title mg-b30">{data.mainTitle}</h1>
                        <div className="bannerBox__status mg-b50">
                            <h3 className="bannerBox__status-title">{data.subTitle}</h3>
                            <span className="bannerBox__status-mark">LIVE</span>
                        </div>
                        <a href="#" className="btn bannerBox__btn" onClick={() => props.enterEvent(data.eventId)}>ENTER EVENT</a>
                    </div>
                    {/* <div className="bannerBox__right">
                        <img className="bannerBox__pic" src={data.mainImageUrl} alt="" />
                    </div> */}
                </div>
            </div>
        </div>
    )
}

//props -  mainTitle, subTitle_line1, subTitle_line2, speakerId, mainImageUrl, watchTrailer()
export function ImageSingleButtonBanner(props) {
    const { data } = props

    return (
        <div className="bannerBox__inner gradient-bg2">
            <div className="bannerBox__slide" >
                <div class="container" >
                    <div className="bannerBox__left" >
                        <h1 className="bannerBox__featired-title mg-b50" style={{ color: '#fff' }}>{data.mainTitle}<br></br><span>{data.subTitle_line1}<br></br>{data.subTitle_line2}</span></h1>
                        <a href="#" className="bannerBox__profile mg-b50">
                            <SpeakerProfile type={SpeakerProfileType.CARD_PROFILE} id={data.speakerId} />
                        </a>
                        <a href="#" className="btn  bannerBox__btn" onClick={() => props.watchTrailer(data.trailerUrl)}>Watch Trailer</a>
                    </div>
                    <div className="bannerBox__center">
                        <img src={data.mainImageUrl} alt="" />
                    </div>
                </div>
            </div>
        </div>
    )
}

//props -  mainTitle, subTitle_line1, subTitle_line2, speakerId, mainImageUrl, watchTrailer()
export function UpcompingEventBanner(props) {
    const { data } = props
    return (
        <div className="bannerBox__inner ">
            <div className="bannerBox__slide" style={{ backgroundImage: 'url(/assets/images/banner-bg2.jpg)' }}>
                <div class="container" >
                    <div class="d-flex">
                        <div className="bannerBox__left">
                            <h1 className="bannerBox__maintitle mg-b40">{data.mainTitle}</h1>
                            <p className="bannerBox__subtitle mg-b50">{data.subTitle_line1}<br></br>{data.subTitle_line2}</p>
                            <p className="bannerBox__date mg-b40">{data.dateString}</p>
                            <div className="d-flex">
                                <AddToCalendar />
                                {/* <a href="#" className="btn btn-secondary bannerBox__btn mg-r20" onClick={() => props.addToCalendar(data.calendarData)}>Add to Calender</a> */}
                                {/* <a href="#" className="btn btn-secondary--outline bannerBox__btn mg-l20" onClick={() => props.watchTrailer(data.trailerUrl)}>WATCH TRAILER</a> */}
                            </div>
                        </div>
                        <div className="bannerBox__right">
                            <img className="bannerBox__pic" src={data.mainImageUrl} alt="" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

