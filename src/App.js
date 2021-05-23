import React, { useContext, useEffect } from "react";
import { BrowserRouter as Router, Redirect, Switch } from "react-router-dom";
import { UserContext } from "./Context/Auth/UserContextProvider";
import ProtectedRoute from "./Components/ProtectedRoute/ProtectedRoute";
import NotLoggedInRoutes from "./Components/NotLoggedInRoutes/NotLoggedInRoutes";

import {
  HOME_ROUTE,
  LOGIN_ROUTE,
  REGISTER_ROUTE,
  RootRoute,
  EVENT_ROUTE,
} from "./AppConstants/Routes";

// import css
// import Home from './Pages/Home/Home';

import "./assets/css/modal.css";

import loadable from "@loadable/component";
import LoadableFallback from "./Components/LoadableFallback/LoadableFallback";
import PreEvent from "./Pages/PreEvent/PreEvent";
import EventRoute from "./Components/EventRoute";
import EventManager from "./Managers/EventManager";
import { LOREM_TEXT } from "./AppConstants/Lorem";
import { firestore } from "./Firebase/firebase";
import { PROFILE_COLLECTION } from "./AppConstants/CollectionConstants";
import { PollManager } from "./Managers/PollManager";
import { TRENDING_ITEM_TYPE } from "./AppConstants/TrendingItemTypes";
// import loadable from "@loadable/component";
// import LoadableFallback from "./Components/LoadableFallback/LoadableFallback";
// import Upload from './Components/Upload/upload';
// import LiveCount from './Pages/LiveCount/liveCount';
// import QnaPage from './Pages/QnaPage/QnaPage';
const RegisterLazy = loadable(
  () =>
    import(
      /* webpackChunkName: "Register" */ "./Pages/SimpleRegister/Register"
    ),
  { fallback: <LoadableFallback /> }
);

const PreEventLazy = loadable(() => import("./Pages/PreEvent/PreEvent"), {
  fallback: <LoadableFallback />,
});
const LoginLazy = loadable(
  () => import(/* webpackChunkName: "Login" */ "./Pages/SimpleLogin/Login"),
  { fallback: <LoadableFallback /> }
);
const MediaModalLazy = loadable(
  () =>
    import(
      /* webpackChunkName: "MediaModal" */ "./Containers/MediaModal/MediaModal"
    ),
  { fallback: <LoadableFallback /> }
);
const EventLazy = loadable(
  () => import(/* webpackChunkName: "EventLazy" */ "./Pages/Event/Event"),
  { fallback: <LoadableFallback /> }
);

const HomeLazy = loadable(
  () => import(/* webpackChunkName: "HomeLazy" */ "./Pages/Home/Home"),
  { fallback: <LoadableFallback /> }
);
const LiveCountLazy = loadable(
  () =>
    import(
      /* webpackChunkName: "LiveCountLazy" */ "./Pages/LiveCount/liveCount"
    ),
  { fallback: <LoadableFallback /> }
);
const QnaPageLazy = loadable(
  () => import(/* webpackChunkName: "QnaPageLazy" */ "./Pages/QnaPage/QnaPage"),
  { fallback: <LoadableFallback /> }
);
const UploadLazy = loadable(
  () =>
    import(/* webpackChunkName: "UploadLazy" */ "./Components/Upload/upload"),
  { fallback: <LoadableFallback /> }
);

const EvolveLoginLazy = loadable(
  () => import(/* webpackChunkName: "UploadLazy" */ "./Pages/Evolve/Login"),
  { fallback: <LoadableFallback /> }
);
const EvolveRegisterLazy = loadable(
  () => import(/* webpackChunkName: "UploadLazy" */ "./Pages/Evolve/Register"),
  { fallback: <LoadableFallback /> }
);
const EvolvePreEventLazy = loadable(
  () => import(/* webpackChunkName: "UploadLazy" */ "./Pages/Evolve/PreEvent"),
  { fallback: <LoadableFallback /> }
);
// import EvolveLogin from "./Pages/Evolve/Login";
// import EvolveRegister from "./Pages/Evolve/Register";
// import EvolvePreEvent from "./Pages/Evolve/PreEvent";

// import VideoManager from './Managers/VideoManager';
// import EventManager from './Managers/EventManager';
// import EventManager from './Managers/EventManager';
// import Trending from './Components/Event/Trending/Trending';
// import { TRENDING_ITEM_TYPE } from './AppConstants/TrendingItemTypes';
// import { LOREM_TEXT } from './AppConstants/Lorem';
// import { PollManager } from './Managers/PollManager';
// import axios from 'axios';
// import { CONFIRMATIONENDPOINT } from './AppConstants/APIEndpoints';
// import SpeakerManager from './Managers/SpeakerManager';
// import SpeakerManager from './Managers/SpeakerManager';

const speakerProfileLink =
  "https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg";

const preload = (component) => {
  component.preload && component.preload();
};

export default function App() {
  const { initalCheck, user } = useContext(UserContext);
  useEffect(() => {
    if (user) {
      console.log("App Started - DJ");
      preload(EventLazy);
      preload(HomeLazy);
    } else {
      preload(RegisterLazy);
      preload(LoginLazy);
    }
  }, [initalCheck, user]);

  useEffect(() => {
    // EventManager.addTrendingItem(
    //   "evolve",
    //   TRENDING_ITEM_TYPE.PDF,
    //   "Unleashing the Efficacy & Safety of Levosalbutamol",
    //   "Unleashing the Efficacy & Safety of Levosalbutamol",
    //   "https://firebasestorage.googleapis.com/v0/b/cipla-impact.appspot.com/o/evolve%2Ftrending%2FInsync-Levolin%20Issue%201.pdf?alt=media&token=c9b34df5-c4ab-48e5-8325-cc0a42bb5f2e",
    //   "https://firebasestorage.googleapis.com/v0/b/cipla-impact.appspot.com/o/impact2021%2Ftrending%2FNutshell%20Issue%206%20-%20Cough%20Variant_page-0001.jpg?alt=media&token=e9a47171-da42-4a0e-811f-c108d07c2bdb"
    // );
    // EventManager.addTrendingItem(
    //   "evolve",
    //   TRENDING_ITEM_TYPE.PDF,
    //   "Simplicity with Safety- Levosalbutamol in Breathe-Actuated Inhaler",
    //   "Simplicity with Safety- Levosalbutamol in Breathe-Actuated Inhaler",
    //   "https://firebasestorage.googleapis.com/v0/b/cipla-impact.appspot.com/o/evolve%2Ftrending%2FLevosalbutamol%20BAI_Study-%201.pdf?alt=media&token=5b797fa5-77ef-4484-a67b-7980a0f83ab6",
    //   "https://firebasestorage.googleapis.com/v0/b/cipla-impact.appspot.com/o/impact2021%2Ftrending%2FNutshell%20Issue%206%20-%20Cough%20Variant_page-0001.jpg?alt=media&token=e9a47171-da42-4a0e-811f-c108d07c2bdb"
    // );
  }, []);

  const updateUserMetaData = async () => {
    console.log("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX");
    const query = await firestore.collection(PROFILE_COLLECTION).get();
    for (let i = 0; i < query.docs.length; i++) {
      console.log(
        "--------------------------" +
          (i / query.docs.length) * 100 +
          "------------------------------"
      );
      await crossCheckForRegDateAndUpdateMetaData(query.docs[i]);
    }
    console.log("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX");
  };
  const crossCheckForRegDateAndUpdateMetaData = (doc) => {
    return new Promise(async (res, rej) => {
      try {
        let uid = doc.id;
        let docData = doc.data();
        let regEvent = "impact";
        console.log(docData.date, 1618684200000, docData.date > 1618684200000);
        if (docData.date > 1618684200000) {
          regEvent = "ott";
        }
        const ref = firestore.collection("userMetaData").doc(uid);
        await firestore.runTransaction(async (transcation) => {
          const metaDoc = await transcation.get(ref);
          if (metaDoc.exists) {
            return;
          } else {
            let data = {};
            if (regEvent === "impact") {
              data["registeration"] = "impact";
              data["events"] = ["impact"];
            } else {
              data["registeration"] = "ott";
              data["events"] = [];
            }
            return transcation.set(ref, data);
          }
        });
        res();
      } catch (error) {
        rej(error);
      }
    });
  };

  return (
    <>
      <MediaModalLazy />
      <Router>
        {initalCheck && (
          <Switch>
            <NotLoggedInRoutes redirectTo={"/evolve"} path={"/evolve/register"}>
              <EvolveRegisterLazy />
              {/* <Redirect to={REGISTER_ROUTE}></Redirect> */}
            </NotLoggedInRoutes>
            <NotLoggedInRoutes redirectTo={"/evolve"} path={"/evolve/login"}>
              <EvolveLoginLazy />
              {/* <Redirect to={REGISTER_ROUTE}></Redirect> */}
            </NotLoggedInRoutes>
            <ProtectedRoute exact redirectTo={"/evolve/login"} path={"/evolve"}>
              {/* <PreEventLazy /> */}
              {/* <EvolvePreEventLazy /> */}
              <EventLazy eventId={'evolve'} />
            </ProtectedRoute>
            <ProtectedRoute
              exact
              redirectTo={LOGIN_ROUTE}
              path={"/evolve/liveCount-kmp23"}
            >
              <LiveCountLazy eventId={"evolve"} />
            </ProtectedRoute>
            <ProtectedRoute
              exact
              redirectTo={LOGIN_ROUTE}
              path={"/evolve/qna-kmp23"}
            >
              <QnaPageLazy eventId={"evolve"} />
            </ProtectedRoute>

            {/* Register Route */}
            <NotLoggedInRoutes
              redirectTo={HOME_ROUTE}
              path={REGISTER_ROUTE + "/:event"}
            >
              {/* <RegisterLazy /> */}
              <Redirect to={REGISTER_ROUTE}></Redirect>
            </NotLoggedInRoutes>
            <NotLoggedInRoutes redirectTo={HOME_ROUTE} path={REGISTER_ROUTE}>
              <RegisterLazy />
            </NotLoggedInRoutes>

            {/* Login Route */}
            <NotLoggedInRoutes
              redirectTo={HOME_ROUTE}
              path={LOGIN_ROUTE + "/:event"}
            >
              {/* <LoginLazy /> */}
              <Redirect to={LOGIN_ROUTE}></Redirect>
            </NotLoggedInRoutes>
            <NotLoggedInRoutes redirectTo={HOME_ROUTE} path={LOGIN_ROUTE}>
              <LoginLazy />
            </NotLoggedInRoutes>

            {/* Home Route */}

            <ProtectedRoute redirectTo={LOGIN_ROUTE} path={HOME_ROUTE}>
              {/* <PreEvent /> */}
              <HomeLazy />
              {/* <Redirect to={"/event/event-kmde59n5"}></Redirect> */}
            </ProtectedRoute>

            {/* event-kmde59n5 */}
            <ProtectedRoute
              exact
              redirectTo={LOGIN_ROUTE}
              path={EVENT_ROUTE + "/:id"}
            >
              {/* <EventLazy /> */}
              <Redirect to={HOME_ROUTE}></Redirect>
            </ProtectedRoute>

            {/* UPLOAD */}
            <ProtectedRoute
              exact
              redirectTo={LOGIN_ROUTE}
              path={"/upload-kmp23"}
            >
              <UploadLazy />
            </ProtectedRoute>
            <ProtectedRoute
              exact
              redirectTo={LOGIN_ROUTE}
              path={"/liveCount-kmp23"}
            >
              <LiveCountLazy />
            </ProtectedRoute>
            <ProtectedRoute exact redirectTo={LOGIN_ROUTE} path={"/qna-kmp23"}>
              <QnaPageLazy />
            </ProtectedRoute>

            {/* <EventRoute
              exact
              redirectTo={HOME_ROUTE} //redirect route if root got a hit
              login={LoginLazy} //For Login component
              register={RegisterLazy} //for register component
              notLive={PreEvent} //for prevent component
              liveEvent={Event} //for event component
              // finishedEvent={''}//for finished component
            /> */}
            <ProtectedRoute
              exact
              redirectTo={LOGIN_ROUTE}
              path={"/event-kmde59n5"}
            >
              {/* <PreEventLazy /> */}
              <EventLazy />
            </ProtectedRoute>
            <ProtectedRoute exact redirectTo={LOGIN_ROUTE} path={"*"}>
              {/* <PreEventLazy /> */}
              <Redirect to={HOME_ROUTE}></Redirect>
            </ProtectedRoute>
          </Switch>
        )}
      </Router>
    </>
  );
}

//include lazy loading of componenets
//make speaker context, video context
