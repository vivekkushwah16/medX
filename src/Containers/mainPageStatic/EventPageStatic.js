import React from "react";
import { Link } from "react-router-dom";
import { RootRoute } from "../../AppConstants/Routes";
// import CIPLAMEDXLOGO_WHITE from "../../assets/images/ciplamed-logo2.png";
import bg from "./bg.jpg";
import center_logo from "./center-logo.png";
import ciplaMedX from "./ciplaMedX.png";
import cipla_res from "./cipla-respiratory.png";
import left_wing from "./left-wing.png";
import right_wing from "./right-wing.png";
import timing from "./timing.svg";
import bg2 from "./bg2.png";
import "./EventPageStatic.css";
export default function EventPageStatic({ event }) {
  return (
    <>
      <div
        className="login2Box__Simple_Left event"
        style={{ backgroundImage: `url(https://storage.googleapis.com/cipla-impact.appspot.com/${event}/bg.jpg?updated=1)` }}
      >
        <img src={`https://storage.googleapis.com/cipla-impact.appspot.com/${event}/bg2.png?updated=1`} alt="" className="bg2" />
        <Link to={RootRoute} className={"headerBox__logo5"}>
          <img src={ciplaMedX} alt="CIPLAMEDXLOGO" />
        </Link>
        <img src={`https://storage.googleapis.com/cipla-impact.appspot.com/${event}/eventLogo.png?updated=1`} alt="" className="cipla-res" />
        <img src={`https://storage.googleapis.com/cipla-impact.appspot.com/${event}/center-logo.png?updated=1`} alt="" className="center_logo" />
      </div>
    </>
  );
}
