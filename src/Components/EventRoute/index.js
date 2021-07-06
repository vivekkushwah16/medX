import React, { useContext, useEffect, useState } from "react";
import {
  Redirect,
  Route,
  Switch,
  useHistory,
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

export const EventChecker = (props) => {
  //to wait till we reead values from firesbase
  const [doneCheck, setCheckDonw] = useState(false);
  const [eventStatus, setEventStatus] = useState(false);
  const [eventDetails, setEventDetails] = useState(false);

  //Router hooks
  let { url } = useRouteMatch();
  let { event } = useParams();
  if (event) {
    event = event.toLowerCase()
  }
  const history = useHistory();

  useEffect(() => {
    getEventNameAndCrossCheck();
  }, [event]);

  const getEventNameAndCrossCheck = async () => {
    // console.log(event);
    let ref = firestore
      .collection(BACKSTAGE_COLLECTION)
      .doc(PLATFORM_BACKSTAGE_DOC);
    const doc = await ref.onSnapshot(
      (doc) => {
        if (!doc.exists) {
          history.push(`/home`);
        }
        const activeEventList = doc.data().activeEventList;
        if (activeEventList.hasOwnProperty(event.toLowerCase())) {
          // if (activeEventList[event.toLowerCase()].disabled && props.env !== "dev") {
          //   history.push(`/home`);
          //   return;
          // }
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
        <NotLoggedInRoutes redirectTo={url} path={`${url}/login`}>
          {props.login ? (
            <props.login
              event={event.toLowerCase()}
              haveAgenda={eventDetails.agenda}
              registerUrl={`${url}/register`}
            />
          ) : (
            "login"
          )}
        </NotLoggedInRoutes>

        <NotLoggedInRoutes redirectTo={url} path={`${url}/register`}>
          {props.register ? (
            <props.register
              event={event.toLowerCase()}
              haveAgenda={eventDetails.agenda}
              loginUrl={`${url}/login`}
              eventTitle={eventDetails.title}
            />
          ) : (
            "register"
          )}
        </NotLoggedInRoutes>

        <ProtectedRoute
          redirectTo={`${url}/login`}
          path={`${url}/register-ott`}
        >
          <props.notLive
            event={event.toLowerCase()}
            calendatDetails={eventDetails.calendar}
            eventTitle={eventDetails.title}
            canEnterEvent={eventStatus === EventStausType.Live}
            eventData={eventDetails}
          />
        </ProtectedRoute>

        <ProtectedRoute
          exact
          redirectTo={`${url}/login`}
          path={`${url}/liveCount-kmp23`}
        >
          <props.liveCount eventId={event} />
        </ProtectedRoute>
        <ProtectedRoute
          exact
          redirectTo={`${url}/login`}
          path={`${url}/qna-kmp23`}
        >
          <props.qnaPage eventId={event} />
        </ProtectedRoute>

        <ProtectedRoute redirectTo={`${url}/login`} path={url}>
          {eventStatus === EventStausType.NotLive && (
            <>
              {props.notLive ? (
                <props.notLive
                  event={event.toLowerCase()}
                  eventTitle={eventDetails.title}
                  calendatDetails={eventDetails.calendar}
                  eventData={eventDetails}
                />
              ) : (
                "NotLive Event"
              )}
            </>
          )}
          {eventStatus === EventStausType.Live && (
            <>
              {props.liveEvent ? (
                <props.liveEvent
                  event={event.toLowerCase()}
                  eventTitle={eventDetails.title}
                />
              ) : (
                "Live Event"
              )}
            </>
          )}
          {eventStatus === EventStausType.Finished && (
            <>
              {props.finishedEvent ? (
                <props.finishedEvent event={event.toLowerCase()} />
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
      <Route path={"/:event"}>
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
