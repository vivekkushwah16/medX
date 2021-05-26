import React from "react";
import { SpeakerProfileType } from "../../AppConstants/SpeakerProfileType";
import SpeakerProfile from "../../Containers/SpeakerProfile.js/SpeakerProfile";
import AddToCalendar from "../AddToCalendar/AddToCalendar";
import "./bannerIndex.css";
import { isMobileOnly } from "react-device-detect";
//props -  mainTitle, subTitle_line1, subTitle_line2, route, mainImageUrl, gotoRoute(),buttonText
export function Custom1(props) {
  const { data } = props;
  return (
    <div className="bannerBox__inner gradient-bg2">
      <div
        className="bannerBox__slide"
        style={{ backgroundImage: `url(${data.mainImageUrl})` }}
      >
        <div class="container">
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
              href="#"
              className="btn  bannerBox__btn"
              onClick={() => props.goToRoute(data.route)}
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
        <div class="container">
          <div
            className={
              isMobileOnly ? "bannerSubLogo flexBoxC" : "bannerSubLogo"
            }
          >
            <img className=" mg-b20" src={data.logoImageUrl} alt="logo"></img>
            {/* <h1 className="bannerBox__featired-title mg-b50" style={{ color: '#fff' }}>{data.mainTitle}<br></br><span>{data.subTitle_line1}<br></br>{data.subTitle_line2}</span></h1> */}
            <a
              href="#"
              className="btn   bannerBox__btn"
              onClick={() => props.goToRoute(data.route)}
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
  const { data } = props;
  return (
    // bannerBox__inner2 gradient-bg4
    <div className="bannerBox__inner ">
      <div
        className="bannerBox__slide"
        style={{ backgroundImage: "url(/assets/images/banner-bg2.jpg)" }}
      >
        <div class="container">
          <div class="d-flex">
            <div className="bannerBox__left">
               ̰
              <h1 className="bannerBox__title mg-b30">{data.mainTitle}</h1>
              <div className="bannerBox__status mg-b30">
                <h3 className="bannerBox__status-title">{data.subTitle}</h3>
                {/* <span className="bannerBox__status-mark">LIVE</span> */}
              </div>
              <a
                href="#"
                className="btn bannerBox__btn mg-b30"
                onClick={(e) => {
                  e.preventDefault();
                  // console.log(data.eventId);
                  props.enterEvent(data.eventId);
                }}
              >
                ENTER EVENT
              </a>
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

//props -  mainTitle, subTitle_line1, subTitle_line2, speakerId, mainImageUrl, watchTrailer()
export function ImageSingleButtonBanner(props) {
  const { data } = props;

  return (
    <div className="bannerBox__inner gradient-bg2">
      <div className="bannerBox__slide">
        <div class="container">
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
        <div class="container">
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
        <div class="container">
          <div class="d-flex">
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
