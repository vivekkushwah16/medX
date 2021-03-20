import React, { useContext, useState, useEffect } from 'react'
import { MonthName } from '../../AppConstants/Months';
import { SpeakerProfileType } from '../../AppConstants/SpeakerProfileType';
import { LikeType } from '../../AppConstants/TypeConstant';
import SpeakerProfile from '../../Containers/SpeakerProfile.js/SpeakerProfile';
import { likeContext } from '../../Context/Like/LikeContextProvider';

function AgendaCard(props) {
    const { timeline, haveVideo, haveLikeButton } = props
    const { getLike, addLike, removeLike } = useContext(likeContext)
    const [like, setLike] = useState(false);

    useEffect(() => {
        getCurrentTargetLikeStatus()
    }, [])

    const getCurrentTargetLikeStatus = async () => {
        if (haveLikeButton) {
            if (timeline) {
                const status = await getLike(timeline.id)
                setLike(status)
            }
        }
    }

    const toggleLikeToTarget = async () => {
        if (like) {
            await removeLike(timeline.id, timeline.eventId, LikeType.TIMELINE_LIKE)
        } else {
            await addLike(timeline.id, timeline.eventId, LikeType.TIMELINE_LIKE)
        }
        setLike(!like)
    }


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
                    <div class="rating-block">
                        <button className={` mg-b40 mg-sm-b20 like-btn ${like ? 'like-btn--active' : ''}`} onClick={() => toggleLikeToTarget()}><i className="icon-like"></i>{timeline.likes}</button>
                        <p class="font-12 mg-b20">Is this topic relevant to you?</p>
                        <ul class="rating-block__stars">
                            <li class="active"><i class="icon-star"></i></li>
                            <li class="active"><i class="icon-star"></i></li>
                            <li class="active"><i class="icon-star"></i></li>
                            <li class="active"><i class="icon-star"></i></li>
                            <li><i class="icon-star"></i></li>
                        </ul>
                    </div>
                }
            </div>
        </div>
    )
}

export default AgendaCard
