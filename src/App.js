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
import EventRoute, { EventStausType } from "./Components/EventRoute";
import EventManager from "./Managers/EventManager";
import { LOREM_TEXT } from "./AppConstants/Lorem";
import { firestore } from "./Firebase/firebase";
import { PROFILE_COLLECTION } from "./AppConstants/CollectionConstants";
import { PollManager } from "./Managers/PollManager";
import { TRENDING_ITEM_TYPE } from "./AppConstants/TrendingItemTypes";
import Myprofile from "./Containers/myProfile/Myprofile";
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
const OrientLoginLazy = loadable(
  () => import(/* webpackChunkName: "UploadLazy" */ "./Pages/Orient/Login"),
  { fallback: <LoadableFallback /> }
);
const OrientRegisterLazy = loadable(
  () => import(/* webpackChunkName: "UploadLazy" */ "./Pages/Orient/Register"),
  { fallback: <LoadableFallback /> }
);
const OrientPreEventLazy = loadable(
  () => import(/* webpackChunkName: "UploadLazy" */ "./Pages/Orient/PreEvent"),
  { fallback: <LoadableFallback /> }
);
const OrientEventLazy = loadable(
  () => import(/* webpackChunkName: "UploadLazy" */ "./Pages/Orient/Event"),
  { fallback: <LoadableFallback /> }
);
const InspiraLoginLazy = loadable(
  () => import(/* webpackChunkName: "UploadLazy" */ "./Pages/Inspira/Login"),
  { fallback: <LoadableFallback /> }
);
const InspiraRegisterLazy = loadable(
  () => import(/* webpackChunkName: "UploadLazy" */ "./Pages/Inspira/Register"),
  { fallback: <LoadableFallback /> }
);
const InspiraPreEventLazy = loadable(
  () => import(/* webpackChunkName: "UploadLazy" */ "./Pages/Inspira/PreEvent"),
  { fallback: <LoadableFallback /> }
);
const InspiraEventLazy = loadable(
  () => import(/* webpackChunkName: "UploadLazy" */ "./Pages/Inspira/Event"),
  { fallback: <LoadableFallback /> }
);


const MainPagesLoginLazy = loadable(
  () => import(/* webpackChunkName: "UploadLazy" */ "./Pages/MainPages/Login"),
  { fallback: <LoadableFallback /> }
);
const MainPagesRegisterLazy = loadable(
  () => import(/* webpackChunkName: "UploadLazy" */ "./Pages/MainPages/Register"),
  { fallback: <LoadableFallback /> }
);
const MainPagesPreEventLazy = loadable(
  () => import(/* webpackChunkName: "UploadLazy" */ "./Pages/MainPages/PreEvent"),
  { fallback: <LoadableFallback /> }
);
const MainPagesEventLazy = loadable(
  () => import(/* webpackChunkName: "UploadLazy" */ "./Pages/MainPages/Event"),
  { fallback: <LoadableFallback /> }
);

const speakerProfileLink =
  "https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg";

const preload = (component) => {
  component.preload && component.preload();
};

export default function App() {
  const { initalCheck, user } = useContext(UserContext);
  useEffect(() => {
    if (user) {
      // console.log("App Started - DJ");
      preload(EventLazy);
      preload(HomeLazy);
    } else {
      preload(RegisterLazy);
      preload(LoginLazy);
    }
  }, [initalCheck, user]);

  useEffect(() => {
    // EventManager.addEventTimeLine(
    //   "inspira21-jun5",
    //   "MANAGEMENT OF INVASIVE FUNGAL INFECTIONS - CURRENTS CONCEPTS",
    //   "",
    //   [],
    //   1622892600000,
    //   "60"
    // );
  }, []);

  const updateUserMetaData = async () => {
    const query = await firestore.collection(PROFILE_COLLECTION).get();
    for (let i = 0; i < query.docs.length; i++) {
      // console.log(
      //   "--------------------------" +
      //     (i / query.docs.length) * 100 +
      //     "------------------------------"
      // );
      await crossCheckForRegDateAndUpdateMetaData(query.docs[i]);
    }
  };
  const crossCheckForRegDateAndUpdateMetaData = (doc) => {
    return new Promise(async (res, rej) => {
      try {
        let uid = doc.id;
        let docData = doc.data();
        let regEvent = "impact";
        // console.log(docData.date, 1618684200000, docData.date > 1618684200000);
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
            {/* <ProtectedRoute exact redirectTo={"/orient/login"} path={"/orient"}>
              <EventLazy />
              <OrientPreEventLazy />
            </ProtectedRoute>{" "}
            <NotLoggedInRoutes redirectTo={"/orient"} path={"/orient/register"}>
              <OrientRegisterLazy />
              <Redirect to={REGISTER_ROUTE}></Redirect>
            </NotLoggedInRoutes>
            <NotLoggedInRoutes redirectTo={"/orient"} path={"/orient/login"}>
              <OrientLoginLazy />
              <Redirect to={REGISTER_ROUTE}></Redirect>
            </NotLoggedInRoutes> */}
            {/* <ProtectedRoute
              exact
              redirectTo={"/orient/login"}
              path={"/orient/register-ott"}
            >
              <EvolvePreEventLazy />
            </ProtectedRoute> */}

            {/* EVOLVE EVENT */}
            {/* <NotLoggedInRoutes redirectTo={"/evolve"} path={"/evolve/register"}>
              <EvolveRegisterLazy />
            </NotLoggedInRoutes>
            <NotLoggedInRoutes redirectTo={"/evolve"} path={"/evolve/login"}>
              <EvolveLoginLazy />
            </NotLoggedInRoutes>
            <ProtectedRoute
              exact
              redirectTo={"/evolve/login"}
              path={"/evolve/register-ott"}
            >
              <EvolvePreEventLazy />
            </ProtectedRoute>
            <ProtectedRoute exact redirectTo={"/evolve/login"} path={"/evolve"}>
              <EventLazy eventId={"evolve"} />
            </ProtectedRoute> */}

            <ProtectedRoute
              exact
              redirectTo={LOGIN_ROUTE}
              path={"/evolve/liveCount-kmp23"}
            >
              <LiveCountLazy eventId={"evolve"} />
            </ProtectedRoute>
            {/* <ProtectedRoute path={`/home/profile`}>
              <Myprofile />
            </ProtectedRoute> */}
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
            {/* <ProtectedRoute
              exact
              redirectTo={LOGIN_ROUTE}
              path={"/liveCount-kmp23"}
            >
              <LiveCountLazy />
            </ProtectedRoute>
            <ProtectedRoute exact redirectTo={LOGIN_ROUTE} path={"/qna-kmp23"}>
              <QnaPageLazy />
            </ProtectedRoute> */}
            <EventRoute
              exact
              redirectTo={HOME_ROUTE} //redirect route if root got a hit
              login={MainPagesLoginLazy} //For Login component
              register={MainPagesRegisterLazy} //for register component
              notLive={MainPagesPreEventLazy} //for prevent component
              liveEvent={MainPagesEventLazy} //for event component
              // finishedEvent={''}//for finished component
              qnaPage={QnaPageLazy}
              liveCount={LiveCountLazy}
              env={"prod"} //dev or prod
              forceState={EventStausType.NotLive}
            />
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
