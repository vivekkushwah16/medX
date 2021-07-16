import React from "react";
import "./footer.css";

export default function Footer() {
  return (
    <footer className="footerBox" style={{ zIndex: 5 }}>
      {/* <div className="">
                <img src="/assets/images/ciplamed-logo2.png"></img>
                <div>

                </div>
            </div> */}
      <div className="copyright">
        <img src="/assets/images/logo.png" alt="" />
        <span>© Copyright 2021 -- All rights reserved</span>
      </div>
      {/* <ul>
                <li class="active"><a href="#">
                    <i class="icon-home"></i>
                   Home</a>
                </li>
                <li><a href="#">
                    <i class="icon-search"></i>
                    Search</a>
                </li>
                <li><a href="#">
                    <i class="icon-bell"></i>
                    Notification</a>
                </li>
                <li><a href="#">
                    <i class="icon-profile"></i>
                    Profile</a>
                </li>
            </ul> */}
    </footer>
  );
}
