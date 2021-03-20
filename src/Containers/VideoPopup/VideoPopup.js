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


function VideoPopup(props) {
    const playerRef = useRef(null);
    const { currVideosData, videoData, closeVideoPop } = props

    const { getLike, addLike, removeLike } = useContext(likeContext)
    const [like, setLike] = useState(false);
    const [likeCount, setLikeCount] = useState(videoData.likes);

    useEffect(() => {
        getCurrentTargetLikeStatus()
    }, [])

    const getCurrentTargetLikeStatus = async () => {
        if (videoData) {
            const status = await getLike(videoData.id)
            setLike(status)
        }
    }

    const toggleLikeToTarget = async () => {
        if (like) {
            const count = await removeLike(videoData.id, null, LikeType.VIDEO_LIKE)
            setLikeCount(count)

        } else {
            const count = await addLike(videoData.id, null, LikeType.VIDEO_LIKE)
            setLikeCount(count)
        }
        setLike(!like)
    }

    const seekTo = (timestamp) => {
        playerRef.current.seekTo(timestamp, "seconds");
    };

    const moreVideos = currVideosData.filter(currentVideoData => currentVideoData.id !== videoData.id)

    return (

        <div className="modalBox modalBox--large"  >
            <div className="modalBox__inner">
                <div className="modalBox__header">
                    <h3 className="modalBox__title"></h3>
                    <button className="modalBox__close-link" onClick={closeVideoPop}>CLOSE</button>
                </div>
                <div className="modalBox__body">
                    <div className="modalBox__video">
                        <ReactPlayer ref={playerRef}
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
                                <button className={`like-btn ${like ? 'like-btn--active' : ''}`} onClick={() => toggleLikeToTarget()}><i className="icon-like"></i>{likeCount}</button>
                                {
                                    videoData.pdf &&
                                    <button className="like-btn">Download PDF</button>
                                }
                            </div>
                            <div className="timelineBox">
                                {
                                    videoData.videoTimestamp.map(timeline =>
                                        <TimelineBoxItem timelineData={timeline} timelineClick={seekTo} />
                                    )
                                }
                            </div>
                        </div>

                        <div className="videodetailBox__left">
                            <h2 className="videodetailBox__title">{videoData.title}</h2>

                            <p className="videodetailBox__desc">{videoData.views} Views - {moment(videoData.timestamp.toMillis()).format("Do MMMM YYYY")}</p>
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

                            {
                                moreVideos.length > 0 &&
                                <>
                                    <h4 className="videodetailBox__subtitle">More Videos</h4>
                                    <div className="videodetailBox__list">
                                        {
                                            moreVideos.map(currentVideoData =>
                                                <VideoThumbnail_Compact />
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
