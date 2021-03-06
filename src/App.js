import React, { useContext, useEffect, useState, useRef } from "react";
import { BrowserRouter as Router, Redirect, Switch } from "react-router-dom";
import { UserContext } from "./Context/Auth/UserContextProvider";
import ProtectedRoute from "./Components/ProtectedRoute/ProtectedRoute";
import NotLoggedInRoutes from "./Components/NotLoggedInRoutes/NotLoggedInRoutes";
import usePWA from "react-pwa-install-prompt";
import {
  HOME_ROUTE,
  LOGIN_ROUTE,
  REGISTER_ROUTE,
  RootRoute,
  EVENT_ROUTE,
  INTEREST_ROUTE,
  NEWS_ROUTE,
  SEARCH_ROUTE,
} from "./AppConstants/Routes";

// import css
// import Home from './Pages/Home/Home';

import "./assets/css/modal.css";

import loadable from "@loadable/component";
import LoadableFallback from "./Components/LoadableFallback/LoadableFallback";
// import PreEvent from "./Pages/PreEvent/PreEvent";
import EventRoute, { EventStausType } from "./Components/EventRoute";
// import EventManager from "./Managers/EventManager";
// import { LOREM_TEXT } from "./AppConstants/Lorem";
import firebase, {
  exportFile,
  firestore,
} from "./Firebase/firebase";
import {
  BRONCHTALK_COLLECTION,
  PROFILE_COLLECTION,
  PROFILE_COLLECTION_test,
  USERMETADATA_COLLECTION,
} from "./AppConstants/CollectionConstants";
import { PollManager } from "./Managers/PollManager";
import { TRENDING_ITEM_TYPE } from "./AppConstants/TrendingItemTypes";
import Myprofile from "./Containers/myProfile/Myprofile";
import IntersetSelection from "./Containers/IntersetSelection";
import EventManager from "./Managers/EventManager";
import SearchPage from "./Pages/SearchPage";
import { MediaModalType } from "./AppConstants/ModalType";
import PWApromptWithButton, {
  PWAInstaller,
} from "./Components/pwaPrompt/PWAprompt";
import { NEW_SPECIALITY } from "./specialityData";

import News from "./Containers/News/News";

// import loadable from "@loadable/component";
// import LoadableFallback from "./Components/LoadableFallback/LoadableFallback";
// import Upload from './Components/Upload/upload';
// import LiveCount from './Pages/LiveCount/liveCount';
// import QnaPage from './Pages/QnaPage/QnaPage';
const RegisterLazy = loadable(
  () =>
    import(
      "./Pages/SimpleRegister/Register"
    ),
  { fallback: <LoadableFallback /> }
);

const LoginLazy = loadable(
  () => import("./Pages/SimpleLogin/Login"),
  { fallback: <LoadableFallback /> }
);
const MediaModalLazy = loadable(
  () =>
    import(
      "./Containers/MediaModal/MediaModal"
    ),
  { fallback: <LoadableFallback /> }
);
const EventLazy = loadable(
  () => import("./Pages/Event/Event"),
  { fallback: <LoadableFallback /> }
);

const HomeLazy = loadable(
  () => import("./Pages/Home/Home"),
  { fallback: <LoadableFallback /> }
);
const LiveCountLazy = loadable(
  () =>
    import(
      "./Pages/LiveCount/liveCount"
    ),
  { fallback: <LoadableFallback /> }
);
const QnaPageLazy = loadable(
  () => import("./Pages/QnaPage/QnaPage"),
  { fallback: <LoadableFallback /> }
);
const PollPageLazy = loadable(
  () => import("./Pages/PollPage/PollResponseContainer"),
  { fallback: <LoadableFallback /> }
);
const UploadLazy = loadable(
  () =>
    import("./Components/Upload/upload"),
  { fallback: <LoadableFallback /> }
);

const MainPagesLoginLazy = loadable(
  () => import("./Pages/MainPages/Login"),
  { fallback: <LoadableFallback /> }
);
const MainPagesRegisterLazy = loadable(
  () =>
    import("./Pages/MainPages/Register"),
  { fallback: <LoadableFallback /> }
);
const MainPagesPreEventLazy = loadable(
  () =>
    import("./Pages/MainPages/PreEvent"),
  { fallback: <LoadableFallback /> }
);
const MainPagesEventLazy = loadable(
  () => import("./Pages/MainPages/Event"),
  { fallback: <LoadableFallback /> }
);

// const MainPagesLoginLazy = loadable(
//   () => import( "./Pages/MainPages/Login"),
//   { fallback: <LoadableFallback /> }
// );
// const MainPagesRegisterLazy = loadable(
//   () =>
//     import( "./Pages/MainPages/Register"),
//   { fallback: <LoadableFallback /> }
// );
// const MainPagesPreEventLazy = loadable(
//   () =>
//     import( "./Pages/MainPages/PreEvent"),
//   { fallback: <LoadableFallback /> }
// );
// const MainPagesEventLazy = loadable(
//   () => import("./Pages/MainPages/Event"),
//   { fallback: <LoadableFallback /> }
// );

const speakerProfileLink =
  "https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg";

const preload = (component) => {
  component.preload && component.preload();
};

async function downloadData() {
  firestore
    .collection("userFeedback")
    .where("eventId", "==", "ipaedia21")
    .get()
    .then((snap) => {
      if (!snap.empty) {
        let data = {};
        snap.docs.forEach(
          (d) =>
          (data[d.id] = {
            ...d.data(),
            id: d.id.split("_")[1],
            phoneNumber: d.data().email.split("@")[0],
          })
        );
        console.log(data);
        exportFile(
          Object.values(data),
          "ipedia21_feedback",
          "ipedia21_feedback.xlsx"
        );
      }
    });
}

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
    window.console.medXlog = (...args) => {
      if (process.env.NODE_ENV !== "production") {
        window.console.log(...args)
      } else {
        if (window.showMedxConsole)
          window.console.log(...args)
      }
    }

    // setTimeout(() => {
    //   console.clear()
    //   ReadUserProfile()
    // }, 1000)
    // downloadData()
    // EventManager.addEngagement('ipaedia21', MediaModalType.Iframe, 'Survey', 'We need your valuable feedback.', '/fd2/index.html', 'https://firebasestorage.googleapis.com/v0/b/cipla-impact.appspot.com/o/impact2021%2Ftrending%2FForacort%20Synchrobreathe%20-%20Infoguide.jpg?alt=media&token=9195d987-7708-4039-ab78-70613fce7b6a').then(res => {
    //   console.log('xxxxxxxxxxxxxxxxx')
    //   console.log('xxxxxxxxxxxxxxxxx')
    //   console.log(res)
    //   console.log('xxxxxxxxxxxxxxxxx')
    // })
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
      {/* <PWApromptWithButton /> */}
      <Router>
        {initalCheck && (
          <Switch>
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

            <ProtectedRoute redirectTo={LOGIN_ROUTE} path={INTEREST_ROUTE}>
              <UserContext.Consumer>
                {(value) => <IntersetSelection value={value.userInfo} />}
              </UserContext.Consumer>
            </ProtectedRoute>

            {/* Search Route */}
            <ProtectedRoute redirectTo={LOGIN_ROUTE} path={SEARCH_ROUTE}>
              <SearchPage />
            </ProtectedRoute>

            {/* Home Route */}
            <ProtectedRoute redirectTo={LOGIN_ROUTE} path={HOME_ROUTE}>
              <HomeLazy />
              {/* <Redirect to={"/event/event-kmde59n5"}></Redirect> */}
            </ProtectedRoute>

            {/* UPLOAD */}
            <ProtectedRoute
              exact
              redirectTo={LOGIN_ROUTE}
              path={"/upload-kmp23"}
            >
              <UploadLazy />
            </ProtectedRoute>

            {/* NEWS Route */}
            <ProtectedRoute redirectTo={LOGIN_ROUTE} path={NEWS_ROUTE}>
              <News />
            </ProtectedRoute>

            <EventRoute
              exact
              redirectTo={HOME_ROUTE} //redirect route if root got a hit
              login={MainPagesLoginLazy} //For Login component
              register={MainPagesRegisterLazy} //for register component
              notLive={MainPagesPreEventLazy} //for prevent component
              liveEvent={MainPagesEventLazy} //for event component
              // finishedEvent={''}//for finished component
              qnaPage={QnaPageLazy}
              pollPage={PollPageLazy}
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

async function ReadUser() {
  let lastUID = null;
  try {
    console.log("start");
    let startTime = firebase.firestore.Timestamp.fromMillis(1626912000000);
    let endTime = firebase.firestore.Timestamp.fromMillis(1628121600000);
    let queryRef = firestore
      .collection(PROFILE_COLLECTION)
      .where("timestamp", ">=", startTime)
      .where("timestamp", "<=", endTime);
    // .limit(5)

    let queryResult = await queryRef.get();
    if (!queryResult.empty) {
      let docs = queryResult.docs;
      for (let i = 0; i < docs.length; i++) {
        lastUID = docs[i].id;
        await checkForUserMetaData(docs[i].id);
      }
    } else {
      console.log("not Found");
    }
    console.log("end");
  } catch (error) {
    console.log("last uid :" + lastUID);
    console.error(error);
  }
}

async function checkForUserMetaData(uid) {
  return new Promise(async (response, reject) => {
    try {
      if (!uid) {
        throw new Error({ code: "invalid UID" });
      }
      console.log("start checking userMetaData", uid);
      let userMetaef = firestore.collection(USERMETADATA_COLLECTION).doc(uid);
      await firestore.runTransaction(async (trans) => {
        let document = await trans.get(userMetaef);
        if (!document.exists) {
          console.log("No userMeta found for ", uid);
          return trans.set(userMetaef, {
            registeration: "copdupdate",
            events: ["copdupdate"],
          });
        } else {
          console.log("userMeta already exits for ", uid);
          return true;
        }
      });
      response();
    } catch (error) {
      console.error(error);
      reject(error);
    }
  });
}

function getNewSpec(oldSpec) {
  if (NEW_SPECIALITY[oldSpec.toUpperCase()]) {
    return NEW_SPECIALITY[oldSpec.toUpperCase()];
  } else {
    return [];
  }
}

async function updateSpecaility(uid) {
  return new Promise(async (response, reject) => {
    try {
      console.log("start checking profile", uid);
      let docRef = firestore.collection(PROFILE_COLLECTION).doc(uid);
      await firestore.runTransaction(async (trans) => {
        let document = await trans.get(docRef);
        if (!document.exists) {
          console.log("No userMeta found for ", uid);
          return false;
        } else {
          let currentData = document.data();
          let newSp = getNewSpec(currentData.speciality);
          if (newSp.length == 0) {
            return true;
          } else if (newSp.length == 1) {
            return trans.update(docRef, {
              speciality: newSp[0],
            });
          } else if (newSp.length == 2) {
            return trans.update(docRef, {
              speciality: newSp[0],
              secondarySpeciality: newSp[1],
            });
          } else {
            return true;
          }
        }
      });
      response();
    } catch (error) {
      console.error(error);
      reject(error);
    }
  });
}

async function ReadUserProfile() {
  let lastUID = null;
  try {
    console.log("start");
    let queryRef = firestore.collection(PROFILE_COLLECTION);
    // .limit(1)

    let queryResult = await queryRef.get();
    if (!queryResult.empty) {
      let docs = queryResult.docs;
      console.log("totalLength", docs.length);
      for (let i = 0; i < docs.length; i++) {
        lastUID = docs[i].id;
        console.log("entering index ", i, docs[i]);
        if (docs[i].data().speciality) {
          if (NEW_SPECIALITY[docs[i].data().speciality.toUpperCase()])
            await updateSpecaility(docs[i].id);
        }
      }
    } else {
      console.log("not Found");
    }
    console.log("end ,", lastUID);
  } catch (error) {
    console.log("last uid :" + lastUID);
    console.error(error);
  }
}
