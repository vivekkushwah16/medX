import React, { useContext, useState, useEffect, useMemo } from "react";
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
import { isMobileOnly } from "react-device-detect";
import {
  KNOW_YOUR_SPEAKER_CLICK_EVENT,
  WATCHTRAILER_ANALYTICS_EVENT,
  OLD_USER_REGISTER_EVENT,
} from "../../AppConstants/AnalyticsEventName";
import blur__img from "./pre_event_blur.svg";
import doc__profile from "./doc-profile.svg";
import spider__img from "./pre_event_bg.png";
import right__wing from "./right-wing.png";
import evolve__logo from "./evolve-logo.svg";
import cipla__res from "./cipla-res.svg";
import thank__you from "./thak_you.svg";
import timing from "./timing.svg";
import mobile__blur from "./mobile-blur.svg";
import firebase, { firestore } from "../../Firebase/firebase";
import { USERMETADATA_COLLECTION } from "../../AppConstants/CollectionConstants";
import { UserContext } from "../../Context/Auth/UserContextProvider";
import LoadableFallback from "../../Components/LoadableFallback/LoadableFallback";
import { useHistory } from "react-router-dom";
function PreEvent(props) {
  const { user } = useContext(UserContext);
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
      setToggleForRegisterationForOldUser({ status: true, value: false });
    } catch (error) {
      console.log(error)
    }

  };

  const componentDIdMount = () => {
    firestore
      .collection(USERMETADATA_COLLECTION)
      .doc(user.uid)
      .get()
      .then((doc) => {
        const data = doc.data();
        if (data.events) {
          if (data.events.indexOf(props.event) === -1) {
            setToggleForRegisterationForOldUser({ status: true, value: true });
          } else {
            setToggleForRegisterationForOldUser({ status: true, value: false });
          }
        } else {
          setToggleForRegisterationForOldUser({ status: true, value: true });
        }
      })
      .catch((err) => {
        console.log(err);
        setToggleForRegisterationForOldUser({ status: true, value: false });
      });
  };
  let componentDIdMountRef = useMemo(() => componentDIdMount(), []);

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

  return (
    <>
      <div className="evolve__main__div">
        <Header event={props.event} eventTitle={props.eventTitle} />
        <div className="mobile__layout">
          <img src={evolve__logo} alt="" className="evolve__logo" />
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
                  <div className="thanks_text">
                    Sign Up To Explore Newer Paradigms In Respiratory Medicine
                    {/* <img src={thank__you} alt="" className="thank__you" /> */}
                  </div>
                  <div className="timing--">
                    Date: 23 May 2021
                    {/* <img src={timing} alt="" className="timing-" /> */}
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
                  <div className="thanks_text">
                    Mucormycosis -<br></br>
                    What lies beneath
                  </div>
                  <div className="timing--">
                    26th May, 2021 | <strong>7:00 PM - 8:00 PM</strong>
                  </div>

                  <div className="thanks">
                    <img src={doc__profile} alt="" className="thank__you" />
                  </div>

                  <div className="buttons">
                    {/* <button className="btn btn-secondary evolve-btn">
                          Add to Calendar
                    </button> 
                    */}
                    <AddToCalendar blueBtn={true} />
                    {
                      props.canEnterEvent && props.event &&
                      <button
                        className="btn btn-secondary"
                        onClick={(e) => {
                          if (history) {
                            history.push(`/${props.event}`);
                          }
                        }}
                      >
                        Enter Event
                      </button>
                    }
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
        <img src={blur__img} alt="" className="blur__img" />
        <img src={spider__img} alt="" className="spider__img" />
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
                  <div className="thanks_text">
                    Sign Up To Explore Newer Paradigms In Respiratory Medicine
                  </div>
                  <div className="timing--">Date: 23 May 2021</div>
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
                  <div className="thanks_text">
                    Mucormycosis - <br></br>
                    What lies beneath
                  </div>
                  <div className="timing--" style={{ marginBottom: "1em" }}>
                    26th May, 2021 | <strong>7:00 PM - 8:00 PM</strong>
                  </div>

                  <div className="thanks">
                    <img src={doc__profile} alt="" className="thank__you" />
                  </div>

                  <div className="buttons">
                    <AddToCalendar blueBtn={true} />
                    {
                      props.canEnterEvent && props.event &&
                      <button
                        className="btn btn-secondary"
                        onClick={(e) => {
                          if (history) {
                            history.push(`/${props.event}`);
                          }
                        }}
                      >
                        Enter Event
                      </button>
                    }
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
          <img src={evolve__logo} alt="" className="evolve__logo" />
          {/* <img src={cipla__res} alt="" className="cipla__res" /> */}
        </div>
      </div>
    </>
  );
}

export default PreEvent;
