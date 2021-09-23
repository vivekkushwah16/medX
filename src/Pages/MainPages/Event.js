import React, { useContext, useEffect, useState, useMemo } from "react";
import "./Event.css";
import Footer from "../../Containers/Footer/Footer";
import Header from "../../Containers/Header/Header";
import {
  Switch,
  useHistory,
  useParams,
  useRouteMatch,
  Route,
} from "react-router-dom";
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
import Myprofile from "../../Containers/myProfile/Myprofile";

export const EVENTPAGE_MENUITEM_ID = {
  About: "About",
  Agenda: "Agenda",
  Trending: "Trending",
  Polls: "Polls",
  Partner_with_us: "Partner_with_us",
  Engagement: "Engagement"
};

export const EVENTPAGE_MENUITEM_INDEX = {
  About: 0,
  Agenda: 1,
  Trending: 2,
  Polls: 3,
  Partner_with_us: 4,
  Engagement: 5
};

export const EVENTPAGE_MENUITEM = [
  { id: EVENTPAGE_MENUITEM_ID.About, name: "Faculty", className: "", enabled: true },
  { id: EVENTPAGE_MENUITEM_ID.Agenda, name: "Agenda", className: "", enabled: true },
  { id: EVENTPAGE_MENUITEM_ID.Trending, name: "Resources", className: "", enabled: true },
  { id: EVENTPAGE_MENUITEM_ID.Polls, name: "Q&A", className: "hide-on-desktop", enabled: true },
  { id: EVENTPAGE_MENUITEM_ID.Partner_with_us, name: "Partner with us", className: "", enabled: true },
  { id: EVENTPAGE_MENUITEM_ID.Engagement, name: "Engagement", className: "", enabled: false },
];

let MenuSpecification = "menuSpecification"

export default function Event(props) {
  // console.log(props);
  const { event } = props;
  const { path, url } = useRouteMatch();
  const history = useHistory();
  //remove params as we not geting this from url now
  // let param = useParams()
  let param = useMemo(
    () => ({ id: props.event ? props.event.toLowerCase() : "inspira21-jun5" }),
    event
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
    attachEngagementListener,
    removeEngagementListener
  } = useContext(eventContext);
  const { addGAWithUserInfo, addCAWithUserInfo } = useContext(AnalyticsContext);
  let { getLike, addLike, removeLike } = useContext(likeContext);
  const { user, userInfo } = useContext(UserContext);
  const [eventData, setEventData] = useState({});
  const [agendaData, setAgendaData] = useState([]);
  const [trendingData, setTrendingData] = useState(null);
  const [engagementData, setEngagementData] = useState(null);
  const [partnerWithUsData, setPartnerWithUsData] = useState(null);
  const [likedEvent, setLikeEvent] = useState(false);
  const [isloading, setIsloading] = useState(true);
  const [menuItems, setMenuItems] = useState(null);

  useEffect(() => {
    checkIfUserIsRegistered();
    return () => {
      removeTrendingDataListener();
      removeEventDataListener();
      removeTimelineListener();
      removeEngagementListener();
    };
  }, []);

  useEffect(() => {
    // console.log(event)
    if (event) {
      // Get the root element
      var r = document.querySelector(':root');
      //to get value
      // var rs = getComputedStyle(r);
      // rs.getPropertyValue('--eventPageHeaderBand')

      let val = " url(\"https://storage.googleapis.com/cipla-impact.appspot.com/" + event + "/eventPageHeaderBand.svg?upated=1\")"
      r.style.setProperty('--eventPageHeaderBand', val);
      let eventPageBottomBg = " url(\"https://storage.googleapis.com/cipla-impact.appspot.com/" + event + "/eventPageBottomBg.png?upated=1\")"
      r.style.setProperty('--eventPageBg', eventPageBottomBg);
    }
  }, [event])

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
    setMenuItems(EVENTPAGE_MENUITEM);
    setIsloading(false);
    getEventInfo();
    // getAgendaInfo();
    // getTrending();
    // getPartnerWithUsData();
  };

  const checkEventMenu = (eventData) => {
    let finalMenu = EVENTPAGE_MENUITEM
    if (eventData[MenuSpecification]) {
      let newSpecifications = eventData[MenuSpecification]

      let newMenuItem = EVENTPAGE_MENUITEM.map(item => {
        if (newSpecifications.hasOwnProperty(item.id)) {
          let newItem = newSpecifications[item.id]
          const updateValue = (newObj, key, valueContainer, newKey) => {
            if (newObj.hasOwnProperty(key)) {
              valueContainer[newKey] = newObj[key]
            }
          }
          updateValue(newItem, 'status', item, 'enabled')
          updateValue(newItem, 'name', item, 'name')
          return item
        } else {
          return item
        }
      })
      finalMenu = newMenuItem
    }
    if (finalMenu[EVENTPAGE_MENUITEM_INDEX.Agenda].enabled) {
      getAgendaInfo();
    }

    if (finalMenu[EVENTPAGE_MENUITEM_INDEX.Trending].enabled) {
      getTrending();
    }

    if (finalMenu[EVENTPAGE_MENUITEM_INDEX.Partner_with_us].enabled) {
      getPartnerWithUsData();
    }

    // console.log(finalMenu[EVENTPAGE_MENUITEM_INDEX.Engagement])
    if (finalMenu[EVENTPAGE_MENUITEM_INDEX.Engagement].enabled) {
      getEngagment()
    }


    setMenuItems(EVENTPAGE_MENUITEM)
  }

  const getEventInfo = async () => {
    try {
      // const data = await getEvent(param.id, true)
      // setEventData(data)
      getEventDataListener(param.id, (data) => {
        setEventData(data);
        checkEventMenu(data)
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

  const getEngagment = () => {
    try {
      // console.log('getEngagment', param.id)
      attachEngagementListener(param.id, (data) => {
        setEngagementData(data);
      });
    } catch (error) {
      console.log(error);
    }
  }

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
    // console.log(userInfo);
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
              backgroundImage: `url('https://storage.googleapis.com/cipla-impact.appspot.com/${param.id}/eventPageInitalLoader.png?updated=${Math.random() * 100}')`,
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
                addClickAnalytics={addClickAnalytics}
                eventData={props.eventData}
                showCertificate={false}
                showFeedback={false}
                disableFeedback={false}
                stickyOnScroll={true}
              />
            ) : (
              <Header
                eventPage={true}
                eventAndCiplaLogo={`https://storage.googleapis.com/cipla-impact.appspot.com/${props.event}/cipla_with_eventLogo.png?updated=1`}
                event={props.event}
                eventTitle={props.eventTitle}
                addClickAnalytics={addClickAnalytics}
                eventData={props.eventData}
                showCertificate={true}
                showFeedback={true}
                disableFeedback={
                  eventData ? !eventData.activeCertificate : false
                }
                stickyOnScroll={true}
              />
            )}
            {eventData && menuItems && (
              <EventContainer
                id={param.id}
                data={eventData}
                agendaData={agendaData}
                trendingData={trendingData}
                engagementData={engagementData}
                partnerWithUsData={partnerWithUsData}
                countPartnerWithUsAgree={countPartnerWithUsAgree}
                sendQuestion={sendQuestion}
                likedEvent={likedEvent}
                handleEventLikeButton={handleEventLikeButton}
                menuItems={menuItems}
              />
            )}
            {/* <Footer /> */}
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
      )}
    </section>
  );
}
