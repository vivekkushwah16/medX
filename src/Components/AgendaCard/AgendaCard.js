import React, { useContext, useState, useEffect } from "react";
import {
  INVITEYOURFRIEND_EVENT_WHATSAPP,
  TEASER_EVENT,
  TIMELINE_LIKE_EVENT,
  TIMELINE_RATING_EVENT,
} from "../../AppConstants/AnalyticsEventName";
import { MonthName } from "../../AppConstants/Months";
import { SpeakerProfileType } from "../../AppConstants/SpeakerProfileType";
import { LikeType } from "../../AppConstants/TypeConstant";
import SpeakerProfile from "../../Containers/SpeakerProfile.js/SpeakerProfile";
import { AnalyticsContext } from "../../Context/Analytics/AnalyticsContextProvider";
import { UserContext } from "../../Context/Auth/UserContextProvider";
import { likeContext } from "../../Context/Like/LikeContextProvider";
import { analytics, database } from "../../Firebase/firebase";
import ReadMore from "../ReadMore/ReadMore";
import StartRating from "../StartRating/StartRating";

function AgendaCard(props) {
  const {
    timeline,
    haveVideo,
    haveLikeButton,
    animate,
    placeIndex,
    forEventPage,
    wantHeaderFooter,
    showLive,
    handleClick,
  } = props;
  const { getLike, addLike, removeLike, getRating, updateRating } =
    useContext(likeContext);
  const { userInfo, user } = useContext(UserContext);
  const { addGAWithUserInfo, addCAWithUserInfo } = useContext(AnalyticsContext);

  const [like, setLike] = useState(false);
  const [likeAmount, setLikeAmount] = useState(0);
  const [rating, setRating] = useState(null);

  useEffect(() => {
    getCurrentTargetLikeStatus();
    getCurrentTargetRatingStatus();
  }, []);

  useEffect(() => {
    getCurrentTargetLikeStatus();
    getCurrentTargetRatingStatus();
    setLikeAmount(timeline.likes);
  }, [timeline, haveLikeButton]);

  const getCurrentTargetLikeStatus = async () => {
    if (haveLikeButton) {
      if (timeline) {
        const status = await getLike(timeline.id);
        setLike(status);
      }
    }
  };

  const getCurrentTargetRatingStatus = async () => {
    if (haveLikeButton) {
      if (timeline) {
        const rat = await getRating(timeline.id);
        setRating(rat);
      }
    }
  };

  const updatingTimelineRating = async (rating) => {
    await updateRating(timeline.id, timeline.eventId, rating);
    addGAWithUserInfo(TIMELINE_RATING_EVENT, {
      timeline: timeline.id,
      rating: rating,
    });
    addCAWithUserInfo(
      `/${TIMELINE_RATING_EVENT}/${user.uid}_${timeline.id}`,
      false,
      { timeline: timeline.id, rating: rating }
    );
  };

  const toggleLikeToTarget = async () => {
    if (like) {
      await removeLike(timeline.id, timeline.eventId, LikeType.TIMELINE_LIKE);
      addGAWithUserInfo(TIMELINE_LIKE_EVENT, {
        timeline: timeline.id,
        status: false,
      });
      await database
        .ref(`/${TIMELINE_LIKE_EVENT}/${user.uid}_${timeline.id}`)
        .remove();
      setLikeAmount(likeAmount - 1);
    } else {
      await addLike(timeline.id, timeline.eventId, LikeType.TIMELINE_LIKE);
      addGAWithUserInfo(TIMELINE_LIKE_EVENT, {
        timeline: timeline.id,
        status: true,
      });
      addCAWithUserInfo(
        `/${TIMELINE_LIKE_EVENT}/${user.uid}_${timeline.id}`,
        false,
        { timeline: timeline.id }
      );
      setLikeAmount(likeAmount + 1);
    }
    setLike(!like);
  };
  const getMainRender = () => {
    return (
      <div
        style={{
          maxWidth: `${props.fromTitle ? "100%" : ""}`,
          paddingLeft: "none",
        }}
        key={`AgendaCard-${timeline.id}`}
        id={`AgendaCard-${timeline.id}`}
        className={`maincardBox__card ${timeline.videoUrl.length > 0 ? "maincardBox__card-video_canPlay" : ""
          } ${props.fromTitle ? "from__title" : ""}`}
      >
        {haveVideo && (
          <div
            className={`maincardBox__card-video `}
            style={{ backgroundImage: `url(${timeline.thumnailUrL})` }}
            onClick={(event) => {
              event.preventDefault();
              if (timeline.videoUrl.length > 0) {
                addGAWithUserInfo(TEASER_EVENT, {
                  timelineId: timeline.id,
                  eventId: timeline.eventId,
                });
                addCAWithUserInfo(
                  `/${TEASER_EVENT}/${user.uid}_${timeline.id}`,
                  false,
                  { timeline: timeline.id, eventId: timeline.eventId },
                  true
                );
                handleClick(timeline);
              }
            }}
          >
            {/* <div className="tint"></div> */}
            <a href="#" className="maincardBox__card-video__play">
              <i className="icon-play"></i>
            </a>
          </div>
        )}
        <div
          key={`AgendaCard-${timeline.id}-body`}
          className="maincardBox__card-body"
        >
          <div className="text-block">
            <h4 className="mg-b15 maincardBox__card-title">{timeline.title}</h4>
            {showLive ? (
              <div className="mg-b15 maincardBox__card-title d-flex">
                <h2 className="maincardBox__card-date">
                  {" "}
                  {`${new Date(timeline.startTime).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })} - ${new Date(
                    timeline.startTime + timeline.duration * 60 * 1000
                  ).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}`}
                </h2>
                <div className="liveBlock">
                  <span></span>
                  <div>Live</div>
                </div>
              </div>
            ) : (
              <h2 className="maincardBox__card-date mg-b10">
                {" "}
                {`${new Date(timeline.startTime).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })} - ${new Date(
                  timeline.startTime + timeline.duration * 60 * 1000
                ).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}`}
              </h2>
            )}
            {props.fromTitle ? (
              <p className="mg-b25 maincardBox__card-desc">
                {timeline.description}
              </p>
            ) : (
              <ReadMore
                className="mg-b25 maincardBox__card-desc"
                description={timeline.description}
              />
            )}
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "end",
            }}
          >
            {haveLikeButton && (
              <div
                className={`rating-block ${props.fromTitle ? "from__title__rating" : ""
                  }`}
              >
                <button
                  className={`mg-b40 mg-sm-b20 like-btn ${like ? "like-btn--active" : ""
                    } `}
                  onClick={() => toggleLikeToTarget()}
                >
                  <i className="icon-like"></i>
                  {likeAmount}
                </button>
                {forEventPage && rating !== null && (
                  <>
                    {props.fromTitle ? (
                      <div className="stars">
                        <StartRating
                          initalRating={rating}
                          updateRating={updatingTimelineRating}
                        />
                      </div>
                    ) : (
                      <>
                        <p className="font-12 mg-b20">
                          Please Rate this Session
                        </p>
                        <StartRating
                          initalRating={rating}
                          updateRating={updatingTimelineRating}
                        />
                      </>
                    )}
                  </>
                )}
              </div>
            )}
            {props.fromTitle && (
              <div>
                {props.currentActiveVideo.timelineId === timeline.id ? (
                  <span
                    className="like-btn"
                    style={{ background: "#015189", color: "#fff" }}
                  >
                    Watching
                  </span>
                ) : (
                  <span
                    className="like-btn like-btn--active"
                    onClick={() => handleClick(timeline.id, props.videoUrl)}
                  >
                    Watch Now
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {timeline.speakers && timeline.speakers.length > 0 && (
          <>
            <div className="maincardBox__card-footer">
              {timeline.speakers.length === 1 ? (
                <>
                  <h4 className="maincardBox__card-footer-title">Faculty</h4>
                  {timeline.speakers.map((id) => (
                    <SpeakerProfile
                      fromTitle={props.fromTitle}
                      type={SpeakerProfileType.CARD_PROFILE}
                      id={id}
                      key={`speaker-${id}`}
                    />
                  ))}
                </>
              ) : (
                <>
                  <h4 className="maincardBox__card-footer-title">Faculty</h4>
                  <div
                    className="wrap-speakers"
                    style={{ display: "flex", flexWrap: "wrap" }}
                  >
                    {timeline.speakers.map((id) => (
                      <SpeakerProfile
                        fromTitle={props.fromTitle}
                        type={SpeakerProfileType.CARD_PROFILE}
                        id={id}
                        key={`speaker-${id}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </div>
    );
  };

  if (wantHeaderFooter) {
    if (forEventPage) {
      return (
        <>
          <div className="maincardBox__card-wrap">{getMainRender()}</div>
        </>
      );
    } else {
      return <>{getMainRender()}</>;
    }
  }

  return (
    <div
      key={timeline.id}
      className={`maincardBox__card ${haveVideo ? "maincardBox__card--large" : ""
        } ${animate ? "maincardBox__card_animate" : ""}`}
      style={
        animate
          ? {
            animationDelay: `${placeIndex ? placeIndex * 0.25 : 0}s`,
          }
          : {}
      }
    >
      <div className="maincardBox__card-left">
        {haveVideo && (
          <>
            <div
              className="maincardBox__card-video"
              // onClick={() => { props.handleClick() }}
              style={{ backgroundImage: `url(${timeline.thumnailUrL})` }}
            >
              {/* <a href="#" className="maincardBox__card-video__play"><i
                                className="icon-play"></i></a> */}
              <div className="tint"></div>
            </div>
          </>
        )}
        {!haveVideo && (
          <>
            <h2 className="maincardBox__card-date mg-b10">{`${MonthName[new Date(timeline.startTime).getMonth()]
              } ${new Date(timeline.startTime).getDate()}, ${new Date(
                timeline.startTime
              ).getFullYear()} `}</h2>
            <p className="maincardBox__card-time">
              {new Date(timeline.startTime).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </>
        )}
      </div>
      <div className="maincardBox__card-right">
        <h4 className="mg-b15 maincardBox__card-title">{timeline.title}</h4>
        <ReadMore
          className="mg-b25 maincardBox__card-desc"
          description={timeline.description}
        />
        {haveVideo && (
          <p
            className="mg-b25 maincardBox__card-time "
            style={{ fontWeight: "bold" }}
          >{`${MonthName[new Date(timeline.startTime).getMonth()]} ${new Date(
            timeline.startTime
          ).getDate()}, ${new Date(
            timeline.startTime
          ).getFullYear()} | ${new Date(timeline.startTime).toLocaleTimeString(
            [],
            { hour: "2-digit", minute: "2-digit" }
          )} - ${new Date(
            timeline.startTime + timeline.duration * 60 * 1000
          ).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}`}</p>
        )}
        {timeline.speakers && timeline.speakers.length > 0 && (
          <>
            {timeline.speakers.length === 1 ? (
              <h4 className="mg-b20 maincardBox__card-title">SPEAKER</h4>
            ) : (
              <h4 className="mg-b20 maincardBox__card-title">SPEAKERS</h4>
            )}

            <div style={{ display: "flex", flexWrap: "wrap" }}>
              {timeline.speakers.map((id) => (
                <SpeakerProfile
                  type={SpeakerProfileType.CARD_PROFILE}
                  id={id}
                  key={id}
                />
              ))}
            </div>
          </>
        )}

        {haveLikeButton && !forEventPage && (
          <div className="rating-block">
            <button
              className={` mg-b40 mg-sm - b20 like-btn ${like ? "like-btn--active" : ""
                } `}
              onClick={() => toggleLikeToTarget()}
            >
              <i className="icon-like"></i>
              {timeline.likes}
            </button>
            {rating !== null && (
              <>
                <p className="font-14 mg-b20">Please Rate this Session?</p>
                <StartRating
                  initalRating={rating}
                  updateRating={updatingTimelineRating}
                />
              </>
            )}
          </div>
        )}
      </div>
      {forEventPage && (
        <div className="rating-block">
          <button
            className={` mg-b40 mg-sm - b20 like-btn ${like ? "like-btn--active" : ""
              } `}
            onClick={() => toggleLikeToTarget()}
          >
            <i className="icon-like"></i>
            {timeline.likes}
          </button>
          {rating !== null && (
            <>
              <p className="font-14 mg-b20">Please Rate this Session?</p>
              <StartRating
                initalRating={rating}
                updateRating={updatingTimelineRating}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default AgendaCard;
