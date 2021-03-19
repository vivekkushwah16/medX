import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import UserContextProvider from './Context/Auth/UserContextProvider';
import SpeakerContextProvider from './Context/Speaker/SpeakerContextProvider';
import EventContextProvider from './Context/Event/EventContextProvider';
import LikeContextProvider from './Context/Like/LikeContextProvider';

ReactDOM.render(
  <React.StrictMode>
    <UserContextProvider>
      <EventContextProvider>
        <SpeakerContextProvider>
          <LikeContextProvider>
            <App />
          </LikeContextProvider>
        </SpeakerContextProvider>
      </EventContextProvider>
    </UserContextProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
