import React, { useContext, useEffect } from "react";
import { BrowserRouter as Router, Redirect, Switch } from "react-router-dom";
import { UserContext } from "./Context/Auth/UserContextProvider";
import ProtectedRoute from "./Components/ProtectedRoute/ProtectedRoute";
import NotLoggedInRoutes from "./Components/NotLoggedInRoutes/NotLoggedInRoutes";
import EvolveLogin from "./Pages/Evolve/Login";
import EvolveRegister from "./Pages/Evolve/Register";
import EvolvePreEvent from "./Pages/Evolve/PreEvent";
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
   }, []);
  return (
    <>
      <MediaModalLazy />
      <Router>
        {initalCheck && (
          <Switch>
            <NotLoggedInRoutes redirectTo={"/evolve"} path={"/evolve/register"}>
              <EvolveRegister />
              {/* <Redirect to={REGISTER_ROUTE}></Redirect> */}
            </NotLoggedInRoutes>
            <NotLoggedInRoutes redirectTo={"/evolve"} path={"/evolve/login"}>
              <EvolveLogin />
              {/* <Redirect to={REGISTER_ROUTE}></Redirect> */}
            </NotLoggedInRoutes>
            <ProtectedRoute exact redirectTo={"/evolve/login"} path={"/evolve"}>
              {/* <EventLazy /> */}
              {/* <PreEventLazy /> */}
              <EvolvePreEvent />
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
