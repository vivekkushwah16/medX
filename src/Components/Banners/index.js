import React, { useEffect, useState, useContext } from "react";
import { SpeakerProfileType } from "../../AppConstants/SpeakerProfileType";
import SpeakerProfile from "../../Containers/SpeakerProfile.js/SpeakerProfile";
import AddToCalendar from "../AddToCalendar/AddToCalendar";
import { useHistory } from "react-router";

import "./bannerIndex.css";
import { isMobileOnly } from "react-device-detect";
import Countdown from "../../Containers/Countdown/Countdown";
// import { } from "react/cjs/react.development";
import UserContextProvider, {
  UserBronchTalkMetaDataContext,
  UserMetaDataContext,
} from "../../Context/Auth/UserContextProvider";
import { AnalyticsContext } from "../../Context/Analytics/AnalyticsContextProvider";
import { NEWS_ROUTE } from "../../AppConstants/Routes";
import { NEWS_EXPLORE_BANNER_CLICK } from "../../AppConstants/AnalyticsEventName";
//props -  mainTitle, subTitle_line1, subTitle_line2, route, mainImageUrl, gotoRoute(),buttonText
export function Custom1(props) {
  const { data } = props;
  return (
    <div className="bannerBox__inner gradient-bg2">
      <div
        className="bannerBox__slide"
        style={{ backgroundImage: `url(${data.mainImageUrl})` }}
      >
        <div className="container">
          <div
            className={
              isMobileOnly ? "bannerBox__left flexBoxC" : "bannerBox__left"
            }
          >
            {isMobileOnly && (
              <img
                style={{ height: "2.8rem" }}
                className="mg-b30"
                src="/assets/images/logos/ciplamed-logo2.png"
              ></img>
            )}
            <h1
              id="banner"
              className="bannerBox__featired-title mg-b50"
              style={{ color: "#fff" }}
            >
              {data.mainTitle}
              <br></br>
              <span>
                {data.subTitle_line1}
                <br></br>
                {data.subTitle_line2}
              </span>
            </h1>
            {/* <a href="#" className="bannerBox__profile mg-b50">
                            <SpeakerProfile type={SpeakerProfileType.CARD_PROFILE} id={data.speakerId} />
                        </a> */}
            <a
              href={`#${data.route}`}
              className="btn  bannerBox__btn"
              onClick={(event) => {
                event.preventDefault();
                props.goToRoute(data.route);
              }}
            >
              {data.buttonText}
            </a>
          </div>
          {/* <div className="bannerBox__center">
                        <img src={data.mainImageUrl} alt="" />
                    </div> */}
        </div>
      </div>
    </div>
  );
}
//props -  logoImageUrl, route, mainImageUrl, gotoRoute(), buttonText
export function Custom2(props) {
  const { data } = props;
  return (
    <div className="bannerBox__inner gradient-bg2">
      <div
        className="bannerBox__slide"
        style={{ backgroundImage: `url(${data.mainImageUrl})` }}
      >
        <div className="container">
          <div
            className={
              isMobileOnly ? "bannerSubLogo flexBoxC" : "bannerSubLogo"
            }
          >
            <img className=" mg-b20" src={data.logoImageUrl} alt="logo"></img>
            {/* <h1 className="bannerBox__featired-title mg-b50" style={{ color: '#fff' }}>{data.mainTitle}<br></br><span>{data.subTitle_line1}<br></br>{data.subTitle_line2}</span></h1> */}
            <a
              href={`#${data.route}`}
              className="btn   bannerBox__btn"
              onClick={(event) => {
                event.preventDefault();
                props.goToRoute(data.route);
              }}
            >
              {data.buttonText}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

//props - mainTitle, subTitle, eventId, enterEvent()
export function LiveEventBanner(props) {
  const { data, needCountDown } = props;
  const userMetaData = useContext(UserMetaDataContext);
  const [isRegistered, setIsRegistered] = useState(false);
  useEffect(() => {
    if (userMetaData) {
      // console.log(userMetaData)
      let registeredEvents = userMetaData.events;
      // console.log(userMetaData.events)
      // console.log(data.eventId)

      if (registeredEvents) {
        if (registeredEvents.length > 0) {
          if (registeredEvents.indexOf(data.eventId) !== -1) {
            setIsRegistered(true);
          } else {
            setIsRegistered(false);
          }
        } else {
          setIsRegistered(false);
        }
      }
    }
  }, [userMetaData]);

  return (
    // bannerBox__inner2 gradient-bg4
    <div className="bannerBox__inner ">
      <div
        className="bannerBox__slide"
        style={{ backgroundImage: "url(/assets/images/banner-bg2.jpg)" }}
      >
        <div className="container">
          <div className="d-flex">
            <div
              className="bannerBox__left"
              style={data?.style?.bannerLeftStyle ?? {}}
            >
              ??<h1 className="bannerBox__title mg-b30">{data.mainTitle}</h1>
              <div className="bannerBox__status mg-b30">
                <h3 className="bannerBox__status-title">{data.subTitle}</h3>
                {/* <span className="bannerBox__status-mark">LIVE</span> */}
              </div>
              {needCountDown && <Countdown event={data.eventId} />}
              <a
                href="#"
                className="btn bannerBox__btn mg-b30"
                onClick={(e) => {
                  e.preventDefault();
                  // console.log(data.eventId);
                  props.enterEvent(data.eventName);
                }}
              >
                {isRegistered ? "ENTER EVENT" : "Sign Up"}
              </a>
            </div>
            <div
              className="bannerBox__right"
              style={data?.style?.bannerRightStyle ?? {}}
            >
              <img
                className="bannerBox__pic"
                style={data?.style?.bannerImageStyle ?? {}}
                src={data.mainImageUrl}
                alt=""
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

//props -  mainTitle, subTitle_line1, subTitle_line2, speakerId, mainImageUrl, watchTrailer()
export function ImageSingleButtonBanner(props) {
  const { data } = props;

  return (
    <div className="bannerBox__inner gradient-bg2">
      <div className="bannerBox__slide">
        <div className="container">
          <div className="bannerBox__left">
            <h1
              className="bannerBox__featired-title mg-b50"
              style={{ color: "#fff" }}
            >
              {data.mainTitle}
              <br></br>
              <span>
                {data.subTitle_line1}
                <br></br>
                {data.subTitle_line2}
              </span>
            </h1>
            <a href="#" className="bannerBox__profile mg-b50">
              <SpeakerProfile
                type={SpeakerProfileType.CARD_PROFILE}
                id={data.speakerId}
              />
            </a>
            <a
              href="#"
              className="btn  bannerBox__btn"
              onClick={() => props.watchTrailer(data.trailerUrl)}
            >
              Watch Trailer
            </a>
          </div>
          <div className="bannerBox__center">
            <img src={data.mainImageUrl} alt="" />
          </div>
        </div>
      </div>
    </div>
  );
}

//props -  mainTitle, speakerId, videoUrl, mainImageUrl, watchVideo()
export function PromoVideoBanner(props) {
  const { data } = props;

  return (
    <div className="bannerBox__inner gradient-bg2">
      <div
        className="bannerBox__slide"
        style={{ backgroundImage: `url(${data.mainImageUrl})` }}
      >
        <div className="container">
          <div className="bannerBox__left">
            <span
              className="bannerBox__subtitle mg-b0"
              style={{ color: "#fff" }}
            >
              {data.subTitle_line1}
            </span>
            <h1
              className="bannerBox__featired-title mg-b50"
              style={{ color: "#fff" }}
            >
              {data.mainTitle}
            </h1>
            {/* <a href="#" className="bannerBox__profile mg-b50">
                            <SpeakerProfile type={SpeakerProfileType.CARD_PROFILE} id={data.speakerId} />
                        </a> */}
            <a
              href="#"
              className="btn  bannerBox__btn"
              onClick={() => props.watchVideo(data.videoUrl)}
            >
              {data.buttonText}
            </a>
          </div>
          {/* <div className="bannerBox__center">
                        <img src={data.mainImageUrl} alt="" />
                    </div> */}
        </div>
      </div>
    </div>
  );
}

//props -  mainTitle, subTitle_line1, subTitle_line2, speakerId, mainImageUrl, watchTrailer()
export function UpcompingEventBanner(props) {
  const { data } = props;
  return (
    <div className="bannerBox__inner ">
      <div
        className="bannerBox__slide"
        style={{ backgroundImage: "url(/assets/images/banner-bg2.jpg)" }}
      >
        <div className="container">
          <div className="d-flex">
            <div className="bannerBox__left">
              <h1 className="bannerBox__maintitle mg-b30">{data.mainTitle}</h1>
              <p className="bannerBox__subtitle mg-b30">
                {data.subTitle_line1}
                <br></br>
                {data.subTitle_line2}
              </p>
              <p className="bannerBox__date mg-b30">{data.dateString}</p>
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
  );
}

export function LiveEventBanner2(props) {
  const { data, needCountDown } = props;
  const userBronchTalkMetaData = useContext(UserBronchTalkMetaDataContext);
  const [isRegistered, setIsRegistered] = useState(false);

  // console.log("Ssasasasasasasa", userBronchTalkMetaData);
  useEffect(() => {
    if (userBronchTalkMetaData) {
      // console.log(userMetaData)
      let registeredEvents = userBronchTalkMetaData.events;
      // console.log(userMetaData.events)
      // console.log(data.eventId)

      if (registeredEvents) {
        if (registeredEvents.length > 0) {
          if (registeredEvents.indexOf(data.eventId) !== -1) {
            setIsRegistered(true);
          } else {
            setIsRegistered(false);
          }
        } else {
          setIsRegistered(false);
        }
      }
    }
  }, [userBronchTalkMetaData]);

  return (
    // bannerBox__inner2 gradient-bg4
    <div className="bannerBox__inner ">
      <div
        className="bannerBox__slide"
        style={{ backgroundImage: "url(/assets/images/bronchbg.png)" }}
      >
        <div className="container">
          <div className="d-flex">
            <div
              className="bannerBox__left"
              style={data?.style?.bannerLeftStyle ?? {}}
            >
              ??<h1 className="bannerBox__title mg-b30">{data.mainTitle}</h1>
              <div className="bannerBox__status mg-b30">
                <h3 className="bannerBox__status-title">{data.subTitle}</h3>
                {/* <span className="bannerBox__status-mark">LIVE</span> */}
              </div>
              {/* {needCountDown && <Countdown event={data.eventId} />} */}
              <a
                href="#"
                className="btn bannerBox__btn mg-b30"
                onClick={(e) => {
                  e.preventDefault();
                  // console.log(data.eventId);
                  props.enterEvent(data.platformId);
                }}
              >
                {isRegistered ? "ENTER EVENT" : "JOIN NOW"}
              </a>
            </div>
            <div
              className="bannerBox__right"
              style={data?.style?.bannerRightStyle ?? {}}
            >
              <img
                className="bannerBox__pic"
                style={data?.style?.bannerImageStyle ?? {}}
                src={data.mainImageUrl}
                alt=""
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function MainNewsBanner(props) {
  const { data } = props;
  let history = useHistory();
  const { addGAWithUserInfo } = useContext(AnalyticsContext);

  const handleExplorebtn = () => {
    addGAWithUserInfo(NEWS_EXPLORE_BANNER_CLICK);
    history.push(NEWS_ROUTE);
  };

  return (
    <div className="bannerBox__inner gradient-bg2">
      <div
        className="bannerBox__slide"
        style={{ backgroundImage: `url(${data.mainImageUrl})` }}
      >
        <div className="container main_news_banner_container">
          <div>
            <h1
              id="banner"
              className="bannerBox__featired-title mg-b50 newsMainBanner"
              style={{ color: "#fff" }}
            >
              {data.mainTitle}
              <br></br>
              <span>
                <span className="newsMainBannersub1">
                  {data.subTitle_line1}
                </span>
                <br></br>
                <span>
                  {`${data.subTitle_line2.split(" ")[0]} ${
                    data.subTitle_line2.split(" ")[1]
                  }`}
                  &nbsp;
                  <span className="newsBannerFontWt">
                    {data.subTitle_line2.split(" ")[2]}
                  </span>
                </span>
                <br></br>
                <span className="newsBannerFontWt">
                  {data.subTitle_line3.split(" ")[0]}
                  <span style={{ fontWeight: "normal" }}>
                    &nbsp;
                    {data.subTitle_line3.split(" ")[1]}
                  </span>
                  <span className="newsBannerFontWt">
                    &nbsp;
                    {data.subTitle_line3.split(" ")[2]}
                  </span>
                </span>
              </span>
            </h1>
            {/* <a href="#" className="bannerBox__profile mg-b50">
                            <SpeakerProfile type={SpeakerProfileType.CARD_PROFILE} id={data.speakerId} />
                        </a> */}
            <div
              onClick={() => handleExplorebtn(data.route)}
              className="btn bannerBox__btn"
            >
              {data.buttonText}
            </div>
          </div>
          {/* <div className="bannerBox__center">
                        <img src={data.mainImageUrl} alt="" />
                    </div> */}
        </div>
      </div>
    </div>
  );
}
