import React, { useState } from "react";
import { firestore } from "../../Firebase/firebase";
import "./countdown.css";
function Countdown(props) {
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [mins, setMins] = useState(0);
  const [secs, setSecs] = useState(0);
  const timerRef = React.useRef();
  const startTimer = (eventTime) => {
    const DateNow = new Date().getTime();
    const difference = eventTime - DateNow;
    if (difference < 0) {
      console.log("event live");
      return;
    }
    const sec = 1 * 1000;
    const min = sec * 60;
    const hours = min * 60;
    const days = hours * 24;

    const remainingDays = Math.floor(difference / days);
    const remainingHours = Math.floor((difference % days) / hours);
    const remainingMin = Math.floor((difference % hours) / min);
    const remainingSec = Math.floor((difference % min) / sec);
    setDays(remainingDays);
    setHours(remainingHours);
    setMins(remainingMin);
    setSecs(remainingSec);
  };
  React.useEffect(() => {
    firestore
      .collection("events")
      .doc(props.event ? props.event : "inspira21-jun5")
      .onSnapshot((timeline) => {
        const eventTime = timeline.data().eventTime;
        setInterval(() => {
          startTimer(eventTime);
        }, 1000);
      });
  }, []);
  return (
    <div className="count__container">
      <p className="txt head">Event starts in</p>
      <ul className="countdown">
        <li>
          <div className="num">{days}</div>
          <div className="txt">days</div>
        </li>
        <li>
          <div className="num">{hours}</div>
          <div className="txt">hours</div>
        </li>
        <li>
          <div className="num">{mins}</div>
          <div className="txt">minutes</div>
        </li>
        <li>
          <div className="num">{secs}</div>
          <div className="txt">seconds</div>
        </li>
      </ul>
    </div>
  );
}

export default Countdown;
