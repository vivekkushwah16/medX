import React, { useRef, useContext, useState, useEffect } from 'react'
import ReactPlayer from 'react-player'
import SpeakerProfile from '../SpeakerProfile.js/SpeakerProfile'
import { SpeakerProfileType } from '../../AppConstants/SpeakerProfileType'
import './VideoPopup.css'
import { likeContext } from '../../Context/Like/LikeContextProvider'
import { LikeType } from '../../AppConstants/TypeConstant'
import moment from 'moment'
import TimelineBoxItem from '../../Components/TimelineBoxItem/TimelineBoxItem'
import VideoThumbnail_Compact from '../../Components/VideoThumbnail_Compact/VideoThumbnail_Compact'
import VideoManager from '../../Managers/VideoManager'
import { UserContext } from '../../Context/Auth/UserContextProvider'
import StartRating from '../../Components/StartRating/StartRating'
import { AnalyticsContext } from '../../Context/Analytics/AnalyticsContextProvider'
import { VIDEO_CLICK, VIDEO_KEYFRAME_CLICK } from '../../AppConstants/AnalyticsEventName'

const timeLimit = 10;
let currenttimeWatched = 0;

function VideoPopup(props) {
    const playerRef = useRef(null);
    const { metadata, currVideosData, videoData: _vd, closeVideoPop, openVideoPop } = props
    const [videoData, setVideoData] = useState(_vd)
    const { getLike, addLike, removeLike, updateRating, getRating } = useContext(likeContext)
    const [like, setLike] = useState(false);
    const [likeCount, setLikeCount] = useState(videoData.likes);
    const { setVideoMetaData } = useContext(UserContext);
    const [minPlayed, setMinPlayed] = useState(0)
    const [rating, setRating] = useState(null);
    const { addGAWithUserInfo, addCAWithUserInfo } = useContext(AnalyticsContext)
    const { user } = useContext(UserContext)

    useEffect(() => {
        setLikeCount(props.videoData.likes);
        getCurrentTargetLikeStatus();
        getCurrentTargetRatingStatus();
        VideoManager.getVideoWithId(props.videoData.id).then(data => {
            setVideoData(data)
        })
    }, [props.videoData])

    useEffect(() => {
        if (playerRef.current) {
            seekTo(metadata.lastKnownTimestamp);
            currenttimeWatched = 0;
        }
    }, [playerRef.current])

    const [runningTimer, setRunningTimer] = useState(false);
    const runTimer = async () => {
        // console.log('Still being called');
        if (currenttimeWatched >= timeLimit) { return }
        currenttimeWatched += 1
        // console.log('inc timer ', currenttimeWatched)
        if (currenttimeWatched >= timeLimit) {
            stopTimer();
            let newCount = await VideoManager.addView(videoData.id);
            // console.log(newCount);
        }
    }

    useEffect(
        function () {
            if (!runningTimer) {
                return;
            }

            const intervalId = setInterval(() => {
                runTimer();
            }, 1000);
            return () => {
                console.log('Reached cleanup function');
                clearInterval(intervalId);
            };
        },
        [runningTimer]
    );

    function startTimer() {
        setRunningTimer(true);
    }

    function stopTimer() {
        setRunningTimer(false);
    }

    const getCurrentTargetLikeStatus = async () => {
        if (videoData) {
            const status = await getLike(videoData.id)
            setLike(status)
        }
    }

    const toggleLikeToTarget = async () => {
        if (like) {
            // console.log("removeLike")
            const count = await removeLike(videoData.id, null, LikeType.VIDEO_LIKE)
            setLikeCount(count)

        } else {
            // console.log("addLike")
            const count = await addLike(videoData.id, null, LikeType.VIDEO_LIKE)
            setLikeCount(count)
        }
        setLike(!like)
    }

    const seekTo = (timestamp) => {
        playerRef.current.seekTo(timestamp, "seconds");
    };
    let moreVideos = []
    if (currVideosData)
        moreVideos = currVideosData.filter(currentVideoData => currentVideoData.id !== videoData.id)


    const updatingTimelineRating = async (rating) => {
        await updateRating(videoData.id, null, rating)
        setRating(rating)
    }

    const getCurrentTargetRatingStatus = async () => {
        if (videoData.id) {
            const rat = await getRating(videoData.id)
            setRating(rat)
        }
    }

    const addVideoClickAnalytics = (videoData) => {
        addGAWithUserInfo(VIDEO_CLICK, { tag: _vd.tagSelectedFrom, videoId: videoData.id })
        addCAWithUserInfo(`/${VIDEO_CLICK}/${user.uid}_${videoData.id}`, false, { tag: _vd.tagSelectedFrom, videoId: videoData.id }, true)
    }

    const addAnalyticsKeyFrameClick = (keyframe) => {
        addGAWithUserInfo(VIDEO_KEYFRAME_CLICK, { tag: _vd.tagSelectedFrom, videoId: _vd.id, title: keyframe.title })
        addCAWithUserInfo(`/${VIDEO_KEYFRAME_CLICK}/${user.uid}_${videoData.id}`, false, { tag: _vd.tagSelectedFrom, videoId: _vd.id, title: keyframe.title }, true)
    }

    return (
        <div className="modalBox modalBox--large active videoModalBox"  >
            <span class="modalBox__overlay" onClick={() => {
                stopTimer();
                if (playerRef.current) {
                    var currentTime = playerRef.current.getCurrentTime();
                    var duration = playerRef.current.getDuration();
                    // console.log(videoData.id, currentTime, duration);
                    if (currentTime && duration) {
                        setVideoMetaData(videoData.id, currentTime, duration);
                        // console.log(videoData.id, currentTime, duration);
                    }
                }
                closeVideoPop(videoData);
            }}></span>
            <div className="modalBox__inner">
                <div className="modalBox__header">
                    <h3 className="modalBox__title"></h3>
                    <button className="modalBox__close-link" onClick={() => {
                        stopTimer();
                        if (playerRef.current) {
                            var currentTime = playerRef.current.getCurrentTime();
                            var duration = playerRef.current.getDuration();
                            // console.log(videoData.id, currentTime, duration);
                            if (currentTime && duration) {
                                setVideoMetaData(videoData.id, currentTime, duration);
                                // console.log(videoData.id, currentTime, duration);
                            }
                        }
                        closeVideoPop(videoData);
                    }}>CLOSE</button>
                </div>
                <div className="modalBox__body">
                    <div className="modalBox__video">
                        <ReactPlayer ref={playerRef}
                            playing={true}
                            url={videoData.videoUrl}
                            volume={0.85}
                            controls={true}
                            width={"auto"}
                            height={"calc(0.56 * 56rem)"}
                            onPlay={startTimer}
                            style={{ "backgroundColor": "black" }}
                            playsinline={true}
                            onPause={() => {
                                stopTimer()
                            }}
                            onProgress={(event) => {
                                if (videoData && videoData.videoTimestamp) {
                                    setMinPlayed(event.playedSeconds)
                                }
                            }}
                        ></ReactPlayer>
                    </div>

                    <div className="videodetailBox">
                        <div className="videodetailBox__right hide-on-mobile">
                            <div className="likeBtnContainer mg-b40">
                                <button className={`like-btn ${like ? 'like-btn--active' : ''}`} onClick={() => toggleLikeToTarget()}><i className="icon-like"></i>{likeCount}</button>
                                {
                                    videoData.pdf &&
                                    <button className="like-btn">Download PDF</button>
                                }
                            </div>
                            <div className="timelineBox">
                                {
                                    videoData.videoTimestamp.map(timeline =>
                                        <TimelineBoxItem minPlayed={minPlayed} timelineData={timeline} timelineClick={(time) => {
                                            addAnalyticsKeyFrameClick(timeline)
                                            seekTo(time)
                                        }} />
                                    )
                                }
                            </div>
                        </div>

                        <div className="videodetailBox__left">
                            <h2 className="videodetailBox__title">{videoData.title}</h2>

                            <p className="videodetailBox__views">{videoData.views} Views - {moment(videoData.timestamp.toMillis()).format("Do MMMM YYYY")}</p>
                            <p className="videodetailBox__desc mg-b10">{videoData.description}</p>

                            {
                                rating !== null &&
                                <StartRating initalRating={rating} updateRating={updatingTimelineRating} />
                            }

                            <div className="hide-on-desktop mg-t20">
                                <div className="likeBtnContainer">
                                    <button className={`like-btn ${like ? 'like-btn--active' : ''}`} onClick={() => toggleLikeToTarget()}><i className="icon-like"></i>{likeCount}</button>
                                    {
                                        videoData.pdf &&
                                        <button className="like-btn">Download PDF</button>
                                    }
                                </div>
                                <div className="timelineBox mobileView_timelineBox">
                                    {
                                        videoData.videoTimestamp.map(timeline =>
                                            <TimelineBoxItem minPlayed={minPlayed} timelineData={timeline} timelineClick={seekTo} />
                                        )
                                    }
                                </div>
                            </div>


                            {/* <p className="videodetailBox__desc"><a href="javascript:void(0)">Show Less</a></p> */}
                            {
                                videoData.speakers &&
                                <>
                                    <h4 className="videodetailBox__subtitle mg-t20">SPEAKERS</h4>

                                    <div className="videodetailBox__profiles">
                                        {
                                            videoData.speakers.map(speaker =>
                                                <SpeakerProfile type={SpeakerProfileType.CARD_PROFILE} id={speaker} />
                                            )
                                        }
                                    </div>
                                </>
                            }

                            {
                                moreVideos.length > 0 &&
                                <>
                                    <h4 className="videodetailBox__subtitle">More Videos</h4>
                                    <div className="videodetailBox__list">
                                        {
                                            moreVideos.map(currentVideoData =>
                                                <VideoThumbnail_Compact videosData={currVideosData} currentVideoData={currentVideoData} openVideoPop={(currentVideoData, videosData) => {

                                                    addVideoClickAnalytics(currentVideoData)
                                                    openVideoPop(videoData, currentVideoData, videosData)
                                                }} />
                                            )
                                        }
                                    </div>
                                </>
                            }

                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default VideoPopup
