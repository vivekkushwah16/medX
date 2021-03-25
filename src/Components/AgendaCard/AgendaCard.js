import React, { useContext, useState, useEffect } from 'react'
import { MonthName } from '../../AppConstants/Months';
import { SpeakerProfileType } from '../../AppConstants/SpeakerProfileType';
import { LikeType } from '../../AppConstants/TypeConstant';
import SpeakerProfile from '../../Containers/SpeakerProfile.js/SpeakerProfile';
import { UserContext } from '../../Context/Auth/UserContextProvider';
import { likeContext } from '../../Context/Like/LikeContextProvider';
import { analytics, database } from '../../Firebase/firebase';
import StartRating from '../StartRating/StartRating';

function AgendaCard(props) {
    const { timeline, haveVideo, haveLikeButton, animate, placeIndex } = props
    const { getLike, addLike, removeLike, getRating, updateRating } = useContext(likeContext)
    const { userInfo, user } = useContext(UserContext)
    const [like, setLike] = useState(false);
    const [rating, setRating] = useState(null);


    useEffect(() => {
        getCurrentTargetLikeStatus()
        getCurrentTargetRatingStatus()
    }, [])

    const getCurrentTargetLikeStatus = async () => {
        if (haveLikeButton) {
            if (timeline) {
                const status = await getLike(timeline.id)
                setLike(status)
            }

        }
    }

    const getCurrentTargetRatingStatus = async () => {
        if (haveLikeButton) {
            if (timeline) {
                const rat = await getRating(timeline.id)
                setRating(rat)
            }

        }
    }

    const updatingTimelineRating = async (rating) => {
        await updateRating(timeline.id, timeline.eventId, rating)
        let _data = {
            uid: user.uid,
            country: userInfo.country,
            state: userInfo.state,
            city: userInfo.city,
            date: new Date(),
            rating: rating,
            timline: timeline.id,
        }
        analytics.logEvent("timeline_Rating", _data)
        await database.ref(`/timeline_Rating/${user.uid}_${timeline.id}`).update(_data)
    }

    const toggleLikeToTarget = async () => {
        let _data = {
            uid: user.uid,
            country: userInfo.country,
            state: userInfo.state,
            city: userInfo.city,
            date: new Date(),
            timline: timeline.id,
        }
        if (like) {
            await removeLike(timeline.id, timeline.eventId, LikeType.TIMELINE_LIKE)
            analytics.logEvent("timeline_revertedlike", _data)
            await database.ref(`/timeline_revertedlike/${user.uid}_${timeline.id}`).update(_data)
        } else {
            await addLike(timeline.id, timeline.eventId, LikeType.TIMELINE_LIKE)
            analytics.logEvent("timeline_like", _data)
            await database.ref(`/timeline_like/${user.uid}_${timeline.id}`).update(_data)
        }
        setLike(!like)
    }


    return (
        <div key={timeline.id} className={`maincardBox__card ${haveVideo ? 'maincardBox__card--large' : ''} ${animate ? 'maincardBox__card_animate' : ''}`}
            style={animate ? {
                animationDelay: `${placeIndex ? placeIndex * 0.25 : 0}s`
            } : {}}
        >
            <div className="maincardBox__card-left">
                {
                    haveVideo &&
                    <>

                        <div className="maincardBox__card-video"
                            // onClick={() => { props.handleClick() }}
                            style={{ backgroundImage: `url(${timeline.thumnailUrL})` }}>
                            {/* <a href="#" className="maincardBox__card-video__play"><i
                                className="icon-play"></i></a> */}
                            <div className="tint"></div>
                        </div>
                    </>
                }
                {
                    !haveVideo &&
                    <>
                        <h2 className="maincardBox__card-date mg-b10">{`${MonthName[new Date(timeline.startTime).getMonth()]} ${new Date(timeline.startTime).getDate()}, ${new Date(timeline.startTime).getFullYear()} `}</h2>
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
                        <button className={` mg-b40 mg-sm - b20 like-btn ${like ? 'like-btn--active' : ''} `} onClick={() => toggleLikeToTarget()}><i className="icon-like"></i>{timeline.likes}</button>
                        {
                            rating !== null &&
                            <>
                                <p class="font-14 mg-b20">Is this topic relevant to you?</p>
                                <StartRating initalRating={rating} updateRating={updatingTimelineRating} />
                            </>
                        }
                    </div>
                }
            </div>
        </div>
    )
}

export default AgendaCard
