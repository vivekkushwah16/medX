import React, { useContext, useState, useEffect, useMemo, useRef } from "react";
import { eventContext } from "../../Context/Event/EventContextProvider";
import Header from "../../Containers/Header/Header";
import AddToCalendar from "../../Components/AddToCalendar/AddToCalendar";
import { MediaModalContext } from "../../Context/MedialModal/MediaModalContextProvider";
import { MediaModalType } from "../../AppConstants/ModalType";
import { AnalyticsContext } from "../../Context/Analytics/AnalyticsContextProvider";
import { MonthName } from "../../AppConstants/Months";
import AgendaNavBar from "../../Components/Event/AgendaNavBar/AgendaNavBar";
import AgendaCard from "../../Components/AgendaCard/AgendaCard";
import "./PreEvent.css";
import axios from "axios";
import { isMobileOnly } from "react-device-detect";
import { Route, Switch } from "react-router-dom";
import {
  KNOW_YOUR_SPEAKER_CLICK_EVENT,
  WATCHTRAILER_ANALYTICS_EVENT,
  OLD_USER_REGISTER_EVENT,
} from "../../AppConstants/AnalyticsEventName";
import blur__img from "./pre_event_blur.svg";

// import leftTest from "./preEventPage_left_heading.svg";
// import RightTest from "./preEventPage_right_speakers.png";
// import leftMobileTest from "./prevent_mobile_info.png";
// import rightMobileTest from "./preevent_mobile_Speaker.png";

import firebase, { firestore } from "../../Firebase/firebase";
import { USERMETADATA_COLLECTION } from "../../AppConstants/CollectionConstants";
import { UserContext } from "../../Context/Auth/UserContextProvider";
import LoadableFallback from "../../Components/LoadableFallback/LoadableFallback";
import { useHistory } from "react-router-dom";
import Myprofile from "../../Containers/myProfile/Myprofile";
import { HOME_ROUTE } from "../../AppConstants/Routes";
import { EVENT_CONFIRMATION_ENDPOINT } from "../../AppConstants/APIEndpoints";
import { RegistrationType } from "../../AppConstants/TypeConstant";
import { addToEventRegistered_IndexDB } from "../../utils/notificationsManager";

function PreEvent(props) {
  const { user, userInfo } = useContext(UserContext);
  const { showMediaModal } = useContext(MediaModalContext);
  const [agendaData, setAgendaData] = useState(null);
  const [agendaDates, setAgendaDates] = useState([]);
  const [cureentAgendaDate, setCureentAgendaDate] = useState(null);
  const history = useHistory();
  const [showRegisterForOldUser, setToggleForRegisterationForOldUser] =
    useState({ status: false, value: false });
  const { attachTimelineListener, removeTimelineListener } =
    useContext(eventContext);
  const { addGAWithUserInfo, addCAWithUserInfo } = useContext(AnalyticsContext);

  let firstTime = useMemo(() => true, []);
  const regeristerUser = async () => {
    try {
      setToggleForRegisterationForOldUser({ status: false, value: true });
      await firestore
        .collection(USERMETADATA_COLLECTION)
        .doc(user.uid)
        .update({
          events: firebase.firestore.FieldValue.arrayUnion(props.event),
        });

      // add the event to indexDB
      addToEventRegistered_IndexDB([{ id: props.event, status: true }])

      const confirmationMailResponse = await axios({
        method: "post",
        url: EVENT_CONFIRMATION_ENDPOINT,
        data: {
          title: props.eventTitle,
          email: userInfo.email,
          mobileNumber: userInfo.phoneNumber,
          name: `${userInfo.firstName} ${userInfo.lastName ? userInfo.lastName : ""
            }`,
          isDoctor: userInfo.profession === "Doctor",
          event: props.eventData.eventName,
          date: props.eventDate ? props.eventDate : `03 July 2021`,
        },
      });
      setToggleForRegisterationForOldUser({ status: true, value: false });
    } catch (error) {
      console.log(error);
    }
  };

  // const componentDIdMount = () => {
  //   firestore
  //     .collection(USERMETADATA_COLLECTION)
  //     .doc(user.uid)
  //     .get()
  //     .then((doc) => {
  //       const data = doc.data();
  //       if (data.events) {
  //         if (data.events.indexOf(props.event) === -1) {
  //           setToggleForRegisterationForOldUser({ status: true, value: true });
  //         } else {
  //           setToggleForRegisterationForOldUser({ status: true, value: false });
  //         }
  //       } else {
  //         setToggleForRegisterationForOldUser({ status: true, value: true });
  //       }
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //       setToggleForRegisterationForOldUser({ status: true, value: false });
  //     });
  // };
  // let componentDIdMountRef = useMemo(() => componentDIdMount(), []);

  useEffect(() => {
    if (userInfo) {
      firestore
        .collection(USERMETADATA_COLLECTION)
        .doc(user.uid)
        .get()
        .then((doc) => {
          const data = doc.data();
          if (data.events) {
            if (data.events.indexOf(props.event) === -1) {
              regeristerUser();
            } else {
              setToggleForRegisterationForOldUser({
                status: true,
                value: false,
              });
            }
          } else {
            regeristerUser();
          }
        })
        .catch((err) => {
          console.log(err);
          setToggleForRegisterationForOldUser({ status: true, value: false });
        });
    }
  }, [userInfo]);

  useEffect(() => {
    if (props.eventData.registrationType === RegistrationType.WithAgenda) {
      getAgendaData(props.event);
    }
    return () => {
      removeTimelineListener();
    };
  }, []);

  const getAgendaData = async (eventId) => {
    attachTimelineListener(eventId, (data, err) => {
      if (err) {
        console.log(err);
        return;
      }
      processAgendaData(data);
      // setAgendaData(data)
    });
  };

  const processAgendaData = (data) => {
    let newData = {};
    data.sort(function (a, b) {
      return a.startTime - b.startTime;
    });
    data.forEach((timeline) => {
      let date = `${MonthName[new Date(timeline.startTime).getMonth()]
        } ${new Date(timeline.startTime).getDate()}`;
      if (newData.hasOwnProperty(date)) {
        newData = {
          ...newData,
          [date]: [...newData[date], timeline],
        };
      } else {
        newData = {
          ...newData,
          [date]: [timeline],
        };
      }
    });
    let dates = Object.keys(newData);
    setAgendaDates(dates);
    if (firstTime) {
      setCureentAgendaDate(dates[0]);
      firstTime = false;
    }
    setAgendaData(newData);
  };

  const startVideo = (timeline) => {
    showMediaModal(MediaModalType.Videos, timeline.videoUrl);
    // setVideoModalVisible(true)
  };

  const handleDateChange = (date, event) => {
    if (event) {
      event.preventDefault();
    }
    setCureentAgendaDate(date);
  };

  let initalCSSValues = useRef({});
  useEffect(() => {
    if (props.eventData) {
      if (props.eventData.preventStyle) {
        let root = document.querySelector(":root");
        let computedStyle = getComputedStyle(root);
        let preeventStyle = props.eventData.preventStyle;

        Object.keys(preeventStyle).forEach((varName) => {
          let initalValue = computedStyle.getPropertyValue(`--${varName}`);
          if (initalValue) {
            initalCSSValues.current[varName] = initalValue;
          }
          root.style.setProperty(`--${varName}`, preeventStyle[varName]);
        });
      }
    }
    return () => {
      if (initalCSSValues.current) {
        let root = document.querySelector(":root");
        Object.keys(initalCSSValues.current).forEach((varName) => {
          root.style.setProperty(
            `--${varName}`,
            initalCSSValues.current[varName]
          );
        });
      }
    };
  }, [props.eventData]);

  return (
    <>
      {props.eventData.registrationType === RegistrationType.WithAgenda ? (
        <>
          <div className="preventPage min-height-full gradient-bg3 ">
            {/* Header */}
            <Header
              event={props.event}
              eventTitle={props.eventTitle}
              eventData={props.eventData}
              showMobileSearchBtn={false}
            />
            <div
              className="login2Box__left s"
              style={{
                backgroundImage: `url("https://storage.googleapis.com/cipla-impact.appspot.com/${props.event}/WithAgenda_MainBG.jpg?X=${Math.random()}")`,
                backgroundPosition: "top",
                backgroundSize: "contain",
                backgroundRepeat: "repeat-x",
                backgroundColor: `${props.eventData?.preventStyle?.preeventBGColor
                  ? props.eventData.preventStyle.preeventBGColor
                  : "inherit"
                  }`,
                backgroundBlendMode: `${props.eventData?.preventStyle?.stop_multiply_bgBlendMode ? 'inherit' : "multiply"}`,
              }}
            >
              {/* BannerBox */}
              <div className="bannerBox">
                <div className="bannerBox__inner bannerBox__inner--small bannerBox__inner4 gradient-bg1">
                  <div className="bannerBox__slide">
                    <div className="container">
                      <div className="d-flex justify-content-between pd-b100 pd-t60 pd-l60 pd-md-b0 pd-md-t0 pd-md-l0">
                        <div className="bannerBox__left">
                          <img
                            className="bannerBox__pic mg-b35"
                            src={`https://storage.googleapis.com/cipla-impact.appspot.com/${props.event
                              }/${isMobileOnly
                                ? "WithAgenda_Mobile_Preevent_heading_left.png"
                                : "WithAgenda_Preevent_heading_left.png"
                              }?updated=${Math.random() * 100}`}
                            alt="header_left"
                          />

                          {/* <h1 class="bannerBox__maintitle"> </h1> */}
                          {/* <p class="bannerBox__subtitle mg-b40">Do tune in on 16th April 2021 for 2 days of cutting-edge academic feast with experts in Respiratory Medicine</p> */}
                          {/* <p class="bannerBox__subtitle mg-b40">
                                Tune in for a State-of-the-Art Academic Feast with the
                                Leaders in Respiratory Medicine.
                              </p>
                              <p class="bannerBox__date mg-b30">
                                16<sup>th</sup> - 17<sup>th</sup> April 2021
                              </p> */}
                          {props.eventData.watchTrailer &&
                            props.eventData.watchTrailer.enabled &&
                            props.eventData.watchTrailer.link && (
                              <a
                                href="#"
                                className="btn btn-secondary--outline bannerBox__btn mg-b20 wt-btn"
                                style={{ fontSize: "1.1rem" }}
                                onClick={(e) => {
                                  showMediaModal(
                                    MediaModalType.Videos,
                                    props.eventData.watchTrailer.link
                                  );
                                  addGAWithUserInfo(
                                    WATCHTRAILER_ANALYTICS_EVENT,
                                    { eventId: props.event }
                                  );
                                  addCAWithUserInfo(
                                    `/${WATCHTRAILER_ANALYTICS_EVENT}`,
                                    true,
                                    { eventId: props.event },
                                    true
                                  );
                                }}
                              >
                                {
                                  // isMobileOnly ? 'Trailer' :
                                  <>
                                    Watch Trailer&nbsp;
                                    <i
                                      className="icon-play"
                                      style={{ fontSize: "1rem" }}
                                    ></i>
                                  </>
                                }
                              </a>
                            )}

                          {!showRegisterForOldUser.status && (
                            <>
                              <div className="lds-dual-ring-lazy"></div>
                            </>
                          )}
                          {showRegisterForOldUser.status && (
                            <>
                              <div className="d-flex middle-In-mobile">
                                <AddToCalendar
                                  blueBtn={true}
                                  calendatDetails={props.calendatDetails}
                                  eventId={props.event}
                                  eventData={props.eventData}
                                />
                                {props.eventData.faculty &&
                                  props.eventData.faculty.enabled &&
                                  props.eventData.faculty.link && (
                                    <a
                                      href="#"
                                      className="btn btn-secondary--outline bannerBox__btn mg-l20 mg-b30"
                                      onClick={(e) => {
                                        showMediaModal(
                                          MediaModalType.PDF,
                                          `/web/viewer.html?file=${encodeURIComponent(
                                            props.eventData.faculty.link
                                          )}`
                                        );
                                        addGAWithUserInfo(
                                          KNOW_YOUR_SPEAKER_CLICK_EVENT,
                                          {
                                            eventId: props.event,
                                          }
                                        );
                                        addCAWithUserInfo(
                                          `/${KNOW_YOUR_SPEAKER_CLICK_EVENT}`,
                                          true,
                                          { eventId: props.event },
                                          true
                                        );
                                      }}
                                    >
                                      {isMobileOnly
                                        ? "Faculty"
                                        : "Know Your Faculty"}
                                    </a>
                                  )}
                                {!props.canEnterEvent &&
                                  props.eventData?.feedback?.enabled ? (
                                  <a
                                    href="#"
                                    className="btn btn-secondary--outline bannerBox__btn mg-l20 mg-b30 event-feedback"
                                    onClick={(e) => {
                                      showMediaModal(
                                        MediaModalType.PDF,
                                        `${props.eventData.feedback.link}?id=123&event=${props.event}&title=${props.eventTitle}`
                                      );
                                    }}
                                  >
                                    {props.eventData?.feedback.btnName
                                      ? props.eventData?.feedback.btnName
                                      : "Take Poll"}
                                  </a>
                                ) : (
                                  <></>
                                  // <a
                                  //   href="#"
                                  //   className="btn btn-secondary--outline bannerBox__btn mg-l20 mg-b30"
                                  //   onClick={(e) => {
                                  //     if (history) {
                                  //       history.push(HOME_ROUTE);
                                  //     }
                                  //   }}
                                  // >
                                  //   Explore Informative videos
                                  // </a>
                                )}
                                {props.canEnterEvent && props.event && (
                                  <a
                                    href="#"
                                    className="btn btn-secondary--outline bannerBox__btn mg-l20 mg-b30"
                                    onClick={(e) => {
                                      if (history) {
                                        history.push(
                                          `/${props.eventData.eventName}`
                                        );
                                      }
                                    }}
                                  >
                                    Enter Event
                                  </a>
                                )}
                              </div>
                            </>
                          )}
                        </div>
                        <div className="bannerBox__right">
                          <img
                            className="bannerBox__pic"
                            src={`https://storage.googleapis.com/cipla-impact.appspot.com/${props.event
                              }/${isMobileOnly && props.eventData.useSeparateImages
                                ? "WithAgenda_Mobile_Preevent_heading_right.png"
                                : "WithAgenda_Preevent_heading_right.png"
                              }?updated=${Math.random() * 100}`}
                            alt=""
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <AgendaNavBar
                containerClass="container"
                className={"hide-on-tablet"}
                dates={agendaDates}
                currentDate={cureentAgendaDate}
                handleClick={handleDateChange}
                stickyOnScroll={true}
              />
              <AgendaNavBar
                containerClass="container"
                className={"show-on-tablet show-on-tablet--flex "}
                dates={agendaDates}
                currentDate={cureentAgendaDate}
                handleClick={handleDateChange}
                forceAgendaVisibleMobile={true}
                stickyOnScroll={true}
              />

              <div className="maincardBox maincardBox--large maincardBox--mobile-visible">
                <div className="maincardBox__card-wrapper">
                  <div className="container">
                    {agendaData &&
                      agendaData[cureentAgendaDate] &&
                      agendaData[cureentAgendaDate].map((timeline, index) => (
                        <AgendaCard
                          timeline={timeline}
                          haveVideo={false}
                          haveLikeButton={true}
                          handleClick={startVideo}
                          wantHeaderFooter={true}
                          key={index}
                        />
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="evolve__main__div preventPage">
            <Header
              event={props.event}
              eventTitle={props.eventTitle}
              eventData={props.eventData}
              showMobileSearchBtn={false}
            />
            <div className="mobile__layout">
              <img
                src={`https://storage.googleapis.com/cipla-impact.appspot.com/${props.event
                  }/preevent_mobile_Speaker.png?updated=${Math.random() * 100}`}
                alt=""
                className="evolve__logo"
              />
              {/* <img src={rightMobileTest} alt="" className="evolve__logo" /> */}
              {!showRegisterForOldUser.status && (
                <>
                  <LoadableFallback tranparentBg />
                </>
              )}
              {showRegisterForOldUser.status && (
                <>
                  {showRegisterForOldUser.value ? (
                    <>
                      <div className="thanks">
                        {/* <img src={leftMobileTest} alt="" className="thank__you" /> */}
                        <img
                          src={`https://storage.googleapis.com/cipla-impact.appspot.com/${props.event
                            }/prevent_mobile_info.png?updated=${Math.random() * 100
                            }`}
                          alt=""
                          className="thank__you"
                        />
                      </div>
                      <div className="buttons">
                        <button
                          className="btn btn-secondary"
                          onClick={(e) => {
                            regeristerUser();
                            addGAWithUserInfo(OLD_USER_REGISTER_EVENT, {
                              eventId: props.event,
                            });
                            addCAWithUserInfo(
                              `/${OLD_USER_REGISTER_EVENT}`,
                              true,
                              { eventId: props.event },
                              true
                            );
                          }}
                        >
                          SignUp
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* <div className="thanks_text">
                      Mucormycosis -<br></br>
                      What lies beneath
                    </div>
                    <div className="timing--">
                      26th May, 2021 | <strong>7:00 PM - 8:00 PM</strong>
                    </div> */}

                      <div className="thanks">
                        {/* <img src={leftMobileTest} alt="" className="thank__you" /> */}
                        <img
                          src={`https://storage.googleapis.com/cipla-impact.appspot.com/${props.event
                            }/prevent_mobile_info.png?updated=${Math.random() * 100
                            }`}
                          alt=""
                          className="thank__you"
                        />
                      </div>

                      <div className="buttons">
                        {/* <button className="btn btn-secondary evolve-btn">
                            Add to Calendar
                      </button> 
                      */}
                        <AddToCalendar
                          blueBtn={true}
                          calendatDetails={props.calendatDetails}
                          eventId={props.event}
                          eventData={props.eventData}
                        />
                        {!props.canEnterEvent && (
                          <>
                            {props.eventData?.feedback?.enabled ? (
                              <a
                                style={{
                                  marginTop: "2rem",
                                }}
                                href="#"
                                className="btn btn-secondary--outline bannerBox__btn mg-l20 mg-b30 event-feedback"
                                onClick={(e) => {
                                  showMediaModal(
                                    MediaModalType.PDF,
                                    `${props.eventData.feedback.link}?id=123&event=${props.event}&title=${props.eventTitle}`
                                  );
                                }}
                              >
                                {props.eventData?.feedback.btnName
                                  ? props.eventData?.feedback.btnName
                                  : "Take Poll"}
                              </a>
                            ) : (
                              <button
                                className="btn btn-secondary  explore-btn"
                                onClick={(e) => {
                                  if (history) {
                                    history.push(HOME_ROUTE);
                                  }
                                }}
                              >
                                Explore Informative videos
                              </button>
                            )}
                          </>
                        )}
                        {props.canEnterEvent && props.event && (
                          <button
                            className="btn btn-secondary  explore-btn"
                            onClick={(e) => {
                              if (history) {
                                history.push(`/${props.eventData.eventName}`);
                              }
                            }}
                          >
                            Enter Event
                          </button>
                        )}
                        {/* 
                          <button
                          className="btn btn-secondary"
                          disabled
                          onClick={(e) => {
                            showMediaModal(
                              MediaModalType.Videos,
                              "https://player.vimeo.com/video/536876068"
                            );
                            addGAWithUserInfo(WATCHTRAILER_ANALYTICS_EVENT, { eventId: 'evolve' })
                            addCAWithUserInfo(`/${WATCHTRAILER_ANALYTICS_EVENT}`, true, { eventId: 'evolve' }, true)
                          }}
                        >
                          Watch Trailer
                        </button> 
                        */}
                      </div>
                    </>
                  )}
                </>
              )}
              <div
                className="bottom_right_eventLogo"
                style={{ position: "unset", display: "block" }}
              >
                <img
                  src={`https://storage.googleapis.com/cipla-impact.appspot.com/${props.event
                    }/eventLogo.png?updated=${Math.random() * 100}`}
                  alt=""
                  className="eventLogo"
                />
              </div>
            </div>
            {/* <img src={mobile__blur} alt="" className="mobile__blur" /> */}
            {/* <img src={blur__img} alt="" className="blur__img" /> */}
            <img
              src={`https://storage.googleapis.com/cipla-impact.appspot.com/${props.event
                }/pre_event_bg.jpg?updated=${Math.random() * 100}`}
              alt=""
              className="spider__img"
            />
            {/* <img src={right__wing} alt="" className="right__wing" /> */}
            <div className="left__div">
              {!showRegisterForOldUser.status && (
                <>
                  <LoadableFallback tranparentBg />
                </>
              )}
              {showRegisterForOldUser.status && (
                <>
                  {showRegisterForOldUser.value ? (
                    <>
                      {/* <div className="thanks_text">
                      Sign Up To Explore Newer Paradigms In Respiratory Medicine
                    </div>
                    <div className="timing--">Date: 05 June 2021</div> */}
                      <div className="thanks">
                        {/* <img src={leftTest} alt="" className="thank__you" /> */}
                        <img
                          src={`https://storage.googleapis.com/cipla-impact.appspot.com/${props.event
                            }/preEventPage_left_heading.svg?updated=${Math.random() * 100
                            }`}
                          alt=""
                          className="thank__you"
                        />
                      </div>
                      <div className="buttons">
                        <button
                          className="btn btn-secondary "
                          onClick={(e) => {
                            regeristerUser();
                            addGAWithUserInfo(OLD_USER_REGISTER_EVENT, {
                              eventId: props.event,
                            });
                            addCAWithUserInfo(
                              `/${OLD_USER_REGISTER_EVENT}`,
                              true,
                              { eventId: props.event },
                              true
                            );
                          }}
                        >
                          SignUp
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* <div className="thanks_text">
                      Mucormycosis - <br></br>
                      What lies beneath
                    </div>
                    <div className="timing--" style={{ marginBottom: "1em" }}>
                      26th May, 2021 | <strong>7:00 PM - 8:00 PM</strong>
                    </div> */}

                      <div className="thanks">
                        {/* <img src={leftTest} alt="" className="thank__you" /> */}
                        <img
                          src={`https://storage.googleapis.com/cipla-impact.appspot.com/${props.event
                            }/preEventPage_left_heading.svg?updated=${Math.random() * 100
                            }`}
                          alt=""
                          className="thank__you"
                        />
                      </div>

                      <div className="buttons">
                        <AddToCalendar
                          blueBtn={true}
                          calendatDetails={props.calendatDetails}
                          eventId={props.event}
                          eventData={props.eventData}
                        />
                        {!props.canEnterEvent && (
                          <>
                            {props.eventData?.feedback?.enabled ? (
                              <button
                                className="btn btn-secondary explore-btn event-feedback"
                                onClick={(e) => {
                                  showMediaModal(
                                    MediaModalType.PDF,
                                    `${props.eventData.feedback.link}?id=123&event=${props.event}&title=${props.eventTitle}`
                                  );
                                }}
                              >
                                {props.eventData?.feedback.btnName
                                  ? props.eventData?.feedback.btnName
                                  : "Take Poll"}
                              </button>
                            ) : (
                              <button
                                className="btn btn-secondary explore-btn"
                                onClick={(e) => {
                                  if (history) {
                                    history.push(HOME_ROUTE);
                                  }
                                }}
                              >
                                Explore Informative videos
                              </button>
                            )}
                          </>
                        )}

                        {props.canEnterEvent && props.event && (
                          <button
                            className="btn btn-secondary  explore-btn"
                            onClick={(e) => {
                              if (history) {
                                history.push(`/${props.eventData.eventName}`);
                              }
                            }}
                          >
                            Enter Event
                          </button>
                        )}
                        {/* <button className="btn btn-secondary evolve-btn">
                              Add to Calendar
                            </button>
                        */}
                        {/* <button
                              className="btn btn-secondary "
                              disabled
                              onClick={(e) => {
                                showMediaModal(
                                  MediaModalType.Videos,
                                  "https://player.vimeo.com/video/536876068"
                                );
                                addGAWithUserInfo(WATCHTRAILER_ANALYTICS_EVENT, { eventId: 'evolve' })
                                addCAWithUserInfo(`/${WATCHTRAILER_ANALYTICS_EVENT}`, true, { eventId: 'evolve' }, true)
                              }}
                            >
                              Watch Trailer
                            </button> 
                            */}
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
            <div className="right__div">
              <img
                src={`https://storage.googleapis.com/cipla-impact.appspot.com/${props.event
                  }/preEventPage_right_speakers.png?updated=${Math.random() * 100
                  }`}
                alt=""
                className="speakerAreas"
              />
              {/* <img src={RightTest} alt="" className="speakerAreas" /> */}
            </div>

            <div className="bottom_right_eventLogo">
              <img
                src={`https://storage.googleapis.com/cipla-impact.appspot.com/${props.event
                  }/eventLogo.png?updated=${Math.random() * 100}`}
                alt=""
                className="eventLogo"
              />
            </div>
          </div>
        </>
      )}

      <Switch>
        <Route path={`/:event/profile`}>
          {userInfo ? (
            <Myprofile returnUrl={`/${props.eventData.eventName}`} />
          ) : (
            <div className="loaderContainer">
              <div className="lds-dual-ring"></div>
            </div>
          )}
        </Route>
      </Switch>
    </>
  );
}

export default PreEvent;
