import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import UserContextProvider from "./Context/Auth/UserContextProvider";
import SpeakerContextProvider from "./Context/Speaker/SpeakerContextProvider";
import EventContextProvider from "./Context/Event/EventContextProvider";
import LikeContextProvider from "./Context/Like/LikeContextProvider";
import { transitions, positions, Provider as AlertProvider } from "react-alert";
import AlertTemplate from "react-alert-template-basic";
import MediaModalContextProvider from "./Context/MedialModal/MediaModalContextProvider";
import AnalyticsContextProvider, {
  AnalyticsContext,
} from "./Context/Analytics/AnalyticsContextProvider";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import { PWAInstaller } from "./Components/pwaPrompt/PWAprompt";

const options = {
  position: positions.BOTTOM_RIGHT,
  timeout: 2500,
  offset: "30px",
  transition: transitions.SCALE,
};

ReactDOM.render(
  <React.StrictMode>
    <PWAInstaller />
    <UserContextProvider>
      <AnalyticsContextProvider>
        <EventContextProvider>
          <SpeakerContextProvider>
            <LikeContextProvider>
              <MediaModalContextProvider>
                <AlertProvider template={AlertTemplate} {...options}>
                  <App />
                </AlertProvider>
              </MediaModalContextProvider>
            </LikeContextProvider>
          </SpeakerContextProvider>
        </EventContextProvider>
      </AnalyticsContextProvider>
    </UserContextProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
// serviceWorkerRegistration.unregister();
serviceWorkerRegistration.register();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
