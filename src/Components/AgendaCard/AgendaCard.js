import React, { useState } from 'react'
import { MonthName } from '../../AppConstants/Months';
import { SpeakerProfileType } from '../../AppConstants/SpeakerProfileType';
import SpeakerProfile from '../../Containers/SpeakerProfile.js/SpeakerProfile';

function AgendaCard(props) {
    const { timeline, haveVideo, haveLikeButton } = props
    const [like, setLike] = useState(true);
    return (
        <div key={timeline.id} className={`maincardBox__card ${haveVideo ? 'maincardBox__card--large' : ''} `}>
            <div className="maincardBox__card-left">
                {
                    haveVideo &&
                    <>
                        <div className="maincardBox__card-video"
                            onClick={() => { props.handleClick() }}
                            style={{ backgroundImage: `url(${timeline.thumnailUrL})` }}>
                            <a href="#" className="maincardBox__card-video__play"><i
                                className="icon-play"></i></a>
                        </div>
                    </>
                }
                {
                    !haveVideo &&
                    <>
                        <h2 className="maincardBox__card-date mg-b10">{`${MonthName[new Date(timeline.startTime).getMonth()]} ${new Date(timeline.startTime).getDate()}, ${new Date(timeline.startTime).getFullYear()}`}</h2>
                        <p className="maincardBox__card-time">{new Date(timeline.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </>
                }
            </div>
            <div className="maincardBox__card-right">
                <h4 className="mg-b15 maincardBox__card-title">{timeline.title}</h4>
                <p className="mg-b25 maincardBox__card-desc">{timeline.description}</p>
                <h4 className="mg-b20 maincardBox__card-title">SPEAKERS</h4>
                <SpeakerProfile type={SpeakerProfileType.CARD_PROFILE} id={timeline.speakers[0]} />
                {
                    haveLikeButton &&
                    <button className={`like-btn ${like ? 'like-btn--active' : ''}`} onClick={() => setLike(!like)}><i className="icon-like"></i>{timeline.likes}</button>
                }
            </div>
        </div>
    )
}

export default AgendaCard
