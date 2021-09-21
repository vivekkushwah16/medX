import React, { useState } from "react";
import { firestore } from "../../Firebase/firebase";
import "./countdown.css";
function Countdown(props) {
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [mins, setMins] = useState(0);
  const [secs, setSecs] = useState(0);
  const [showTimer, setTimerVisiblity] = useState(false)
  const [checkedOnce, setCheckedOnce] = useState(false)
  const timerRef = React.useRef();

  const startTimer = (eventTime) => {
    const DateNow = new Date().getTime();
    const difference = eventTime - DateNow;
    if (difference < 0) {
      setCheckedOnce(true)
      setTimerVisiblity(false)
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
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
    if (!showTimer) {
      setCheckedOnce(true)
      setTimerVisiblity(true)
    }
  };

  React.useEffect(() => {
    firestore
      .collection("events")
      .doc(props.event ? props.event : "inspira21-jun5")
      .onSnapshot((timeline) => {

        const eventTime = timeline.data().eventTime;

        if (!eventTime) {
          return
        }
        const DateNow = new Date().getTime();
        const difference = eventTime - DateNow;
        if (difference < 0) {
          return;
        }
        if (timerRef.current) {
          clearInterval(timerRef.current)
        }

        timerRef.current = setInterval(() => {
          startTimer(eventTime);
        }, 1000);

      });
  }, []);

  if (!showTimer) {
    if (checkedOnce) {
      return (
        <div className="count__container" style={{ marginBottom: '2rem' }}>
          <div className="count__container_Live">
            <div className="Live-dot"></div>  Live
          </div>
        </div>
      )
    } else {
      return null
    }

  } else {
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
}

export default Countdown;
