import React, { useRef, useContext, useState, useEffect } from "react";
import ReactPlayer from "react-player";
import SpeakerProfile from "../SpeakerProfile.js/SpeakerProfile";
import { SpeakerProfileType } from "../../AppConstants/SpeakerProfileType";
import "./VideoPopup.css";
import { likeContext } from "../../Context/Like/LikeContextProvider";
import { LikeType } from "../../AppConstants/TypeConstant";
import moment from "moment";
import TimelineBoxItem from "../../Components/TimelineBoxItem/TimelineBoxItem";
import VideoThumbnail_Compact from "../../Components/VideoThumbnail_Compact/VideoThumbnail_Compact";
import VideoManager from "../../Managers/VideoManager";
import { UserContext } from "../../Context/Auth/UserContextProvider";
import StartRating from "../../Components/StartRating/StartRating";
import { AnalyticsContext } from "../../Context/Analytics/AnalyticsContextProvider";
import InviteFriendModal from "../../Components/InviteFriend/InviteFriendModal/InviteFriendModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShare } from "@fortawesome/free-solid-svg-icons";
import ShareVideoLink from "../../Components/ShareVideoLink/ShareVideoLink";
import {
  VIDEO_CLICK,
  VIDEO_KEYFRAME_CLICK,
  VIDEO_TIMESPENT,
} from "../../AppConstants/AnalyticsEventName";
import { scrollToTop } from "react-scroll/modules/mixins/animate-scroll";
import Header from "../Header/Header";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const timeLimit = 10;
let currenttimeWatched = 0;
let randomNextVideo = -1;

function VideoPopup(props) {
  const playerRef = useRef(null);
  const {
    metadata,
    currVideosData,
    videoData: _vd,
    closeVideoPop,
    openVideoPop,
  } = props;
  const [videoData, setVideoData] = useState(_vd);
  const { getLike, addLike, removeLike, updateRating, getRating } =
    useContext(likeContext);
  const [like, setLike] = useState(false);
  const [likeCount, setLikeCount] = useState(videoData.likes);
  const [inviteFriend, setInviteFriend] = useState(false);
  const { setVideoMetaData } = useContext(UserContext);
  const [minPlayed, setMinPlayed] = useState(0);
  const [rating, setRating] = useState(null);
  const [isPlaying, playingStatus] = useState(null);
  const [isEnded, endedStatus] = useState(null);
  const { addGAWithUserInfo, addCAWithUserInfo } = useContext(AnalyticsContext);
  const { user } = useContext(UserContext);

  const headerRef = useRef(null);

  const scrollToHeader = () => {
    if (headerRef.current) {
      headerRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    getVideoData();
    setLikeCount(props.videoData.likes);
    getCurrentTargetLikeStatus();
    getCurrentTargetRatingStatus();
    VideoManager.getVideoWithId(props.videoData.id).then((data) => {
      setVideoData(data);
    });
    window.videoTimeSpent = 0;
    window.videoStartTimestamp = null;
    window.videoEndTimestmap = null;
    window.isOnHold = false;
  }, [props.videoData]);

  useEffect(() => {
    if (playerRef.current) {
      seekTo(metadata.lastKnownTimestamp);
      currenttimeWatched = 0;
    }
  }, [playerRef.current]);

  const getVideoData = async () => {
    const videoDataNew = await VideoManager.getVideoWithId(props.videoData.id);
    // setNewVideoData(videoDataNew)
    setLikeCount(videoDataNew.likes);
  };

  const [runningTimer, setRunningTimer] = useState(false);
  const runTimer = async () => {
    // console.log('Still being called');
    if (currenttimeWatched >= timeLimit) {
      return;
    }
    currenttimeWatched += 1;
    // console.log('inc timer ', currenttimeWatched)
    if (currenttimeWatched >= timeLimit) {
      stopTimer();
      let newCount = await VideoManager.addView(videoData.id);
      // console.log(newCount);
    }
  };

  useEffect(
    function () {
      if (!runningTimer) {
        return;
      }

      const intervalId = setInterval(() => {
        runTimer();
      }, 1000);
      return () => {
        // console.log('Reached cleanup function');
        clearInterval(intervalId);
      };
    },
    [runningTimer]
  );

  const calculateTimeSpent = () => {
    window.isOnHold = false;
    window.videoEndTimestmap = new Date().getTime();
    window.videoTimeSpent +=
      window.videoEndTimestmap - window.videoStartTimestamp;
    // console.log(window.videoTimeSpent, "<-- timespent", window.videoStartTimestamp, window.videoEndTimestmap)
    window.previousStartTimestamp = window.videoStartTimestamp;
  };

  function startTimer() {
    // console.log("startTimer------------------------------------")
    if (window.isOnHold && window.videoStartTimestamp) {
      calculateTimeSpent();
    }
    window.videoStartTimestamp = new Date().getTime();
    setRunningTimer(true);
  }

  function stopTimer() {
    // console.log("stopTimer------------------------------------", window.videoStartTimestamp, window.videoEndTimestmap)
    if (
      window.videoStartTimestamp &&
      window.previousStartTimestamp !== window.videoStartTimestamp
    ) {
      calculateTimeSpent();
    }
    setRunningTimer(false);
  }

  const getCurrentTargetLikeStatus = async () => {
    if (videoData) {
      const status = await getLike(videoData.id);
      setLike(status);
    }
  };

  const toggleLikeToTarget = async () => {
    if (like) {
      // console.log("removeLike")
      const count = await removeLike(videoData.id, null, LikeType.VIDEO_LIKE);
      setLikeCount(count);
    } else {
      // console.log("addLike")
      const count = await addLike(videoData.id, null, LikeType.VIDEO_LIKE);
      setLikeCount(count);
    }
    setLike(!like);
  };

  const seekTo = (timestamp) => {
    playerRef.current.seekTo(timestamp, "seconds");
  };

  let moreVideos = [];
  if (currVideosData) {
    moreVideos = currVideosData.filter(
      (currentVideoData) => currentVideoData.id !== videoData.id
    );
    if (randomNextVideo == -1) {
      randomNextVideo = Math.floor(Math.random() * moreVideos.length);
      // console.log(randomNextVideo);
    }
  }

  const updatingTimelineRating = async (rating) => {
    await updateRating(videoData.id, null, rating);
    setRating(rating);
  };

  const getCurrentTargetRatingStatus = async () => {
    if (videoData.id) {
      const rat = await getRating(videoData.id);
      setRating(rat);
    }
  };

  const addVideoClickAnalytics = (videoData) => {
    addGAWithUserInfo(VIDEO_CLICK, {
      tag: _vd.tagSelectedFrom,
      videoId: videoData.id,
    });
    addCAWithUserInfo(
      `/${VIDEO_CLICK}/${user.uid}_${videoData.id}`,
      false,
      { tag: _vd.tagSelectedFrom, videoId: videoData.id },
      true
    );
  };

  const addAnalyticsKeyFrameClick = (keyframe) => {
    addGAWithUserInfo(VIDEO_KEYFRAME_CLICK, {
      tag: _vd.tagSelectedFrom,
      videoId: _vd.id,
      title: keyframe.title,
    });
    addCAWithUserInfo(
      `/${VIDEO_KEYFRAME_CLICK}/${user.uid}_${videoData.id}`,
      false,
      { tag: _vd.tagSelectedFrom, videoId: _vd.id, title: keyframe.title },
      true
    );
  };

  const addTimeSpentAnalytics = () => {
    if (playerRef.current) {
      if (playerRef.current.player.isPlaying) {
        calculateTimeSpent();
      }
      addGAWithUserInfo(VIDEO_TIMESPENT, {
        tag: _vd.tagSelectedFrom,
        videoId: videoData.id,
        timespent: window.videoTimeSpent,
        duration: playerRef.current.getDuration(),
        lastTimestamp: playerRef.current.getCurrentTime(),
      });
      addCAWithUserInfo(
        `/${VIDEO_TIMESPENT}/${user.uid}_${videoData.id}`,
        false,
        {
          tag: _vd.tagSelectedFrom,
          videoId: videoData.id,
          duration: playerRef.current.getDuration(),
          lastTimestamp: playerRef.current.getCurrentTime(),
        },
        false,
        { name: "timespent", value: window.videoTimeSpent }
      );
    }
  };
  const closeInvitePopup = () => {
    setInviteFriend(false);
  };
  const __closeVideoPop = () => {
    document.getElementsByTagName("body")[0].style.overflow = "auto";
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
    addTimeSpentAnalytics();
    closeVideoPop(videoData);
  };

  return (
    <>
      {inviteFriend ? (
        <ShareVideoLink
          message={`Check out this informative video from CiplaMedX: LINK: ${window.location.href}`}
          zIndex={18}
          email_endpoint="https://ciplamedx-mail.djvirtualevents.com/shareVideo"
          closeInvitePopup={closeInvitePopup}
          title={videoData.title}
        />
      ) : (
        ""
      )}

      <div
        className="modalBox modalBox--large active videoModalBox"
        id="videoPopupDiv"
      >
        <span
          class="modalBox__overlay"
          onClick={() => {
            __closeVideoPop();
          }}
        ></span>
        <div className="modalBox__inner">
          <div className="modalBox__header" ref={headerRef}>
            <h3 className="modalBox__title"></h3>
            <button
              className="modalBox__close-link"
              onClick={() => {
                __closeVideoPop();
              }}
            >
              CLOSE
            </button>
          </div>
          <div className="modalBox__body">
            {playerRef.current &&
              isPlaying == false &&
              isPlaying != null &&
              !isEnded && (
                <>
                  <div
                    style={{
                      pointerEvents: "none",
                      position: "absolute",
                      zIndex: "1",
                      width: "100%",
                      height: "calc(0.56 * 56rem)",
                      backgroundImage: "linear-gradient(black , transparent)",
                    }}
                  ></div>
                  <div
                    style={{
                      pointerEvents: "none",
                      position: "absolute",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      zIndex: "1",
                      width: "100%",
                      height: "calc(0.56 * 56rem)",
                      backgroundImage: "linear-gradient(transparent , black)",
                    }}
                  >
                    <i
                      className="icon-play"
                      style={{
                        fontSize: "1.5rem",
                        color: "white",
                        borderRadius: "0.5rem",
                        background: "#30c1ff",
                        padding: "0.9rem 1.3rem 1rem 1.9rem",
                      }}
                    ></i>
                  </div>
                </>
              )}
            {playerRef.current && isEnded && (
              <>
                <div
                  style={{
                    pointerEvents: "none",
                    position: "absolute",
                    zIndex: "1",
                    width: "100%",
                    height: "calc(0.56 * 56rem)",
                    backgroundImage: "linear-gradient(black , transparent)",
                  }}
                ></div>
                <div
                  style={{
                    position: "absolute",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    zIndex: "1",
                    width: "100%",
                    height: "calc(0.56 * 56rem)",
                    backgroundImage: "linear-gradient(transparent , black)",
                  }}
                >
                  <span
                    style={{
                      width: "60%",
                      fontSize: "1.5rem",
                      fontWeight: "500",
                      color: "#00adef",
                      marginBottom: "0.4rem",
                    }}
                  >
                    Watch More..
                  </span>
                  <div
                    style={{
                      width: "60%",
                      background: "#0869a8",
                      height: "0.08rem",
                      "margin-bottom": "1rem",
                    }}
                  ></div>
                  <div style={{ width: "60%" }}>
                    <VideoThumbnail_Compact
                      videosData={currVideosData}
                      currentVideoData={moreVideos[randomNextVideo]}
                      openVideoPop={(currentVideoData, videosData) => {
                        addVideoClickAnalytics(currentVideoData);
                        __closeVideoPop();
                        openVideoPop(
                          videoData,
                          currentVideoData,
                          videosData,
                          currentVideoData.tagSelectedFrom
                        );
                      }}
                    />
                  </div>
                  {/* <i className='icon-play' style={{ fontSize: "2rem",color: 'white',borderRadius: '1rem',background: "#30c1ff",padding: "0.9rem 1.3rem 1rem 1.9rem"}}></i> */}
                </div>
              </>
            )}
            <div className="modalBox__video" style={{ cursor: "pointer" }}>
              <ReactPlayer
                ref={playerRef}
                playing={true}
                url={videoData.videoUrl}
                volume={0.85}
                controls={true}
                width={"auto"}
                height={"calc(0.56 * 56rem)"}
                // onPlay={startTimer}
                style={{ backgroundColor: "black" }}
                playsinline={true}
                onPlay={() => {
                  startTimer();
                  // console.log("playing!!")
                  playingStatus(true);
                  endedStatus(false);
                }}
                onBuffer={() => {
                  // console.log('isBuffereing');
                  window.isOnHold = true;
                }}
                onSeek={() => {
                  // console.log("seekingg!!")
                  window.isOnHold = true;
                }}
                onPause={() => {
                  // console.log("paused!!")
                  playingStatus(false);
                  stopTimer();
                }}
                onEnded={() => {
                  // console.log("ended!!")
                  endedStatus(true);
                  stopTimer();
                }}
                onProgress={(event) => {
                  if (videoData && videoData.videoTimestamp) {
                    setMinPlayed(event.playedSeconds);
                  }
                }}
              ></ReactPlayer>
            </div>
            {/* <div className="modalBox__video"> */}

            {/* </div> */}
            <div className="videodetailBox">
              <div className="videodetailBox__right hide-on-mobile">
                <div className="likeBtnContainer  mg-b40">
                  {/* dsk-like */}
                  {rating !== null && (
                    <>
                      <div className="starParent ">
                        {/* dsk */}
                        <StartRating
                          initalRating={rating}
                          updateRating={updatingTimelineRating}
                        />
                      </div>
                      <button
                        className={`like-btn ${like ? "like-btn--active" : ""}`}
                        onClick={() => toggleLikeToTarget()}
                      >
                        <i className="icon-like"></i>
                        {likeCount}
                      </button>
                    </>
                  )}
                  <div className="btns-div">
                    <button
                      className={`like-btn`}
                      onClick={() => {
                        setInviteFriend(true);
                      }}
                    >
                      <FontAwesomeIcon icon={faShare} />
                      {"Share"}
                    </button>
                  </div>
                  {videoData.pdf && (
                    <button className="like-btn">Download PDF</button>
                  )}
                </div>
                <div className="timelineBox">
                  {videoData.videoTimestamp.map((timeline) => (
                    <TimelineBoxItem
                      minPlayed={minPlayed}
                      timelineData={timeline}
                      timelineClick={(time) => {
                        scrollToHeader();
                        addAnalyticsKeyFrameClick(timeline);
                        seekTo(time);
                      }}
                    />
                  ))}
                </div>
              </div>

              <div className="videodetailBox__left">
                <h2 className="videodetailBox__title">{videoData.title}</h2>

                <p className="videodetailBox__views">
                  {/* {videoData.views} Views  */}
                  {moment(videoData.timestamp.toMillis()).format("MMMM YYYY") +
                    " "}
                  {playerRef.current && playerRef.current.getDuration() > 0 && (
                    <>
                      {"-" +
                        moment("2015-01-01")
                          .startOf("day")
                          .seconds("" + playerRef.current.getDuration())
                          .format(
                            playerRef.current.getDuration() > 3600
                              ? "H:mm:ss"
                              : "mm:ss"
                          )}{" "}
                      mins
                    </>
                  )}
                </p>
                <div
                  style={{
                    width: "100%",
                    background: "rgb(255 255 255 / 18%)",
                    height: "0.01rem",
                    "margin-bottom": "1rem",
                  }}
                ></div>
                {videoData.speakers && videoData.speakers.length > 0 && (
                  <>
                    <h4 className="videodetailBox__subtitle mg-t10">
                      {/* SPEAKERS */}
                    </h4>

                    <div className="videodetailBox__profiles">
                      {videoData.speakers.map((speaker) => (
                        <SpeakerProfile
                          type={SpeakerProfileType.CARD_PROFILE}
                          id={speaker}
                        />
                      ))}
                    </div>
                  </>
                )}
                <p
                  className="videodetailBox__desc mg-b40"
                  style={{ textAlign: "justify" }}
                >
                  {videoData.description}
                </p>

                <div className="hide-on-desktop mg-t20">
                  <div className="likeBtnContainer">
                    {rating !== null && (
                      <>
                        <div className="starParent">
                          <StartRating
                            initalRating={rating}
                            updateRating={updatingTimelineRating}
                          />
                        </div>
                      </>
                    )}
                    <button
                      className={`like-btn ${like ? "like-btn--active" : ""}`}
                      onClick={() => toggleLikeToTarget()}
                    >
                      <i className="icon-like"></i>
                      {likeCount}
                    </button>
                    <button
                      className={`like-btn`}
                      style={{ marginLeft: "1rem" }}
                      onClick={() => {
                        setInviteFriend(true);
                      }}
                    >
                      <FontAwesomeIcon icon={faShare} />
                      {"Share"}
                    </button>
                    {videoData.pdf && (
                      <button className="like-btn">Download PDF</button>
                    )}
                  </div>
                  <div className="timelineBox mobileView_timelineBox">
                    {videoData.videoTimestamp.map((timeline) => (
                      <TimelineBoxItem
                        minPlayed={minPlayed}
                        timelineData={timeline}
                        timelineClick={seekTo}
                      />
                    ))}
                  </div>
                </div>

                {/* <p className="videodetailBox__desc"><a href="javascript:void(0)">Show Less</a></p> */}

                {/* {
                                moreVideos.length > 0 &&
                                <>
                                    <h4 className="videodetailBox__subtitle mg-t20">More Videos</h4>
                                    <div className="videodetailBox__list">
                                        {
                                            moreVideos.map(currentVideoData =>
                                                <VideoThumbnail_Compact videosData={currVideosData} currentVideoData={currentVideoData} openVideoPop={(currentVideoData, videosData) => {
                                                    __closeVideoPop()
                                                    addVideoClickAnalytics(currentVideoData)
                                                    openVideoPop(videoData, currentVideoData, videosData, currentVideoData.tagSelectedFrom)
                                                }} />
                                            )
                                        }
                                    </div>
                                </>
                            } */}
              </div>
            </div>

            <div className="videodetailBox">
              <div className="videodetailBox__left">
                {moreVideos.length > 0 && (
                  <>
                    <h4 className="videodetailBox__subtitle mg-t20">
                      More Videos
                    </h4>
                    <div className="videodetailBox__list">
                      {moreVideos.map((currentVideoData) => (
                        <VideoThumbnail_Compact
                          videosData={currVideosData}
                          currentVideoData={currentVideoData}
                          openVideoPop={(currentVideoData, videosData) => {
                            __closeVideoPop();
                            addVideoClickAnalytics(currentVideoData);
                            openVideoPop(
                              videoData,
                              currentVideoData,
                              videosData,
                              currentVideoData.tagSelectedFrom
                            );
                          }}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default VideoPopup;
