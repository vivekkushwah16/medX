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
  NOTIFICATION_RECEIVED,
  NOTIFICATION_INTERACTED,
} from "../../AppConstants/AnalyticsEventName";
import { Link } from "react-router-dom";
import swal from "sweetalert";
import SearchBar from "../../Components/SearchBar/SearchBar";
import {
  addNewNotificationToIDB,
  checkIfEventIsRegistered_IndexDB,
  getAllNotifications,
  getClickNotificationFromDB,
  updateNotification,
} from "../../utils/notificationsManager";
import { onMessageListener } from "../../Firebase/firebase";
import { ToastContainer, toast, Flip } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AnalyticsContext } from "../../Context/Analytics/AnalyticsContextProvider";
import { UserContext } from "../../Context/Auth/UserContextProvider";
import NewsHeader from "../../Components/NewsHeader/NewsHeader";

const audioLinkRef =
  "https://storage.googleapis.com/cipla-impact.appspot.com/notification_music/notification.mp3";

const USER_NOTIFICATION_TABLE = "user_notification";
const NEW_NOTIFICATION_TABLE = "new_notification";
const CLICKED_NOTIFICATION_TABLE = "clicked_notification";
const notificationType_registration = "registration";
//showCertificate, showFeedback
export default function Header(props) {
  let audioRef = useRef();

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
  const { addGAWithUserInfo } = useContext(AnalyticsContext);
  const { userInfo } = useContext(UserContext);

  const navBar = useRef(null);
  const [sticky, setSticky] = useState(false);
  const [notificationData, setNotificationData] = useState([]);
  const [searchBarSticky, setSearchBarSticky] = useState(false);
  const [yOffset, setyOffset] = useState(100);

  function NotificationDisplay({
    title,
    body,
    link,
    id,
    date,
    icon,
    opened,
    topic,
  }) {
    const handleClick = () => {
      if (!opened) {
        let newData = {
          title,
          body,
          link,
          id,
          date,
          icon,
          opened: true,
          topic,
        };
        updateNotification(newData, (res) => {
          // console.log("clicked", res);
          // addNewNotificationToIDB(
          //   CLICKED_NOTIFICATION_TABLE,
          //   newData,
          //   (res) => {
          //     console.log("updated new_notification-------------", res);
          //   }
          // );
          addGAWithUserInfo(NOTIFICATION_INTERACTED, {
            msg_id: id || title,
            title: title,
            topic: topic,
            mode: "FRONTEND_NOTIFICATION",
          });
        });
      }
    };
    return (
      <div key={id}>
        <a
          href={link}
          onClick={handleClick}
          style={{ textDecoration: "none", color: "initial" }}
        >
          <h4>{title}</h4>
          <p>{body}</p>
        </a>
      </div>
    );
  }

  const isListenerAttached = useRef(false);

  useEffect(() => {
    if (userInfo && !isListenerAttached.current) {
      isListenerAttached.current = true;
      window.addEventListener("focus", () => {
        getClickNotificationFromDB(
          CLICKED_NOTIFICATION_TABLE,
          addGAWithUserInfo,
          (data) => {
            if (data) {
              //if clicked add click analytics
              // addGAWithUserInfo(NOTIFICATION_INTERACTED, {
              //   msg_id: "id" || "title",
              //   title: "title",
              //   topic: "topic",
              // });
            }
          }
        );

        getClickNotificationFromDB(
          NEW_NOTIFICATION_TABLE,
          addGAWithUserInfo,
          (data) => {
            if (data) {
              //Update state with new notification
              // setNotificationData(data);
              // fetch all notifications from db initially
              getAllNotifications(USER_NOTIFICATION_TABLE, (data) => {
                if (data) {
                  let sortedData = data.sort((a, b) => b.date - a.date);
                  setNotificationData(sortedData);
                } else {
                  setNotificationData([]);
                }
              });
            }
          }
        );
      });
      // fetch all notifications from db initially
      getAllNotifications(USER_NOTIFICATION_TABLE, (data) => {
        if (data) {
          let sortedData = data.sort((a, b) => b.date - a.date);
          setNotificationData(sortedData);
        } else {
          setNotificationData([]);
        }
      });

      //Notification Listener
      onMessageListener(async (payload) => {
        // console.log("payload", payload);
        let date = new Date();
        let data = {
          id: payload.data.msg_id,
          title: payload.data.title,
          body: payload.data.body,
          link: payload.data.link,
          icon: payload.data.icon,
          topic: payload.data.topic,
          canRepeat: payload.data.canRepeat === "true" ? true : false,
          date: date,
          opened: false,
        };
        const handleNotification = () => {
          addGAWithUserInfo(NOTIFICATION_RECEIVED, {
            msg_id: payload.data.msg_id || payload.data.title,
            title: payload.data.title,
            topic: payload.data.topic,
            mode: "FRONTEND_NOTIFICATION",
          });
          audioRef.current.play();

          addNewNotificationToIDB(USER_NOTIFICATION_TABLE, data, (res) => {
            if (res) {
              console.log("data successfully added in indexDB");
              // fetch all notifications from db
              getAllNotifications(USER_NOTIFICATION_TABLE, (data) => {
                if (data) {
                  let sortedData = data.sort((a, b) => b.date - a.date);
                  setNotificationData(sortedData);
                } else {
                  setNotificationData([]);
                }
              });
            } else {
              console.log("failed to add data in indexDB");
            }
          });

          // addNewNotificationToIDB(NEW_NOTIFICATION_TABLE, data, (res) => {
          //   console.log("updated new_notification-------------", res);
          // });

          toast.info(
            <NotificationDisplay
              title={payload.data.title}
              body={payload.data.body}
              link={payload.data.link}
              id={payload.data.msg_id}
              date={date}
              topic={payload.data.topic}
              icon={payload.data.icon}
              opened={false}
            />,
            {
              icon: <img src={payload.data.icon} alt="" />,
            }
          );
        };

        await getAllNotifications(USER_NOTIFICATION_TABLE, async (response) => {
          if (response) {
            let repeat = false;

            if (response.length !== 0) {
              let re = response.filter((d) => d.id === payload.data.msg_id)[0];
              if (re) {
                repeat = re.canRepeat;
              } else {
                repeat = true;
              }
            } else {
              repeat = true;
            }
            if (
              payload.data.type === notificationType_registration &&
              payload.data.eventId
            ) {
              checkIfEventIsRegistered_IndexDB(
                payload.data.eventId,
                async (registered) => {
                  if (!registered) {
                    if (repeat) {
                      await handleNotification();
                      updateNotification(
                        { ...data, canRepeat: data.canRepeat },
                        (res) => {}
                      );
                    }
                  }
                }
              );
            } else {
              if (repeat) {
                await handleNotification();
                updateNotification(
                  { ...data, canRepeat: data.canRepeat },
                  (res) => {}
                );
              }
            }
          }
        });
      });
    }
  }, [userInfo]);

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
    <>
      <ToastContainer
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        transition={Flip}
        pauseOnHover={false}
      />
      <audio
        // style={{ display: "none" }}
        src={audioLinkRef}
        ref={audioRef}
        preload="auto"
      ></audio>

      {props.headerType === "news" ? (
        <NewsHeader />
      ) : (
        <div
          className={` headerBox--full pd-r0 ${
            sticky ? "headerBox_sticky" : "headerBox"
          }`}
          ref={navBar}
          style={{
            padding:
              history.location.pathname.includes("search") &&
              "1.325rem 0 5rem 0",
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
                  // handleClick={() => {
                  // showMediaModal(MediaModalType.PDF, '/web/viewer.html?file=%2Fassets%2Fimages%2Fnewflyer.pdf')
                  // }}
                  data={
                    notificationData //["No Notifications"]
                  }
                />
                <Profile />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
