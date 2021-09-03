import React, { useContext, useEffect, useRef, useState } from "react";
import InviteFriend from "../../Components/InviteFriend/InviteFriend";
import Notification from "../../Components/Notification/Notification";
import Profile from "../../Components/Profile/Profile";
import CIPLAMEDXLOGO from "../../assets/images/medXlogo.png";
import CIPLAMEDXLOGO_WHITE from "../../assets/images/ciplamed-logo2.png";
import ciplamedximpact from "../../assets/images/logos/ciplamedximpact.png";
import ciplamedxevolve from "../../assets/images/ciplamedxevolve.png";
import ciplamedxorient from "../../assets/images/ciplamedxorient.png";
import ciplamedxinspira from "../../assets/images/cipla_with_eventLogo.png";
import { RootRoute } from "../../AppConstants/Routes";
import { MediaModalContext } from "../../Context/MedialModal/MediaModalContextProvider";
import { MediaModalType } from "../../AppConstants/ModalType";
import Certificate from "../../Components/Certificate/Certificate";
import { useHistory } from "react-router-dom";
import "./Header.css";
import {
  CERTIFICATE_CLICK,
  DOWNLOAD_CERTIFICATE,
  FEEDBACK_CLICK,
} from "../../AppConstants/AnalyticsEventName";
import { Link } from "react-router-dom";
import swal from "sweetalert";
import SearchBar from "../../Components/SearchBar/SearchBar";

//showCertificate, showFeedback
export default function Header(props) {
  let history = useHistory();
  // console.log(props);
  const {
    stickyOnScroll,
    addClickAnalytics,
    showSearchBar,
    doSearch,
    initalSearchKeyword,
  } = props;
  const [showInviteFriendModal, toggleInviteFriendModal] = useState(false);
  const { showMediaModal } = useContext(MediaModalContext);

  const navBar = useRef(null);
  const [sticky, setSticky] = useState(false);
  const [searchBarSticky, setSearchBarSticky] = useState(false);
  const [yOffset, setyOffset] = useState(100);
  useEffect(() => {
    if (stickyOnScroll) {
      // console.log(navBar.current)
      if (navBar.current) {
        // yOffset = navBar.current.offsetTop
        setyOffset(navBar.current.offsetTop);
        // console.log(navBar.current.offsetTop)
        window.addEventListener("scroll", handleScroll);
        return () => {
          window.removeEventListener("scroll", handleScroll);
        };
      }
    }
  }, [navBar.current]);

  const handleScroll = () => {
    try {
      if (window.pageYOffset > yOffset) {
        setSticky(true);
      } else {
        setSticky(false);
      }
      if (
        window.pageYOffset >
          window.innerHeight + navBar.current.offsetTop + 130 &&
        window.innerHeight <= 600
      ) {
        setSearchBarSticky(true);
      } else if (
        window.pageYOffset > window.innerHeight * 0.9 &&
        window.innerHeight > 600
      ) {
        setSearchBarSticky(true);
      } else {
        setSearchBarSticky(false);
      }
    } catch (error) {
      // console.log(error);
    }
  };

  return (
    <div
      className={` headerBox--full pd-r0 ${
        sticky ? "headerBox_sticky" : "headerBox"
      }`}
      ref={navBar}
      style={{
        padding:
          history.location.pathname.includes("search") && "1.325rem 0 5rem 0",
        backgroundColor:
          window.innerWidth <= 768 &&
          history.location.pathname.includes("search") &&
          "#000",
      }}
      id="header"
    >
      <div className="container">
        <div className="d-flex align-items-center justify-content-between">
          <div className="headerBox__left">
            <Link
              to={RootRoute}
              className={
                props.eventPage ? "headerBox__logo6" : "headerBox__logo5"
              }
            >
              <img
                src={
                  props.whiteLogo
                    ? CIPLAMEDXLOGO_WHITE
                    : props.eventPage
                    ? props.eventAndCiplaLogo
                    : CIPLAMEDXLOGO
                }
                alt="CIPLAMEDXLOGO"
              />
            </Link>
            {/* <a href={RootRoute} className="headerBox__logo5">
                            <img src={props.whiteLogo ? CIPLAMEDXLOGO_WHITE : CIPLAMEDXLOGO} alt="CIPLAMEDXLOGO" />
                        </a> */}
          </div>

          {showSearchBar && (
            <SearchBar
              doSearch={doSearch}
              initalSearchKeyword={initalSearchKeyword}
              sticky={searchBarSticky}
            />
          )}

          <div className="headerBox__right headerBox__right--nogap">
            {props.showCertificate && (
              <button
                className="btn btn-secondary"
                onClick={() => {
                  if (props.disableFeedback)
                    swal(
                      "Event still in progress",
                      "Please collect your certificate at the end of the event"
                    );
                  else {
                    addClickAnalytics(CERTIFICATE_CLICK);
                    showMediaModal(MediaModalType.Component, {
                      component: Certificate,
                      data: {
                        addClickAnalytics: () => {
                          addClickAnalytics(DOWNLOAD_CERTIFICATE);
                        },
                        event: props.event,
                      },
                    });
                  }
                }}
              >
                Get your certificate
              </button>
            )}
            {props.showFeedback && (
              <button
                className="btn btn-secondary"
                onClick={() => {
                  addClickAnalytics(FEEDBACK_CLICK);
                  showMediaModal(
                    MediaModalType.PDF,
                    `/feedback/index.html?id=123&event=${props.event}&title=${props.eventTitle}`
                  );
                }}
              >
                Feedback
              </button>
            )}
            {!props.hideInviteFriend && (
              <InviteFriend
                eventTitle={props.eventTitle}
                event={props.event}
                eventData={props.eventData}
                toggleInviteFriendModal={toggleInviteFriendModal}
                showInviteFriendModal={showInviteFriendModal}
              />
            )}
            <Link
              to="/search"
              style={{
                display:
                  (history.location.pathname.includes("search") ||
                    !props.showMobileSearchBtn) &&
                  "none",
              }}
              className="mobile-search-btn"
            >
              <i className="icon-search"></i>
            </Link>
            <Notification
              handleClick={() => {
                // showMediaModal(MediaModalType.PDF, '/web/viewer.html?file=%2Fassets%2Fimages%2Fnewflyer.pdf')
              }}
              data={["No Notifications"]}
            />
            <Profile />
          </div>
        </div>
      </div>
    </div>
  );
}
