import React, { useContext, useEffect, useState } from "react";
import {
  Redirect,
  Route,
  Switch,
  useHistory,
  useLocation,
  useParams,
  useRouteMatch,
} from "react-router-dom";
import {
  BACKSTAGE_COLLECTION,
  PLATFORM_BACKSTAGE_DOC,
} from "../../AppConstants/CollectionConstants";
import { HOME_ROUTE } from "../../AppConstants/Routes";
import { UserContext } from "../../Context/Auth/UserContextProvider";
import { firestore } from "../../Firebase/firebase";
import LoadableFallback from "../LoadableFallback/LoadableFallback";
import NotLoggedInRoutes from "../NotLoggedInRoutes/NotLoggedInRoutes";
import ProtectedRoute from "../ProtectedRoute/ProtectedRoute";
export const EventStausType = {
  NotLive: "notLive",
  Live: "live",
  Finished: "finished",
};

export const PREVIEW_OPTIONS = {
  registration: "registration",
  event: "event",
}

export const ADMIN_TYPE = {
  Master: "master",
  Simple: "simple"
}

//https://ciplamedx.com/ronaprevewebcast?admin=true&preview=registration

export const EventChecker = (props) => {
  //to wait till we reead values from firesbase
  const [doneCheck, setCheckDonw] = useState(false);
  const [eventStatus, setEventStatus] = useState(false);
  const [eventDetails, setEventDetails] = useState(false);
  const [dashboardPreview, setDashboardPreview] = useState({});

  const { user } = useContext(UserContext)

  //Router hooks
  let { url } = useRouteMatch();
  let { eventName } = useParams();
  if (eventName) {
    eventName = eventName.toLowerCase()
  }
  const history = useHistory();
  function useQuery() {
    return new URLSearchParams(useLocation().search);
  }
  let urlQuery = useQuery();

  useEffect(() => {
    getEventNameAndCrossCheck();
  }, [eventName]);

  const getEventNameAndCrossCheck = async () => {
    let url_admin = urlQuery.get("admin") === "true" ? true : false
    let url_preview = urlQuery.get("preview")

    // console.log(event);
    let ref = firestore
      .collection(BACKSTAGE_COLLECTION)
      .doc(PLATFORM_BACKSTAGE_DOC);
    const doc = await ref.onSnapshot(
      async (doc) => {
        if (!doc.exists) {
          history.push(`/home`);
          return
        }
        const eventNameList = doc.data().eventName
        if (!eventNameList.hasOwnProperty(eventName.toLowerCase())) {
          history.push(`/home`);
          return
        }
        const event = eventNameList[eventName]
        const activeEventList = doc.data().activeEventList;
        if (activeEventList.hasOwnProperty(event.toLowerCase())) {
          if (url_admin && user && Object.values(PREVIEW_OPTIONS).indexOf(url_preview) !== -1) {
            let uid = user.uid
            let _dashboardAdminDoc = await firestore.collection("dashboardAdmin").doc(uid).get()
            if (_dashboardAdminDoc.exists) {
              //check admin type 
              let eventPermissions = null
              if (_dashboardAdminDoc.data().type === ADMIN_TYPE.Simple) {
                let permissions = _dashboardAdminDoc.data().permissions
                eventPermissions = permissions.filter(item => item.event === eventName.toLowerCase())[0]
                console.log(eventPermissions)
              }
              if (_dashboardAdminDoc.data().type === ADMIN_TYPE.Master || (_dashboardAdminDoc.data().type === ADMIN_TYPE.Simple && eventPermissions !== null)) {
                setDashboardPreview({
                  permission: eventPermissions,
                  adminType: _dashboardAdminDoc.data().type,
                  page: url_preview,
                  currentPage: url_preview,
                })
                if (url_preview === PREVIEW_OPTIONS.registration) {
                  setEventStatus(EventStausType.NotLive);
                } else {
                  setEventStatus(EventStausType.Live);
                }
                setEventDetails(activeEventList[event.toLowerCase()]);
                setCheckDonw(true);
                return
              }
            }
          }

          if (activeEventList[event.toLowerCase()].disabled && (props.env !== "dev")) {
            history.push(`/home`);
            return;
          }
          if (props.env === "dev") {
            activeEventList[event.toLowerCase()].status = props.forceState;
          }
          setEventStatus(activeEventList[event.toLowerCase()].status);
          setEventDetails(activeEventList[event.toLowerCase()]);
          setCheckDonw(true);

        } else {
          history.push(`/home`);
        }
      },
      (error) => {
        history.push("/home");
      }
    );
  };

  if (!doneCheck) {
    return <LoadableFallback />;
  }

  return (
    <>
      <Switch>
        <NotLoggedInRoutes redirectTo={url} path={`${url}/signup`}>
          {props.login ? (
            <props.login
              event={eventDetails.id.toLowerCase()}
              eventData={eventDetails}
              haveAgenda={eventDetails.agenda}
              registerUrl={`${url}/register`}
            />
          ) : (
            "signup"
          )}
        </NotLoggedInRoutes>

        <NotLoggedInRoutes redirectTo={url} path={`${url}/register`}>
          {props.register ? (
            <props.register
              haveAgenda={eventDetails.agenda}
              loginUrl={`${url}/signup`}
              event={eventDetails.id.toLowerCase()}
              eventTitle={eventDetails.title}
              eventDate={eventDetails.eventDate}
              eventData={eventDetails}
            />
          ) : (
            "register"
          )}
        </NotLoggedInRoutes>


        <ProtectedRoute
          redirectTo={`${url}/signup`}
          path={`${url}/feedback`}
        >
          {
            eventDetails.feedback &&
              eventDetails.feedback.enabled ?
              <iframe className="feedback-fullpage" src={`${eventDetails.feedback.link}?id=123&event=${eventDetails.id.toLowerCase()}&title=${eventDetails.title}`} title="feedback" />
              :
              <Redirect to={`${url}/signup`}></Redirect>
          }
        </ProtectedRoute>


        <ProtectedRoute
          redirectTo={`${url}/signup`}
          path={`${url}/register-ott`}
        >
          <props.notLive
            event={eventDetails.id.toLowerCase()}
            calendatDetails={eventDetails.calendar}
            eventTitle={eventDetails.title}
            canEnterEvent={eventStatus === EventStausType.Live}
            eventData={eventDetails}
          />
        </ProtectedRoute>

        <ProtectedRoute
          exact
          redirectTo={`${url}/signup`}
          path={`${url}/liveCount-kmp23`}
        >
          <props.liveCount eventId={eventDetails.id} />
        </ProtectedRoute>
        <ProtectedRoute
          exact
          redirectTo={`${url}/signup`}
          path={`${url}/qna-kmp23`}
        >
          <props.qnaPage eventId={eventDetails.id} />
        </ProtectedRoute>

        <ProtectedRoute redirectTo={`${url}/signup`} path={url}>
          {
            eventStatus === EventStausType.NotLive ?
              (dashboardPreview.currentPage === PREVIEW_OPTIONS.registration ?
                <>
                  {props.login ? (
                    <props.login
                      event={eventDetails.id.toLowerCase()}
                      eventData={eventDetails}
                      haveAgenda={eventDetails.agenda}
                      registerUrl={`${url}/register`}
                      dummyPage={true}
                      goToPreviewPage={() => {
                        setDashboardPreview(oldVal => ({
                          ...oldVal,
                          currentPage: "preEvent"
                        })
                        )
                      }}
                    />
                  ) : (
                    "signup"
                  )}
                </>
                :
                <>
                  {props.notLive ? (
                    <props.notLive
                      event={eventDetails.id.toLowerCase()}
                      eventDate={eventDetails.eventDate}
                      eventTitle={eventDetails.title}
                      calendatDetails={eventDetails.calendar}
                      eventData={eventDetails}
                    />
                  ) : (
                    "NotLive Event"
                  )}
                </>) : null
          }

          {eventStatus === EventStausType.Live && (
            <>
              {props.liveEvent ? (
                <props.liveEvent
                  event={eventDetails.id.toLowerCase()}
                  eventTitle={eventDetails.title}
                  eventData={eventDetails}
                />
              ) : (
                "Live Event"
              )}
            </>
          )}
          {eventStatus === EventStausType.Finished && (
            <>
              {props.finishedEvent ? (
                <props.finishedEvent event={eventDetails.id.toLowerCase()} />
              ) : (
                "Finished Event"
              )}
            </>
          )}
        </ProtectedRoute>
        <Redirect to={HOME_ROUTE}></Redirect>
      </Switch>
    </>
  );
};

export default function EventRoute(props) {
  return (
    <>
      <Route path={"/:eventName"}>
        <EventChecker
          login={props.login}
          register={props.register}
          notLive={props.notLive}
          liveEvent={props.liveEvent}
          finishedEvent={props.finishedEvent}
          env={props.env} //dev or prod
          forceState={props.forceState}
          qnaPage={props.qnaPage}
          liveCount={props.liveCount}
        >
          {props.children}
        </EventChecker>
      </Route>
      <Route exact path={"/"}>
        <Redirect to={props.redirectTo}></Redirect>
      </Route>
    </>
  );
}

// include registrationType = "WithAgenda" and
//faculty = { enabled: false, link:"" }
//watchTrailer = { enabled: false, link:"" }