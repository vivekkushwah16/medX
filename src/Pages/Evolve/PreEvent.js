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
import { KNOW_YOUR_SPEAKER_CLICK_EVENT } from "../../AppConstants/AnalyticsEventName";
import blur__img from "./pre_event_blur.png";
import spider__img from "./pre_event_bg.png";
import right__wing from "./right-wing.png";
import evolve__logo from "./evolve-logo.svg";
import cipla__res from "./cipla-res.svg";
import thank__you from "./thak_you.svg";
import timing from "./timing.svg";
import mobile__blur from "./mobile-blur.svg";
function PreEvent() {
  const { showMediaModal } = useContext(MediaModalContext);
  const [agendaData, setAgendaData] = useState(null);
  const [agendaDates, setAgendaDates] = useState([]);
  const [cureentAgendaDate, setCureentAgendaDate] = useState(null);
  const { attachTimelineListener, removeTimelineListener } =
    useContext(eventContext);
  const { addGAWithUserInfo, addCAWithUserInfo } = useContext(AnalyticsContext);
  let firstTime = useMemo(() => true, []);

  useEffect(() => {
    getAgendaData("event-kmde59n5");
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

  return (
    <>
      <div className="evolve__main__div">
        <Header />
        <div className="mobile__layout">
          <img src={evolve__logo} alt="" className="evolve__logo" />
          <img src={cipla__res} alt="" className="cipla__res" />
          <div className="thanks">
            <img src={thank__you} alt="" className="thank__you" />
          </div>
          <div className="timing--">
            <img src={timing} alt="" className="timing-" />
          </div>
          <div className="buttons">
            {/* <button className="btn btn-secondary evolve-btn">
              Add to Calendar
            </button> */}
            <AddToCalendar blueBtn={true} />
            <button
              className="btn btn-secondary"
              onClick={(e) => {
                showMediaModal(
                  MediaModalType.Videos,
                  "https://player.vimeo.com/video/536876068"
                );
                // addGAWithUserInfo(KNOW_YOUR_SPEAKER_CLICK_EVENT, { eventId: 'event-kmde59n5' })
                // addCAWithUserInfo(`/${KNOW_YOUR_SPEAKER_CLICK_EVENT}`, true, { eventId: 'event-kmde59n5' }, true)
              }}
            >
              Watch Trailer
            </button>
          </div>
        </div>
        <img src={mobile__blur} alt="" className="mobile__blur" />
        <img src={blur__img} alt="" className="blur__img" />
        <img src={spider__img} alt="" className="spider__img" />
        <img src={right__wing} alt="" className="right__wing" />
        <div className="left__div">
          <div className="thanks">
            <img src={thank__you} alt="" className="thank__you" />
          </div>
          <div className="timing--">
            <img src={timing} alt="" className="timing-" />
          </div>
          <div className="buttons">
            <AddToCalendar blueBtn={true} />
            {/* <button className="btn btn-secondary evolve-btn">
              Add to Calendar
            </button> */}
            <button
              className="btn btn-secondary "
              onClick={(e) => {
                showMediaModal(
                  MediaModalType.Videos,
                  "https://player.vimeo.com/video/536876068"
                );
                // addGAWithUserInfo(KNOW_YOUR_SPEAKER_CLICK_EVENT, { eventId: 'event-kmde59n5' })
                // addCAWithUserInfo(`/${KNOW_YOUR_SPEAKER_CLICK_EVENT}`, true, { eventId: 'event-kmde59n5' }, true)
              }}
            >
              Watch Trailer
            </button>
          </div>
        </div>
        <div className="right__div">
          <img src={evolve__logo} alt="" className="evolve__logo" />
          <img src={cipla__res} alt="" className="cipla__res" />
        </div>
      </div>
    </>
  );
}

export default PreEvent;
