import React, { useContext, useEffect, useState, useMemo } from "react";
import "./Event.css";
import Footer from "../../Containers/Footer/Footer";
import Header from "../../Containers/Header/Header";
import { useHistory, useParams, useRouteMatch } from "react-router-dom";
import EventContainer from "../../Containers/EventContainer/EventContainer";
import { eventContext } from "../../Context/Event/EventContextProvider";
import { likeContext } from "../../Context/Like/LikeContextProvider";
import { LikeType } from "../../AppConstants/TypeConstant";
import { isMobileOnly } from "react-device-detect";
import { AnalyticsContext } from "../../Context/Analytics/AnalyticsContextProvider";
import { database, firestore } from "../../Firebase/firebase";
import { SESSION_ATTENDED } from "../../AppConstants/AnalyticsEventName";
import { UserContext } from "../../Context/Auth/UserContextProvider";
import { USERMETADATA_COLLECTION } from "../../AppConstants/CollectionConstants";
import LoadableFallback from "../../Components/LoadableFallback/LoadableFallback";

export default function Event(props) {
  // console.log(props);
  const { eventId } = props;
  const { path, url } = useRouteMatch();
  const history = useHistory();
  //remove params as we not geting this from url now
  // let param = useParams()
  let param = useMemo(
    () => ({ id: props.event ? props.event.toLowerCase() : "inspira21-jun5" }),
    eventId
  );

  let {
    getTimelines,
    attachTrendingDataListener,
    removeTrendingDataListener,
    getPartnerWithUs,
    countPartnerWithUsAgree,
    sendQuestion,
    getEventDataListener,
    removeEventDataListener,
    attachTimelineListener,
    removeTimelineListener,
  } = useContext(eventContext);
  const { addGAWithUserInfo, addCAWithUserInfo } = useContext(AnalyticsContext);
  let { getLike, addLike, removeLike } = useContext(likeContext);
  const { user, userInfo } = useContext(UserContext);
  const [eventData, setEventData] = useState({});
  const [agendaData, setAgendaData] = useState([]);
  const [trendingData, setTrendingData] = useState(null);
  const [partnerWithUsData, setPartnerWithUsData] = useState(null);
  const [likedEvent, setLikeEvent] = useState(false);
  const [isloading, setIsloading] = useState(true);

  useEffect(() => {
    checkIfUserIsRegistered();
    return () => {
      removeTrendingDataListener();
      removeEventDataListener();
      removeTimelineListener();
    };
  }, []);

  const checkIfUserIsRegistered = async () => {
    firestore
      .collection(USERMETADATA_COLLECTION)
      .doc(user.uid)
      .get()
      .then((doc) => {
        const data = doc.data();
        if (data.events) {
          if (data.events.indexOf(param.id) === -1) {
            //not registered in event
            redirectToLoggedInRegister();
          } else {
            //registered in event
            startLoadingContent();
          }
        } else {
          //never registered into any event
          redirectToLoggedInRegister();
        }
      })
      .catch((err) => {
        console.log(err);
        //redirect
        redirectToLoggedInRegister();
      });
  };

  const redirectToLoggedInRegister = () => {
    if (history) {
      history.push(`/${param.id}/register-ott`);
    }
  };

  const startLoadingContent = () => {
    setIsloading(false);
    getEventInfo();
    getAgendaInfo();
    getTrending();
    getPartnerWithUsData();
  };

  const getEventInfo = async () => {
    try {
      // const data = await getEvent(param.id, true)
      // setEventData(data)
      getEventDataListener(param.id, (data) => {
        setEventData(data);
      });
      getLike(param.id).then((status) => setLikeEvent(status));
    } catch (error) {
      console.log(error);
    }
  };
  const getAgendaInfo = async () => {
    try {
      attachTimelineListener(param.id, (data, err) => {
        if (err) {
          console.log(err);
          return;
        }
        setAgendaData(data);
        // setAgendaData(data)
      });
      // const data = await getTimelines(param.id)
      // setAgendaData(data)
    } catch (error) {
      console.log(error);
    }
  };

  const getTrending = () => {
    try {
      attachTrendingDataListener(param.id, (data) => {
        setTrendingData(data);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const getPartnerWithUsData = async () => {
    try {
      const data = await getPartnerWithUs(param.id);
      setPartnerWithUsData(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleEventLikeButton = async (event, callback) => {
    if (event) {
      event.preventDefault();
    }
    if (!likedEvent) {
      await addLike(param.id, null, LikeType.EVENT_LIKE);
      setLikeEvent(true);
      if (callback) {
        callback();
      }
    } else {
      await removeLike(param.id, null, LikeType.EVENT_LIKE);
      setLikeEvent(false);
      if (callback) {
        callback();
      }
    }
  };

  const addClickAnalytics = (eventName) => {
    console.log(userInfo);
    addGAWithUserInfo(eventName, { eventId: param.id });
    addCAWithUserInfo(`/${eventName}`, true, { eventId: param.id }, true);
  };
  return (
    <section className="wrapper" id="root">
      {isloading && (
        <>
          <div
            style={{
              width: "100vw",
              height: "100vh",
              backgroundImage: `url('/assets/images/${param.id}Loader.jpg')`,
              backgroundPosition: "center",
              backgroundSize: "auto",
              backgroundRepeat: "no-repeat",
            }}
          >
            <LoadableFallback />
          </div>
        </>
      )}
      {!isloading && (
        <>
          <div className="eventBoxBg"></div>
          <div className="topicsBox__wrapper" id="eventPage">
            {isMobileOnly ? (
              <Header
                event={props.event}
                eventTitle={props.eventTitle}
                showCertificate={false}
                showFeedback={false}
                disableFeedback={false}
                stickyOnScroll={true}
              />
            ) : (
              <Header
                eventPage={true}
                event={props.event}
                eventTitle={props.eventTitle}
                addClickAnalytics={addClickAnalytics}
                showCertificate={true}
                showFeedback={true}
                disableFeedback={
                  eventData ? !eventData.activeCertificate : false
                }
                stickyOnScroll={true}
              />
            )}
            {eventData && (
              <EventContainer
                id={param.id}
                data={eventData}
                agendaData={agendaData}
                trendingData={trendingData}
                partnerWithUsData={partnerWithUsData}
                countPartnerWithUsAgree={countPartnerWithUsAgree}
                sendQuestion={sendQuestion}
                likedEvent={likedEvent}
                handleEventLikeButton={handleEventLikeButton}
              />
            )}
            {/* <Footer /> */}
          </div>
        </>
      )}
    </section>
  );
}
