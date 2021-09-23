import React, { useContext, useState, useEffect, useMemo, useRef } from "react";
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
import axios from "axios";
import { isMobileOnly } from "react-device-detect";
import { Route, Switch } from "react-router-dom";
import {
    KNOW_YOUR_SPEAKER_CLICK_EVENT,
    WATCHTRAILER_ANALYTICS_EVENT,
    OLD_USER_REGISTER_EVENT,
} from "../../AppConstants/AnalyticsEventName";
import blur__img from "./pre_event_blur.svg";

// import leftTest from "./preEventPage_left_heading.svg";
// import RightTest from "./preEventPage_right_speakers.png";
// import leftMobileTest from "./prevent_mobile_info.png";
// import rightMobileTest from "./preevent_mobile_Speaker.png";

import firebase, { firestore } from "../../Firebase/firebase";
import { USERMETADATA_COLLECTION } from "../../AppConstants/CollectionConstants";
import { UserContext } from "../../Context/Auth/UserContextProvider";
import LoadableFallback from "../../Components/LoadableFallback/LoadableFallback";
import { useHistory } from "react-router-dom";
import Myprofile from "../../Containers/myProfile/Myprofile";
import { HOME_ROUTE } from "../../AppConstants/Routes";
import { EVENT_CONFIRMATION_ENDPOINT } from "../../AppConstants/APIEndpoints";
import { RegistrationType } from "../../AppConstants/TypeConstant";

function Workshop(props) {
    const { user, userInfo } = useContext(UserContext);
    const { showMediaModal } = useContext(MediaModalContext);
    const [agendaData, setAgendaData] = useState(null);
    const [agendaDates, setAgendaDates] = useState([]);
    const [cureentAgendaDate, setCureentAgendaDate] = useState(null);
    const history = useHistory();
    const [showRegisterForOldUser, setToggleForRegisterationForOldUser] =
        useState({ status: false, value: false });
    const { attachTimelineListener, removeTimelineListener } =
        useContext(eventContext);
    const { addGAWithUserInfo, addCAWithUserInfo } = useContext(AnalyticsContext);
    let firstTime = useMemo(() => true, []);

    useEffect(() => {
        if (userInfo) {
            firestore
                .collection(USERMETADATA_COLLECTION)
                .doc(user.uid)
                .get()
                .then((doc) => {
                    const data = doc.data();
                    if (data.events) {
                        if (data.events.indexOf(props.event) === -1) {
                            if (history) {
                                history.push(props.redirectLink);
                            }
                        } else {
                            setToggleForRegisterationForOldUser({
                                status: true,
                                value: false,
                            });
                        }
                    } else {
                        if (history) {
                            history.push(props.redirectLink);
                        }
                    }
                })
                .catch((err) => {
                    console.log(err);
                    setToggleForRegisterationForOldUser({ status: true, value: false });
                });
        }
    }, [userInfo]);

    useEffect(() => {
        if (props.eventData.registrationType === RegistrationType.WithAgenda) {
            getAgendaData(props.event);
        }
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
            let date = `${MonthName[new Date(timeline.startTime).getMonth()]
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

    const handleDateChange = (date, event) => {
        if (event) {
            event.preventDefault();
        }
        setCureentAgendaDate(date);
    };

    let initalCSSValues = useRef({});

    useEffect(() => {
        if (props.eventData) {
            if (props.eventData.preventStyle) {
                let root = document.querySelector(":root");
                let computedStyle = getComputedStyle(root);
                let preeventStyle = props.eventData.preventStyle;

                Object.keys(preeventStyle).forEach((varName) => {
                    let initalValue = computedStyle.getPropertyValue(`--${varName}`);
                    if (initalValue) {
                        initalCSSValues.current[varName] = initalValue;
                    }
                    root.style.setProperty(`--${varName}`, preeventStyle[varName]);
                });
            }
        }
        return () => {
            if (initalCSSValues.current) {
                let root = document.querySelector(":root");
                Object.keys(initalCSSValues.current).forEach((varName) => {
                    root.style.setProperty(
                        `--${varName}`,
                        initalCSSValues.current[varName]
                    );
                });
            }
        };
    }, [props.eventData]);

    return (
        <>
            <div className="preventPage min-height-full gradient-bg3 ">
                <Header
                    event={props.event}
                    eventTitle={props.eventTitle}
                    eventData={props.eventData}
                    showMobileSearchBtn={false}
                />
                <div
                    className="login2Box__left s"
                    style={{
                        backgroundImage: `url("https://storage.googleapis.com/cipla-impact.appspot.com/${props.event}/WithAgenda_MainBG.jpg?X=x")`,
                        backgroundPosition: "top",
                        backgroundSize: "contain",
                        backgroundRepeat: "repeat-x",
                        backgroundColor: `${props.eventData?.preventStyle?.preeventBGColor
                            ? props.eventData.preventStyle.preeventBGColor
                            : "inherit"
                            }`,
                        backgroundBlendMode: "multiply",
                    }}
                >
                    {/* BannerBox */}
                    <div className="bannerBox">
                        <div className="bannerBox__inner bannerBox__inner--small bannerBox__inner4 gradient-bg1">
                            <div className="bannerBox__slide">
                                <div className="container">
                                    <div className="d-flex justify-content-between pd-b100 pd-t60 pd-l60 pd-md-b0 pd-md-t0 pd-md-l0">
                                        <div className="bannerBox__left">
                                            <img
                                                className="bannerBox__pic mg-b35"
                                                src={`https://storage.googleapis.com/cipla-impact.appspot.com/${props.event
                                                    }/${isMobileOnly
                                                        ? "WithAgenda_Mobile_Preevent_heading_left.png"
                                                        : "WithAgenda_Preevent_heading_left.png"
                                                    }?updated=${Math.random() * 100}`}
                                                alt="header_left"
                                            />
                                        </div>
                                        <div className="bannerBox__right">
                                            <img
                                                className="bannerBox__pic"
                                                src={`https://storage.googleapis.com/cipla-impact.appspot.com/${props.event
                                                    }/${isMobileOnly && props.eventData.useSeparateImages
                                                        ? "WithAgenda_Mobile_Preevent_heading_right.png"
                                                        : "WithAgenda_Preevent_heading_right.png"
                                                    }?updated=${Math.random() * 100}`}
                                                alt=""
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <AgendaNavBar
                        containerClass="container"
                        className={"hide-on-tablet"}
                        dates={agendaDates}
                        currentDate={cureentAgendaDate}
                        handleClick={handleDateChange}
                        stickyOnScroll={true}
                    />
                    <AgendaNavBar
                        containerClass="container"
                        className={"show-on-tablet show-on-tablet--flex "}
                        dates={agendaDates}
                        currentDate={cureentAgendaDate}
                        handleClick={handleDateChange}
                        forceAgendaVisibleMobile={true}
                        stickyOnScroll={true}
                    />

                    <div className="maincardBox maincardBox--large maincardBox--mobile-visible">
                        <div className="maincardBox__card-wrapper">
                            <div className="container">
                                {agendaData &&
                                    agendaData[cureentAgendaDate] &&
                                    agendaData[cureentAgendaDate].map((timeline, index) => (
                                        <>
                                            {
                                                props.workshopData.timelineIds.indexOf(timeline.id) !== -1 && props.workshopData.links && props.workshopData.links[timeline.id] &&
                                                <AgendaCard
                                                    timeline={timeline}
                                                    haveVideo={false}
                                                    haveLikeButton={false}
                                                    handleClick={() => {
                                                    }}
                                                    wantHeaderFooter={true}
                                                    key={index}
                                                    redirectBtn={true}
                                                    redirectLink={props.workshopData.links[timeline.id]}
                                                />
                                            }
                                        </>
                                    ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Switch>
                <Route path={`/:event/profile`}>
                    {userInfo ? (
                        <Myprofile returnUrl={`/${props.eventData.eventName}`} />
                    ) : (
                        <div className="loaderContainer">
                            <div className="lds-dual-ring"></div>
                        </div>
                    )}
                </Route>
            </Switch>
        </>
    );
}

export default Workshop;
