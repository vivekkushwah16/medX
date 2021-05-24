import React from "react";
import { Link } from "react-router-dom";
import { RootRoute } from "../../AppConstants/Routes";
// import CIPLAMEDXLOGO_WHITE from "../../assets/images/ciplamed-logo2.png";
import bg from "./bg.png";
import center_logo from "./center-logo.png";
import ciplaMedX from "./ciplaMedX.png";
import cipla_res from "./cipla-respiratory.png";
import left_wing from "./left-wing.png";
import right_wing from "./right-wing.png";
import timing from "./timing.svg";
import bg2 from "./bg2.svg";
import "./EventPageStatic.css";
export default function EventPageStatic() {
  return (
    <>
      <div
        className="login2Box__Simple_Left event"
        style={{ backgroundImage: `url(${bg})` }}
      >
        <img src={bg2} alt="" className="bg2" />
        {/* <img src={left_wing} alt="" className="left-wing" /> */}
        {/* <img src={right_wing} alt="" className="right-wing" /> */}
        <Link to={RootRoute} className={"headerBox__logo5"}>
          <img src={ciplaMedX} alt="CIPLAMEDXLOGO" />
        </Link>
        <img src={cipla_res} alt="" className="cipla-res" />
        <img src={center_logo} alt="" className="center_logo" />
        <img src={timing} alt="" className="timing" />
        {/* <div className="loginBox__Simple_label">
          <b>Expert Views</b> <br></br>
          Watch Anywhere, Watch Anytime
        </div> */}
      </div>
    </>
  );
}
