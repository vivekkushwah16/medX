import React, { createContext, useState, useEffect, useContext } from "react";
import { isIOS } from "react-device-detect";
import {
  EVENT_COLLECTION,
  PARTNERWITHUSAGREE_COLLECTION,
} from "../../AppConstants/CollectionConstants";
import {
  EVENTDATA_COOKIES,
  PARTNERWITHUSAGREE_COOKIES,
  PARTNERWITHUS_COOKIES,
  TIMELINEDATA_COOKIES,
  TRENDINGDATA_COOKIES,
} from "../../AppConstants/CookiesNames";
import { database, firestore } from "../../Firebase/firebase";
import EventManager from "../../Managers/EventManager";
import QNAManager from "../../Managers/QNAManager";
import { getCookies, saveCookies } from "../../utils/cookiesManager";
import { UserContext } from "../Auth/UserContextProvider";

export const eventContext = createContext([]);

function getCookiesFromData(name) {
  if (isIOS) {
    return {};
  }
  const value = getCookies(name);
  if (value === "") {
    return {};
  }
  return JSON.parse(value);
}

function setDataInCookies(name, data) {
  saveCookies(name, data, 2);
}
/*

    const [eventData, setEventData] = useState(getCookiesFromData(EVENTDATA_COOKIES))
    const [timelineData, setTimelineData] = useState(getCookiesFromData(TIMELINEDATA_COOKIES))
    const [trendingData, setTrendingData] = useState(getCookiesFromData(TIMELINEDATA_COOKIES))
    const [partnerWithUsData, setPartnerWithUsData] = useState(getCookiesFromData(PARTNERWITHUS_COOKIES))
*/
export default function EventContextProvider(props) {
  const { user } = useContext(UserContext);

  const [eventData, setEventData] = useState({});
  const [timelineData, setTimelineData] = useState({});
  const [trendingData, setTrendingData] = useState({});
  const [partnerWithUsData, setPartnerWithUsData] = useState({});
  const [partnerWithUsAgreeData, setPartnerWithUsAgreeData] = useState({});

  const getEvent = (eventId, forceNewValue = false) => {
    return new Promise(async (res, rej) => {
      try {
        const eventIds = Object.keys(eventData);
        if (!forceNewValue) {
          if (eventIds.length > 0) {
            if (eventIds.indexOf(eventId) !== -1) {
              res(eventData[eventId]);
              return;
            }
          }
        }

        const _data = await EventManager.getEventWithId(eventId);
        let newData = { ...eventData, [eventId]: _data };
        setEventData(newData);
        setDataInCookies(EVENTDATA_COOKIES, newData);
        res(_data);
      } catch (error) {
        rej(error);
      }
    });
  };

  const getTimelines = async (eventId) => {
    const eventIds = Object.keys(timelineData);
    if (eventIds.indexOf(eventId) !== -1) {
      return timelineData[eventId];
    } else {
      const _data = await EventManager.getAgenda(eventId);
      let newData = { ...timelineData, [eventId]: _data };
      setTimelineData(newData);
      setDataInCookies(TIMELINEDATA_COOKIES, newData);
      return _data;
    }
  };

  const attachTimelineListener = (eventId, callback) => {
    EventManager.attachTimelineListener(eventId, callback);
  };

  const removeTimelineListener = () => {
    EventManager.removeTimelineListener();
  };

  const attachEngagementListener = (eventId, callback) => {
    EventManager.attachEngagmentListener(eventId, callback);
  };

  const removeEngagementListener = () => {
    EventManager.removeEngagmentListener();
  };

  const getTrendingData = async (eventId) => {
    const eventIds = Object.keys(trendingData);
    if (eventIds.indexOf(eventId) !== -1) {
      if (trendingData[eventId]) return trendingData[eventId];
    }
    const _data = await EventManager.getTrending(eventId);
    let newData = { ...trendingData, [eventId]: _data };
    setTrendingData(newData);
    setDataInCookies(TRENDINGDATA_COOKIES, newData);
    return _data;
  };

  const attachTrendingDataListener = (eventId, callback) => {
    EventManager.attachTrendingListener(eventId, callback);
  };
  const removeTrendingDataListener = () => {
    EventManager.removeTrendingListener();
  };

  const getPartnerWithUs = async (eventId) => {
    const eventIds = Object.keys(partnerWithUsData);
    if (eventIds.indexOf(eventId) !== -1) {
      if (partnerWithUsData[eventId]) return partnerWithUsData[eventId];
    }
    const _data = await EventManager.getPartnerWithUs(eventId);
    let newData = { ...partnerWithUsData, [eventId]: _data };
    setPartnerWithUsData(newData);
    setDataInCookies(PARTNERWITHUS_COOKIES, newData);
    return _data;
  };

  const getEventDataListener = (eventId, callback) => {
    EventManager.addEventDataListener(eventId, callback);
  };

  const removeEventDataListener = () => {
    EventManager.removeEventDataListener();
  };

  const countPartnerWithUsAgree = (eventId, id) => {
    return new Promise(async (res, rej) => {
      try {
        if (!user) {
          console.log("NoUserLoggedIn");
          return;
        }
        await EventManager.addPartnerWithUsInput(eventId, id, user.uid);
        let _data = {
          targetId: id,
          user: user.uid,
          eventId: eventId,
        };
        setPartnerWithUsAgreeData({ ...partnerWithUsAgreeData, [id]: _data });
        res();
      } catch (error) {
        rej(error);
      }
    });
  };

  const getPartnerWithUsAgreeStatus = (id) => {
    return new Promise(async (res, rej) => {
      try {
        const agreePartnerIds = Object.keys(partnerWithUsAgreeData);
        if (agreePartnerIds.indexOf(id) !== -1) {
          if (partnerWithUsAgreeData[id]) {
            console.log("not reading", partnerWithUsAgreeData[id], id);
            res(partnerWithUsAgreeData[id]);
          }
        }
        const data = await EventManager.checkForAlreadyAgreedPartner(
          id,
          user.uid
        );
        if (data) {
          console.log("reading from db", data);
          setPartnerWithUsAgreeData({ ...partnerWithUsAgreeData, [id]: data });
          res(true);
        } else {
          res(false);
        }
      } catch (error) {
        rej(error);
      }
    });
  };

  const sendQuestion = (eventId, question, activeTimelineId) => {
    return new Promise(async (res, rej) => {
      try {
        if (!user) {
          console.log("No user Logged");
          return;
        }
        await QNAManager.sendQnAQuestion(
          user.uid,
          eventId,
          question,
          activeTimelineId
        );
        res();
      } catch (error) {
        rej(error);
      }
    });
  };

  return (
    <eventContext.Provider
      value={{
        getEvent,
        getTimelines,
        attachTimelineListener,
        removeTimelineListener,
        attachTrendingDataListener,
        removeTrendingDataListener,
        getPartnerWithUs,
        countPartnerWithUsAgree,
        getPartnerWithUsAgreeStatus,
        sendQuestion,
        getEventDataListener,
        removeEventDataListener,
        attachEngagementListener,
        removeEngagementListener,
      }}
    >
      {props.children}
    </eventContext.Provider>
  );
}
