import React, { useContext, useState, useEffect } from 'react'
import { INVITEYOURFRIEND_EVENT_WHATSAPP, TIMELINE_LIKE_EVENT, TIMELINE_RATING_EVENT } from '../../AppConstants/AnalyticsEventName';
import { MonthName } from '../../AppConstants/Months';
import { SpeakerProfileType } from '../../AppConstants/SpeakerProfileType';
import { LikeType } from '../../AppConstants/TypeConstant';
import SpeakerProfile from '../../Containers/SpeakerProfile.js/SpeakerProfile';
import { AnalyticsContext } from '../../Context/Analytics/AnalyticsContextProvider';
import { UserContext } from '../../Context/Auth/UserContextProvider';
import { likeContext } from '../../Context/Like/LikeContextProvider';
import { analytics, database } from '../../Firebase/firebase';
import ReadMore from '../ReadMore/ReadMore';
import StartRating from '../StartRating/StartRating';

function AgendaCard(props) {
    const { timeline, haveVideo, haveLikeButton, animate, placeIndex, forEventPage, wantHeaderFooter, showLive, handleClick } = props
    const { getLike, addLike, removeLike, getRating, updateRating } = useContext(likeContext)
    const { userInfo, user } = useContext(UserContext)
    const { addGAWithUserInfo, addCAWithUserInfo } = useContext(AnalyticsContext)

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
        addGAWithUserInfo(TIMELINE_RATING_EVENT, { timeline: timeline.id, rating: rating })
        addCAWithUserInfo(`/${TIMELINE_RATING_EVENT}/${user.uid}_${timeline.id}`, false, { timeline: timeline.id, rating: rating })
    }

    const toggleLikeToTarget = async () => {

        if (like) {
            await removeLike(timeline.id, timeline.eventId, LikeType.TIMELINE_LIKE)
            addGAWithUserInfo(TIMELINE_LIKE_EVENT, { timeline: timeline.id, status: false })
            await database.ref(`/${TIMELINE_LIKE_EVENT}/${user.uid}_${timeline.id}`).remove()

        } else {
            await addLike(timeline.id, timeline.eventId, LikeType.TIMELINE_LIKE)
            addGAWithUserInfo(TIMELINE_LIKE_EVENT, { timeline: timeline.id, status: true })
            addCAWithUserInfo(`/${TIMELINE_LIKE_EVENT}/${user.uid}_${timeline.id}`, false, { timeline: timeline.id })
        }
        setLike(!like)
    }

    const getMainRender = () => {
        return (
            <div key={`AgendaCard-${timeline.id}`} id={`AgendaCard-${timeline.id}`} className={`maincardBox__card ${timeline.videoUrl.length > 0 ? 'maincardBox__card-video_canPlay' : ''}`}>
                {
                    haveVideo &&
                    <div className={`maincardBox__card-video `}
                        style={{ backgroundImage: `url(${timeline.thumnailUrL})` }}
                        onClick={(event) => {
                            event.preventDefault()
                            if (timeline.videoUrl.length > 0)
                                handleClick(timeline.videoUrl)
                        }}
                    >
                        {/* <div className="tint"></div> */}
                        <a href="#" className="maincardBox__card-video__play">
                            <i className="icon-play"></i>
                        </a>
                    </div>
                }
                <div class="maincardBox__card-body">
                    <div class="text-block">
                        <h4 className="mg-b15 maincardBox__card-title">{timeline.title}
                        </h4>
                        {
                            showLive ? (
                                <div className="mg-b15 maincardBox__card-title d-flex">
                                    <h2 class="maincardBox__card-date"> {`${new Date(timeline.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${new Date(timeline.startTime + (timeline.duration * 60 * 1000)).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}</h2>
                                    <div className="liveBlock">
                                        <span></span>
                                        <div>Live</div>
                                    </div>
                                </div>
                            ) :
                                (<h2 class="maincardBox__card-date mg-b10"> {`${new Date(timeline.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${new Date(timeline.startTime + (timeline.duration * 60 * 1000)).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}</h2>)
                        }
                        <ReadMore className="mg-b25 maincardBox__card-desc" description={timeline.description} />

                    </div>
                    {
                        haveLikeButton &&
                        <div class="rating-block">
                            <button className={`mg-b40 mg-sm-b20 like-btn ${like ? 'like-btn--active' : ''} `} onClick={() => toggleLikeToTarget()}><i className="icon-like"></i>{timeline.likes}</button>
                            {
                                forEventPage &&
                                rating !== null &&
                                <>
                                    <p class="font-12 mg-b20">Is this topic relevant to you?</p>
                                    <StartRating initalRating={rating} updateRating={updatingTimelineRating} />
                                </>
                            }
                        </div>
                    }
                </div>
                <div class="maincardBox__card-footer">
                    <h4 class="maincardBox__card-footer-title">Speakers</h4>
                    {
                        timeline.speakers.map(id => (
                            <SpeakerProfile type={SpeakerProfileType.CARD_PROFILE} id={id} />
                        ))
                    }
                </div>
            </div>
        )
    }

    if (wantHeaderFooter) {
        if (forEventPage) {
            return (
                <>
                    <div class="maincardBox__card-wrap">
                        {
                            getMainRender()
                        }
                    </div>
                </>
            )
        } else {
            return (
                <>
                    {
                        getMainRender()
                    }
                </>
            )
        }
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
                <ReadMore className="mg-b25 maincardBox__card-desc" description={timeline.description} />
                {
                    haveVideo &&
                    <p className="mg-b25 maincardBox__card-time " style={{ fontWeight: 'bold' }}>{`${MonthName[new Date(timeline.startTime).getMonth()]} ${new Date(timeline.startTime).getDate()}, ${new Date(timeline.startTime).getFullYear()} | ${new Date(timeline.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${new Date(timeline.startTime + (timeline.duration * 60 * 1000)).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}</p>
                }
                <h4 className="mg-b20 maincardBox__card-title">SPEAKERS</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                    {
                        timeline.speakers.map(id => (
                            <SpeakerProfile type={SpeakerProfileType.CARD_PROFILE} id={id} />
                        ))
                    }
                </div>

                {
                    haveLikeButton && !forEventPage &&
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
            {
                forEventPage &&
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
    )
}

export default AgendaCard
