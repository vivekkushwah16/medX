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
import firebase, { firestore } from "../../Firebase/firebase";
import { USERMETADATA_COLLECTION } from "../../AppConstants/CollectionConstants";
import { UserContext } from "../../Context/Auth/UserContextProvider";
import LoadableFallback from "../../Components/LoadableFallback/LoadableFallback";
import { useHistory } from "react-router-dom";
import Myprofile from "../../Containers/myProfile/Myprofile";
import { HOME_ROUTE } from "../../AppConstants/Routes";
import { EVENT_CONFIRMATION_ENDPOINT } from "../../AppConstants/APIEndpoints";

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
          event: props.event,
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
              regeristerUser()
            } else {
              setToggleForRegisterationForOldUser({ status: true, value: false });
            }
          } else {
            regeristerUser()

          }
        })
        .catch((err) => {
          console.log(err);
          setToggleForRegisterationForOldUser({ status: true, value: false });
        });
    }
  }, [userInfo])

  useEffect(() => {
    // getAgendaData("event-kmde59n5");
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
      let date = `${
        MonthName[new Date(timeline.startTime).getMonth()]
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
      <div className="evolve__main__div preventPage">
        <Header event={props.event} eventTitle={props.eventTitle} />
        <div className="mobile__layout">
          <img
            src={`https://storage.googleapis.com/cipla-impact.appspot.com/${
              props.event
            }/preEventPage_right_speakers.svg?updated=${Math.random() * 100}`}
            alt=""
            className="evolve__logo"
          />
          {/* <img src={cipla__res} alt="" className="cipla__res" /> */}
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
                    <img
                      src={`https://storage.googleapis.com/cipla-impact.appspot.com/${
                        props.event
                      }/preEventPage_left_heading.svg?updated=${
                        Math.random() * 100
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
                    <img
                      src={`https://storage.googleapis.com/cipla-impact.appspot.com/${
                        props.event
                      }/preEventPage_left_heading.svg?updated=${
                        Math.random() * 100
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
                    <AddToCalendar blueBtn={true} />
                    {
                      !props.canEnterEvent &&
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
                    }
                    {props.canEnterEvent && props.event && (
                      <button
                        className="btn btn-secondary  explore-btn"
                        onClick={(e) => {
                          if (history) {
                            history.push(`/${props.event}`);
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
        </div>
        {/* <img src={mobile__blur} alt="" className="mobile__blur" /> */}
        {/* <img src={blur__img} alt="" className="blur__img" /> */}
        <img
          src={`https://storage.googleapis.com/cipla-impact.appspot.com/${
            props.event
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
                    <img
                      src={`https://storage.googleapis.com/cipla-impact.appspot.com/${
                        props.event
                      }/preEventPage_left_heading.svg?updated=${
                        Math.random() * 100
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
                    <img
                      src={`https://storage.googleapis.com/cipla-impact.appspot.com/${
                        props.event
                      }/preEventPage_left_heading.svg?updated=${
                        Math.random() * 100
                      }`}
                      alt=""
                      className="thank__you"
                    />
                  </div>

                  <div className="buttons">
                    <AddToCalendar blueBtn={true} calendatDetails={props.calendatDetails} eventId={props.event} />
                    {
                      !props.canEnterEvent &&
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
                    }
                    {props.canEnterEvent && props.event && (
                      <button
                        className="btn btn-secondary  explore-btn"
                        onClick={(e) => {
                          if (history) {
                            history.push(`/${props.event}`);
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
            src={`https://storage.googleapis.com/cipla-impact.appspot.com/${
              props.event
            }/preEventPage_right_speakers.svg?updated=${Math.random() * 100}`}
            alt=""
            className="speakerAreas"
          />
        </div>

        <div className="bottom_right_eventLogo">
          <img
            src={`https://storage.googleapis.com/cipla-impact.appspot.com/${
              props.event
            }/eventLogo.png?updated=${Math.random() * 100}`}
            alt=""
            className="eventLogo"
          />
        </div>
      </div>
      <Switch>
        <Route path={`/:event/profile`}>
          {userInfo ? (
            <Myprofile returnUrl={`/${props.event}`} />
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
